# Meat Market Data Platform

A comprehensive full-stack application for managing and analyzing meat market data with advanced analytics, CRUD operations, and beautiful visualizations.

## 🌟 Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### 📊 Data Management
- Full CRUD operations for meat market data
- Advanced filtering and search capabilities
- CSV import/export functionality
- Data validation and error handling
- Pagination and sorting

### 📈 Analytics & Visualization
- Interactive dashboard with key metrics
- Price trend analysis over time
- Supply vs demand analysis
- Regional market analysis
- Seasonal trend patterns
- Market insights and volatility analysis
- Multiple chart types (Line, Bar, Doughnut)

### 🎨 Modern UI/UX
- Beautiful, responsive design with Tailwind CSS
- Dark/Light theme toggle
- Mobile-friendly interface
- Smooth animations and transitions
- Modern component library

### 🚀 Advanced Features
- Real-time data updates
- Export data to CSV/Excel
- Bulk data upload via CSV
- Advanced filtering system
- Comprehensive error handling
- Loading states and feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Chart.js** - Data visualization
- **Headless UI** - Accessible UI components
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CSV Parser** - CSV file processing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DataBase_Project
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/meatmarket
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
CLIENT_URL=http://localhost:3000
```

### 4. Database Setup

Make sure MongoDB is running on your machine or update the `MONGODB_URI` to point to your MongoDB instance.

### 5. Start the Application

```bash
# From the root directory, start both client and server
npm run dev

# Or start them separately:
# Terminal 1 - Start server
npm run server

# Terminal 2 - Start client
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Usage

### Demo Accounts
For testing purposes, you can create accounts or use these demo credentials:

**Admin Account:**
- Email: admin@demo.com
- Password: admin123

**Regular User:**
- Email: user@demo.com  
- Password: user123

### Key Features Usage

#### 1. Dashboard
- View summary statistics
- Analyze monthly trends
- See product distribution
- Check recent entries

#### 2. Data Table
- Add new meat market entries
- Edit existing data
- Delete entries (with permissions)
- Filter and search data
- Export data to CSV
- Import data from CSV

#### 3. Historic Analysis
- Filter by product, area, and date range
- View price trends over time
- Analyze supply vs demand
- Regional market analysis
- Seasonal trend patterns
- Market insights and growth analysis

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Data Management
- `GET /api/data` - Get data with pagination/filtering
- `POST /api/data` - Create new data entry
- `GET /api/data/:id` - Get single data entry
- `PUT /api/data/:id` - Update data entry
- `DELETE /api/data/:id` - Delete data entry
- `POST /api/data/upload-csv` - Upload CSV file
- `GET /api/data/export/csv` - Export data to CSV

### Analytics
- `GET /api/analytics/dashboard` - Dashboard summary
- `GET /api/analytics/price-trends` - Price trend analysis
- `GET /api/analytics/supply-demand` - Supply vs demand data
- `GET /api/analytics/regional-analysis` - Regional analysis
- `GET /api/analytics/seasonal-trends` - Seasonal patterns
- `GET /api/analytics/market-insights` - Market insights

## 🎯 Data Model

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  isActive: Boolean,
  timestamps: true
}
```

### Meat Data Schema
```javascript
{
  productName: String (Beef, Chicken, Pork, Lamb, Fish, Turkey, Other),
  quantity: Number,
  unit: String (kg, lbs, tons),
  suppliedTo: String,
  date: Date,
  area: String,
  pricePerUnit: Number,
  currency: String (USD, EUR, GBP, INR),
  category: String (production, supply, demand),
  quality: String (Premium, Standard, Economy),
  supplier: String,
  notes: String,
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `build` folder to your hosting service
3. Set environment variables for API URL

### Backend (Heroku/Railway/DigitalOcean)
1. Deploy the `server` directory
2. Set environment variables
3. Ensure MongoDB connection

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=your_frontend_url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Chart.js for beautiful data visualizations
- Tailwind CSS for the utility-first styling approach
- MongoDB for flexible data storage
- React ecosystem for modern frontend development

## 📞 Support

For support, email support@meatmarket.com or create an issue in the repository.

---

**Built with ❤️ for comprehensive meat market data analysis**
