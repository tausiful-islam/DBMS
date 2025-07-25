# 🥩 Meat Market Platform - Management Guide

## 🚀 Quick Start Commands

### Start the Application
```bash
./start.sh
```

### Check Status
```bash
./status.sh
```

### Fix Issues
```bash
./fix.sh
```

### Stop the Application
```bash
./stop.sh
```

### Manual Start (Alternative)
```bash
# Terminal 1: Start Backend
cd server && npm start

# Terminal 2: Start Frontend  
cd client && npm start
```

---

## 👥 User Management

### User Roles
- **Admin**: Full access to all features, user management
- **Manager**: Data management, analytics, reports
- **User**: View-only access to data and basic analytics

### Creating Users
1. Go to `http://localhost:3000/register`
2. Fill in: Name, Email, Password, Role
3. Click "Register"

### Managing Users (Admin Only)
- Access user management through the Dashboard
- Change user roles, deactivate accounts
- View user activity logs

---

## 📊 Data Management

### Adding Meat Market Data
1. Navigate to **Data Table** page
2. Click **"Add New Entry"**
3. Fill in required fields:
   - Product Name
   - Category (Beef, Pork, Chicken, etc.)
   - Price per Unit
   - Quantity
   - Supplier
   - Date
   - Region

### Bulk Data Import
1. Go to **Data Table** page
2. Click **"Import CSV"**
3. Upload CSV file with columns: `productName,category,pricePerUnit,quantity,supplier,date,region`

### Export Data
- Click **"Export CSV"** to download current data
- Choose date ranges and filters before export

---

## 📈 Analytics & Reports

### Dashboard Features
- **Key Metrics**: Total products, revenue, suppliers
- **Price Trends**: Line charts showing price changes over time
- **Category Distribution**: Pie charts of product categories
- **Regional Analysis**: Map and charts by region

### Advanced Analytics
1. Go to **Analytics** page
2. Use filters for:
   - Date ranges
   - Product categories
   - Regions
   - Price ranges

### Generating Reports
- Use the analytics filters to customize views
- Export filtered data as CSV
- Take screenshots of charts for presentations

---

## 🔧 Technical Maintenance

### Database Backup
```bash
# Create backup
mongodump --db meatmarket --out ./backups/$(date +%Y%m%d)

# Restore backup
mongorestore --db meatmarket ./backups/YYYYMMDD/meatmarket
```

### View Database
```bash
# Quick database overview
./db-summary.sh

# Connect to MongoDB shell
mongosh meatmarket

# View all users (without passwords)
mongosh meatmarket --eval "db.users.find({}, {password: 0}).pretty()"

# View all products
mongosh meatmarket --eval "db.meatdatas.find({}).pretty()"

# Common commands inside MongoDB shell
show collections
db.users.find()
db.meatdatas.find()
db.users.countDocuments()
db.meatdatas.countDocuments()
exit
```

### Application Logs
```bash
# Backend logs (if using PM2 or similar)
cd server && npm run logs

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Update Dependencies
```bash
# Backend
cd server && npm update

# Frontend  
cd client && npm update
```

---

## 🛡️ Security Best Practices

### Environment Variables
- Keep `.env` files secure and never commit to version control
- Rotate JWT secrets regularly
- Use strong database passwords

### User Security
- Encourage strong passwords
- Monitor failed login attempts
- Regular security audits

### Data Security
- Regular database backups
- Implement data retention policies
- Monitor data access logs

---

## 🎨 Customization

### Themes
- Users can toggle between light/dark mode
- Themes are automatically saved per user

### UI Customization
- Edit components in `client/src/components/`
- Modify styles in `client/src/index.css`
- Update colors in `client/tailwind.config.js`

### Adding New Features
1. Backend: Add routes in `server/routes/`
2. Frontend: Add pages in `client/src/pages/`
3. Update navigation in `client/src/components/Navbar.js`

---

## 🚨 Troubleshooting

### Common Issues

**"Cannot connect to database"**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

**"Port already in use"**
```bash
# Kill processes on port 3000/5000
sudo lsof -t -i:3000 | xargs sudo kill -9
sudo lsof -t -i:5000 | xargs sudo kill -9
```

**"Registration not working"**
- Check if backend server is running on port 5000
- Verify MongoDB connection
- Check browser console for errors

**"Charts not displaying"**
- Ensure data exists in database
- Check if Chart.js is properly loaded
- Verify API endpoints are responding

### Error Logs Location
- Backend errors: Terminal running `npm start` in server folder
- Frontend errors: Browser Developer Console (F12)
- MongoDB errors: `/var/log/mongodb/mongod.log`

---

## 📞 Support Commands

### Health Check
```bash
# Check all services
curl http://localhost:5000/api/health
curl http://localhost:3000

# Check database connection
mongo meatmarket --eval "db.stats()"
```

### Performance Monitoring
```bash
# Memory usage
free -h

# Disk usage
df -h

# Process monitoring
top -p $(pgrep -f "node")
```

---

## 🔄 Regular Maintenance Tasks

### Daily
- [ ] Check application accessibility
- [ ] Monitor error logs
- [ ] Verify backup completion

### Weekly  
- [ ] Review user activity
- [ ] Clean up old log files
- [ ] Update data if needed

### Monthly
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance review
- [ ] Database optimization

---

## 📱 Mobile Access

The application is responsive and works on:
- ✅ Desktop browsers
- ✅ Tablets
- ✅ Mobile phones

Access the same URL (`http://localhost:3000`) from any device on your local network.

---

## 🆘 Emergency Procedures

### Application Down
1. Check if servers are running: `ps aux | grep node`
2. Restart services: `./start.sh`
3. Check logs for errors
4. Verify database connection

### Data Loss Prevention
1. Immediate backup: `mongodump --db meatmarket`
2. Check backup integrity
3. Implement automated backups

### Security Breach
1. Change all passwords immediately
2. Review access logs
3. Update JWT secrets
4. Audit user permissions

---

*Last updated: July 26, 2025*
