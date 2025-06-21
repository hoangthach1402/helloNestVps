# Gemini AI Module

Module này tích hợp Google Gemini AI để cho phép người dùng truy vấn cơ sở dữ liệu bằng ngôn ngữ tự nhiên.

## Tính năng

- **Truy vấn bằng ngôn ngữ tự nhiên**: Người dùng có thể hỏi về thông tin users bằng tiếng Việt hoặc tiếng Anh
- **Chuyển đổi tự động**: Gemini AI chuyển đổi câu hỏi thành SQL queries
- **Thực thi an toàn**: Chỉ cho phép SELECT queries, bảo vệ dữ liệu
- **Giải thích kết quả**: Trả về kết quả với lời giải thích dễ hiểu

## API Endpoints

### 1. POST /gemini/query
Xử lý câu hỏi bằng ngôn ngữ tự nhiên

**Request Body:**
```json
{
  "question": "Có bao nhiêu người dùng trong hệ thống?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "question": "Có bao nhiêu người dùng trong hệ thống?",
    "sqlQuery": "SELECT COUNT(*) as total_users FROM users WHERE isActive = true",
    "results": [{ "total_users": 25 }],
    "explanation": "Hiện tại có 25 người dùng đang hoạt động trong hệ thống."
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. GET /gemini/schema
Lấy thông tin về cấu trúc database và câu hỏi mẫu

**Response:**
```json
{
  "success": true,
  "data": {
    "tables": ["users", "roles"],
    "userFields": ["id", "username", "email", "firstName", "lastName", "isActive", "createdAt", "roleId"],
    "roleFields": ["id", "name", "description"],
    "sampleQuestions": [
      "Có bao nhiêu người dùng trong hệ thống?",
      "Liệt kê tất cả người dùng có tên là Nguyễn",
      "Người dùng nào được tạo trong tuần này?"
    ]
  }
}
```

### 3. GET /gemini/health
Kiểm tra trạng thái của Gemini AI service

## Câu hỏi mẫu

### Đếm số lượng
- "Có bao nhiêu người dùng trong hệ thống?"
- "Có bao nhiêu admin?"
- "Có bao nhiêu người dùng đang hoạt động?"

### Tìm kiếm theo tên
- "Tìm người dùng có tên là Nguyễn"
- "Liệt kê tất cả người dùng có họ Trần"
- "Người dùng nào có tên chứa 'An'?"

### Tìm kiếm theo email
- "Tìm người dùng có email chứa gmail"
- "Người dùng nào có email kết thúc bằng .edu?"

### Tìm kiếm theo thời gian
- "Người dùng nào được tạo hôm nay?"
- "Người dùng nào được tạo trong tuần này?"
- "Người dùng nào được tạo trong tháng này?"

### Tìm kiếm theo role
- "Ai là admin trong hệ thống?"
- "Liệt kê tất cả user thường"

### Trạng thái hoạt động
- "Người dùng nào đang không hoạt động?"
- "Liệt kê người dùng đã bị vô hiệu hóa"

## Cấu hình

### Environment Variables
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### Database Schema
Module này hoạt động với schema hiện tại:

**Users Table:**
- id: Primary key
- username: Unique username
- email: Unique email
- firstName: First name
- lastName: Last name
- isActive: Active status
- createdAt: Creation timestamp
- roleId: Foreign key to roles table

**Roles Table:**
- id: Primary key
- name: Role name (admin, user)
- description: Role description

## Bảo mật

- **JWT Authentication**: Tất cả endpoints yêu cầu JWT token
- **SQL Injection Protection**: Chỉ cho phép SELECT queries
- **Input Validation**: Validate độ dài và format của câu hỏi
- **Error Handling**: Xử lý lỗi an toàn, không expose sensitive information

## Cách sử dụng

1. **Đăng nhập** để lấy JWT token
2. **Gọi API** với header Authorization: `Bearer <token>`
3. **Gửi câu hỏi** bằng tiếng Việt hoặc tiếng Anh
4. **Nhận kết quả** với SQL query và giải thích

## Ví dụ với cURL

```bash
# Đăng nhập để lấy token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Truy vấn bằng ngôn ngữ tự nhiên
curl -X POST http://localhost:3000/gemini/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"question":"Có bao nhiêu người dùng trong hệ thống?"}'
```

## Lưu ý

- Gemini AI cần kết nối internet để hoạt động
- API key có giới hạn request, cần quản lý usage
- Kết quả có thể khác nhau tùy thuộc vào cách diễn đạt câu hỏi
- Module chỉ hỗ trợ truy vấn dữ liệu, không cho phép thay đổi