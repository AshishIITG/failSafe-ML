# 📉 FAILSAFE Frontend

React frontend for the FAILSAFE student risk prediction dashboard.

## What this frontend does

- Collects student data through an interactive form
- Sends prediction requests to the FastAPI backend
- Polls task status for asynchronous Celery predictions
- Displays risk results, probability, recommended actions, and explainability
- Shows saved prediction history and supports search/filtering
- Renders charts using Recharts for visual analytics

## Tech stack

- React 19
- Vite
- Tailwind CSS
- Recharts

## Setup

From the `frontend` directory:

```bash
npm install
npm run dev
```

Open the app at:

```bash
http://localhost:5173
```

## Backend requirements

This frontend expects the backend API to run at:

```bash
http://127.0.0.1:8000
```

The backend should provide:

- `POST /predict`
- `GET /task-status/{task_id}`
- `GET /history`

## Available scripts

- `npm run dev` — start the local Vite development server
- `npm run build` — build the production bundle
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint checks

## Folder structure

- `src/App.jsx` — main application UI and prediction flow
- `src/main.jsx` — React root entry point
- `src/index.css` — Tailwind and global styling

## Notes

- The frontend uses async polling so predictions return quickly while Celery processes them in the background.
- If you update backend endpoints, also update `src/App.jsx` URL paths.
