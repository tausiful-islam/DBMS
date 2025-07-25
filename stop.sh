#!/bin/bash

echo "🛑 Stopping Meat Market Platform..."
echo "=================================="

# Kill Node.js processes (backend and frontend)
echo "🔧 Stopping Backend Server..."
pkill -f "node.*server" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend stopped"
else
    echo "ℹ️  Backend was not running"
fi

echo "🌐 Stopping Frontend Server..."
pkill -f "react-scripts" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend stopped"
else
    echo "ℹ️  Frontend was not running"
fi

# Optionally stop MongoDB (uncomment if needed)
# echo "📊 Stopping MongoDB..."
# sudo systemctl stop mongod
# echo "✅ MongoDB stopped"

echo ""
echo "🎉 All services stopped successfully!"
echo "💡 To start again, run: ./start.sh"
