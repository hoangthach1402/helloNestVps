#!/bin/bash

# Quick deployment status check
echo "🔍 Checking deployment status..."

# Check if GitHub Actions is working
echo "📊 Latest commits:"
git log --oneline -3

echo ""
echo "🐳 Docker containers:"
ssh root@207.180.251.81 "cd /var/www/hello-vps && docker compose ps"

echo ""
echo "🌐 Application test:"
if curl -f -s http://207.180.251.81:3000 > /dev/null; then
    echo "✅ Application is responding!"
    curl -s http://207.180.251.81:3000
else
    echo "❌ Application is not responding!"
fi

echo ""
echo "📈 Deployment verification complete!"
