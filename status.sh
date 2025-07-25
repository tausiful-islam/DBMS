#!/bin/bash

echo "🔍 Checking Meat Market Platform Status..."
echo "=========================================="

# Function to check if port is in use and get process info
check_service() {
    local port=$1
    local service_name=$2
    local url=$3
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        local pid=$(lsof -Pi :$port -sTCP:LISTEN -t)
        echo "✅ $service_name is running on port $port (PID: $pid)"
        
        # Test HTTP response if URL provided
        if [ ! -z "$url" ]; then
            if curl -s "$url" > /dev/null 2>&1; then
                echo "   🌐 HTTP response: OK"
            else
                echo "   ⚠️  HTTP response: Failed"
            fi
        fi
    else
        echo "❌ $service_name is NOT running on port $port"
        return 1
    fi
}

# Check MongoDB
echo "📊 MongoDB Status:"
if systemctl is-active --quiet mongod; then
    echo "✅ MongoDB service is active"
    if mongo --eval "db.stats()" --quiet meatmarket > /dev/null 2>&1; then
        echo "   📁 Database 'meatmarket' is accessible"
    else
        echo "   ⚠️  Database connection issue"
    fi
else
    echo "❌ MongoDB service is not running"
fi

echo ""

# Check Backend Server
echo "🔧 Backend Server Status:"
check_service 5000 "Backend API" "http://localhost:5000/api/health"

echo ""

# Check Frontend Server
echo "🌐 Frontend Server Status:"
check_service 3000 "React Frontend" "http://localhost:3000"

echo ""

# Overall status
echo "📋 Quick Access URLs:"
echo "   🏠 Main Application: http://localhost:3000"
echo "   🔌 API Health Check: http://localhost:5000/api/health"
echo "   📝 Registration: http://localhost:3000/register"
echo "   🔐 Login: http://localhost:3000/login"

echo ""
echo "💡 Management Commands:"
echo "   Start: ./start.sh"
echo "   Stop:  ./stop.sh"
echo "   Status: ./status.sh"
