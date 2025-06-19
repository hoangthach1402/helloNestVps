#!/bin/bash

# VPS Setup Script for GitHub Actions
# Run this script on your VPS to prepare for GitHub Actions deployment

echo "🚀 Setting up VPS for GitHub Actions deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally (if not already installed)
if ! command -v pm2 &> /dev/null; then
    echo "📱 Installing PM2..."
    sudo npm install -g pm2
fi

# Create project directory
echo "📁 Setting up project directory..."
sudo mkdir -p /var/www
cd /var/www

# Clone repository (if not exists)
if [ ! -d "hello-vps" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/hoangthach1402/helloNestVps.git hello-vps
else
    echo "📁 Repository already exists, pulling latest changes..."
    cd hello-vps
    git pull origin main
    cd ..
fi

# Set proper permissions
echo "🔐 Setting permissions..."
sudo chown -R $USER:$USER /var/www/hello-vps
cd hello-vps

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x scripts/*.sh

# Start application with PM2 (if not running)
echo "🚀 Starting application..."
if ! pm2 describe hello-vps > /dev/null 2>&1; then
    pm2 start dist/main.js --name hello-vps
else
    pm2 restart hello-vps
fi

# Save PM2 configuration
pm2 save

# Setup PM2 startup (so app starts on server reboot)
pm2 startup
echo "⚠️  Please run the command shown above to enable PM2 startup"

echo "✅ VPS setup completed!"
echo "📊 Current status:"
pm2 list
echo ""
echo "🎯 Next steps:"
echo "1. Add GitHub Secrets (VPS_HOST, VPS_USERNAME, VPS_PASSWORD, VPS_PORT)"
echo "2. Push code to trigger first GitHub Actions deployment"
echo "3. Monitor deployment in GitHub Actions tab"
