import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  TableCellsIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { user, logout } = useAuth();

  const clearSession = () => {
    logout();
    window.location.reload(); // Force page refresh to clear any cached state
  };
  const features = [
    {
      name: 'Data Management',
      description: 'Comprehensive CRUD operations for meat market data with advanced filtering and search capabilities.',
      icon: TableCellsIcon,
    },
    {
      name: 'Analytics Dashboard',
      description: 'Visual insights with interactive charts showing trends, supply-demand analysis, and market predictions.',
      icon: ChartBarIcon,
    },
    {
      name: 'Secure Authentication',
      description: 'Role-based access control with JWT authentication ensuring data security and user management.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Regional Analysis',
      description: 'Geographic insights into meat production, consumption patterns, and regional market dynamics.',
      icon: GlobeAltIcon,
    },
    {
      name: 'Market Trends',
      description: 'Historical data analysis with seasonal trends, price volatility, and demand forecasting.',
      icon: ArrowTrendingUpIcon,
    },
    {
      name: 'User Management',
      description: 'Multi-user support with admin controls, profile management, and collaboration features.',
      icon: UsersIcon,
    },
  ];

  const stats = [
    { name: 'Data Points Tracked', value: '50K+' },
    { name: 'Market Regions', value: '25+' },
    { name: 'Product Categories', value: '7' },
    { name: 'Analytics Reports', value: '15+' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                MeatMarket Platform
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Welcome back, {user.name} ({user.role})
                  </span>
                  <Link
                    to="/dashboard"
                    className="btn-secondary"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={clearSession}
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                  >
                    New Session
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              Comprehensive{' '}
              <span className="text-primary-600">Meat Market</span>{' '}
              Data Platform
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Analyze market trends, track supply and demand, manage inventory data, 
              and gain insights into the meat industry with our powerful analytics platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="btn-primary text-lg px-8 py-3"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={clearSession}
                    className="btn-secondary text-lg px-8 py-3"
                  >
                    Start New Session
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary text-lg px-8 py-3"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary text-lg px-8 py-3"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-96 h-96 bg-primary-200 dark:bg-primary-900 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Market Analysis
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to analyze, manage, and understand meat market data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.name}
                  className="card p-8 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 dark:bg-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-100">
                  {stat.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Ready to Transform Your Market Analysis?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
            Join industry professionals who trust our platform for comprehensive meat market insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-3"
            >
              Get Started Now
            </Link>
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-lg px-8 py-3"
            >
              Already have an account? Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              MeatMarket Platform
            </span>
          </div>
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 MeatMarket Platform. All rights reserved.</p>
            <p className="mt-2">Built with modern web technologies for comprehensive market analysis.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
