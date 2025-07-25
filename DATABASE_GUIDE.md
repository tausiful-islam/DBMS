# 📊 Database Access Guide - Meat Market Platform

## 🗄️ **Database Overview**

Your MongoDB database is called `meatmarket` and contains:
- **users** - All registered user accounts
- **meatdatas** - All meat market product data
- **Other collections** - Created automatically as needed

---

## 🔍 **How to View Database Contents**

### **Method 1: MongoDB Shell (Command Line)**

#### Connect to Database:
```bash
mongosh meatmarket
```

#### Basic Database Commands:
```javascript
// Show current database
db.getName()

// List all collections (tables)
show collections

// Exit the shell
exit
```

---

## 👥 **View User Accounts**

### **All Users (without passwords):**
```bash
mongosh meatmarket --quiet --eval "db.users.find({}, {password: 0}).forEach(user => console.log(JSON.stringify(user, null, 2)))"
```

### **Count Total Users:**
```bash
mongosh meatmarket --quiet --eval "console.log('Total users:', db.users.countDocuments())"
```

### **Users by Role:**
```bash
# Admin users
mongosh meatmarket --quiet --eval "db.users.find({role: 'admin'}, {name: 1, email: 1, role: 1}).forEach(user => console.log(user.name + ' - ' + user.email + ' (' + user.role + ')'))"

# Manager users  
mongosh meatmarket --quiet --eval "db.users.find({role: 'manager'}, {name: 1, email: 1, role: 1}).forEach(user => console.log(user.name + ' - ' + user.email + ' (' + user.role + ')'))"

# Regular users
mongosh meatmarket --quiet --eval "db.users.find({role: 'user'}, {name: 1, email: 1, role: 1}).forEach(user => console.log(user.name + ' - ' + user.email + ' (' + user.role + ')'))"
```

---

## 🥩 **View Product Data**

### **All Products:**
```bash
mongosh meatmarket --quiet --eval "db.meatdatas.find({}).forEach(product => console.log(JSON.stringify(product, null, 2)))"
```

### **Count Total Products:**
```bash
mongosh meatmarket --quiet --eval "console.log('Total products:', db.meatdatas.countDocuments())"
```

### **Products by Category:**
```bash
# Beef products
mongosh meatmarket --quiet --eval "db.meatdatas.find({category: 'beef'}).forEach(product => console.log(product.productName + ' - $' + product.pricePerUnit + '/' + product.unitOfMeasure))"

# Chicken products
mongosh meatmarket --quiet --eval "db.meatdatas.find({category: 'chicken'}).forEach(product => console.log(product.productName + ' - $' + product.pricePerUnit + '/' + product.unitOfMeasure))"

# All categories count
mongosh meatmarket --quiet --eval "db.meatdatas.aggregate([{$group: {_id: '$category', count: {$sum: 1}}}]).forEach(result => console.log(result._id + ': ' + result.count + ' products'))"
```

---

## 📋 **Quick Database Summary Script**

I've created a handy script for you:

```bash
./db-summary.sh
```

This script shows:
- Database overview
- Total users by role
- Total products by category  
- Recent activity
- Database size information

---

## 🔧 **Interactive Database Explorer**

### **Method 1: MongoDB Shell Interactive Mode**
```bash
mongosh meatmarket
```

Then use these commands:
```javascript
// View users
db.users.find().pretty()

// View products  
db.meatdatas.find().pretty()

// Search users by email
db.users.findOne({email: "user@example.com"})

// Search products by name
db.meatdatas.find({productName: /beef/i})

// Count documents
db.users.countDocuments()
db.meatdatas.countDocuments()
```

---

## 📈 **Advanced Queries**

### **User Statistics:**
```javascript
// Users created in last 7 days
db.users.find({
  createdAt: {
    $gte: new Date(Date.now() - 7*24*60*60*1000)
  }
})

// Users by role count
db.users.aggregate([
  {$group: {_id: "$role", count: {$sum: 1}}}
])
```

### **Product Analytics:**
```javascript
// Average price by category
db.meatdatas.aggregate([
  {$group: {
    _id: "$category", 
    avgPrice: {$avg: "$pricePerUnit"},
    count: {$sum: 1}
  }}
])

// Products above certain price
db.meatdatas.find({pricePerUnit: {$gt: 10}})

// Recent products (last 30 days)
db.meatdatas.find({
  createdAt: {
    $gte: new Date(Date.now() - 30*24*60*60*1000)
  }
})
```

---

## 💾 **Backup Database**

### **Create Backup:**
```bash
# Full backup
mongodump --db meatmarket --out ./backups/$(date +%Y%m%d_%H%M%S)

# Users only
mongodump --db meatmarket --collection users --out ./backups/users_$(date +%Y%m%d)

# Products only  
mongodump --db meatmarket --collection meatdatas --out ./backups/products_$(date +%Y%m%d)
```

### **Restore Backup:**
```bash
# Restore full database
mongorestore --db meatmarket ./backups/BACKUP_FOLDER/meatmarket

# Restore specific collection
mongorestore --db meatmarket --collection users ./backups/BACKUP_FOLDER/meatmarket/users.bson
```

---

## 🚨 **Database Maintenance**

### **Clean Up:**
```javascript
// Remove users without email (if any corrupted data)
db.users.deleteMany({email: {$exists: false}})

// Remove products with invalid prices
db.meatdatas.deleteMany({pricePerUnit: {$lte: 0}})
```

### **Index Management:**
```javascript
// View indexes
db.users.getIndexes()
db.meatdatas.getIndexes()

// Create index for faster email searches
db.users.createIndex({email: 1})

// Create index for product searches
db.meatdatas.createIndex({productName: 1})
db.meatdatas.createIndex({category: 1})
```

---

## 🔒 **Security Notes**

- **Never share** database connection strings
- **Always backup** before making changes  
- **Use secure passwords** for database access
- **Monitor access logs** regularly
- **Update indexes** for better performance

---

## 📊 **Current Database Status**

**Your database currently contains:**
- ✅ **2 Users** registered
- ⚠️  **0 Products** (you can add some via the web interface)
- ✅ **Database** is healthy and connected

**Next Steps:**
1. Add some product data via the web interface
2. Test with different user roles
3. Explore the analytics dashboard
4. Set up regular backups

---

*Use these commands to explore and manage your Meat Market Platform database!*
