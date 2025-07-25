const mongoose = require('mongoose');
const MeatData = require('./models/MeatData');
const User = require('./models/User');
require('dotenv').config();

// Sample data arrays for realistic generation
const products = ['Beef', 'Chicken', 'Pork', 'Lamb', 'Fish', 'Turkey'];
const areas = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle',
  'Denver', 'Washington DC', 'Boston', 'El Paso', 'Detroit', 'Nashville',
  'Portland', 'Memphis', 'Oklahoma City', 'Las Vegas', 'Louisville', 'Baltimore'
];
const suppliers = [
  'Prime Meat Co', 'Fresh Foods Ltd', 'Global Meat Supply', 'Local Farm Fresh',
  'Organic Meats Inc', 'Quality Butchers', 'Farm to Table Co', 'Premium Cuts',
  'Wholesale Meat Distributors', 'City Meat Market', 'Country Fresh Meats',
  'Atlantic Meat Company', 'Pacific Protein', 'Midwest Meats', 'Southern Supply',
  'Northern Beef Co', 'East Coast Meats', 'West Coast Protein', 'Central Meats',
  'Regional Food Distributors'
];
const categories = ['production', 'supply', 'demand'];
const qualities = ['Premium', 'Standard', 'Economy'];
const unitTypes = ['number', 'weight'];

// Function to generate random date within last 2 years
function randomDate() {
  const start = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000); // 2 years ago
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to get appropriate unit based on unit type
function getUnit(unitType) {
  if (unitType === 'weight') {
    return ['kg', 'lbs', 'tons'][Math.floor(Math.random() * 3)];
  } else {
    return ['pieces', 'units', 'items'][Math.floor(Math.random() * 3)];
  }
}

// Function to generate realistic price based on product and quality
function generatePrice(product, quality, unitType) {
  let basePrice;
  
  // Base prices per unit/kg
  const basePrices = {
    'Beef': 15,
    'Chicken': 8,
    'Pork': 12,
    'Lamb': 18,
    'Fish': 14,
    'Turkey': 10
  };
  
  basePrice = basePrices[product] || 10;
  
  // Quality multiplier
  const qualityMultiplier = {
    'Premium': 1.5,
    'Standard': 1.0,
    'Economy': 0.7
  };
  
  basePrice *= qualityMultiplier[quality];
  
  // Add some randomness (±30%)
  const variation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
  basePrice *= variation;
  
  return Math.round(basePrice * 100) / 100; // Round to 2 decimal places
}

// Function to generate realistic quantity
function generateQuantity(unitType, product) {
  if (unitType === 'weight') {
    // Weight-based: 1-500 kg/lbs, 0.1-5 tons
    return Math.round((1 + Math.random() * 499) * 100) / 100;
  } else {
    // Number-based: 1-1000 pieces/units
    return Math.floor(1 + Math.random() * 999);
  }
}

async function seedDatabase() {
  try {
    console.log('🚀 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meatmarket');
    console.log('✅ Connected to MongoDB');
    
    // Get a user to associate with the data (create one if doesn't exist)
    let user = await User.findOne();
    if (!user) {
      user = new User({
        name: 'System Admin',
        email: 'admin@meatmarket.com',
        password: 'admin123',
        role: 'admin'
      });
      await user.save();
      console.log('✅ Created system admin user');
    }
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    await MeatData.deleteMany({});
    console.log('🗑️  Cleared existing meat data');
    
    const records = [];
    const totalRecords = 1200; // Generate 1200 records
    
    console.log(`📊 Generating ${totalRecords} sample records...`);
    
    for (let i = 0; i < totalRecords; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const area = areas[Math.floor(Math.random() * areas.length)];
      const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const quality = qualities[Math.floor(Math.random() * qualities.length)];
      const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
      const unit = getUnit(unitType);
      const quantity = generateQuantity(unitType, product);
      const pricePerUnit = generatePrice(product, quality, unitType);
      
      const record = {
        productName: product,
        quantity: quantity,
        unitType: unitType,
        unit: unit,
        suppliedTo: `${area} Distribution Center`,
        date: randomDate(),
        area: area,
        pricePerUnit: pricePerUnit,
        totalSellingPrice: quantity * pricePerUnit, // Will be recalculated by middleware
        currency: 'USD',
        category: category,
        quality: quality,
        supplier: supplier,
        notes: `${quality} quality ${product.toLowerCase()} for ${area} market`,
        createdBy: user._id
      };
      
      records.push(record);
      
      // Progress indicator
      if ((i + 1) % 100 === 0) {
        console.log(`📈 Generated ${i + 1}/${totalRecords} records...`);
      }
    }
    
    console.log('💾 Inserting records into database...');
    
    // Insert records in batches for better performance
    const batchSize = 100;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await MeatData.insertMany(batch);
      console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(records.length/batchSize)}`);
    }
    
    console.log('📊 Database seeding completed successfully!');
    
    // Show summary statistics
    const totalCount = await MeatData.countDocuments();
    const productStats = await MeatData.aggregate([
      { $group: { _id: '$productName', count: { $sum: 1 }, avgPrice: { $avg: '$totalSellingPrice' } } },
      { $sort: { count: -1 } }
    ]);
    
    const unitTypeStats = await MeatData.aggregate([
      { $group: { _id: '$unitType', count: { $sum: 1 } } }
    ]);
    
    console.log('\n📈 SEEDING SUMMARY:');
    console.log('==================');
    console.log(`Total Records: ${totalCount}`);
    console.log('\nProducts Distribution:');
    productStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} records (avg selling price: $${stat.avgPrice.toFixed(2)})`);
    });
    
    console.log('\nUnit Types:');
    unitTypeStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} records`);
    });
    
    const totalValue = await MeatData.aggregate([
      { $group: { _id: null, totalValue: { $sum: '$totalSellingPrice' } } }
    ]);
    
    console.log(`\n💰 Total Market Value: $${totalValue[0].totalValue.toFixed(2)}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding
seedDatabase();
