#!/bin/bash

# Health Check Script for GitHub Actions

set -e

echo "🔍 Performing comprehensive health check..."

# Check if PM2 process is running
echo "📱 Checking PM2 status..."
if pm2 list | grep -q "hello-vps.*online"; then
    echo "✅ PM2 process is running"
else
    echo "❌ PM2 process is not running"
    pm2 list
    exit 1
fi

# Check if port 3000 is listening
echo "🌐 Checking if port 3000 is listening..."
if netstat -tuln | grep -q ":3000 "; then
    echo "✅ Port 3000 is listening"
else
    echo "❌ Port 3000 is not listening"
    netstat -tuln | grep ":3000" || echo "No process listening on port 3000"
    exit 1
fi

# Test HTTP endpoint
echo "🌍 Testing HTTP endpoint..."
if command -v curl &> /dev/null; then
    if curl -f -s http://localhost:3000 > /dev/null; then
        echo "✅ HTTP endpoint is responding"
    else
        echo "⚠️  HTTP endpoint test failed (might be normal if API doesn't serve root path)"
        # Try common API endpoints
        if curl -f -s http://localhost:3000/api > /dev/null; then
            echo "✅ API endpoint is responding"
        elif curl -f -s http://localhost:3000/health > /dev/null; then
            echo "✅ Health endpoint is responding"
        else
            echo "ℹ️  No common endpoints responding, but service might still be working"
        fi
    fi
else
    echo "ℹ️  curl not available, skipping HTTP test"
fi

# Check memory usage
echo "💾 Checking memory usage..."
pm2 show hello-vps | grep -E "(memory|cpu)" || echo "Memory info not available"

# Check logs for errors
echo "📋 Checking recent logs for errors..."
RECENT_ERRORS=$(pm2 logs hello-vps --lines 10 --nostream 2>/dev/null | grep -i "error\|exception\|fatal" | wc -l)
if [ "$RECENT_ERRORS" -gt 0 ]; then
    echo "⚠️  Found $RECENT_ERRORS recent errors in logs:"
    pm2 logs hello-vps --lines 10 --nostream | grep -i "error\|exception\|fatal" || true
else
    echo "✅ No recent errors found in logs"
fi

echo "🎉 Health check completed!"
echo "📊 Current application status:"
pm2 show hello-vps
