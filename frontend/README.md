# 📉 FAILSAFE: AI-Powered Student Risk Predictor

An asynchronous, distributed web application that utilizes Machine Learning to predict student academic risk and provides AI-driven intervention strategies.

##  Architecture Overview

This project implements a production-grade microservices architecture to handle heavy Machine Learning processing without blocking the main web server.

*   **Frontend (React & Recharts):** Provides a responsive, asynchronous UI that utilizes automated API polling to fetch background task updates without freezing the client.
*   **Backend API (FastAPI):** A high-performance REST API that instantly handles incoming traffic, routes ML tasks to a message broker, and returns asynchronous task tickets.
*   **Message Broker (Upstash Redis):** A serverless in-memory data store managing the task queue.
*   **Background Worker (Celery):** An asynchronous worker that decouples the heavy Machine Learning inference from the main thread.
*   **Machine Learning (Scikit-Learn & SHAP):** A predictive model that not only calculates risk probability but uses SHAP values to explain *why* the prediction was made.

##  Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS, Recharts
*   **Backend:** Python, FastAPI, SQLAlchemy, SQLite
*   **Distributed Queue:** Celery, Upstash Redis
*   **Data Science:** Pandas, Scikit-Learn, SHAP, Joblib

##  Key Features

1.  **Asynchronous ML Processing:** Decoupled architecture prevents server timeouts during heavy ML inference.
2.  **Automated Status Polling:** React frontend silently polls the FastAPI backend for ticket status updates.
3.  **Explainable AI (XAI):** Utilizes SHAP to generate human-readable insights into which specific student behaviors increased or decreased their academic risk.
4.  **Automated Interventions:** Generates actionable, algorithmic recommendations for faculty based on the student's specific risk factors.

## 🛠️ Local Development Setup

### 1. Clone the repository
```bash
git clone [https://github.com/yourusername/failsafe-ml.git](https://github.com/yourusername/failsafe-ml.git)
cd failsafe-ml