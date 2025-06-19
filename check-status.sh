#!/bin/bash

# Script kiểm tra và khởi động lại ứng dụng
echo "🔍 Kiểm tra trạng thái ứng dụng..."

# Kiểm tra Docker containers
echo "📦 Trạng thái Docker containers:"
docker-compose ps

# Kiểm tra ứng dụng có hoạt động không
echo "🌐 Kiểm tra ứng dụng..."
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    echo "✅ Ứng dụng đang hoạt động bình thường"
else
    echo "❌ Ứng dụng không phản hồi, đang khởi động lại..."
    
    # Khởi động lại containers
    docker-compose restart
    
    # Đợi 10 giây và kiểm tra lại
    sleep 10
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        echo "✅ Ứng dụng đã khởi động lại thành công"
    else
        echo "❌ Ứng dụng vẫn không hoạt động, xem logs:"
        docker-compose logs --tail=50 app
    fi
fi

# Hiển thị logs gần nhất
echo "📋 Logs gần nhất:"
docker-compose logs --tail=20 app

echo "🌐 URL ứng dụng: http://$(curl -s ifconfig.me)"
