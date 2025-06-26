#!/bin/bash

# Generate SSL certificate for development
echo "🔐 Generating SSL certificate for development..."

# Create ssl directory if not exists
mkdir -p ssl

# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 \
  -keyout ssl/server.key \
  -out ssl/server.crt \
  -days 365 \
  -nodes \
  -subj "//C=VN\ST=HCM\L=HCM\O=HelloVPS\OU=Development\CN=localhost"

echo "✅ SSL certificate generated successfully!"
echo "   - Certificate: ./ssl/server.crt"
echo "   - Private key: ./ssl/server.key"
echo ""
echo "💡 These are self-signed certificates for development only."
echo "   Browsers will show security warnings - this is normal."
echo ""
echo "🚀 You can now run: npm run docker:prod"
