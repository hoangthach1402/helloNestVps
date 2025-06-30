# Tour Management API Documentation

This API provides endpoints for managing tours, members, and bills with image support. No authorization is required for any endpoints.

## Base URL
```
http://localhost:3000
```

## API Endpoints

### Members Management

#### Create Member
```http
POST /owners/{ownerId}/members
Content-Type: application/json

{
  "name": "Thạch",
  "phone": "+84123456789",
  "email": "thach@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Get All Members
```http
GET /owners/{ownerId}/members
```

#### Get Member by ID
```http
GET /owners/{ownerId}/members/{memberId}
```

#### Update Member
```http
PATCH /owners/{ownerId}/members/{memberId}
Content-Type: application/json

{
  "name": "Thạch Updated",
  "phone": "+84987654321"
}
```

#### Delete Member
```http
DELETE /owners/{ownerId}/members/{memberId}
```

### Tours Management

#### Create Tour
```http
POST /owners/{ownerId}/tours
Content-Type: application/json

{
  "name": "Đà Lạt Trip",
  "description": "Weekend getaway to Dalat",
  "location": "Đà Lạt, Vietnam",
  "startDate": "2024-01-15",
  "endDate": "2024-01-17",
  "images": [
    "https://example.com/tour1.jpg",
    "https://example.com/tour2.jpg"
  ],
  "memberIds": [1, 2, 3]
}
```

#### Get All Tours
```http
GET /owners/{ownerId}/tours
```

#### Get Tour by ID
```http
GET /owners/{ownerId}/tours/{tourId}
```

#### Get Tour Summary (with expense calculations)
```http
GET /owners/{ownerId}/tours/{tourId}/summary
```

Response:
```json
{
  "tour": { /* tour details */ },
  "summary": [
    {
      "member": { "id": 1, "name": "Thạch" },
      "totalPaid": 1500000,
      "totalShare": 1200000,
      "balance": 300000
    }
  ],
  "totalExpenses": 3000000
}
```

#### Update Tour
```http
PATCH /owners/{ownerId}/tours/{tourId}
Content-Type: application/json

{
  "name": "Updated Tour Name",
  "memberIds": [1, 2, 3, 4]
}
```

#### Delete Tour
```http
DELETE /owners/{ownerId}/tours/{tourId}
```

### Bills Management

#### Create Bill
```http
POST /owners/{ownerId}/tours/{tourId}/bills
Content-Type: application/json

{
  "amount": 500000,
  "description": "Dinner at restaurant",
  "category": "food",
  "images": [
    "https://example.com/receipt1.jpg",
    "https://example.com/receipt2.jpg"
  ],
  "paidBy": 1,
  "splitBetween": [1, 2, 3],
  "notes": "Delicious Vietnamese food"
}
```

#### Get All Bills for Tour
```http
GET /owners/{ownerId}/tours/{tourId}/bills
```

#### Get Bills by Category
```http
GET /owners/{ownerId}/tours/{tourId}/bills?category=food
```

#### Get Total Expenses
```http
GET /owners/{ownerId}/tours/{tourId}/bills/total
```

#### Get Bill by ID
```http
GET /owners/{ownerId}/tours/{tourId}/bills/{billId}
```

#### Update Bill
```http
PATCH /owners/{ownerId}/tours/{tourId}/bills/{billId}
Content-Type: application/json

{
  "amount": 600000,
  "description": "Updated dinner cost"
}
```

#### Delete Bill
```http
DELETE /owners/{ownerId}/tours/{tourId}/bills/{billId}
```

## Data Models

### Member
```json
{
  "id": 1,
  "name": "Thạch",
  "phone": "+84123456789",
  "email": "thach@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "ownerId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Tour
```json
{
  "id": 1,
  "name": "Đà Lạt Trip",
  "description": "Weekend getaway",
  "location": "Đà Lạt, Vietnam",
  "startDate": "2024-01-15",
  "endDate": "2024-01-17",
  "images": ["https://example.com/tour1.jpg"],
  "memberIds": [1, 2, 3],
  "ownerId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Bill
```json
{
  "id": 1,
  "amount": 500000,
  "description": "Dinner",
  "category": "food",
  "images": ["https://example.com/receipt.jpg"],
  "paidBy": 1,
  "splitBetween": [1, 2, 3],
  "notes": "Great meal",
  "tourId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Bill Categories
Common categories you can use:
- `food` - Meals and dining
- `transport` - Transportation costs
- `accommodation` - Hotels and lodging
- `entertainment` - Activities and fun
- `shopping` - Purchases and souvenirs
- `other` - Miscellaneous expenses

## Image Support
- Both tours and bills support multiple images
- Images should be provided as URLs (use the existing upload API to get URLs)
- Tour images can include destination photos, group photos, etc.
- Bill images typically include receipts and proof of purchase

## Example Workflow

1. **Create Members**: Add all people who will participate in tours
2. **Create Tour**: Create a new tour and assign members
3. **Add Bills**: During the tour, add expenses with receipts
4. **Get Summary**: View who owes what to whom

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include descriptive messages to help with debugging.