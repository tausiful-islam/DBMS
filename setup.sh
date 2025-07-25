#!/bin/bash

echo "🚀 Setting up Meat Market Platform..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB service first."
    echo "   For local installation: brew services start mongodb/brew/mongodb-community"
    echo "   Or update MONGODB_URI in server/.env to use a cloud database"
fi

echo "📦 Installing dependencies..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
cd ..

# Create uploads directory for CSV files
mkdir -p server/uploads

echo "✅ Installation complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update server/.env with your MongoDB connection string"
echo "2. Start the application with: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For detailed instructions, see README.md"
