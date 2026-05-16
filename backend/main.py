from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel

import joblib
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = joblib.load("failsafe_model.pkl")

# Load columns
model_columns = joblib.load("model_columns.pkl")


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


@app.post("/predict")
def predict(data: StudentData):

    # Convert request into dict
    input_data = data.dict()

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

    return {
    "prediction": result,
    "probability": round(float(probability), 2)
}