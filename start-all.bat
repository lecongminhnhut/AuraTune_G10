@echo off
echo ===================================================
echo     AuraTune Full-Stack with AI Brain Agent
echo ===================================================
echo 1. Starting AI Brain Service (FastAPI + Gemini) on port 8000...
start "AuraTune AI Service (Port 8000)" cmd /k "py -3.13 -m uvicorn main:app --app-dir src/ai-service --host 0.0.0.0 --port 8000 --reload"

echo 2. Starting AuraTune Node.js Backend on port 5000...
start "AuraTune Backend (Port 5000)" cmd /k "npm --prefix src/backend run dev"

echo 3. Starting AuraTune Web Frontend on port 5173...
start "AuraTune Frontend (Port 5173)" cmd /k "npm --prefix src/frontend run dev"

echo ===================================================
echo Tat ca cac service dang duoc khoi dong trong cac cua so rieng biet:
echo - Frontend:   http://localhost:5173
echo - Backend:    http://localhost:5000
echo - AI Service: http://localhost:8000
echo ===================================================
pause
