#!/bin/bash
# test-cors.sh - Script để test CORS

echo "🧪 Testing CORS configuration..."
echo ""

# Test CORS via Nginx HTTP (should redirect to HTTPS)
echo "1. Testing HTTP CORS preflight (port 8081):"
curl -i -X OPTIONS \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  http://localhost:8081/hellovps/api/auth/profile

echo ""
echo "2. Testing HTTPS CORS preflight (port 8444):"
curl -i -X OPTIONS \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -k https://localhost:8444/hellovps/api/auth/profile

echo ""
echo "3. Testing HTTPS GET request with CORS headers:"
curl -i -X GET \
  -H "Origin: http://localhost:3001" \
  -H "Content-Type: application/json" \
  -k https://localhost:8444/hellovps/api/users

echo ""
echo "✅ CORS test completed!"
