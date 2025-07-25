const express = require('express');
const MeatData = require('../models/MeatData');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Dashboard summary statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const totalEntries = await MeatData.countDocuments();
    
    const totalSupply = await MeatData.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    
    const avgPrice = await MeatData.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$pricePerUnit' } } }
    ]);

    // New metrics for total market value and average selling price
    const marketValueStats = await MeatData.aggregate([
      { 
        $group: { 
          _id: null, 
          totalMarketValue: { $sum: '$totalSellingPrice' },
          avgSellingPrice: { $avg: '$totalSellingPrice' }
        } 
      }
    ]);

    const productDistribution = await MeatData.aggregate([
      { 
        $group: { 
          _id: '$productName', 
          count: { $sum: 1 }, 
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: '$totalSellingPrice' }
        } 
      },
      { $sort: { totalValue: -1 } }
    ]);

    const recentEntries = await MeatData.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const monthlyTrends = await MeatData.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalQuantity: { $sum: '$quantity' },
          avgPrice: { $avg: '$pricePerUnit' },
          totalValue: { $sum: '$totalSellingPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      summary: {
        totalEntries,
        totalSupply: totalSupply[0]?.total || 0,
        avgPrice: avgPrice[0]?.avgPrice || 0,
        totalMarketValue: marketValueStats[0]?.totalMarketValue || 0,
        avgSellingPrice: marketValueStats[0]?.avgSellingPrice || 0,
        productTypes: productDistribution.length
      },
      productDistribution,
      recentEntries,
      monthlyTrends: monthlyTrends.reverse()
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

// Price trends by product
router.get('/price-trends', auth, async (req, res) => {
  try {
    const { productName, startDate, endDate, area } = req.query;
    
    const matchStage = {};
    if (productName) matchStage.productName = productName;
    if (area) matchStage.area = new RegExp(area, 'i');
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const priceData = await MeatData.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            productName: '$productName',
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          avgPrice: { $avg: '$pricePerUnit' },
          minPrice: { $min: '$pricePerUnit' },
          maxPrice: { $max: '$pricePerUnit' },
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Group by product for easier frontend consumption
    const groupedData = {};
    priceData.forEach(item => {
      const product = item._id.productName;
      if (!groupedData[product]) {
        groupedData[product] = [];
      }
      groupedData[product].push({
        period: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        avgPrice: item.avgPrice,
        minPrice: item.minPrice,
        maxPrice: item.maxPrice,
        totalQuantity: item.totalQuantity,
        count: item.count
      });
    });

    res.json(groupedData);
  } catch (error) {
    console.error('Price trends error:', error);
    res.status(500).json({ message: 'Server error while fetching price trends' });
  }
});

// Supply vs Demand analysis
router.get('/supply-demand', auth, async (req, res) => {
  try {
    const { area, startDate, endDate } = req.query;
    
    const matchStage = {};
    if (area) matchStage.area = new RegExp(area, 'i');
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const supplyDemandData = await MeatData.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            productName: '$productName',
            area: '$area',
            category: '$category'
          },
          totalQuantity: { $sum: '$quantity' },
          avgPrice: { $avg: '$pricePerUnit' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: {
            productName: '$_id.productName',
            area: '$_id.area'
          },
          supply: {
            $sum: {
              $cond: [{ $eq: ['$_id.category', 'supply'] }, '$totalQuantity', 0]
            }
          },
          demand: {
            $sum: {
              $cond: [{ $eq: ['$_id.category', 'demand'] }, '$totalQuantity', 0]
            }
          },
          production: {
            $sum: {
              $cond: [{ $eq: ['$_id.category', 'production'] }, '$totalQuantity', 0]
            }
          },
          avgPrice: { $avg: '$avgPrice' }
        }
      },
      {
        $addFields: {
          balance: { $subtract: ['$supply', '$demand'] },
          demandSupplyRatio: {
            $cond: [
              { $eq: ['$supply', 0] },
              null,
              { $divide: ['$demand', '$supply'] }
            ]
          }
        }
      },
      { $sort: { '_id.productName': 1, '_id.area': 1 } }
    ]);

    res.json(supplyDemandData);
  } catch (error) {
    console.error('Supply-demand analysis error:', error);
    res.status(500).json({ message: 'Server error while fetching supply-demand data' });
  }
});

// Regional analysis
router.get('/regional-analysis', auth, async (req, res) => {
  try {
    const { productName, startDate, endDate } = req.query;
    
    const matchStage = {};
    if (productName) matchStage.productName = productName;
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const regionalData = await MeatData.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            area: '$area',
            productName: '$productName'
          },
          totalQuantity: { $sum: '$quantity' },
          avgPrice: { $avg: '$pricePerUnit' },
          minPrice: { $min: '$pricePerUnit' },
          maxPrice: { $max: '$pricePerUnit' },
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$quantity', '$pricePerUnit'] } }
        }
      },
      {
        $group: {
          _id: '$_id.area',
          products: {
            $push: {
              productName: '$_id.productName',
              totalQuantity: '$totalQuantity',
              avgPrice: '$avgPrice',
              minPrice: '$minPrice',
              maxPrice: '$maxPrice',
              count: '$count',
              totalValue: '$totalValue'
            }
          },
          totalAreaQuantity: { $sum: '$totalQuantity' },
          totalAreaValue: { $sum: '$totalValue' },
          avgAreaPrice: { $avg: '$avgPrice' }
        }
      },
      { $sort: { totalAreaValue: -1 } }
    ]);

    res.json(regionalData);
  } catch (error) {
    console.error('Regional analysis error:', error);
    res.status(500).json({ message: 'Server error while fetching regional analysis' });
  }
});

// Seasonal trends
router.get('/seasonal-trends', auth, async (req, res) => {
  try {
    const { productName, area } = req.query;
    
    const matchStage = {};
    if (productName) matchStage.productName = productName;
    if (area) matchStage.area = new RegExp(area, 'i');

    const seasonalData = await MeatData.aggregate([
      { $match: matchStage },
      {
        $addFields: {
          month: { $month: '$date' },
          season: {
            $switch: {
              branches: [
                { case: { $in: ['$month', [12, 1, 2]] }, then: 'Winter' },
                { case: { $in: ['$month', [3, 4, 5]] }, then: 'Spring' },
                { case: { $in: ['$month', [6, 7, 8]] }, then: 'Summer' },
                { case: { $in: ['$month', [9, 10, 11]] }, then: 'Fall' }
              ],
              default: 'Unknown'
            }
          }
        }
      },
      {
        $group: {
          _id: {
            productName: '$productName',
            season: '$season',
            month: '$month'
          },
          avgPrice: { $avg: '$pricePerUnit' },
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: {
            productName: '$_id.productName',
            season: '$_id.season'
          },
          avgSeasonPrice: { $avg: '$avgPrice' },
          totalSeasonQuantity: { $sum: '$totalQuantity' },
          monthlyData: {
            $push: {
              month: '$_id.month',
              avgPrice: '$avgPrice',
              totalQuantity: '$totalQuantity',
              count: '$count'
            }
          }
        }
      },
      { $sort: { '_id.productName': 1, '_id.season': 1 } }
    ]);

    res.json(seasonalData);
  } catch (error) {
    console.error('Seasonal trends error:', error);
    res.status(500).json({ message: 'Server error while fetching seasonal trends' });
  }
});

// Market insights
router.get('/market-insights', auth, async (req, res) => {
  try {
    // Top performing products by value
    const topProducts = await MeatData.aggregate([
      {
        $group: {
          _id: '$productName',
          totalValue: { $sum: { $multiply: ['$quantity', '$pricePerUnit'] } },
          totalQuantity: { $sum: '$quantity' },
          avgPrice: { $avg: '$pricePerUnit' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalValue: -1 } },
      { $limit: 5 }
    ]);

    // Price volatility analysis
    const volatilityAnalysis = await MeatData.aggregate([
      {
        $group: {
          _id: '$productName',
          prices: { $push: '$pricePerUnit' },
          avgPrice: { $avg: '$pricePerUnit' },
          minPrice: { $min: '$pricePerUnit' },
          maxPrice: { $max: '$pricePerUnit' },
          count: { $sum: 1 }
        }
      },
      {
        $addFields: {
          priceRange: { $subtract: ['$maxPrice', '$minPrice'] },
          volatilityIndex: {
            $cond: [
              { $eq: ['$avgPrice', 0] },
              0,
              { $divide: [{ $subtract: ['$maxPrice', '$minPrice'] }, '$avgPrice'] }
            ]
          }
        }
      },
      { $sort: { volatilityIndex: -1 } }
    ]);

    // Growth trends (comparing current vs previous period)
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000);

    const growthData = await Promise.all([
      // Current period (last 30 days)
      MeatData.aggregate([
        { $match: { date: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: '$productName',
            currentQuantity: { $sum: '$quantity' },
            currentAvgPrice: { $avg: '$pricePerUnit' }
          }
        }
      ]),
      // Previous period (30-60 days ago)
      MeatData.aggregate([
        { $match: { date: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
        {
          $group: {
            _id: '$productName',
            previousQuantity: { $sum: '$quantity' },
            previousAvgPrice: { $avg: '$pricePerUnit' }
          }
        }
      ])
    ]);

    // Combine growth data
    const growthAnalysis = growthData[0].map(current => {
      const previous = growthData[1].find(p => p._id === current._id);
      if (!previous) return { ...current, quantityGrowth: null, priceGrowth: null };

      const quantityGrowth = previous.previousQuantity ? 
        ((current.currentQuantity - previous.previousQuantity) / previous.previousQuantity) * 100 : null;
      const priceGrowth = previous.previousAvgPrice ? 
        ((current.currentAvgPrice - previous.previousAvgPrice) / previous.previousAvgPrice) * 100 : null;

      return {
        productName: current._id,
        currentQuantity: current.currentQuantity,
        previousQuantity: previous.previousQuantity,
        quantityGrowth,
        currentAvgPrice: current.currentAvgPrice,
        previousAvgPrice: previous.previousAvgPrice,
        priceGrowth
      };
    });

    res.json({
      topProducts,
      volatilityAnalysis,
      growthAnalysis
    });
  } catch (error) {
    console.error('Market insights error:', error);
    res.status(500).json({ message: 'Server error while fetching market insights' });
  }
});

module.exports = router;
