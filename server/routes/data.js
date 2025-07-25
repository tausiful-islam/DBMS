const express = require('express');
const { body, validationResult, query } = require('express-validator');
const MeatData = require('../models/MeatData');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Get all data with pagination and filtering
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('productName').optional().isString().withMessage('Product name must be a string'),
  query('area').optional().isString().withMessage('Area must be a string'),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.productName) filter.productName = req.query.productName;
    if (req.query.area) filter.area = new RegExp(req.query.area, 'i');
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }

    // Get data with pagination
    const data = await MeatData.find(filter)
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await MeatData.countDocuments(filter);

    res.json({
      data,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get data error:', error);
    res.status(500).json({ message: 'Server error while fetching data' });
  }
});

// Get single data entry
router.get('/:id', auth, async (req, res) => {
  try {
    const data = await MeatData.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!data) {
      return res.status(404).json({ message: 'Data entry not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get single data error:', error);
    res.status(500).json({ message: 'Server error while fetching data entry' });
  }
});

// Create new data entry
router.post('/', auth, [
  body('productName').isIn(['Beef', 'Chicken', 'Pork', 'Lamb', 'Fish', 'Turkey', 'Other']).withMessage('Invalid product name'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('suppliedTo').trim().isLength({ min: 1 }).withMessage('Supplied to is required'),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  body('area').trim().isLength({ min: 1 }).withMessage('Area is required'),
  body('pricePerUnit').isFloat({ min: 0 }).withMessage('Price per unit must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const dataEntry = new MeatData({
      ...req.body,
      createdBy: req.user._id
    });

    await dataEntry.save();
    await dataEntry.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Data entry created successfully',
      data: dataEntry
    });
  } catch (error) {
    console.error('Create data error:', error);
    res.status(500).json({ message: 'Server error while creating data entry' });
  }
});

// Update data entry
router.put('/:id', auth, [
  body('productName').optional().isIn(['Beef', 'Chicken', 'Pork', 'Lamb', 'Fish', 'Turkey', 'Other']).withMessage('Invalid product name'),
  body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('suppliedTo').optional().trim().isLength({ min: 1 }).withMessage('Supplied to cannot be empty'),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  body('area').optional().trim().isLength({ min: 1 }).withMessage('Area cannot be empty'),
  body('pricePerUnit').optional().isFloat({ min: 0 }).withMessage('Price per unit must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const dataEntry = await MeatData.findById(req.params.id);
    
    if (!dataEntry) {
      return res.status(404).json({ message: 'Data entry not found' });
    }

    // Check if user owns this entry or is admin
    if (dataEntry.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this entry' });
    }

    const updatedData = await MeatData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      message: 'Data entry updated successfully',
      data: updatedData
    });
  } catch (error) {
    console.error('Update data error:', error);
    res.status(500).json({ message: 'Server error while updating data entry' });
  }
});

// Delete data entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const dataEntry = await MeatData.findById(req.params.id);
    
    if (!dataEntry) {
      return res.status(404).json({ message: 'Data entry not found' });
    }

    // Check if user owns this entry or is admin
    if (dataEntry.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this entry' });
    }

    await MeatData.findByIdAndDelete(req.params.id);

    res.json({ message: 'Data entry deleted successfully' });
  } catch (error) {
    console.error('Delete data error:', error);
    res.status(500).json({ message: 'Server error while deleting data entry' });
  }
});

// Bulk upload CSV
router.post('/upload-csv', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    const errors = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const validEntries = [];

          for (let i = 0; i < results.length; i++) {
            const row = results[i];
            try {
              const entry = {
                productName: row.productName || row['Product Name'],
                quantity: parseFloat(row.quantity || row['Quantity']),
                suppliedTo: row.suppliedTo || row['Supplied To'],
                date: new Date(row.date || row['Date']),
                area: row.area || row['Area'],
                pricePerUnit: parseFloat(row.pricePerUnit || row['Price Per Unit']),
                unit: row.unit || 'kg',
                currency: row.currency || 'USD',
                category: row.category || 'supply',
                quality: row.quality || 'Standard',
                supplier: row.supplier || row['Supplier'] || '',
                notes: row.notes || row['Notes'] || '',
                createdBy: req.user._id
              };

              // Validate required fields
              if (!entry.productName || !entry.quantity || !entry.suppliedTo || !entry.area || !entry.pricePerUnit) {
                errors.push(`Row ${i + 1}: Missing required fields`);
                continue;
              }

              validEntries.push(entry);
            } catch (err) {
              errors.push(`Row ${i + 1}: ${err.message}`);
            }
          }

          if (validEntries.length > 0) {
            await MeatData.insertMany(validEntries);
          }

          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          res.json({
            message: `Successfully uploaded ${validEntries.length} entries`,
            uploaded: validEntries.length,
            errors: errors.length,
            errorDetails: errors
          });
        } catch (error) {
          fs.unlinkSync(req.file.path);
          console.error('CSV processing error:', error);
          res.status(500).json({ message: 'Error processing CSV file' });
        }
      });
  } catch (error) {
    console.error('CSV upload error:', error);
    res.status(500).json({ message: 'Server error during file upload' });
  }
});

// Export data to CSV
router.get('/export/csv', auth, async (req, res) => {
  try {
    const data = await MeatData.find({}).populate('createdBy', 'name');
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'No data to export' });
    }

    // Convert to CSV format
    const csvHeader = 'Product Name,Quantity,Unit,Supplied To,Date,Area,Price Per Unit,Currency,Category,Quality,Supplier,Notes,Created By\n';
    const csvRows = data.map(entry => 
      `"${entry.productName}","${entry.quantity}","${entry.unit}","${entry.suppliedTo}","${entry.date.toISOString().split('T')[0]}","${entry.area}","${entry.pricePerUnit}","${entry.currency}","${entry.category}","${entry.quality}","${entry.supplier || ''}","${entry.notes || ''}","${entry.createdBy.name}"`
    ).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="meat-data-export.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ message: 'Server error during export' });
  }
});

module.exports = router;
