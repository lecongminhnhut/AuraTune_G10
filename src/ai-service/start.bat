@echo off
echo Starting AuraTune AI Brain Service on port 8000...
cd /d "%~dp0"
py -3.13 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
