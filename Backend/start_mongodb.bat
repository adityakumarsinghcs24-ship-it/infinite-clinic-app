@echo off
echo Starting MongoDB for Infinite Clinic...
echo.

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo MongoDB is not installed or not in PATH
    echo.
    echo Please install MongoDB from: https://www.mongodb.com/try/download/community
    echo Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:7.0
    pause
    exit /b 1
)

REM Create data directory if it doesn't exist
if not exist "mongodb_data" mkdir mongodb_data

echo Starting MongoDB server...
echo Data directory: %CD%\mongodb_data
echo.

REM Start MongoDB
mongod --dbpath "%CD%\mongodb_data" --port 27017 --quiet

pause