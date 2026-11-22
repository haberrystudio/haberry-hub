# Super Admin API Routes

## Base Path: `/v1/super-admin`

### 1. Login
- **Endpoint**: `POST /v1/super-admin/login`
- **Request Body**:
  ```json
  {
    "email": "haberrydigital@gmail.com",
    "password": "YOUR_PASSWORD"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "token": "64_char_hex_token",
    "maxAge": 28800
  }
  ```

### 2. Overview & Analytics
- **Endpoint**: `GET /v1/super-admin/overview`
- **Headers**:
  `Authorization: Bearer <token>`
- **Response**: `200 OK`
  ```json
  {
    "email": "haberrydigital@gmail.com",
    "expiresAt": "2026-11-22T19:33:02.115Z",
    "adminCount": 1,
    "metrics": {
      "balance": { "title": "My balance", "amount": "$28,520.30", "change": "+1.5%" },
      "savings": { "title": "Savings account", "amount": "$24,800.45", "change": "-3.2%" },
      "investments": { "title": "Investment portfolio", "amount": "$70,120.78", "change": "+4.7%" }
    },
    "wallets": [
      { "id": "usd", "currency": "USD", "amount": "$24,678.00", "limit": "Limit is $10k a month", "status": "Active" }
    ],
    "cashFlow": {
      "total": "$540,323.45",
      "period": "Yearly",
      "chartData": [...]
    },
    "recentActivities": [...]
  }
  ```

### 3. Logout
- **Endpoint**: `POST /v1/super-admin/logout`
- **Headers**:
  `Authorization: Bearer <token>`
- **Response**: `204 No Content`
