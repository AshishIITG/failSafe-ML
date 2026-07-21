# FAILSAFE – AI-Powered Student Risk Prediction System

FAILSAFE is a student-risk prediction platform that uses machine learning and explainable AI to identify academically at-risk students and recommend targeted interventions.

## Why this project matters

Many schools struggle to identify students who are at risk early enough. FAILSAFE uses student data, behavior metrics, and explainability to help educators intervene before academic performance declines.

## What it does

- Predicts whether a student is academically at risk
- Calculates a risk probability score
- Generates human-readable reasons using SHAP explainability
- Suggests recommended interventions based on risk factors
- Stores prediction history in a database
- Provides a modern React dashboard with charts and filters
- Supports asynchronous prediction via Celery and Redis

## Key strengths

- Clear risk explanation using SHAP feature importances
- Asynchronous backend task queue for non-blocking prediction
- Full-stack demonstration of ML, API, database, and UI
- Local development setup for frontend and backend

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend: Python, FastAPI, SQLAlchemy
- Machine Learning: scikit-learn, XGBoost, SHAP, joblib
- Background worker: Celery, Redis / Upstash
- Database: SQLite (local), SQLAlchemy ORM

## Repository structure

```bash
FAILSAFE/
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── database.py
│   ├── models.py
│   ├── failsafe_model.pkl
│   ├── model_columns.pkl
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   ├── public/
├── data/
│   └── student.csv
├── README.md
```

## Getting started

### 1. Backend setup

```bash
cd backend
python -m pip install fastapi uvicorn pandas scikit-learn xgboost shap sqlalchemy python-jose passlib[bcrypt] bcrypt python-multipart python-dotenv celery
```

Create a `.env` file in `backend/` with your Redis URL:

```env
REDIS_URL=rediss://<your-redis-connection-url>
```

Start the API server:

```bash
uvicorn main:app --reload
```

Start the Celery worker from the same folder:

```bash
celery -A main worker --loglevel=info
```

The backend API will be available at:

```bash
http://127.0.0.1:8000
```

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open the app in your browser at:

```bash
http://localhost:5173
```

## Backend API endpoints

- `POST /predict` — submit student data and start background prediction
- `GET /task-status/{task_id}` — poll the prediction task status
- `GET /history` — retrieve saved prediction history
- `POST /login` — faculty login
- `POST /register` — create a new user

## Notes

- The backend currently uses SQLite for local prediction history storage.
- The frontend expects the backend to run at `http://127.0.0.1:8000`.
- The model is loaded from `backend/failsafe_model.pkl`; the feature order is stored in `backend/model_columns.pkl`.

## Optional improvements

If you want to make this even stronger for recruiters, consider adding:
- a short demo screenshot
- model performance metrics
- a link to deployed app or video demo
- your role or contribution summary


