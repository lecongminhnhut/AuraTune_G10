@echo off
py -3.13 -m uvicorn main:app --app-dir src/ai-service --port 8000 --reload
