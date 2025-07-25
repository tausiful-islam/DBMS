#!/bin/bash

echo "🚀 Starting Meat Market Platform..."
echo "=================================="

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 0
    else
        return 1
    fi
}

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if ! systemctl is-active --quiet mongod; then
    echo "⚠️  Starting MongoDB..."
    sudo systemctl start mongod
    sleep 3
fi

if systemctl is-active --quiet mongod; then
    echo "✅ MongoDB is running"
else
    echo "❌ Failed to start MongoDB"
    exit 1
fi

# Check if backend is already running
if check_port 5000; then
    echo "✅ Backend server already running on port 5000"
else
    echo "🔧 Starting Backend Server (Port 5000)..."
    cd /home/tausif/DataBase_Project/server
    npm start &
    BACKEND_PID=$!
    echo "✅ Backend started (PID: $BACKEND_PID)"
    sleep 3
fi

# Check if frontend is already running
if check_port 3000; then
    echo "✅ Frontend server already running on port 3000"
    echo ""
    echo "🎉 Application is available at:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5000"
else
    echo "🌐 Starting Frontend Server (Port 3000)..."
    cd /home/tausif/DataBase_Project/client
    echo "✅ Frontend starting... (This will open in your browser)"
    echo ""
    echo "🎉 Application will be available at:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:5000"
    echo ""
    echo "⚠️  To stop the servers, press Ctrl+C"
    echo ""
    npm start
fi
