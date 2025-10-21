@echo off
echo 🛵 Setting up ScootyBook - Scooty Rental Platform
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm found
npm --version

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed successfully

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd client
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed successfully
cd ..

REM Create .env file if it doesn't exist
if not exist .env (
    echo.
    echo 📝 Creating .env file...
    (
        echo MONGODB_URI=mongodb://localhost:27017/scooty-booking
        echo JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
        echo NODE_ENV=development
        echo PORT=5000
    ) > .env
    echo ✅ .env file created
    echo ⚠️  Please update the JWT_SECRET in .env file for security
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Make sure MongoDB is running on your system
echo 2. Update the .env file with your MongoDB connection string
echo 3. Run 'npm run dev' to start the backend server
echo 4. Run 'npm run client' to start the frontend development server
echo.
echo Happy Scooting! 🛵
pause
