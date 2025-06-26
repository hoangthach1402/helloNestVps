#!/bin/bash

echo "🔍 HELLO VPS - PORT USAGE CHECK"
echo "=================================="
echo ""

echo "📋 Current Configuration:"
echo "   - HTTP: Port 8081 (localhost:8081)"
echo "   - HTTPS: Port 8444 (localhost:8444)"
echo "   - NestJS: Port 3002 (internal)"
echo "   - PostgreSQL: Port 5434"
echo "   - URL Path: /hellovps"
echo ""

echo "🌐 Checking port availability..."
echo ""

# Check if ports are available
echo "Port 8081 (HTTP):"
if netstat -tuln | grep -q ":8081 "; then
    echo "❌ Port 8081 is already in use"
    netstat -tuln | grep ":8081 "
else
    echo "✅ Port 8081 is available"
fi

echo ""
echo "Port 8444 (HTTPS):"
if netstat -tuln | grep -q ":8444 "; then
    echo "❌ Port 8444 is already in use"
    netstat -tuln | grep ":8444 "
else
    echo "✅ Port 8444 is available"
fi

echo ""
echo "Port 3002 (NestJS):"
if netstat -tuln | grep -q ":3002 "; then
    echo "❌ Port 3002 is already in use"
    netstat -tuln | grep ":3002 "
else
    echo "✅ Port 3002 is available"
fi

echo ""
echo "Port 5434 (PostgreSQL):"
if netstat -tuln | grep -q ":5434 "; then
    echo "❌ Port 5434 is already in use"
    netstat -tuln | grep ":5434 "
else
    echo "✅ Port 5434 is available"
fi

echo ""
echo "🐳 Docker containers status:"
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}" | grep -E "(hello|vps|NAMES)"

echo ""
echo "🔗 Test URLs after deployment:"
echo "   - HTTP: http://localhost:8081/hellovps"
echo "   - HTTPS: https://localhost:8444/hellovps"
echo "   - API Docs: https://localhost:8444/hellovps/api"
echo "   - Health: https://localhost:8444/hellovps/health"
echo ""
echo "💡 To deploy: npm run docker:prod"
