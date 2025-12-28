# 🚀 Infinite Clinic Deployment Guide

## Architecture
- **Frontend**: Vercel (React + Vite)
- **Backend**: Railway/Render (Django + MongoDB)
- **Database**: MongoDB Atlas (Cloud)

## 📋 Deployment Steps

### 1. Setup MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get your connection string
6. Whitelist your IP addresses (0.0.0.0/0 for all IPs)

### 2. Deploy Backend to Railway

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Create new project
4. Connect your GitHub repository
5. Select the `Backend` folder
6. Add environment variables:
   ```
   SECRET_KEY=your-super-secret-key-here
   DEBUG=False
   MONGO_URI=your-mongodb-atlas-connection-string
   MONGO_DB_NAME=infinite_clinic_prod
   DJANGO_SETTINGS_MODULE=project.settings_prod
   ```
7. Deploy!

### 3. Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Select `Cust_Frontend/infinite-clinic-app` folder
5. Add environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   VITE_BACKEND_URL=https://your-backend.railway.app
   ```
6. Deploy!

### 4. Update CORS Settings

After deployment, update your backend environment variables:
```
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
ALLOWED_HOSTS=your-backend.railway.app
```

## 🔧 Local Development

```bash
# Backend
cd Backend
python manage.py runserver

# Frontend  
cd Cust_Frontend/infinite-clinic-app
npm run dev
```

## 🌐 Production URLs

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.railway.app
- **Database**: MongoDB Atlas

## 📱 Features

✅ User Authentication (MongoDB)
✅ Patient Registration via Test Booking
✅ Test Booking System
✅ MongoDB Data Storage
✅ Responsive Design
✅ Production Ready

## 🔒 Security

- HTTPS enabled
- CORS configured
- Environment variables
- Secure cookies
- JWT authentication