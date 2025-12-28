@echo off
echo Starting Infinite Clinic Development Servers...

REM Start Backend in new window
start "Django Backend" cmd /k "cd Backend && python manage.py runserver"

REM Wait 3 seconds
timeout /t 3 /nobreak > nul

REM Start Frontend in new window  
start "React Frontend" cmd /k "cd Cust_Frontend/infinite-clinic-app && npm run dev"

echo Both servers are starting...
echo Backend: http://127.0.0.1:8000/
echo Frontend: http://localhost:5173/
pause