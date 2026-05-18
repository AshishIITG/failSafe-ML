# FAILSAFE – AI-Powered Student Risk Prediction System

## Overview

FAILSAFE is an AI-powered student risk prediction and intervention platform that identifies academically at-risk students using Machine Learning and Explainable AI.

The system analyzes academic and behavioural factors such as:
- Study time
- Previous failures
- Absences
- Social activity
- Alcohol consumption
- Health condition

The project provides:
- Student risk prediction
- SHAP explainability
- AI-generated interventions
- Analytics dashboard
- PostgreSQL database integration
- JWT authentication APIs

---

# Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Recharts

## Backend
- FastAPI
- Python

## Machine Learning
- XGBoost
- Scikit-learn
- SHAP

## Database
- PostgreSQL
- SQLAlchemy

---

# Project Structure

```bash
FAILSAFE/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── auth.py
│   ├── failsafe_model.pkl
│
├── frontend/
│   ├── src/
│   ├── public/
│
├── data/
│
├── README.md
```

---

# How to Run

## Backend Setup

```bash
cd backend

pip install fastapi uvicorn pandas scikit-learn xgboost shap sqlalchemy psycopg2-binary python-jose passlib[bcrypt] bcrypt python-multipart

uvicorn main:app --reload
```

Backend runs on:
```bash
http://127.0.0.1:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:
```bash
http://localhost:5173
```

---

# Features Implemented

- Student risk prediction
- SHAP explainability
- AI-generated interventions
- Analytics dashboard
- Prediction history
- Search and filtering
- PostgreSQL integration
- JWT authentication APIs

---


