#!/bin/bash

# SSH Connection Test Script for VPS
echo "🔑 Testing SSH connection to VPS..."

VPS_HOST="207.180.251.81"
VPS_USER="root"

echo "Testing SSH connection to $VPS_USER@$VPS_HOST..."

# Test SSH connection
if ssh -o ConnectTimeout=10 -o BatchMode=yes $VPS_USER@$VPS_HOST 'echo "✅ SSH connection successful!"'; then
    echo "✅ SSH key authentication is working!"
    
    # Test if project directory exists
    echo "🔍 Checking project directory..."
    if ssh $VPS_USER@$VPS_HOST 'test -d /var/www/hello-vps'; then
        echo "✅ Project directory exists at /var/www/hello-vps"
    else
        echo "❌ Project directory not found at /var/www/hello-vps"
        echo "Creating project directory..."
        ssh $VPS_USER@$VPS_HOST 'mkdir -p /var/www/hello-vps'
    fi
    
    # Test Docker
    echo "🐳 Testing Docker..."
    if ssh $VPS_USER@$VPS_HOST 'docker --version'; then
        echo "✅ Docker is available"
    else
        echo "❌ Docker not found"
    fi
    
    # Test Git
    echo "📦 Testing Git..."
    if ssh $VPS_USER@$VPS_HOST 'git --version'; then
        echo "✅ Git is available"
    else
        echo "❌ Git not found"
    fi
    
else
    echo "❌ SSH connection failed!"
    echo "Troubleshooting steps:"
    echo "1. Check if SSH key is properly set up"
    echo "2. Verify the VPS IP address: $VPS_HOST"
    echo "3. Ensure the SSH service is running on the VPS"
    echo "4. Check firewall settings"
    
    # Try to get more details
    echo ""
    echo "Attempting verbose connection..."
    ssh -v -o ConnectTimeout=10 $VPS_USER@$VPS_HOST 'exit' 2>&1 | head -20
fi
