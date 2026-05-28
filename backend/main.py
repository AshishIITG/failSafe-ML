from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel

import joblib
import pandas as pd
import shap
import os
import ssl
from celery import Celery
from celery.result import AsyncResult
from dotenv import load_dotenv

# Load the credentials from your new .env file
load_dotenv()

# Initialize the Celery worker and point it to Upstash
celery_app = Celery(
    "tasks",
    broker=os.getenv("REDIS_URL"),
    backend=os.getenv("REDIS_URL")
)

# Fix: Upstash strictly requires valid SSL certificates
celery_app.conf.broker_use_ssl = {"ssl_cert_reqs": ssl.CERT_REQUIRED}
celery_app.conf.redis_backend_use_ssl = {"ssl_cert_reqs": ssl.CERT_REQUIRED}

from database import SessionLocal
from database import engine, Base
from models import Prediction

from auth import (
    hash_password,
    verify_password,
    create_access_token
)

from models import User

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model & columns globally so Celery can use them
model = joblib.load("failsafe_model.pkl")
explainer = shap.Explainer(model)
model_columns = joblib.load("model_columns.pkl")

class UserCreate(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(user: UserCreate):
    db = SessionLocal()
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        return {"message": "Invalid email"}
    if not verify_password(user.password, db_user.password):
        return {"message": "Invalid password"}
    
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/register")
def register(user: UserCreate):
    db = SessionLocal()
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        return {"message": "User already exists"}
    
    new_user = User(email=user.email, password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.close()
    return {"message": "User created successfully"}

# Pydantic schema
class StudentData(BaseModel):
    age: int
    Medu: int
    Fedu: int
    traveltime: int
    studytime: int
    failures: int
    famrel: int
    freetime: int
    goout: int
    Dalc: int
    Walc: int
    health: int
    absences: int

@app.get("/")
def home():
    return {"message": "FAILSAFE API Running"}

feature_name_map = {
    "higher_yes": "Higher Education Aspiration",
    "address_U": "Urban Address",
    "Medu": "Mother's Education",
    "Fedu": "Father's Education",
    "traveltime": "Travel Time",
    "studytime": "Study Time",
    "failures": "Previous Failures",
    "famrel": "Family Relationship",
    "freetime": "Free Time",
    "goout": "Social Activity",
    "Dalc": "Workday Alcohol Consumption",
    "Walc": "Weekend Alcohol Consumption",
    "health": "Health Status",
    "absences": "Absences"
}

# ==========================================
# THE ASYNCHRONOUS CELERY WORKER TASK
# ==========================================
@celery_app.task
def process_ml_prediction(input_data):
    print("Starting background ML Prediction...")
    db = SessionLocal()

    # Convert into dataframe
    df = pd.DataFrame([input_data])

    # Add missing columns
    for col in model_columns:
        if col not in df.columns:
            df[col] = 0

    # Correct column order
    df = df[model_columns]

    # Predict
    prediction = model.predict(df)[0]
    probability = model.predict_proba(df)[0][1]
    result = "At Risk" if prediction == 1 else "Safe"

    # SHAP Explainability
    shap_values = explainer(df)
    feature_impacts = []
    for i, col in enumerate(df.columns):
        feature_impacts.append({
            "feature": col,
            "impact": float(shap_values.values[0][i]) # Ensure it's a standard float
        })

    feature_impacts = sorted(feature_impacts, key=lambda x: abs(x["impact"]), reverse=True)

    reasons = []
    for item in feature_impacts[:3]:
        feature = feature_name_map.get(item["feature"], item["feature"])
        if item["impact"] > 0:
            reasons.append(f"{feature} increased student risk")
        else:
            reasons.append(f"{feature} reduced student risk")

    # Recommendations
    recommendations = []
    if input_data.get("failures", 0) >= 2:
        recommendations.append("Assign academic mentor and remedial classes")
    if input_data.get("absences", 0) > 10:
        recommendations.append("Schedule attendance counselling session")
    if input_data.get("studytime", 0) <= 1:
        recommendations.append("Create structured study timetable")
    if input_data.get("goout", 0) >= 4:
        recommendations.append("Recommend productivity and focus mentoring")
    if input_data.get("Dalc", 0) >= 3 or input_data.get("Walc", 0) >= 3:
        recommendations.append("Refer wellness counsellor for support")
    if len(recommendations) == 0:
        recommendations.append("Maintain current academic consistency")
        
    try:
        new_prediction = Prediction(
            prediction=result,
            probability=round(float(probability), 4),
            reasons=", ".join(reasons)
        )
        db.add(new_prediction)
        db.commit()
        print("Prediction successfully saved to database!")
    except Exception as e:
        print("DATABASE ERROR:", e)
    finally:
        db.close()

    return {
        "prediction": result,
        "probability": round(float(probability), 2),
        "reasons": reasons,
        "recommendations": recommendations
    }


# ==========================================
# THE FASTAPI ENDPOINTS
# ==========================================

@app.post("/predict")
def predict(data: StudentData):
    # We hand the data to Celery using .delay() instead of running it here
    task = process_ml_prediction.delay(data.dict())
    
    # Return instantly so the frontend doesn't freeze
    return {
        "message": "Prediction task started",
        "task_id": task.id
    }

@app.get("/task-status/{task_id}")
def get_task_status(task_id: str):
    # This lets the frontend check if the worker is done yet
    task_result = AsyncResult(task_id, app=celery_app)
    
    if task_result.state == 'PENDING':
        return {"status": "Processing...", "result": None}
    elif task_result.state == 'SUCCESS':
        return {"status": "Complete", "result": task_result.result}
    else:
        return {"status": task_result.state, "result": None}

@app.get("/history")
def get_history():
    db = SessionLocal()
    predictions = db.query(Prediction).all()
    results = []
    for p in predictions:
        results.append({
            "id": p.id,
            "prediction": p.prediction,
            "probability": p.probability,
            "reasons": p.reasons
        })
    db.close()
    return results