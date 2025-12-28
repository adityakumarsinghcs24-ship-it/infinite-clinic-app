@echo off
echo 🚀 Starting Infinite Clinic Deployment...

REM Backend Deployment
echo 📦 Building Backend...
cd Backend

REM Install Python dependencies
python -m pip install -r requirements.txt

REM Collect static files
python manage.py collectstatic --noinput --settings=project.settings_prod

REM Create logs directory
if not exist logs mkdir logs

echo ✅ Backend ready for deployment

REM Frontend Deployment
echo 📦 Building Frontend...
cd ..\Cust_Frontend\infinite-clinic-app

REM Install Node dependencies
npm install

REM Build for production
npm run build

echo ✅ Frontend built successfully

echo 🎉 Deployment preparation complete!
echo.
echo 📋 Next Steps:
echo 1. Update .env.production with your actual domain and secrets
echo 2. Set up MongoDB (local or Atlas)
echo 3. Configure web server (Nginx/Apache)
echo 4. Set up SSL certificate
echo 5. Deploy to your server

pause