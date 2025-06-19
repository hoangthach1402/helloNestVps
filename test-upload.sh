#!/bin/bash

# Test Upload Script for Hello VPS
echo "🧪 Testing Cloudinary Upload API..."

BASE_URL="http://207.180.251.81:3000"
# For local testing, use: BASE_URL="http://localhost:3000"

echo "📋 Available endpoints:"
echo "  POST $BASE_URL/upload/image"
echo "  POST $BASE_URL/upload/images"
echo ""

# Test health check first
echo "🔍 Testing health check..."
if curl -f -s "$BASE_URL" > /dev/null; then
    echo "✅ App is running!"
else
    echo "❌ App is not responding. Please check if Docker containers are running."
    echo "Run: docker compose ps"
    exit 1
fi

echo ""
echo "📝 To test upload manually:"
echo ""
echo "Single image upload:"
echo "curl -X POST \\"
echo "  $BASE_URL/upload/image \\"
echo "  -F \"file=@your-image.jpg\""
echo ""
echo "Multiple images upload:"
echo "curl -X POST \\"
echo "  $BASE_URL/upload/images \\"
echo "  -F \"files=@image1.jpg\" \\"
echo "  -F \"files=@image2.png\""
echo ""

# Create a simple test image if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "🎨 Creating test image..."
    convert -size 100x100 xc:blue test-image.png
    
    echo "📤 Testing single image upload..."
    RESPONSE=$(curl -s -X POST \
        "$BASE_URL/upload/image" \
        -F "file=@test-image.png")
    
    if [[ $RESPONSE == *"uploaded successfully"* ]]; then
        echo "✅ Single image upload test passed!"
        echo "Response: $RESPONSE"
    else
        echo "❌ Single image upload test failed!"
        echo "Response: $RESPONSE"
    fi
    
    # Clean up
    rm -f test-image.png
else
    echo "ℹ️  ImageMagick not found. Skipping automatic test."
    echo "Please test manually with your own image files."
fi

echo ""
echo "🎉 Upload service is ready!"
echo "📚 Check the Cloudinary dashboard at: https://cloudinary.com/console"
