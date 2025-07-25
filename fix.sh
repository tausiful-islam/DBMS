#!/bin/bash

echo "🔧 Meat Market Platform - Troubleshooting & Repair..."
echo "====================================================="

# Function to fix common issues
fix_ports() {
    echo "🔧 Clearing ports 3000 and 5000..."
    
    # Kill processes on port 3000
    local pids_3000=$(lsof -ti:3000 2>/dev/null)
    if [ ! -z "$pids_3000" ]; then
        echo "   Stopping processes on port 3000: $pids_3000"
        kill -9 $pids_3000 2>/dev/null
    fi
    
    # Kill processes on port 5000
    local pids_5000=$(lsof -ti:5000 2>/dev/null)
    if [ ! -z "$pids_5000" ]; then
        echo "   Stopping processes on port 5000: $pids_5000"
        kill -9 $pids_5000 2>/dev/null
    fi
    
    sleep 2
    echo "✅ Ports cleared"
}

fix_mongodb() {
    echo "🔧 Fixing MongoDB..."
    sudo systemctl stop mongod
    sleep 2
    sudo systemctl start mongod
    sleep 3
    
    if systemctl is-active --quiet mongod; then
        echo "✅ MongoDB restarted successfully"
    else
        echo "❌ MongoDB restart failed - check logs: sudo journalctl -u mongod"
    fi
}

fix_permissions() {
    echo "🔧 Fixing file permissions..."
    cd /home/tausif/DataBase_Project
    chmod +x *.sh
    chmod -R 755 client server
    echo "✅ Permissions fixed"
}

reinstall_deps() {
    echo "🔧 Reinstalling dependencies..."
    
    echo "   Backend dependencies..."
    cd /home/tausif/DataBase_Project/server
    rm -rf node_modules package-lock.json
    npm install
    
    echo "   Frontend dependencies..."
    cd /home/tausif/DataBase_Project/client
    rm -rf node_modules package-lock.json
    npm install
    
    echo "✅ Dependencies reinstalled"
}

# Main menu
echo "What would you like to fix?"
echo "1) Clear ports (3000, 5000)"
echo "2) Restart MongoDB"
echo "3) Fix file permissions"
echo "4) Reinstall dependencies"
echo "5) Full reset (all above)"
echo "6) Just check status"
echo ""
read -p "Choose option (1-6): " choice

case $choice in
    1)
        fix_ports
        ;;
    2)
        fix_mongodb
        ;;
    3)
        fix_permissions
        ;;
    4)
        reinstall_deps
        ;;
    5)
        fix_ports
        fix_mongodb
        fix_permissions
        echo "⚠️  Skipping dependency reinstall (takes time). Run option 4 if needed."
        ;;
    6)
        cd /home/tausif/DataBase_Project && ./status.sh
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🔍 Checking status after fixes..."
cd /home/tausif/DataBase_Project && ./status.sh

echo ""
echo "💡 To start the application: ./start.sh"
