#!/bin/bash

# Script deploy ứng dụng lên VPS
echo "🚀 Bắt đầu deploy ứng dụng..."

# Cập nhật code từ GitHub
echo "📥 Cập nhật code từ GitHub..."
git pull origin main

# Dừng containers hiện tại
echo "⏹️ Dừng containers hiện tại..."
docker-compose down

# Xóa images cũ để build lại
echo "🗑️ Xóa images cũ..."
docker-compose down --rmi all

# Build và khởi động lại
echo "🔨 Build và khởi động containers..."
docker-compose up -d --build

# Xem logs
echo "📋 Kiểm tra logs..."
docker-compose logs -f app

echo "✅ Deploy hoàn thành!"
echo "🌐 Ứng dụng đang chạy tại: http://207.180.251.81:3000"
