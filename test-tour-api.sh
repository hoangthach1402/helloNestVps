#!/bin/bash

# Test script for Tour Management API
# Make sure the server is running on localhost:3000

BASE_URL="http://localhost:3000"
OWNER_ID=1

echo "=== Testing Tour Management API ==="
echo

# Test 1: Create Members
echo "1. Creating members..."
curl -X POST "$BASE_URL/owners/$OWNER_ID/members" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Thạch",
    "phone": "+84123456789",
    "email": "thach@example.com"
  }'
echo
echo

curl -X POST "$BASE_URL/owners/$OWNER_ID/members" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mai",
    "phone": "+84987654321",
    "email": "mai@example.com"
  }'
echo
echo

curl -X POST "$BASE_URL/owners/$OWNER_ID/members" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hùng",
    "phone": "+84555666777",
    "email": "hung@example.com"
  }'
echo
echo

# Test 2: Get all members
echo "2. Getting all members..."
curl -X GET "$BASE_URL/owners/$OWNER_ID/members"
echo
echo

# Test 3: Create a tour
echo "3. Creating a tour..."
curl -X POST "$BASE_URL/owners/$OWNER_ID/tours" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Đà Lạt Trip",
    "description": "Weekend getaway to Dalat",
    "location": "Đà Lạt, Vietnam",
    "startDate": "2024-01-15",
    "endDate": "2024-01-17",
    "images": [
      "https://example.com/dalat1.jpg",
      "https://example.com/dalat2.jpg"
    ],
    "memberIds": [1, 2, 3]
  }'
echo
echo

# Test 4: Get all tours
echo "4. Getting all tours..."
curl -X GET "$BASE_URL/owners/$OWNER_ID/tours"
echo
echo

# Test 5: Create bills
echo "5. Creating bills..."
curl -X POST "$BASE_URL/owners/$OWNER_ID/tours/1/bills" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500000,
    "description": "Dinner at restaurant",
    "category": "food",
    "images": ["https://example.com/receipt1.jpg"],
    "paidBy": 1,
    "splitBetween": [1, 2, 3],
    "notes": "Delicious Vietnamese food"
  }'
echo
echo

curl -X POST "$BASE_URL/owners/$OWNER_ID/tours/1/bills" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 300000,
    "description": "Hotel accommodation",
    "category": "accommodation",
    "images": ["https://example.com/hotel-receipt.jpg"],
    "paidBy": 2,
    "splitBetween": [1, 2, 3],
    "notes": "Nice hotel in city center"
  }'
echo
echo

curl -X POST "$BASE_URL/owners/$OWNER_ID/tours/1/bills" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150000,
    "description": "Transportation",
    "category": "transport",
    "paidBy": 3,
    "splitBetween": [1, 2],
    "notes": "Bus tickets"
  }'
echo
echo

# Test 6: Get all bills
echo "6. Getting all bills for tour..."
curl -X GET "$BASE_URL/owners/$OWNER_ID/tours/1/bills"
echo
echo

# Test 7: Get tour summary
echo "7. Getting tour summary with calculations..."
curl -X GET "$BASE_URL/owners/$OWNER_ID/tours/1/summary"
echo
echo

# Test 8: Get bills by category
echo "8. Getting food bills only..."
curl -X GET "$BASE_URL/owners/$OWNER_ID/tours/1/bills?category=food"
echo
echo

# Test 9: Get total expenses
echo "9. Getting total expenses..."
curl -X GET "$BASE_URL/owners/$OWNER_ID/tours/1/bills/total"
echo
echo

echo "=== Test completed ==="