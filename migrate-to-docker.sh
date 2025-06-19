#!/bin/bash

# Script chuyển từ PM2 sang Docker
echo "🔄 Chuyển đổi từ PM2 sang Docker..."

# Kiểm tra và dừng PM2 nếu đang chạy
echo "⏹️ Dừng PM2 processes..."
pm2 stop all
pm2 delete all

# Kiểm tra port đang sử dụng
echo "🔍 Kiểm tra port 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Port 3000 đang được sử dụng, dừng process..."
    sudo fuser -k 3000/tcp
fi

# Kiểm tra Docker đã được cài đặt chưa
if ! command -v docker &> /dev/null; then
    echo "🐳 Docker chưa được cài đặt. Đang cài đặt..."
    ./setup-docker-vps.sh
else
    echo "✅ Docker đã được cài đặt"
fi

# Kiểm tra Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "🔧 Cài đặt Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Dừng containers cũ nếu có
echo "🛑 Dừng containers cũ..."
docker-compose down 2>/dev/null || true

# Build và khởi động Docker
echo "🚀 Khởi động Docker containers..."
docker-compose up -d --build

# Kiểm tra trạng thái
echo "📊 Kiểm tra trạng thái containers..."
docker-compose ps

echo "✅ Chuyển đổi hoàn thành!"
echo "🌐 Ứng dụng đang chạy tại: http://$(curl -s ifconfig.me):80"
