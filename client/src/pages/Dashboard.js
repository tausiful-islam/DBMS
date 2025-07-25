import React from 'react';
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
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  CubeIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
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
  ArcElement
);

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: analyticsService.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">
            Error loading dashboard data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const { summary, productDistribution, recentEntries, monthlyTrends } = dashboardData || {};

  // Summary stats
  const stats = [
    {
      name: 'Total Entries',
      value: summary?.totalEntries || 0,
      icon: ChartBarIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Market Value',
      value: `$${(summary?.totalMarketValue || 0).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Avg Selling Price',
      value: `$${(summary?.avgSellingPrice || 0).toFixed(2)}`,
      icon: ArrowTrendingUpIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Product Types',
      value: summary?.productTypes || 0,
      icon: CubeIcon,
      color: 'bg-purple-500',
    },
  ];

  // Chart configurations
  const chartOptions = {
    responsive: true,
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

  // Monthly trends chart data
  const monthlyTrendsData = {
    labels: monthlyTrends?.map(trend => 
      `${trend._id.year}-${String(trend._id.month).padStart(2, '0')}`
    ) || [],
    datasets: [
      {
        label: 'Total Quantity (kg)',
        data: monthlyTrends?.map(trend => trend.totalQuantity) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Average Price ($)',
        data: monthlyTrends?.map(trend => trend.avgPrice) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
        yAxisID: 'y1',
      },
    ],
  };

  const monthlyTrendsOptions = {
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
  };

  // Product distribution chart data
  const productDistributionData = {
    labels: productDistribution?.map(product => product._id) || [],
    datasets: [
      {
        label: 'Total Quantity (kg)',
        data: productDistribution?.map(product => product.totalQuantity) || [],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(14, 165, 233, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Doughnut chart for product distribution
  const doughnutData = {
    labels: productDistribution?.map(product => product._id) || [],
    datasets: [
      {
        data: productDistribution?.map(product => product.totalQuantity) || [],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(14, 165, 233, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Overview of your meat market data and analytics
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="stat-card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Trends
          </h3>
          <div className="h-80">
            <Line data={monthlyTrendsData} options={monthlyTrendsOptions} />
          </div>
        </div>

        {/* Product Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Product Distribution by Quantity
          </h3>
          <div className="h-80">
            <Bar data={productDistributionData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Share */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Product Share
          </h3>
          <div className="h-64">
            <Doughnut 
              data={doughnutData} 
              options={{
                ...chartOptions,
                scales: undefined,
                maintainAspectRatio: false,
              }} 
            />
          </div>
        </div>

        {/* Recent Entries */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Entries
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="table-header">Product</th>
                  <th className="table-header">Quantity</th>
                  <th className="table-header">Price</th>
                  <th className="table-header">Area</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentEntries?.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="table-cell font-medium">
                      {entry.productName}
                    </td>
                    <td className="table-cell">
                      {entry.quantity.toLocaleString()} {entry.unit}
                    </td>
                    <td className="table-cell">
                      ${entry.pricePerUnit.toFixed(2)}
                    </td>
                    <td className="table-cell">
                      {entry.area}
                    </td>
                    <td className="table-cell">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!recentEntries || recentEntries.length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No recent entries found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
