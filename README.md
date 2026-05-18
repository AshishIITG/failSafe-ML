Project Overview

FAILSAFE is an AI-powered academic risk prediction and intervention platform developed to identify students who are academically at risk before final examination results are declared.

The system analyzes academic and behavioural factors such as study time, failures, attendance, social activity, alcohol consumption, and health condition to predict whether a student is academically safe or at risk.

The project combines Machine Learning, Explainable AI, Full-Stack Web Development, Database Integration, and Analytics Dashboarding into a single application.

Key Features
Student Risk Prediction
Predicts whether a student is:
Safe
At Risk
Generates prediction probability using a trained Machine Learning model.
Explainable AI using SHAP
Uses SHAP (SHapley Additive exPlanations) to explain predictions.
Displays the most influential features affecting student risk.
Makes predictions transparent and understandable.

Project Structure
FAILSAFE/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── auth.py
│   ├── failsafe_model.pkl
│   ├── model_columns.pkl
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── data/
│
├── README.md
Installation and Setup
1. Clone Repository
git clone <your-github-repository-link>
Backend Setup
2. Navigate to Backend
cd backend
3. Install Dependencies
pip install fastapi uvicorn pandas scikit-learn xgboost shap sqlalchemy psycopg2-binary python-jose passlib[bcrypt] bcrypt python-multipart
4. Configure PostgreSQL Database

Create PostgreSQL database:

CREATE DATABASE failsafe_db;

Update DATABASE_URL inside database.py

Example:

DATABASE_URL = "postgresql://postgres:password@localhost:5432/failsafe_db"
5. Run Backend Server
uvicorn main:app --reload

Backend runs on:

http://127.0.0.1:8000
Frontend Setup
6. Navigate to Frontend
cd frontend
7. Install Dependencies
npm install
8. Run React Frontend
npm run dev







