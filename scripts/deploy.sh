#!/bin/bash

# GitHub Actions Deploy Script
# This script is called by GitHub Actions workflow

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are we in the right directory?"
    exit 1
fi

# Backup current version (optional)
if [ -d "dist" ]; then
    echo "📦 Backing up current build..."
    cp -r dist dist.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm ci --only=production

# Build application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ] || [ ! -f "dist/main.js" ]; then
    echo "❌ Build failed! dist/main.js not found."
    exit 1
fi

# Restart PM2 application
echo "🔄 Restarting application with PM2..."

# Check if app exists, if not create it
if pm2 describe hello-vps > /dev/null 2>&1; then
    echo "📱 Restarting existing PM2 application..."
    pm2 restart hello-vps
else
    echo "📱 Starting new PM2 application..."
    pm2 start dist/main.js --name hello-vps
fi

# Wait a bit for the app to start
sleep 3

# Health check
echo "🔍 Performing health check..."
if pm2 list | grep -q "hello-vps.*online"; then
    echo "✅ Application is running successfully!"
    
    # Show app info
    pm2 show hello-vps
    
    # Test endpoint (if applicable)
    if command -v curl &> /dev/null; then
        echo "🌐 Testing endpoint..."
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            echo "✅ Endpoint responding correctly!"
        else
            echo "⚠️  Warning: Endpoint not responding (might be normal if not serving root path)"
        fi
    fi
    
else
    echo "❌ Application failed to start!"
    echo "📋 PM2 Status:"
    pm2 list
    echo "📋 Application Logs:"
    pm2 logs hello-vps --lines 20
    exit 1
fi

# Save PM2 configuration
pm2 save

echo "🎉 Deployment completed successfully!"
echo "📊 Application Status:"
pm2 monit hello-vps
