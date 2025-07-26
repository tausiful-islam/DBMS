# 🗂️ Meat Market Platform - Complete Project Structure Guide

*Your comprehensive guide to understanding every file and how to manage your data*

---

## 📋 Table of Contents

1. [🏗️ Project Overview](#-project-overview)
2. [📁 Complete File Structure](#-complete-file-structure)
3. [🔍 File-by-File Explanation](#-file-by-file-explanation)
4. [📊 Dataset Management Guide](#-dataset-management-guide)
5. [🔄 Data Operations](#-data-operations)
6. [💾 Database Structure](#-database-structure)
7. [🛠️ Management Tools](#-management-tools)
8. [🚀 Quick Reference](#-quick-reference)

---

## 🏗️ Project Overview

Your Meat Market Platform is a **full-stack web application** with:
- **Frontend**: React.js with Tailwind CSS (Port 3000)
- **Backend**: Node.js/Express API server (Port 5000)
- **Database**: MongoDB (Port 27017)
- **Architecture**: RESTful API with JWT authentication

```
Internet → Frontend (React) → Backend (Node.js) → Database (MongoDB)
```

---

## 📁 Complete File Structure

```
DataBase_Project/
├── 📱 CLIENT (Frontend - React App)
│   ├── public/
│   │   └── index.html              # Main HTML template
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── DataModal.js        # Add/Edit data form popup
│   │   │   ├── FilterModal.js      # Data filtering interface
│   │   │   ├── LoadingSpinner.js   # Loading animation
│   │   │   └── Navbar.js           # Navigation bar
│   │   ├── contexts/               # React state management
│   │   │   ├── AuthContext.js      # User authentication state
│   │   │   └── ThemeContext.js     # Dark/Light theme state
│   │   ├── pages/                  # Main application pages
│   │   │   ├── Analytics.js        # Advanced analytics page
│   │   │   ├── Dashboard.js        # Main dashboard with overview
│   │   │   ├── DataTable.js        # Data management table
│   │   │   ├── LandingPage.js      # Welcome/home page
│   │   │   ├── Login.js            # Login form
│   │   │   └── Register.js         # Registration form
│   │   ├── services/               # API communication
│   │   │   ├── api.js              # Base API configuration
│   │   │   └── dataService.js      # Data CRUD operations
│   │   ├── App.js                  # Main React app component
│   │   └── index.css               # Global styles
│   ├── package.json                # Frontend dependencies
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── postcss.config.js           # CSS processing configuration
│
├── 🖥️ SERVER (Backend - Node.js API)
│   ├── models/                     # Database schemas
│   │   ├── User.js                 # User account structure
│   │   └── MeatData.js             # Meat market data structure
│   ├── routes/                     # API endpoints
│   │   ├── auth.js                 # Login/register/logout
│   │   ├── data.js                 # CRUD operations for meat data
│   │   └── analytics.js            # Analytics and statistics
│   ├── middleware/
│   │   └── auth.js                 # JWT token verification
│   ├── index.js                    # Main server file
│   ├── seed.js                     # Sample data generator (small)
│   ├── seed-large.js               # Large dataset generator (1200+ records)
│   ├── .env                        # Environment variables (passwords, secrets)
│   └── package.json                # Backend dependencies
│
├── 🛠️ MANAGEMENT SCRIPTS
│   ├── start.sh                    # Start both frontend & backend
│   ├── stop.sh                     # Stop all processes
│   ├── status.sh                   # Check if everything is running
│   ├── fix.sh                      # Fix common issues
│   ├── setup.sh                    # Initial project setup
│   └── db-summary.sh               # Database content overview
│
├── 📚 DOCUMENTATION
│   ├── README.md                   # Project overview & setup
│   ├── DEVELOPMENT.md              # Development guidelines
│   ├── MANAGEMENT_GUIDE.md         # Operations manual
│   ├── DATABASE_GUIDE.md           # Database access guide
│   ├── FEATURE_UPDATE.md           # Recent changes log
│   ├── FIXES_APPLIED.md            # Bug fixes history
│   └── PROJECT_STRUCTURE_GUIDE.md  # This file!
│
├── 🔧 CONFIGURATION
│   ├── .gitignore                  # Files to exclude from Git
│   └── index.html                  # Legacy file (can be removed)
```

---

## 🔍 File-by-File Explanation

### 🎨 **Frontend Files (client/)**

#### **Core Application**
- **`App.js`** - Main React component that controls routing and page navigation
- **`index.css`** - Global styles, colors, fonts, and Tailwind CSS imports
- **`public/index.html`** - HTML template that loads your React app

#### **Pages (User Interfaces)**
- **`LandingPage.js`** - Welcome page users see first
- **`Login.js`** - User login form with email/password
- **`Register.js`** - New user registration with role selection
- **`Dashboard.js`** - Main overview with charts, statistics, and key metrics
- **`DataTable.js`** - Table showing all meat data with add/edit/delete functions
- **`Analytics.js`** - Advanced charts and filtering options

#### **Components (Reusable Parts)**
- **`Navbar.js`** - Top navigation bar with menu links and user info
- **`DataModal.js`** - Popup form for adding/editing meat data entries
- **`FilterModal.js`** - Popup for filtering data by date, category, region
- **`LoadingSpinner.js`** - Animated loading indicator

#### **State Management**
- **`AuthContext.js`** - Manages user login status, permissions, and logout
- **`ThemeContext.js`** - Handles dark/light mode switching

#### **API Services**
- **`api.js`** - Base configuration for communicating with backend
- **`dataService.js`** - Functions for creating, reading, updating, deleting data

### 🔧 **Backend Files (server/)**

#### **Main Server**
- **`index.js`** - Main server file that starts Express, connects to MongoDB, handles all requests

#### **Database Models**
- **`User.js`** - Defines user account structure (name, email, password, role)
- **`MeatData.js`** - Defines meat product structure (name, category, price, quantity, etc.)

#### **API Routes**
- **`auth.js`** - Handles login, registration, logout, user verification
- **`data.js`** - Handles all meat data operations (create, read, update, delete, search)
- **`analytics.js`** - Provides statistics, charts data, and analytics

#### **Security**
- **`middleware/auth.js`** - Verifies user tokens and permissions before API access

#### **Data Generation**
- **`seed.js`** - Creates 50 sample records for testing
- **`seed-large.js`** - Creates 1200+ realistic records for full database

### 🛠️ **Management Scripts**
- **`start.sh`** - Starts both frontend and backend servers
- **`stop.sh`** - Stops all running processes
- **`status.sh`** - Shows if servers are running and database is connected
- **`fix.sh`** - Fixes common issues like port conflicts, permissions
- **`db-summary.sh`** - Shows database statistics and sample data

---

## 📊 Dataset Management Guide

### 🗄️ **Your Database Structure**

Your MongoDB database named `meatmarket` contains two main collections:

#### **1. Users Collection (`users`)**
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com", 
  password: "hashed_password",
  role: "admin|manager|user",
  createdAt: Date
}
```

#### **2. Meat Data Collection (`meatdatas`)**
```javascript
{
  _id: ObjectId,
  productName: "Premium Beef Steak",
  category: "Beef",
  unitType: "weight|number",         // NEW: Type of measurement
  unit: "kg|pound|piece|dozen",      // Dynamic based on unitType
  pricePerUnit: 25.50,               // Price per single unit
  quantity: 100,                     // Amount in stock
  totalSellingPrice: 2550.00,       // Auto-calculated (price × quantity)
  supplier: "Fresh Farms Ltd",
  region: "North America",
  date: "2025-01-15",
  createdAt: Date,
  updatedAt: Date
}
```

### 📈 **Current Dataset Overview**

Your database currently contains **1,200+ realistic records** with:
- **Categories**: Beef, Pork, Chicken, Lamb, Fish, Turkey, Duck
- **Regions**: North America, Europe, Asia, South America, Africa, Oceania
- **Unit Types**: Both weight-based (kg, pounds) and number-based (pieces, dozens)
- **Price Range**: $0.50 - $50.00 per unit
- **Suppliers**: 50+ different supplier companies
- **Date Range**: Last 2 years of data

---

## 🔄 Data Operations

### 📥 **Adding New Data**

#### **Through the Web Interface:**
1. Go to `http://localhost:3000/data-table`
2. Click **"Add New Entry"**
3. Fill in the form:
   - Product Name
   - Category (dropdown)
   - Unit Type (Weight/Number)
   - Unit (changes based on type)
   - Price per Unit
   - Quantity
   - Supplier
   - Region
   - Date
4. Click **"Save"**

#### **Through Database Direct:**
```bash
# Connect to MongoDB
mongosh meatmarket

# Add a single record
db.meatdatas.insertOne({
  productName: "Organic Chicken Breast",
  category: "Chicken",
  unitType: "weight",
  unit: "kg", 
  pricePerUnit: 12.99,
  quantity: 50,
  supplier: "Green Valley Farm",
  region: "North America",
  date: "2025-07-26"
})
```

### 📤 **Exporting Data**

#### **CSV Export (Recommended):**
1. Go to Data Table page
2. Apply any filters you want
3. Click **"Export CSV"**
4. File downloads to your computer

#### **Database Export:**
```bash
# Export entire database
mongodump --db meatmarket --out ./backups/$(date +%Y%m%d)

# Export only meat data
mongoexport --db meatmarket --collection meatdatas --out meatdata_export.json

# Export as CSV
mongoexport --db meatmarket --collection meatdatas --type=csv --fields productName,category,pricePerUnit,quantity,supplier,region,date --out meatdata.csv
```

### 📊 **Viewing Your Data**

#### **Quick Database Summary:**
```bash
./db-summary.sh
```

#### **View Specific Data:**
```bash
# Connect to database
mongosh meatmarket

# Count total records
db.meatdatas.countDocuments()

# View latest 5 records
db.meatdatas.find().sort({createdAt: -1}).limit(5).pretty()

# View by category
db.meatdatas.find({category: "Beef"}).limit(5).pretty()

# View by price range
db.meatdatas.find({pricePerUnit: {$gte: 20, $lte: 30}}).pretty()

# View by date range
db.meatdatas.find({date: {$gte: "2025-01-01"}}).count()

# Exit database
exit
```

### 🔍 **Searching and Filtering**

#### **Web Interface:**
- Use the filter button in Data Table
- Filter by: Date range, Category, Region, Price range
- Search by product name or supplier

#### **Database Queries:**
```bash
mongosh meatmarket

# Find expensive items (over $30)
db.meatdatas.find({pricePerUnit: {$gt: 30}})

# Find by multiple criteria
db.meatdatas.find({
  category: "Beef",
  region: "North America", 
  pricePerUnit: {$gte: 15}
})

# Text search in product names
db.meatdatas.find({productName: {$regex: "steak", $options: "i"}})

# Group by category and count
db.meatdatas.aggregate([
  {$group: {_id: "$category", count: {$sum: 1}}}
])
```

### ✏️ **Updating Data**

#### **Web Interface:**
1. Go to Data Table
2. Click **"Edit"** button on any row
3. Modify fields in the popup
4. Click **"Save"**

#### **Database Direct:**
```bash
mongosh meatmarket

# Update a single record
db.meatdatas.updateOne(
  {productName: "Premium Beef Steak"},
  {$set: {pricePerUnit: 28.99, quantity: 75}}
)

# Update multiple records
db.meatdatas.updateMany(
  {category: "Chicken"},
  {$inc: {pricePerUnit: 1.50}}  // Increase all chicken prices by $1.50
)
```

### 🗑️ **Deleting Data**

#### **Web Interface:**
1. Go to Data Table
2. Click **"Delete"** button on any row
3. Confirm deletion

#### **Database Direct:**
```bash
mongosh meatmarket

# Delete a single record
db.meatdatas.deleteOne({productName: "Old Product Name"})

# Delete by criteria (BE CAREFUL!)
db.meatdatas.deleteMany({date: {$lt: "2023-01-01"}})  // Delete old data

# Delete everything (DANGER!)
# db.meatdatas.deleteMany({})  // Uncomment only if you're sure!
```

---

## 💾 Database Structure

### 🔑 **Key Fields Explanation**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `productName` | String | Name of the meat product | "Premium Beef Steak" |
| `category` | String | Type of meat | "Beef", "Pork", "Chicken" |
| `unitType` | String | Measurement type | "weight" or "number" |
| `unit` | String | Measurement unit | "kg", "pound", "piece", "dozen" |
| `pricePerUnit` | Number | Cost per single unit | 25.50 |
| `quantity` | Number | Amount available | 100 |
| `totalSellingPrice` | Number | Auto-calculated total value | 2550.00 |
| `supplier` | String | Company providing the product | "Fresh Farms Ltd" |
| `region` | String | Geographic area | "North America" |
| `date` | String | Date added/updated | "2025-07-26" |

### 📋 **Data Validation Rules**

- **Product Name**: Required, 3-100 characters
- **Category**: Must be one of predefined categories
- **Unit Type**: Either "weight" or "number"
- **Unit**: Depends on unitType (weight: kg/pound, number: piece/dozen)
- **Price**: Must be positive number, max 2 decimal places
- **Quantity**: Must be positive integer
- **Date**: Must be valid date format (YYYY-MM-DD)

---

## 🛠️ Management Tools

### 🚀 **Quick Commands**

```bash
# Start everything
./start.sh

# Check what's running
./status.sh

# View database overview
./db-summary.sh

# Fix common issues
./fix.sh

# Stop everything
./stop.sh
```

### 📊 **Data Analysis Commands**

```bash
# Quick statistics
mongosh meatmarket --eval "
  print('Total Records:', db.meatdatas.countDocuments());
  print('Categories:', db.meatdatas.distinct('category').length);
  print('Suppliers:', db.meatdatas.distinct('supplier').length);
  print('Regions:', db.meatdatas.distinct('region').length);
"

# Price analysis
mongosh meatmarket --eval "
  db.meatdatas.aggregate([
    {$group: {
      _id: null,
      avgPrice: {$avg: '$pricePerUnit'},
      minPrice: {$min: '$pricePerUnit'},
      maxPrice: {$max: '$pricePerUnit'},
      totalValue: {$sum: '$totalSellingPrice'}
    }}
  ]).pretty()
"

# Category breakdown
mongosh meatmarket --eval "
  db.meatdatas.aggregate([
    {$group: {_id: '$category', count: {$sum: 1}, avgPrice: {$avg: '$pricePerUnit'}}},
    {$sort: {count: -1}}
  ]).pretty()
"
```

---

## 🚀 Quick Reference

### 🌐 **Access URLs**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:27017

### 🔑 **Default Test User**
- **Email**: admin@meatmarket.com
- **Password**: admin123
- **Role**: Admin

### 📱 **Main Pages**
- `/` - Landing page
- `/login` - User login
- `/register` - New user registration  
- `/dashboard` - Main overview with charts
- `/data-table` - Manage meat data
- `/analytics` - Advanced analytics

### 🗃️ **Database Collections**
- `users` - User accounts and roles
- `meatdatas` - Meat market product data

### 📋 **Common File Locations**
- Configuration: `server/.env`
- Logs: Terminal outputs
- Backups: `./backups/`
- Documentation: `./docs/` (this folder)

---

## 🆘 **Quick Troubleshooting**

### **Can't access website?**
1. Run `./status.sh` - check if servers are running
2. Run `./start.sh` - start servers if needed

### **Database empty?**
1. Run `./db-summary.sh` - check data count
2. Run `cd server && node seed-large.js` - add sample data

### **Login not working?**
1. Check if backend is running on port 5000
2. Try the default user: admin@meatmarket.com / admin123

### **Need to reset everything?**
1. Run `./fix.sh` - fixes most common issues
2. Delete `server/.env` and run `./setup.sh` for fresh start

---

*This guide covers everything you need to understand and manage your Meat Market Platform. Keep this file handy for reference!*

*Last updated: July 26, 2025*
