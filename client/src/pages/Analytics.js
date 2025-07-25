import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line, Bar } from 'react-chartjs-2';
import {
  ChartBarIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { analyticsService } from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const Analytics = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  // Queries for different analytics
  const { data: priceTrends, isLoading: loadingPrices } = useQuery({
    queryKey: ['price-trends', selectedProduct, selectedArea, dateRange.startDate, dateRange.endDate],
    queryFn: () => analyticsService.getPriceTrends({
      productName: selectedProduct,
      area: selectedArea,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    }),
  });

  const { data: supplyDemand, isLoading: loadingSupplyDemand } = useQuery({
    queryKey: ['supply-demand', selectedArea, dateRange.startDate, dateRange.endDate],
    queryFn: () => analyticsService.getSupplyDemand({
      area: selectedArea,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    }),
  });

  const { data: regionalAnalysis, isLoading: loadingRegional } = useQuery({
    queryKey: ['regional-analysis', selectedProduct, dateRange.startDate, dateRange.endDate],
    queryFn: () => analyticsService.getRegionalAnalysis({
      productName: selectedProduct,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    }),
  });

  const { data: seasonalTrends, isLoading: loadingSeasonal } = useQuery({
    queryKey: ['seasonal-trends', selectedProduct, selectedArea],
    queryFn: () => analyticsService.getSeasonalTrends({
      productName: selectedProduct,
      area: selectedArea,
    }),
  });

  const { data: marketInsights } = useQuery({
    queryKey: ['market-insights'],
    queryFn: analyticsService.getMarketInsights,
  });

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
      },
      tooltip: {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        titleColor: document.documentElement.classList.contains('dark') ? '#f9fafb' : '#111827',
        bodyColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#f3f4f6',
        },
      },
      y: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#f3f4f6',
        },
      },
    },
  };

  // Price trends chart data
  const getPriceTrendData = () => {
    if (!priceTrends) return { labels: [], datasets: [] };

    const colors = [
      'rgb(239, 68, 68)',
      'rgb(245, 158, 11)',
      'rgb(34, 197, 94)',
      'rgb(59, 130, 246)',
      'rgb(147, 51, 234)',
      'rgb(236, 72, 153)',
    ];

    const datasets = Object.entries(priceTrends).map(([product, data], index) => ({
      label: `${product} - Avg Price`,
      data: data.map(item => ({ x: item.period, y: item.avgPrice })),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '20',
      tension: 0.1,
    }));

    return { datasets };
  };

  // Supply vs Demand chart data
  const getSupplyDemandData = () => {
    if (!supplyDemand) return { labels: [], datasets: [] };

    const labels = supplyDemand.map(item => 
      `${item._id.productName} - ${item._id.area}`
    );

    return {
      labels,
      datasets: [
        {
          label: 'Supply (kg)',
          data: supplyDemand.map(item => item.supply),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
        },
        {
          label: 'Demand (kg)',
          data: supplyDemand.map(item => item.demand),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
        },
        {
          label: 'Production (kg)',
          data: supplyDemand.map(item => item.production),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Regional analysis chart data
  const getRegionalData = () => {
    if (!regionalAnalysis) return { labels: [], datasets: [] };

    const labels = regionalAnalysis.map(item => item._id);
    
    return {
      labels,
      datasets: [
        {
          label: 'Total Quantity (kg)',
          data: regionalAnalysis.map(item => item.totalAreaQuantity),
          backgroundColor: 'rgba(147, 51, 234, 0.8)',
          borderColor: 'rgba(147, 51, 234, 1)',
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          label: 'Average Price ($)',
          data: regionalAnalysis.map(item => item.avgAreaPrice),
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          borderColor: 'rgba(245, 158, 11, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
        },
      ],
    };
  };

  // Seasonal trends chart data
  const getSeasonalData = () => {
    if (!seasonalTrends) return { labels: [], datasets: [] };

    const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
    const products = [...new Set(seasonalTrends.map(item => item._id.productName))];
    const colors = [
      'rgb(239, 68, 68)',
      'rgb(245, 158, 11)',
      'rgb(34, 197, 94)',
      'rgb(59, 130, 246)',
      'rgb(147, 51, 234)',
    ];

    const datasets = products.map((product, index) => {
      const productData = seasonalTrends.filter(item => item._id.productName === product);
      const data = seasons.map(season => {
        const seasonData = productData.find(item => item._id.season === season);
        return seasonData ? seasonData.avgSeasonPrice : 0;
      });

      return {
        label: `${product} - Avg Price`,
        data,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        tension: 0.1,
      };
    });

    return {
      labels: seasons,
      datasets,
    };
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Historic Analysis
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Comprehensive market analytics and trends
        </p>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Analysis Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="input-field"
            >
              <option value="">All Products</option>
              <option value="Beef">Beef</option>
              <option value="Chicken">Chicken</option>
              <option value="Pork">Pork</option>
              <option value="Lamb">Lamb</option>
              <option value="Fish">Fish</option>
              <option value="Turkey">Turkey</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Area
            </label>
            <input
              type="text"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="input-field"
              placeholder="Enter area/region"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Market Insights Summary */}
      {marketInsights && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Products */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <ArrowTrendingUpIcon className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Products by Value
              </h3>
            </div>
            <div className="space-y-3">
              {marketInsights.topProducts?.slice(0, 5).map((product, index) => (
                <div key={product._id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {index + 1}. {product._id}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${product.totalValue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Volatility */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="w-5 h-5 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Price Volatility
              </h3>
            </div>
            <div className="space-y-3">
              {marketInsights.volatilityAnalysis?.slice(0, 5).map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item._id}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {(item.volatilityIndex * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Analysis */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <GlobeAltIcon className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Growth Trends (30d)
              </h3>
            </div>
            <div className="space-y-3">
              {marketInsights.growthAnalysis?.slice(0, 5).map((item) => (
                <div key={item.productName} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.productName}
                  </span>
                  <span className={`text-sm font-medium ${
                    item.quantityGrowth > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {item.quantityGrowth ? `${item.quantityGrowth.toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="space-y-8">
        {/* Price Trends */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Price Trends Over Time
            </h3>
            {loadingPrices && <LoadingSpinner size="small" />}
          </div>
          <div className="h-96">
            {priceTrends && Object.keys(priceTrends).length > 0 ? (
              <Line 
                data={getPriceTrendData()} 
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    x: {
                      ...chartOptions.scales.x,
                      type: 'time',
                      time: {
                        unit: 'month',
                      },
                    },
                  },
                }} 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                {loadingPrices ? 'Loading...' : 'No price trend data available'}
              </div>
            )}
          </div>
        </div>

        {/* Supply vs Demand */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Supply vs Demand Analysis
            </h3>
            {loadingSupplyDemand && <LoadingSpinner size="small" />}
          </div>
          <div className="h-96">
            {supplyDemand && supplyDemand.length > 0 ? (
              <Bar data={getSupplyDemandData()} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                {loadingSupplyDemand ? 'Loading...' : 'No supply-demand data available'}
              </div>
            )}
          </div>
        </div>

        {/* Regional Analysis and Seasonal Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Regional Analysis */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Regional Analysis
              </h3>
              {loadingRegional && <LoadingSpinner size="small" />}
            </div>
            <div className="h-80">
              {regionalAnalysis && regionalAnalysis.length > 0 ? (
                <Bar 
                  data={getRegionalData()} 
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: {
                          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
                        },
                        grid: {
                          drawOnChartArea: false,
                        },
                      },
                    },
                  }} 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  {loadingRegional ? 'Loading...' : 'No regional data available'}
                </div>
              )}
            </div>
          </div>

          {/* Seasonal Trends */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Seasonal Trends
              </h3>
              {loadingSeasonal && <LoadingSpinner size="small" />}
            </div>
            <div className="h-80">
              {seasonalTrends && seasonalTrends.length > 0 ? (
                <Line data={getSeasonalData()} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  {loadingSeasonal ? 'Loading...' : 'No seasonal data available'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
