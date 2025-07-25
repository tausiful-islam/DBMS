#!/bin/bash

echo "📊 Meat Market Platform - Database Summary"
echo "=========================================="
echo ""

# Check if MongoDB is running
if ! systemctl is-active --quiet mongod; then
    echo "❌ MongoDB is not running. Please start it first:"
    echo "   sudo systemctl start mongod"
    exit 1
fi

echo "🗄️  DATABASE OVERVIEW"
echo "-------------------"
mongosh meatmarket --quiet --eval "
console.log('Database Name: ' + db.getName());
console.log('Collections: ' + db.getCollectionNames().join(', '));
console.log('Database Size: ' + JSON.stringify(db.stats().dataSize) + ' bytes');
"

echo ""
echo "👥 USER ACCOUNTS"
echo "----------------"
mongosh meatmarket --quiet --eval "
const totalUsers = db.users.countDocuments();
console.log('Total Users: ' + totalUsers);

if(totalUsers > 0) {
  console.log('');
  console.log('Users by Role:');
  db.users.aggregate([
    {\$group: {_id: '\$role', count: {\$sum: 1}}}
  ]).forEach(result => {
    console.log('  ' + result._id + ': ' + result.count + ' users');
  });
  
  console.log('');
  console.log('Recent Users:');
  db.users.find({}, {name: 1, email: 1, role: 1, createdAt: 1}).sort({createdAt: -1}).limit(5).forEach(user => {
    const date = user.createdAt ? user.createdAt.toISOString().split('T')[0] : 'N/A';
    console.log('  • ' + user.name + ' (' + user.email + ') - ' + user.role + ' - ' + date);
  });
} else {
  console.log('No users found in database.');
}
"

echo ""
echo "🥩 PRODUCT DATA"
echo "---------------"
mongosh meatmarket --quiet --eval "
const totalProducts = db.meatdatas.countDocuments();
console.log('Total Products: ' + totalProducts);

if(totalProducts > 0) {
  console.log('');
  console.log('Products by Category:');
  db.meatdatas.aggregate([
    {\$group: {_id: '\$category', count: {\$sum: 1}, avgPrice: {\$avg: '\$pricePerUnit'}}}
  ]).forEach(result => {
    const avgPrice = result.avgPrice ? '\$' + result.avgPrice.toFixed(2) : 'N/A';
    console.log('  ' + result._id + ': ' + result.count + ' items (avg: ' + avgPrice + ')');
  });
  
  console.log('');
  console.log('Recent Products:');
  db.meatdatas.find({}, {productName: 1, category: 1, pricePerUnit: 1, createdAt: 1}).sort({createdAt: -1}).limit(5).forEach(product => {
    const date = product.createdAt ? product.createdAt.toISOString().split('T')[0] : 'N/A';
    const price = product.pricePerUnit ? '\$' + product.pricePerUnit : 'N/A';
    console.log('  • ' + product.productName + ' (' + product.category + ') - ' + price + ' - ' + date);
  });
} else {
  console.log('No products found in database.');
  console.log('');
  console.log('💡 To add products:');
  console.log('   1. Go to http://localhost:3000');
  console.log('   2. Login to your account');
  console.log('   3. Navigate to Data Table');
  console.log('   4. Click \"Add New Entry\"');
}
"

echo ""
echo "⚡ QUICK ACCESS COMMANDS"
echo "------------------------"
echo "View all users:       mongosh meatmarket --eval \"db.users.find({}, {password: 0}).pretty()\""
echo "View all products:    mongosh meatmarket --eval \"db.meatdatas.find({}).pretty()\""
echo "Database shell:       mongosh meatmarket"
echo "Backup database:      mongodump --db meatmarket --out ./backup_\$(date +%Y%m%d)"
echo ""
echo "🌐 Web Interface:     http://localhost:3000"
echo "📖 Full guide:        cat DATABASE_GUIDE.md"
