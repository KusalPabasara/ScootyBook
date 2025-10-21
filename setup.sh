#!/bin/bash

echo "🛵 Setting up ScootyBook - Scooty Rental Platform"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd client
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cat > .env << EOL
MONGODB_URI=mongodb://localhost:27017/scooty-booking
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
NODE_ENV=development
PORT=5000
EOL
    echo "✅ .env file created"
    echo "⚠️  Please update the JWT_SECRET in .env file for security"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running on your system"
echo "2. Update the .env file with your MongoDB connection string"
echo "3. Run 'npm run dev' to start the backend server"
echo "4. Run 'npm run client' to start the frontend development server"
echo ""
echo "Happy Scooting! 🛵"
