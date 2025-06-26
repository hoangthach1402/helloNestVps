#!/bin/bash

# Test HTTPS setup for NestJS VPS
echo "🔍 Testing HTTPS Setup..."

# Check if SSL certificates exist
echo "📋 Checking SSL certificates..."
if [ -f "./ssl/server.crt" ] && [ -f "./ssl/server.key" ]; then
    echo "✅ SSL certificates found"
    echo "   - Certificate: ./ssl/server.crt"
    echo "   - Private key: ./ssl/server.key"
else
    echo "❌ SSL certificates not found!"
    echo "Run: npm run ssl:generate"
    exit 1
fi

# Check certificate details
echo "📄 Certificate details:"
openssl x509 -in ./ssl/server.crt -noout -subject -dates

# Test HTTP redirect (if running)
echo ""
echo "🌐 Testing HTTP redirect to HTTPS..."
curl -I -s -k http://localhost:8081/hellovps || echo "⚠️  Service not running"

# Test HTTPS endpoint (if running)
echo ""
echo "🔒 Testing HTTPS API endpoint..."
curl -I -s -k https://localhost:8444/hellovps/api || echo "⚠️  Service not running"

# Test specific API endpoints
echo ""
echo "🧪 Testing API endpoints..."
echo "1. Health check:"
curl -s -k https://localhost:8444/hellovps/api || echo "⚠️  API not responding"

echo ""
echo "2. Auth endpoint:"
curl -I -s -k https://localhost:8444/hellovps/api/auth/profile || echo "⚠️  Auth endpoint not responding"

echo ""
echo "3. CORS preflight:"
curl -I -s -k -X OPTIONS \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  https://localhost:8444/hellovps/api || echo "⚠️  CORS preflight failed"

echo ""
echo "🎯 If services are running, you should see:"
echo "   - HTTP 301 redirect to HTTPS"
echo "   - HTTPS 200/404 responses"
echo "   - CORS headers in responses"
echo ""
echo "💡 To start services: npm run docker:prod"
echo "🌐 Access URLs:"
echo "   - HTTP: http://localhost:8081/hellovps"
echo "   - HTTPS: https://localhost:8444/hellovps"
echo "   - API Docs: https://localhost:8444/hellovps/api"
