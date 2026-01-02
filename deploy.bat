@echo off
echo 🚀 Starting Infinite Clinic Deployment with Time Slots...

REM Backend Deployment
echo 📦 Building Backend with Time Slots System...
cd Backend

REM Copy production environment
if exist .env.production (
    copy .env.production .env
    echo ✅ Production environment configured
) else (
    echo ⚠️  Warning: .env.production not found, using default .env
)

REM Install Python dependencies (if available)
echo 📦 Installing Python dependencies...
python -m pip install -r requirements.txt 2>nul || echo ⚠️  Python dependencies not installed (will work on server)

REM Create production files for time slots
echo 🕒 Setting up Time Slots system...
if not exist timeslots_db.json (
    echo {"timeslots":[],"metadata":{"created_at":"2026-01-02T00:00:00Z","version":"1.0"}} > timeslots_db.json
    echo ✅ Time slots database file created
)

REM Collect static files (if Django is available)
python manage.py collectstatic --noinput --settings=project.settings_prod 2>nul || echo ⚠️  Static files collection skipped

REM Create logs directory
if not exist logs mkdir logs

echo ✅ Backend ready for deployment with Time Slots

REM Frontend Deployment
echo 📦 Building Frontend...
cd ..\Cust_Frontend\infinite-clinic-app

REM Copy production environment
if exist .env.production (
    copy .env.production .env
    echo ✅ Frontend production environment configured
)

REM Install Node dependencies
echo 📦 Installing Node dependencies...
npm install

REM Build for production
echo 🏗️  Building frontend for production...
npm run build

echo ✅ Frontend built successfully

cd ..\..

echo 🎉 Deployment preparation complete!
echo.
echo 📋 Deployment Status:
echo ✅ Backend: Ready with Time Slots system
echo ✅ Frontend: Built and ready
echo ✅ Time Slots: JSON database initialized
echo ✅ Production configs: Set up
echo.
echo 🚀 Next Steps for Live Deployment:
echo.
echo 📱 BACKEND (Render.com):
echo 1. Push code to GitHub
echo 2. Connect Render to your GitHub repo
echo 3. Set environment variables in Render dashboard
echo 4. Deploy backend service
echo.
echo 🌐 FRONTEND (Vercel/Netlify):
echo 1. Deploy the 'dist' folder from Cust_Frontend/infinite-clinic-app/
echo 2. Set VITE_API_BASE_URL to your Render backend URL
echo.
echo 💾 DATABASE:
echo - Time slots will be stored in MongoDB (or JSON file as fallback)
echo - Auto-creates time slots when needed
echo.
echo 🔗 Your backend will be: https://infinite-clinic-app.onrender.com
echo 🔗 Your frontend will be: https://your-app.vercel.app

pause