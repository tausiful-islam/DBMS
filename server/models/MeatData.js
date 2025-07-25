const mongoose = require('mongoose');

const meatDataSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    enum: ['Beef', 'Chicken', 'Pork', 'Lamb', 'Fish', 'Turkey', 'Other']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unitType: {
    type: String,
    enum: ['number', 'weight'],
    required: [true, 'Unit type is required'],
    default: 'weight'
  },
  unit: {
    type: String,
    enum: ['kg', 'lbs', 'tons', 'pieces', 'units', 'items'],
    default: 'kg'
  },
  suppliedTo: {
    type: String,
    required: [true, 'Supplied to field is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    trim: true
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Price per unit is required'],
    min: [0, 'Price cannot be negative']
  },
  totalSellingPrice: {
    type: Number,
    required: true,
    min: [0, 'Total selling price cannot be negative']
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'INR'],
    default: 'USD'
  },
  category: {
    type: String,
    enum: ['production', 'supply', 'demand'],
    default: 'supply'
  },
  quality: {
    type: String,
    enum: ['Premium', 'Standard', 'Economy'],
    default: 'Standard'
  },
  supplier: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: 500
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate total selling price
meatDataSchema.pre('save', function(next) {
  // Calculate total selling price = quantity × pricePerUnit
  this.totalSellingPrice = this.quantity * this.pricePerUnit;
  next();
});

// Pre-update middleware for findOneAndUpdate
meatDataSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.quantity !== undefined || update.pricePerUnit !== undefined) {
    const quantity = update.quantity || this.quantity;
    const pricePerUnit = update.pricePerUnit || this.pricePerUnit;
    update.totalSellingPrice = quantity * pricePerUnit;
  }
  next();
});

// Indexes for better query performance
meatDataSchema.index({ productName: 1, date: -1 });
meatDataSchema.index({ area: 1, date: -1 });
meatDataSchema.index({ createdBy: 1 });
meatDataSchema.index({ totalSellingPrice: -1 });

module.exports = mongoose.model('MeatData', meatDataSchema);
