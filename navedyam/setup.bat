@echo off
echo.
echo  Navedyam Cloud Kitchen App - Setup
echo =====================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Node.js not found. Please install from https://nodejs.org
  pause
  exit /b 1
)

echo  Node.js found: 
node -v

echo.
echo  Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
  echo ERROR: Backend install failed
  pause
  exit /b 1
)
echo  Backend ready!

echo.
echo  Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
  echo ERROR: Frontend install failed
  pause
  exit /b 1
)
echo  Frontend ready!

echo.
echo =====================================
echo  Setup complete!
echo.
echo  Next steps:
echo.
echo   1. Open a terminal in the 'backend' folder and run:
echo         node server.js
echo.
echo   2. Open ANOTHER terminal in 'frontend' folder and run:
echo         npx expo start
echo.
echo   3. Scan QR code with Expo Go app on your phone
echo.
echo   NOTE: If on a real phone, edit:
echo   frontend\src\api\client.js
echo   Replace 'localhost' with your PC's local IP address
echo   (run 'ipconfig' in CMD to find it)
echo.
pause
