# 📤 Upload API Documentation

## Overview
Upload service sử dụng Cloudinary để lưu trữ và tối ưu hóa hình ảnh trên cloud.

## Base URL
- **Production**: `http://207.180.251.81:3000`
- **Local**: `http://localhost:3000`

## Endpoints

### 1. Upload Single Image
**POST** `/upload/image`

#### Request
- **Content-Type**: `multipart/form-data`
- **Field**: `file` (required)
- **Supported formats**: JPEG, PNG, GIF, WebP
- **Max size**: 5MB

#### Example
```bash
curl -X POST \
  http://207.180.251.81:3000/upload/image \
  -F "file=@image.jpg"
```

#### Response Success (200)
```json
{
  "message": "Image uploaded successfully",
  "url": "https://res.cloudinary.com/cugia94/image/upload/v1234567890/hello-vps/abc123.jpg",
  "publicId": "hello-vps/abc123",
  "width": 1920,
  "height": 1080,
  "format": "jpg",
  "size": 245760
}
```

#### Response Error (400)
```json
{
  "statusCode": 400,
  "message": "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
  "error": "Bad Request"
}
```

### 2. Upload Multiple Images
**POST** `/upload/images`

#### Request
- **Content-Type**: `multipart/form-data`
- **Field**: `files` (required, multiple)
- **Max files**: 10 per request
- **Supported formats**: JPEG, PNG, GIF, WebP
- **Max size**: 5MB per file

#### Example
```bash
curl -X POST \
  http://207.180.251.81:3000/upload/images \
  -F "files=@image1.jpg" \
  -F "files=@image2.png" \
  -F "files=@image3.gif"
```

#### Response Success (200)
```json
{
  "message": "3 images uploaded successfully",
  "images": [
    {
      "url": "https://res.cloudinary.com/cugia94/image/upload/v1234567890/hello-vps/abc123.jpg",
      "publicId": "hello-vps/abc123",
      "width": 1920,
      "height": 1080,
      "format": "jpg",
      "size": 245760
    },
    {
      "url": "https://res.cloudinary.com/cugia94/image/upload/v1234567891/hello-vps/def456.png",
      "publicId": "hello-vps/def456",
      "width": 1080,
      "height": 1920,
      "format": "png", 
      "size": 512000
    }
  ]
}
```

## Features

### 🎨 **Automatic Image Optimization**
- **Auto resize**: Max 1920x1080 (maintain aspect ratio)
- **Quality optimization**: Auto quality based on image content
- **Format optimization**: Auto WebP when supported
- **Compression**: Lossless optimization

### 🔒 **Validation**
- **File type validation**: Only image formats allowed
- **Size limit**: 5MB per file
- **Quantity limit**: 10 files per batch upload

### 🌐 **CDN Delivery**
- **Global CDN**: Fast delivery worldwide
- **HTTPS**: Secure image delivery
- **Responsive**: Multiple sizes available on demand

## Cloudinary Transformations

### URL Parameters
Bạn có thể thêm transformations vào URL để thay đổi hình ảnh:

```
# Original
https://res.cloudinary.com/cugia94/image/upload/v1234567890/hello-vps/abc123.jpg

# Resize to 300x200
https://res.cloudinary.com/cugia94/image/upload/w_300,h_200,c_fill/v1234567890/hello-vps/abc123.jpg

# Convert to WebP
https://res.cloudinary.com/cugia94/image/upload/f_webp/v1234567890/hello-vps/abc123.jpg

# Thumbnail with blur effect
https://res.cloudinary.com/cugia94/image/upload/w_150,h_150,c_thumb,g_face,e_blur:300/v1234567890/hello-vps/abc123.jpg
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | No file uploaded | Không có file trong request |
| 400 | Invalid file type | File không phải định dạng hình ảnh hỗ trợ |
| 400 | File too large | File vượt quá 5MB |
| 400 | Upload failed | Lỗi upload lên Cloudinary |

## Testing

### Manual Test
```bash
# Run test script
chmod +x test-upload.sh
./test-upload.sh

# Or test manually with curl
curl -X POST \
  http://207.180.251.81:3000/upload/image \
  -F "file=@your-image.jpg"
```

### With Postman
1. **Method**: POST
2. **URL**: `http://207.180.251.81:3000/upload/image`
3. **Body**: form-data
4. **Key**: `file` (Type: File)
5. **Value**: Select your image file

## Environment Variables

```env
CLOUDINARY_CLOUD_NAME=cugia94
CLOUDINARY_API_KEY=725368927496298
CLOUDINARY_API_SECRET=wIwx-h_7EUYpVfTauBWw_p8YiiQ
```

## Next Steps

### 📱 Frontend Integration
```javascript
// Example với JavaScript/React
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://207.180.251.81:3000/upload/image', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

### 🔗 User Profile Integration
- Add `avatar` field to User entity
- Update profile endpoint to handle image upload
- Store Cloudinary URL in database

### 📊 Analytics
- Track upload metrics
- Monitor Cloudinary usage
- Implement usage limits per user
