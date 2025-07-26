# 📊 Dataset Management & Data Operations Guide

*Your specialized guide for managing meat market data effectively*

---

## 🎯 Quick Dataset Overview

Your **Meat Market Database** contains:
- **Total Records**: 1,200+ realistic entries
- **Categories**: 7 types (Beef, Pork, Chicken, Lamb, Fish, Turkey, Duck)
- **Time Period**: 2+ years of historical data
- **Suppliers**: 50+ different companies
- **Regions**: 6 global regions
- **Value Range**: $0.50 - $50.00 per unit

---

## 📋 Dataset Structure

### **Core Data Fields**
```javascript
{
  productName: "Premium Beef Steak",      // What you're selling
  category: "Beef",                       // Type of meat
  unitType: "weight",                     // "weight" or "number"
  unit: "kg",                            // kg, pound, piece, dozen
  pricePerUnit: 25.50,                   // Price per single unit
  quantity: 100,                         // How many units in stock
  totalSellingPrice: 2550.00,           // Auto-calculated total value
  supplier: "Fresh Farms Ltd",          // Who supplies it
  region: "North America",               // Where it's from
  date: "2025-07-26"                     // When added/updated
}
```

### **Available Categories**
- 🥩 **Beef**: Steaks, ground beef, roasts
- 🐷 **Pork**: Chops, bacon, ham
- 🐔 **Chicken**: Breast, wings, whole chicken
- 🐑 **Lamb**: Chops, leg, shoulder
- 🐟 **Fish**: Salmon, tuna, cod
- 🦃 **Turkey**: Breast, whole turkey
- 🦆 **Duck**: Breast, whole duck

### **Unit Types & Units**
- **Weight-based**: kg, pound (for most meats)
- **Number-based**: piece, dozen (for items like whole chickens)

---

## 🔍 How to View Your Data

### **1. Quick Database Overview**
```bash
# Get instant summary
./db-summary.sh
```
**Shows**: Total records, categories, suppliers, regions, date range

### **2. Web Interface**
- Go to: `http://localhost:3000/data-table`
- **View**: All data in a sortable table
- **Search**: By product name or supplier
- **Filter**: By date, category, region, price range

### **3. Database Direct Access**
```bash
# Connect to your database
mongosh meatmarket

# Count all records
db.meatdatas.countDocuments()

# View latest 10 entries
db.meatdatas.find().sort({createdAt: -1}).limit(10).pretty()

# View specific category
db.meatdatas.find({category: "Beef"}).limit(5).pretty()

# Exit database
exit
```

---

## ➕ Adding New Data

### **Method 1: Web Interface (Recommended)**
1. Open: `http://localhost:3000/data-table`
2. Click: **"Add New Entry"** button
3. Fill in the form:
   - **Product Name**: e.g., "Organic Chicken Breast"
   - **Category**: Select from dropdown
   - **Unit Type**: Choose "weight" or "number"
   - **Unit**: Automatically updates based on type
   - **Price per Unit**: e.g., 12.99
   - **Quantity**: e.g., 50
   - **Supplier**: e.g., "Green Valley Farm"
   - **Region**: Select from dropdown
   - **Date**: Today's date (auto-filled)
4. Click: **"Save"**

### **Method 2: Database Direct**
```bash
# Connect to database
mongosh meatmarket

# Add single record
db.meatdatas.insertOne({
  productName: "Fresh Salmon Fillet",
  category: "Fish",
  unitType: "weight",
  unit: "kg",
  pricePerUnit: 18.99,
  quantity: 25,
  supplier: "Ocean Fresh Seafood",
  region: "North America",
  date: "2025-07-26"
})

# Add multiple records at once
db.meatdatas.insertMany([
  {
    productName: "Pork Tenderloin",
    category: "Pork",
    unitType: "weight", 
    unit: "kg",
    pricePerUnit: 15.50,
    quantity: 30,
    supplier: "Farm Fresh Meats",
    region: "Europe",
    date: "2025-07-26"
  },
  {
    productName: "Whole Chicken",
    category: "Chicken",
    unitType: "number",
    unit: "piece", 
    pricePerUnit: 8.99,
    quantity: 20,
    supplier: "Country Poultry",
    region: "North America",
    date: "2025-07-26"
  }
])
```

### **Method 3: CSV Import**
1. Create CSV file with columns: `productName,category,unitType,unit,pricePerUnit,quantity,supplier,region,date`
2. Go to Data Table page
3. Click **"Import CSV"**
4. Upload your file

**Example CSV:**
```csv
productName,category,unitType,unit,pricePerUnit,quantity,supplier,region,date
Premium Ribeye Steak,Beef,weight,kg,32.99,15,Premium Beef Co,North America,2025-07-26
Fresh Duck Breast,Duck,weight,kg,22.50,10,Artisan Poultry,Europe,2025-07-26
```

---

## 📊 Searching & Filtering Your Data

### **Web Interface Filters**
1. Go to Data Table page
2. Click **"Filter"** button
3. Available filters:
   - **Date Range**: From/To dates
   - **Category**: Select specific meat types
   - **Region**: Geographic areas
   - **Price Range**: Min/Max prices
   - **Supplier**: Specific suppliers

### **Database Search Queries**

#### **Basic Searches**
```bash
mongosh meatmarket

# Find by category
db.meatdatas.find({category: "Beef"})

# Find by price range
db.meatdatas.find({pricePerUnit: {$gte: 20, $lte: 30}})

# Find by supplier
db.meatdatas.find({supplier: "Fresh Farms Ltd"})

# Find by region
db.meatdatas.find({region: "North America"})
```

#### **Advanced Searches**
```bash
# Multiple criteria
db.meatdatas.find({
  category: "Beef",
  region: "North America",
  pricePerUnit: {$gte: 15}
})

# Text search in product names
db.meatdatas.find({productName: {$regex: "steak", $options: "i"}})

# Date range search
db.meatdatas.find({
  date: {
    $gte: "2025-01-01",
    $lte: "2025-07-26"
  }
})

# High-value items (total selling price > $1000)
db.meatdatas.find({totalSellingPrice: {$gt: 1000}})
```

#### **Data Analytics Queries**
```bash
# Count by category
db.meatdatas.aggregate([
  {$group: {_id: "$category", count: {$sum: 1}}},
  {$sort: {count: -1}}
])

# Average price by category  
db.meatdatas.aggregate([
  {$group: {
    _id: "$category", 
    avgPrice: {$avg: "$pricePerUnit"},
    totalQuantity: {$sum: "$quantity"}
  }}
])

# Most expensive items
db.meatdatas.find().sort({pricePerUnit: -1}).limit(10)

# Suppliers with most products
db.meatdatas.aggregate([
  {$group: {_id: "$supplier", productCount: {$sum: 1}}},
  {$sort: {productCount: -1}},
  {$limit: 10}
])

# Total market value
db.meatdatas.aggregate([
  {$group: {_id: null, totalValue: {$sum: "$totalSellingPrice"}}}
])
```

---

## ✏️ Updating Your Data

### **Web Interface**
1. Go to Data Table page
2. Find the record you want to edit
3. Click **"Edit"** button
4. Modify fields in popup form
5. Click **"Save"**

### **Database Updates**
```bash
mongosh meatmarket

# Update single record
db.meatdatas.updateOne(
  {productName: "Premium Beef Steak"},
  {$set: {pricePerUnit: 28.99, quantity: 75}}
)

# Update multiple records
db.meatdatas.updateMany(
  {category: "Chicken"},
  {$inc: {pricePerUnit: 1.50}}  // Increase all chicken prices by $1.50
)

# Update with current date
db.meatdatas.updateOne(
  {productName: "Fresh Salmon"},
  {$set: {date: "2025-07-26", updatedAt: new Date()}}
)
```

---

## 📤 Exporting Your Data

### **Method 1: CSV Export (Web Interface)**
1. Go to Data Table page
2. Apply any filters you want
3. Click **"Export CSV"**
4. File downloads automatically

### **Method 2: Database Export**
```bash
# Export as JSON
mongoexport --db meatmarket --collection meatdatas --out meatdata_backup.json

# Export as CSV
mongoexport --db meatmarket --collection meatdatas --type=csv \
  --fields productName,category,unitType,unit,pricePerUnit,quantity,totalSellingPrice,supplier,region,date \
  --out meatdata_export.csv

# Export filtered data (example: only beef products)
mongoexport --db meatmarket --collection meatdatas --query '{"category":"Beef"}' \
  --type=csv --fields productName,pricePerUnit,quantity,supplier,date \
  --out beef_products.csv
```

### **Method 3: Full Database Backup**
```bash
# Complete database backup
mongodump --db meatmarket --out ./backups/$(date +%Y%m%d)

# Restore from backup (if needed)
mongorestore --db meatmarket ./backups/YYYYMMDD/meatmarket
```

---

## 🗑️ Deleting Data

### **Web Interface**
1. Go to Data Table page
2. Find the record to delete
3. Click **"Delete"** button
4. Confirm deletion in popup

### **Database Deletion**
```bash
mongosh meatmarket

# Delete single record
db.meatdatas.deleteOne({productName: "Old Product Name"})

# Delete by criteria (BE CAREFUL!)
db.meatdatas.deleteMany({date: {$lt: "2023-01-01"}})  # Delete old data

# Delete by category (CAREFUL!)
db.meatdatas.deleteMany({category: "OldCategory"})

# To delete ALL data (DANGER - only if you're sure!)
# db.meatdatas.deleteMany({})
```

⚠️ **WARNING**: Always backup before bulk deletions!

---

## 📈 Data Analytics & Reports

### **Built-in Analytics (Web Interface)**
- Go to: `http://localhost:3000/dashboard`
- **Key Metrics**: Total products, market value, suppliers
- **Charts**: Price trends, category distribution, regional analysis
- **Filters**: Date ranges, categories, regions

### **Custom Analytics Queries**

#### **Financial Analysis**
```bash
mongosh meatmarket

# Total market value
db.meatdatas.aggregate([
  {$group: {_id: null, totalValue: {$sum: "$totalSellingPrice"}}}
])

# Average selling price by category
db.meatdatas.aggregate([
  {$group: {
    _id: "$category",
    avgPrice: {$avg: "$pricePerUnit"},
    avgTotal: {$avg: "$totalSellingPrice"},
    count: {$sum: 1}
  }},
  {$sort: {avgPrice: -1}}
])

# Most valuable inventory by supplier
db.meatdatas.aggregate([
  {$group: {
    _id: "$supplier",
    totalValue: {$sum: "$totalSellingPrice"},
    productCount: {$sum: 1}
  }},
  {$sort: {totalValue: -1}},
  {$limit: 10}
])
```

#### **Inventory Analysis**
```bash  
# Low stock items (quantity < 20)
db.meatdatas.find({quantity: {$lt: 20}}).sort({quantity: 1})

# High stock items (quantity > 100)  
db.meatdatas.find({quantity: {$gt: 100}}).sort({quantity: -1})

# Stock value by region
db.meatdatas.aggregate([
  {$group: {
    _id: "$region",
    totalQuantity: {$sum: "$quantity"},
    totalValue: {$sum: "$totalSellingPrice"},
    avgPrice: {$avg: "$pricePerUnit"}
  }}
])
```

#### **Trend Analysis**
```bash
# Products added per month
db.meatdatas.aggregate([
  {$group: {
    _id: {$substr: ["$date", 0, 7]},  // Group by YYYY-MM
    count: {$sum: 1},
    totalValue: {$sum: "$totalSellingPrice"}
  }},
  {$sort: {_id: 1}}
])

# Price trends by category over time
db.meatdatas.aggregate([
  {$group: {
    _id: {
      category: "$category",
      month: {$substr: ["$date", 0, 7]}
    },
    avgPrice: {$avg: "$pricePerUnit"}
  }},
  {$sort: {"_id.month": 1, "_id.category": 1}}
])
```

---

## 🔄 Data Maintenance

### **Regular Maintenance Tasks**

#### **Weekly**
```bash
# Check data consistency
./db-summary.sh

# Update any stale prices (if needed)
mongosh meatmarket --eval "
  db.meatdatas.find({date: {$lt: '2025-01-01'}}).count()
"
```

#### **Monthly**
```bash
# Backup database
mongodump --db meatmarket --out ./backups/monthly_$(date +%Y%m%d)

# Clean up old test data (if any)
mongosh meatmarket --eval "
  db.meatdatas.deleteMany({productName: {$regex: 'test', $options: 'i'}})
"

# Update quantities for seasonal adjustments (example)
mongosh meatmarket --eval "
  db.meatdatas.updateMany(
    {category: 'Turkey'},
    {$inc: {quantity: 10}}  // Increase turkey stock before holidays
  )
"
```

### **Performance Optimization**
```bash
mongosh meatmarket

# Create indexes for faster searches
db.meatdatas.createIndex({category: 1})
db.meatdatas.createIndex({supplier: 1})
db.meatdatas.createIndex({date: 1})
db.meatdatas.createIndex({pricePerUnit: 1})

# Check index usage
db.meatdatas.getIndexes()

# Database statistics
db.stats()
```

---

## 🚨 Common Data Issues & Solutions

### **Problem: Duplicate Records**
```bash
# Find duplicates
db.meatdatas.aggregate([
  {$group: {
    _id: {productName: "$productName", supplier: "$supplier"},
    count: {$sum: 1},
    docs: {$push: "$_id"}
  }},
  {$match: {count: {$gt: 1}}}
])

# Remove duplicates (keep first occurrence)
# Review the results first, then run deletion if needed
```

### **Problem: Inconsistent Data**
```bash
# Find records with zero or negative prices
db.meatdatas.find({pricePerUnit: {$lte: 0}})

# Find records with zero quantity
db.meatdatas.find({quantity: {$lte: 0}})

# Fix negative prices (example)
db.meatdatas.updateMany(
  {pricePerUnit: {$lte: 0}},
  {$set: {pricePerUnit: 1.00}}
)
```

### **Problem: Missing Fields**
```bash
# Find records missing required fields
db.meatdatas.find({productName: {$exists: false}})
db.meatdatas.find({category: {$exists: false}})

# Add missing fields with default values
db.meatdatas.updateMany(
  {unitType: {$exists: false}},
  {$set: {unitType: "weight", unit: "kg"}}
)
```

---

## 🎯 Best Practices

### **Data Entry**
- ✅ Always use consistent naming (e.g., "Beef Steak" not "beef steak")
- ✅ Verify prices before saving (check for decimal errors)
- ✅ Use standard date format (YYYY-MM-DD)
- ✅ Keep supplier names consistent
- ✅ Review auto-calculated totalSellingPrice

### **Data Management**
- 📅 Regular backups (weekly minimum)
- 🔍 Periodic data validation checks
- 📊 Monitor database size and performance
- 🧹 Clean up test/duplicate data regularly
- 📈 Track data growth trends

### **Security**
- 🔒 Never share database credentials
- 🛡️ Regular password updates
- 🔐 Limit database access to necessary users
- 📋 Log important data changes

---

## 📞 Quick Help Commands

```bash
# Check if database is running
mongosh --eval "db.runCommand('ping')"

# Quick data count
mongosh meatmarket --eval "print('Total records:', db.meatdatas.countDocuments())"

# Latest 5 entries
mongosh meatmarket --eval "db.meatdatas.find().sort({createdAt:-1}).limit(5).forEach(printjson)"

# Database size
mongosh meatmarket --eval "db.stats().dataSize"
```

---

*This guide provides everything you need to effectively manage your meat market dataset. Keep it handy for daily operations!*

*Last updated: July 26, 2025*
