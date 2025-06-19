#!/bin/bash

# Auto-deployment script for VPS
# Usage: ./deploy.sh

echo "🚀 Starting deployment..."

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed!"
    exit 1
fi

# Stop containers
echo "🛑 Stopping containers..."
docker compose down

# Build with latest code
echo "🔨 Building containers..."
docker compose build --no-cache

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Start containers
echo "▶️ Starting containers..."
docker compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Container start failed!"
    exit 1
fi

# Wait for containers to be ready
echo "⏳ Waiting for containers to be ready..."
sleep 10

# Check container status
echo "📊 Checking container status..."
docker compose ps

# Test API
echo "🧪 Testing API..."
curl -s http://localhost:3000/ > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ API is responding"
else
    echo "❌ API is not responding"
fi

# Check Swagger
curl -s http://localhost:3000/api > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Swagger UI is available"
else
    echo "❌ Swagger UI is not available"
fi

echo "🎉 Deployment completed!"
echo "📚 Swagger UI: http://your-vps-ip/api"
echo "🔗 API Base: http://your-vps-ip/"
