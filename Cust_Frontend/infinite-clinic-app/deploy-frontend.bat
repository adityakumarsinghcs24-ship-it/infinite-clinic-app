@echo off
echo Building frontend for deployment...
npm run build

echo.
echo Build complete! Files are in the dist/ folder.
echo.
echo To deploy to Vercel:
echo 1. Make sure you have Vercel CLI installed: npm i -g vercel
echo 2. Run: vercel --prod
echo.
echo Or push to your GitHub repository and Vercel will auto-deploy.
pause