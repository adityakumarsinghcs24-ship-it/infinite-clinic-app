@echo off
echo Stopping Infinite Clinic Development Servers...

REM Kill Django processes
taskkill /f /im python.exe 2>nul
echo Django server stopped

REM Kill Node processes  
taskkill /f /im node.exe 2>nul
echo React server stopped

echo All servers stopped
pause