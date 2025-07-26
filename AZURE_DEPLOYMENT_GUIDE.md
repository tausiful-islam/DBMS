# 🚀 Azure Production Deployment Guide

*Complete guide to deploy your Meat Market Platform to Microsoft Azure*

---

## 🎯 Deployment Overview

You'll deploy your application using these Azure services:
- **Frontend**: Azure Static Web Apps (React)
- **Backend**: Azure App Service (Node.js)
- **Database**: Azure Cosmos DB (MongoDB API)
- **Storage**: Azure Blob Storage (backups/files)
- **Domain**: Azure DNS (optional custom domain)

**Estimated Monthly Cost**: $20-50 USD for small-medium usage

---

## 📋 Prerequisites

### **Before You Start**
1. **Azure Account**: Sign up at [portal.azure.com](https://portal.azure.com)
2. **Azure CLI**: Install on your computer
3. **Git Repository**: Your code should be on GitHub (✅ Already done!)
4. **Node.js**: Version 16+ installed locally

### **Install Azure CLI**
```bash
# Ubuntu/Debian
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Set subscription (if you have multiple)
az account list --output table
az account set --subscription "Your-Subscription-ID"
```

---

## 🗄️ Step 1: Setup Azure Cosmos DB (Database)

### **Create Cosmos DB Account**
```bash
# Create resource group
az group create --name MeatMarketRG --location "East US"

# Create Cosmos DB with MongoDB API
az cosmosdb create \
  --resource-group MeatMarketRG \
  --name meatmarket-cosmos-db \
  --kind MongoDB \
  --server-version "4.2" \
  --default-consistency-level Eventual \
  --locations regionName="East US" failoverPriority=0 isZoneRedundant=False
```

### **Create Database and Collection**
```bash
# Create database
az cosmosdb mongodb database create \
  --account-name meatmarket-cosmos-db \
  --resource-group MeatMarketRG \
  --name meatmarket

# Create collection for meat data
az cosmosdb mongodb collection create \
  --account-name meatmarket-cosmos-db \
  --resource-group MeatMarketRG \
  --database-name meatmarket \
  --name meatdatas \
  --throughput 400

# Create collection for users
az cosmosdb mongodb collection create \
  --account-name meatmarket-cosmos-db \
  --resource-group MeatMarketRG \
  --database-name meatmarket \
  --name users \
  --throughput 400
```

### **Get Connection String**
```bash
# Get MongoDB connection string
az cosmosdb keys list \
  --name meatmarket-cosmos-db \
  --resource-group MeatMarketRG \
  --type connection-strings
```

**Save this connection string - you'll need it for your backend!**

---

## 🖥️ Step 2: Deploy Backend to Azure App Service

### **Prepare Your Backend Code**

1. **Update Environment Variables** in `server/.env`:
```env
# Azure Production Environment
NODE_ENV=production
PORT=8000
JWT_SECRET=your-super-secure-jwt-secret-key-change-this

# Azure Cosmos DB Connection (replace with your actual connection string)
MONGODB_URI=mongodb://meatmarket-cosmos-db:KEY@meatmarket-cosmos-db.mongo.cosmos.azure.com:10255/meatmarket?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@meatmarket-cosmos-db@

# CORS Origins (will update after frontend deployment)
CORS_ORIGIN=https://your-frontend-url.azurestaticapps.net
```

2. **Update server/package.json** for Azure:
```json
{
  "name": "meatmarket-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

3. **Create deployment configuration** `server/web.config`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="index.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="DynamicContent">
          <match url="/*" />
          <action type="Rewrite" url="index.js"/>
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### **Deploy Backend**
```bash
# Navigate to server directory
cd server

# Create App Service Plan
az appservice plan create \
  --name MeatMarketPlan \
  --resource-group MeatMarketRG \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group MeatMarketRG \
  --plan MeatMarketPlan \
  --name meatmarket-api \
  --runtime "NODE|18-lts" \
  --deployment-local-git

# Configure environment variables
az webapp config appsettings set \
  --resource-group MeatMarketRG \
  --name meatmarket-api \
  --settings \
    NODE_ENV=production \
    JWT_SECRET="your-super-secure-jwt-secret" \
    MONGODB_URI="your-cosmos-db-connection-string"

# Deploy code
git remote add azure https://meatmarket-api.scm.azurewebsites.net:443/meatmarket-api.git
git push azure main

# Or deploy from GitHub (recommended)
az webapp deployment source config \
  --resource-group MeatMarketRG \
  --name meatmarket-api \
  --repo-url https://github.com/tausiful-islam/DBMS.git \
  --branch main \
  --manual-integration
```

**Your backend will be available at**: `https://meatmarket-api.azurewebsites.net`

---

## 🌐 Step 3: Deploy Frontend to Azure Static Web Apps

### **Prepare Frontend Code**

1. **Update API endpoints** in `client/src/services/api.js`:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://meatmarket-api.azurewebsites.net/api'
  : 'http://localhost:5000/api';

export default API_BASE_URL;
```

2. **Build configuration** - create `client/staticwebapp.config.json`:
```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*.{png,jpg,gif}", "/css/*"]
  },
  "mimeTypes": {
    ".json": "text/json"
  }
}
```

### **Deploy Frontend**
```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# From project root, create Static Web App
az staticwebapp create \
  --name meatmarket-frontend \
  --resource-group MeatMarketRG \
  --source https://github.com/tausiful-islam/DBMS \
  --branch main \
  --app-location "/client" \
  --output-location "build" \
  --login-with-github
```

**Your frontend will be available at**: `https://meatmarket-frontend.azurestaticapps.net`

---

## 📊 Step 4: Migrate Your Data

### **Export Local Data**
```bash
# From your local machine
mongoexport --db meatmarket --collection meatdatas --out meatdatas.json
mongoexport --db meatmarket --collection users --out users.json
```

### **Import to Azure Cosmos DB**
```bash
# Install MongoDB tools if not installed
sudo apt-get install mongodb-database-tools

# Import to Cosmos DB (replace connection string)
mongoimport --uri "your-cosmos-db-connection-string" \
  --collection meatdatas \
  --file meatdatas.json

mongoimport --uri "your-cosmos-db-connection-string" \
  --collection users \
  --file users.json
```

### **Alternative: Use Azure Data Migration Tool**
1. Download [Azure Cosmos DB Data Migration Tool](https://docs.microsoft.com/en-us/azure/cosmos-db/import-data)
2. Source: MongoDB (your local database)
3. Target: Azure Cosmos DB (MongoDB API)
4. Follow wizard to migrate data

---

## 🔧 Step 5: Configure Production Settings

### **Update CORS in Backend**
Update your backend's CORS configuration in `server/index.js`:
```javascript
app.use(cors({
  origin: [
    'https://meatmarket-frontend.azurestaticapps.net',
    'http://localhost:3000' // Keep for local development
  ],
  credentials: true
}));
```

### **SSL/HTTPS Configuration**
Azure automatically provides SSL certificates. Your apps will be accessible via:
- Backend: `https://meatmarket-api.azurewebsites.net`
- Frontend: `https://meatmarket-frontend.azurestaticapps.net`

### **Environment Variables in Azure**
Set all environment variables in Azure App Service:
```bash
az webapp config appsettings set \
  --resource-group MeatMarketRG \
  --name meatmarket-api \
  --settings \
    NODE_ENV=production \
    JWT_SECRET="your-jwt-secret" \
    MONGODB_URI="your-cosmos-connection-string" \
    CORS_ORIGIN="https://meatmarket-frontend.azurestaticapps.net"
```

---

## 💾 Step 6: Setup Automated Backups

### **Create Storage Account for Backups**
```bash
# Create storage account
az storage account create \
  --name meatmarketbackups \
  --resource-group MeatMarketRG \
  --location "East US" \
  --sku Standard_LRS

# Create container for backups
az storage container create \
  --account-name meatmarketbackups \
  --name database-backups \
  --auth-mode login
```

### **Automated Backup Script** (create `backup-script.js`):
```javascript
const { exec } = require('child_process');
const { BlobServiceClient } = require('@azure/storage-blob');

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const mongoUri = process.env.MONGODB_URI;
const containerName = 'database-backups';

async function backupDatabase() {
  const timestamp = new Date().toISOString().split('T')[0];
  const backupFile = `backup-${timestamp}.json`;
  
  // Export database
  exec(`mongoexport --uri "${mongoUri}" --collection meatdatas --out ${backupFile}`, 
    async (error, stdout, stderr) => {
      if (error) {
        console.error('Backup failed:', error);
        return;
      }
      
      // Upload to Azure Blob Storage
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(backupFile);
      
      await blockBlobClient.uploadFile(backupFile);
      console.log(`Backup uploaded: ${backupFile}`);
    });
}

backupDatabase();
```

---

## 🔍 Step 7: Monitoring & Logging

### **Enable Application Insights**
```bash
# Create Application Insights
az monitor app-insights component create \
  --app meatmarket-insights \
  --location "East US" \
  --resource-group MeatMarketRG

# Connect to App Service
az webapp config appsettings set \
  --resource-group MeatMarketRG \
  --name meatmarket-api \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="your-insights-key"
```

### **Setup Alerts**
```bash
# CPU usage alert
az monitor metrics alert create \
  --name "High CPU Usage" \
  --resource-group MeatMarketRG \
  --scopes "/subscriptions/YOUR-SUBSCRIPTION/resourceGroups/MeatMarketRG/providers/Microsoft.Web/sites/meatmarket-api" \
  --condition "avg Percentage CPU > 80" \
  --description "Alert when CPU usage is above 80%"
```

---

## 🌍 Step 8: Custom Domain (Optional)

### **Purchase Domain in Azure**
```bash
# Purchase domain (optional)
az appservice domain create \
  --resource-group MeatMarketRG \
  --hostname yourdomain.com

# Configure custom domain for Static Web App
az staticwebapp hostname set \
  --name meatmarket-frontend \
  --resource-group MeatMarketRG \
  --hostname yourdomain.com
```

---

## 🚀 Step 9: CI/CD Pipeline Setup

### **GitHub Actions for Auto-Deployment**

Azure Static Web Apps automatically creates GitHub Actions. For the backend, create `.github/workflows/azure-backend.yml`:

```yaml
name: Deploy Backend to Azure

on:
  push:
    branches: [ main ]
    paths: [ 'server/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd server
        npm ci
        
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'meatmarket-api'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ./server
```

---

## 📊 Step 10: Performance Optimization

### **Database Indexing**
Connect to your Cosmos DB and create indexes:
```javascript
// Connect via MongoDB shell to Cosmos DB
mongosh "your-cosmos-db-connection-string"

// Create indexes for better performance
db.meatdatas.createIndex({category: 1})
db.meatdatas.createIndex({supplier: 1})
db.meatdatas.createIndex({date: 1})
db.meatdatas.createIndex({pricePerUnit: 1})
db.users.createIndex({email: 1}, {unique: true})
```

### **CDN Setup for Static Assets**
```bash
# Create CDN profile
az cdn profile create \
  --resource-group MeatMarketRG \
  --name MeatMarketCDN \
  --sku Standard_Microsoft

# Create CDN endpoint
az cdn endpoint create \
  --resource-group MeatMarketRG \
  --name meatmarket-cdn \
  --profile-name MeatMarketCDN \
  --origin meatmarket-frontend.azurestaticapps.net
```

---

## 💰 Cost Management

### **Resource Costs (Estimated Monthly)**
- **Azure App Service (B1)**: $13-15
- **Cosmos DB (400 RU/s)**: $24
- **Static Web Apps**: Free tier (sufficient for most use)
- **Storage Account**: $1-2
- **Application Insights**: Free tier
- **Total**: ~$40-45/month

### **Cost Optimization Tips**
- Use **Free tier** for Static Web Apps
- Start with **Basic (B1)** App Service plan
- Use **Serverless** Cosmos DB for variable workloads
- Enable **auto-scaling** only when needed
- Set up **budget alerts** in Azure portal

---

## 🔒 Security Checklist

### **Production Security**
- ✅ **HTTPS only** (enforced by Azure)
- ✅ **Environment variables** secured in Azure
- ✅ **JWT secrets** rotated and complex
- ✅ **Database connection** encrypted
- ✅ **CORS** properly configured
- ✅ **API rate limiting** implemented
- ✅ **Input validation** on all endpoints

### **Additional Security Measures**
```bash
# Enable HTTPS only
az webapp update \
  --resource-group MeatMarketRG \
  --name meatmarket-api \
  --https-only true

# Configure minimum TLS version
az webapp config set \
  --resource-group MeatMarketRG \
  --name meatmarket-api \
  --min-tls-version "1.2"
```

---

## 🎯 Go-Live Checklist

### **Before Launch**
- [ ] All environment variables configured
- [ ] Database migrated and tested
- [ ] Frontend and backend communicating properly
- [ ] SSL certificates active
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring and alerts setup
- [ ] Backup system tested
- [ ] Performance tested with sample data

### **Launch Day**
- [ ] Update DNS records (if using custom domain)
- [ ] Test all user flows (login, data entry, export)
- [ ] Monitor application logs
- [ ] Check database performance
- [ ] Verify backup systems
- [ ] Test from different devices/browsers

### **Post-Launch**
- [ ] Monitor costs daily for first week
- [ ] Check error logs regularly
- [ ] Scale resources based on usage
- [ ] Setup regular health checks
- [ ] Plan for future updates via CI/CD

---

## 🚨 Troubleshooting Common Issues

### **Backend Not Starting**
```bash
# Check application logs
az webapp log tail --resource-group MeatMarketRG --name meatmarket-api

# Common fixes:
# 1. Verify environment variables
# 2. Check package.json start script
# 3. Ensure Node.js version compatibility
```

### **Database Connection Issues**
```bash
# Test connection string locally first
mongosh "your-connection-string"

# Common issues:
# 1. Incorrect connection string format
# 2. Firewall rules blocking connection
# 3. Missing SSL parameters
```

### **Frontend Not Loading**
```bash
# Check Static Web App logs in Azure portal
# Common issues:
# 1. Build configuration errors
# 2. API endpoint URLs incorrect
# 3. CORS configuration problems
```

---

## 📞 Support & Resources

### **Azure Documentation**
- [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/)

### **Pricing Calculators**
- [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)
- [Cosmos DB Pricing](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/)

### **Monitoring Tools**
- Azure Portal Dashboard
- Application Insights
- Azure Monitor
- Cost Management + Billing

---

## 🎉 Congratulations!

Once completed, your Meat Market Platform will be:
- ✅ **Globally accessible** via Azure's CDN
- ✅ **Highly scalable** with auto-scaling capabilities
- ✅ **Secure** with Azure's enterprise-grade security
- ✅ **Monitored** with built-in logging and alerts
- ✅ **Cost-effective** with pay-as-you-use pricing
- ✅ **Production-ready** with automated backups and CI/CD

**Your production URLs:**
- **Frontend**: `https://meatmarket-frontend.azurestaticapps.net`
- **Backend API**: `https://meatmarket-api.azurewebsites.net`
- **Admin Panel**: Same as frontend with admin login

---

*Follow this guide step-by-step, and you'll have a professional, scalable meat market platform running on Azure! 🚀*

*Last updated: July 26, 2025*
