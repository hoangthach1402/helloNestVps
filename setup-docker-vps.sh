#!/bin/bash

# Script setup Docker cho VPS Ubuntu/Debian
echo "🚀 Bắt đầu cài đặt Docker cho VPS..."

# Update system
echo "📦 Cập nhật hệ thống..."
apt update && apt upgrade -y

# Cài đặt các package cần thiết
echo "📦 Cài đặt các package cần thiết..."
apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    nginx

# Thêm Docker GPG key
echo "🔑 Thêm Docker GPG key..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Thêm Docker repository
echo "📂 Thêm Docker repository..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Cập nhật package list
apt update

# Cài đặt Docker
echo "🐳 Cài đặt Docker..."
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Cài đặt Docker Compose standalone
echo "🔧 Cài đặt Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Khởi động Docker service
echo "▶️ Khởi động Docker service..."
systemctl start docker
systemctl enable docker

# Thêm user vào docker group (nếu không phải root)
# usermod -aG docker $USER

# Kiểm tra cài đặt
echo "✅ Kiểm tra cài đặt Docker..."
docker --version
docker-compose --version

# Tạo thư mục cho project
echo "📁 Tạo thư mục project..."
mkdir -p /var/www/hello-vps
cd /var/www/hello-vps

echo "🎉 Cài đặt Docker hoàn thành!"
echo "📝 Tiếp theo:"
echo "1. Clone repository: git clone https://github.com/hoangthach1402/helloNestVps.git ."
echo "2. Chạy: docker-compose up -d"
