#!/bin/bash

# Infinite Clinic Deployment Script

echo "🚀 Starting Infinite Clinic Deployment..."

# Backend Deployment
echo "📦 Building Backend..."
cd Backend

# Install Python dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput --settings=project.settings_prod

# Create logs directory
mkdir -p logs

echo "✅ Backend ready for deployment"

# Frontend Deployment
echo "📦 Building Frontend..."
cd ../Cust_Frontend/infinite-clinic-app

# Install Node dependencies
npm install

# Build for production
npm run build

echo "✅ Frontend built successfully"

echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env.production with your actual domain and secrets"
echo "2. Set up MongoDB (local or Atlas)"
echo "3. Configure web server (Nginx/Apache)"
echo "4. Set up SSL certificate"
echo "5. Deploy to your server"