const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const MeatData = require('./models/MeatData');

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Regular User',
    email: 'user@demo.com',
    password: 'user123',
    role: 'user'
  }
];

const sampleMeatData = [
  // Beef data
  {
    productName: 'Beef',
    quantity: 1000,
    unit: 'kg',
    suppliedTo: 'Metro Supermarket',
    date: new Date('2024-01-15'),
    area: 'New York',
    pricePerUnit: 12.50,
    currency: 'USD',
    category: 'supply',
    quality: 'Premium',
    supplier: 'Prime Beef Co.',
    notes: 'Grade A beef, fresh delivery'
  },
  {
    productName: 'Beef',
    quantity: 800,
    unit: 'kg',
    suppliedTo: 'Restaurant Chain A',
    date: new Date('2024-01-20'),
    area: 'California',
    pricePerUnit: 11.75,
    currency: 'USD',
    category: 'supply',
    quality: 'Standard',
    supplier: 'West Coast Meats',
    notes: 'Regular supply order'
  },
  // Chicken data
  {
    productName: 'Chicken',
    quantity: 1500,
    unit: 'kg',
    suppliedTo: 'Food Processing Plant',
    date: new Date('2024-01-18'),
    area: 'Texas',
    pricePerUnit: 4.25,
    currency: 'USD',
    category: 'production',
    quality: 'Standard',
    supplier: 'Texas Poultry Farm',
    notes: 'Fresh chicken for processing'
  },
  {
    productName: 'Chicken',
    quantity: 2000,
    unit: 'kg',
    suppliedTo: 'Wholesale Market',
    date: new Date('2024-02-01'),
    area: 'Georgia',
    pricePerUnit: 4.50,
    currency: 'USD',
    category: 'demand',
    quality: 'Premium',
    supplier: 'Southern Farms',
    notes: 'Organic chicken demand'
  },
  // Pork data
  {
    productName: 'Pork',
    quantity: 750,
    unit: 'kg',
    suppliedTo: 'Local Butcher Shop',
    date: new Date('2024-01-25'),
    area: 'Iowa',
    pricePerUnit: 8.75,
    currency: 'USD',
    category: 'supply',
    quality: 'Standard',
    supplier: 'Midwest Pork Producers',
    notes: 'Local distribution'
  },
  // Fish data
  {
    productName: 'Fish',
    quantity: 500,
    unit: 'kg',
    suppliedTo: 'Seafood Restaurant',
    date: new Date('2024-02-05'),
    area: 'Florida',
    pricePerUnit: 15.00,
    currency: 'USD',
    category: 'supply',
    quality: 'Premium',
    supplier: 'Atlantic Fisheries',
    notes: 'Fresh Atlantic salmon'
  },
  // Lamb data
  {
    productName: 'Lamb',
    quantity: 300,
    unit: 'kg',
    suppliedTo: 'Gourmet Restaurant',
    date: new Date('2024-02-10'),
    area: 'Colorado',
    pricePerUnit: 18.50,
    currency: 'USD',
    category: 'supply',
    quality: 'Premium',
    supplier: 'Mountain Lamb Ranch',
    notes: 'Grass-fed lamb'
  },
  // Turkey data
  {
    productName: 'Turkey',
    quantity: 600,
    unit: 'kg',
    suppliedTo: 'Holiday Market',
    date: new Date('2024-01-30'),
    area: 'Minnesota',
    pricePerUnit: 6.25,
    currency: 'USD',
    category: 'demand',
    quality: 'Standard',
    supplier: 'Northern Turkey Farm',
    notes: 'Seasonal demand increase'
  },
  // More varied data for better analytics
  {
    productName: 'Beef',
    quantity: 1200,
    unit: 'kg',
    suppliedTo: 'Export Company',
    date: new Date('2024-02-15'),
    area: 'Texas',
    pricePerUnit: 13.25,
    currency: 'USD',
    category: 'supply',
    quality: 'Premium',
    supplier: 'Texas Beef Export',
    notes: 'International export order'
  },
  {
    productName: 'Chicken',
    quantity: 3000,
    unit: 'kg',
    suppliedTo: 'Fast Food Chain',
    date: new Date('2024-02-20'),
    area: 'Illinois',
    pricePerUnit: 3.95,
    currency: 'USD',
    category: 'demand',
    quality: 'Economy',
    supplier: 'Bulk Poultry Supply',
    notes: 'Large volume order'
  },
  {
    productName: 'Pork',
    quantity: 900,
    unit: 'kg',
    suppliedTo: 'Processing Plant',
    date: new Date('2024-03-01'),
    area: 'North Carolina',
    pricePerUnit: 9.10,
    currency: 'USD',
    category: 'production',
    quality: 'Standard',
    supplier: 'Carolina Pork Co.',
    notes: 'Processing for bacon'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meatmarket');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await MeatData.deleteMany({});
    console.log('Cleared existing data');

    // Create users with hashed passwords
    const users = [];
    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.email}`);
    }

    // Create meat data entries
    const adminUser = users.find(u => u.role === 'admin');
    const regularUser = users.find(u => u.role === 'user');
    
    for (let i = 0; i < sampleMeatData.length; i++) {
      const entryData = {
        ...sampleMeatData[i],
        createdBy: i % 2 === 0 ? adminUser._id : regularUser._id // Alternate between users
      };
      
      const entry = new MeatData(entryData);
      await entry.save();
      console.log(`Created meat data entry: ${entry.productName} - ${entry.area}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Created ${users.length} users`);
    console.log(`- Created ${sampleMeatData.length} meat data entries`);
    console.log('\n🔑 Demo Login Credentials:');
    console.log('Admin: admin@demo.com / admin123');
    console.log('User: user@demo.com / user123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

seedDatabase();
