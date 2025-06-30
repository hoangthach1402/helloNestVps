# Test script for Tour Management API (PowerShell version)
# Make sure the server is running on localhost:3000

$BASE_URL = "http://localhost:3000"
$OWNER_ID = 1

Write-Host "=== Testing Tour Management API ===" -ForegroundColor Green
Write-Host

# Test 1: Create Members
Write-Host "1. Creating members..." -ForegroundColor Yellow
$member1 = @{
    name = "Thạch"
    phone = "+84123456789"
    email = "thach@example.com"
} | ConvertTo-Json

$member2 = @{
    name = "Mai"
    phone = "+84987654321"
    email = "mai@example.com"
} | ConvertTo-Json

$member3 = @{
    name = "Hùng"
    phone = "+84555666777"
    email = "hung@example.com"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "$BASE_URL/owners/$OWNER_ID/members" -Method Post -Body $member1 -ContentType "application/json"
    Write-Host "Member 1 created: $($response1 | ConvertTo-Json -Compress)"
    
    $response2 = Invoke-RestMethod -Uri "$BASE_URL/owners/$OWNER_ID/members" -Method Post -Body $member2 -ContentType "application/json"
    Write-Host "Member 2 created: $($response2 | ConvertTo-Json -Compress)"
    
    $response3 = Invoke-RestMethod -Uri "$BASE_URL/owners/$OWNER_ID/members" -Method Post -Body $member3 -ContentType "application/json"
    Write-Host "Member 3 created: $($response3 | ConvertTo-Json -Compress)"
} catch {
    Write-Host "Error creating members: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host

# Test 2: Get all members
Write-Host "2. Getting all members..." -ForegroundColor Yellow
try {
    $members = Invoke-RestMethod -Uri "$BASE_URL/owners/$OWNER_ID/members" -Method Get
    Write-Host "Members: $($members | ConvertTo-Json -Compress)"
} catch {
    Write-Host "Error getting members: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host

# Test 3: Create a tour
Write-Host "3. Creating a tour..." -ForegroundColor Yellow
$tour = @{
    name = "Đà Lạt Trip"
    description = "Weekend getaway to Dalat"
    location = "Đà Lạt, Vietnam"
    startDate = "2024-01-15"
    endDate = "2024-01-17"
    images = @(
        "https://example.com/dalat1.jpg",
        "https://example.com/dalat2.jpg"
    )
    memberIds = @(1, 2, 3)
} | ConvertTo-Json

try {
    $tourResponse = Invoke-RestMethod -Uri "$BASE_URL/owners/$OWNER_ID/tours" -Method Post -Body $tour -ContentType "application/json"
    Write-Host "Tour created: $($tourResponse | ConvertTo-Json -Compress)"
} catch {
    Write-Host "Error creating tour: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host

# Test 4: Get all tours
Write-Host "4. Getting all tours..." -ForegroundColor Yellow
try {
    $tours = Invoke-RestMethod -Uri "$BASE_URL/owners/$OWNER_ID/tours" -Method Get
    Write-Host "Tours: $($tours | ConvertTo-Json -Compress)"
} catch {
    Write-Host "Error getting tours: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host

# Test 5: Create bills
Write-Host "5. Creating bills..." -ForegroundColor Yellow
$bill1 = @{
    amount = 500000
    description = "Dinner at restaurant"
    category = "food"
    images = @("https://example.com/receipt1.jpg")
    paidBy = 1
    splitBetween = @(1, 2, 3)
    notes = "Delicious Vietnamese food"
} | ConvertTo-Json

$bill2 = @{
    amount = 300000
    description = "Hotel accommodation"
    category = "accommodation"
    images = @("https://example.com/hotel-receipt.jpg")
    paidBy = 2
    splitBetween = @(1, 2, 3)
    notes = "Nice hotel in city center"
} | ConvertTo-Json

$bill3 = @{
    amount = 150000
    description = "Transportation"
    category = "transport"
    paidBy = 3
    splitBetween = @(1, 2)
    notes = "Bus tickets"
} | ConvertTo-Json

try {
    $billResponse1 = Invoke-RestMethod -Uri "$BASE_URL/owners/$OWNER_ID/tours/1/bills" -Method Post -Body $bill1 -ContentType "application/json"
    Write-Host "Bill 1 created: $($billResponse1 | ConvertTo-Json -Compress)"
    
    $billResponse2 = Invoke-RestMethod -Uri "$BASE_URL/owners/$OWNER_ID/tours/1/bills" -Method Post -Body $bill2 -ContentType "application/json"
    Write-Host "Bill 2 created: $($billResponse2 | ConvertTo-Json -Compress)"
    
    $billResponse3 = Invoke-RestMethod -Uri "$BASE_URL/owners/$OWNER_ID/tours/1/bills" -Method Post -Body $bill3 -ContentType "application/json"
    Write-Host "Bill 3 created: $($billResponse3 | ConvertTo-Json -Compress)"
} catch {
    Write-Host "Error creating bills: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host

# Test 6: Get all bills
Write-Host "6. Getting all bills for tour..." -ForegroundColor Yellow
try {
    $bills = Invoke-RestMethod -Uri "$BASE_URL/owners/$OWNER_ID/tours/1/bills" -Method Get
    Write-Host "Bills: $($bills | ConvertTo-Json -Compress)"
} catch {
    Write-Host "Error getting bills: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host

# Test 7: Get tour summary
Write-Host "7. Getting tour summary with calculations..." -ForegroundColor Yellow
try {
    $summary = Invoke-RestMethod -Uri "$BASE_URL/owners/$OWNER_ID/tours/1/summary" -Method Get
    Write-Host "Tour Summary:" -ForegroundColor Cyan
    Write-Host "Total Expenses: $($summary.totalExpenses)" -ForegroundColor Cyan
    foreach ($memberSummary in $summary.summary) {
        $status = if ($memberSummary.balance -gt 0) { "is owed" } else { "owes" }
        $amount = [Math]::Abs($memberSummary.balance)
        Write-Host "  $($memberSummary.member.name): Paid $($memberSummary.totalPaid), Share $($memberSummary.totalShare), $status $amount" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error getting tour summary: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host

# Test 8: Get bills by category
Write-Host "8. Getting food bills only..." -ForegroundColor Yellow
try {
    $foodBills = Invoke-RestMethod -Uri "$BASE_URL/owners/$OWNER_ID/tours/1/bills?category=food" -Method Get
    Write-Host "Food Bills: $($foodBills | ConvertTo-Json -Compress)"
} catch {
    Write-Host "Error getting food bills: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host

# Test 9: Get total expenses
Write-Host "9. Getting total expenses..." -ForegroundColor Yellow
try {
    $total = Invoke-RestMethod -Uri "$BASE_URL/owners/$OWNER_ID/tours/1/bills/total" -Method Get
    Write-Host "Total Expenses: $total"
} catch {
    Write-Host "Error getting total expenses: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host

Write-Host "=== Test completed ===" -ForegroundColor Green