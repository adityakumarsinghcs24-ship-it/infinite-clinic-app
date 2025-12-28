@echo off
echo Checking Infinite Clinic Servers...

echo.
echo Testing Backend (Django):
curl -s http://127.0.0.1:8000/api/mongo/patients/ > nul
if %errorlevel% == 0 (
    echo ✅ Backend is running on http://127.0.0.1:8000/
) else (
    echo ❌ Backend is not responding
)

echo.
echo Testing Frontend (React):
curl -s http://localhost:5174/ > nul
if %errorlevel% == 0 (
    echo ✅ Frontend is running on http://localhost:5174/
) else (
    echo ❌ Frontend is not responding
)

echo.
pause