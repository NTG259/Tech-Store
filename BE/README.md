# TechStore Backend API

Spring Boot backend (port **8082**). Base URL: `http://localhost:8082`

---

## Table of Contents

- [Authentication](#authentication)
- [Client - Products](#client---products)
- [Client - Categories](#client---categories)
- [Client - Profile](#client---profile)
- [Client - Cart](#client---cart)
- [Client - Orders](#client---orders)
- [Admin - Products](#admin---products)
- [Admin - Categories](#admin---categories)
- [Admin - Users](#admin---users)
- [Admin - Orders](#admin---orders)
- [Admin - Dashboard](#admin---dashboard)

---

## Authentication

### POST `/api/auth/login`

Login user and receive access token + refresh token.

**Request:**

```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "code": 200,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "CLIENT"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** Refresh token is set as HttpOnly cookie `rf_token`

---

### POST `/api/auth/register`

Register new user account.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response (200):** User information with message

---

## Client - Products

### GET `/api/client/products`

Get all published products with pagination and filters.

**Query Parameters:**

- `page` (required): Page number (1-based)
- `size` (required): Items per page
- `categoryId` (optional): Filter by category
- `name` (optional): Search by product name
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Response (200):**

```json
{
  "currentPage": 1,
  "totalPages": 5,
  "totalItems": 45,
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 99.99,
      "description": "...",
      "categoryId": 1,
      "status": "PUBLISHED",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### GET `/api/client/products/{id}`

Get product detail by ID.

**Response (200):** Single product object

---

### GET `/api/client/products/new`

Get latest products (most recent published).

**Response (200):** List of latest products

---

## Client - Categories

### GET `/api/client/categories`

Get all product categories.

**Response (200):**

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "description": "..."
    }
  ]
}
```

---

## Client - Profile

### GET `/api/client/profile`

Get current authenticated user's profile.

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):** User information

---

### PUT `/api/client/profile`

Update current user's profile information.

**Headers:** `Authorization: Bearer {accessToken}`

**Request:**

```json
{
  "email": "newemail@example.com",
  "fullName": "Updated Name",
  "phoneNumber": "0123456789"
}
```

**Response (200):** Updated user information

---

### DELETE `/api/client/locked`

Disable/lock current user's account.

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):** Success message

---

## Client - Cart

All cart endpoints require authentication.

### GET `/api/client/cart`

Get current user's shopping cart.

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**

```json
{
  "code": 200,
  "data": {
    "cartId": 1,
    "userId": 1,
    "cartItems": [
      {
        "itemId": 1,
        "productId": 1,
        "productName": "Product",
        "quantity": 2,
        "unitPrice": 99.99,
        "totalPrice": 199.98
      }
    ],
    "totalPrice": 199.98,
    "totalQuantity": 2
  }
}
```

---

### POST `/api/client/cart/add`

Add product to cart.

**Headers:** `Authorization: Bearer {accessToken}`

**Request:**

```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response (200):** Updated cart

---

### PUT `/api/client/cart`

Update cart item quantity.

**Headers:** `Authorization: Bearer {accessToken}`

**Request:**

```json
{
  "productId": 1,
  "quantity": 5
}
```

**Response (200):** Updated cart

---

### DELETE `/api/client/cart/{itemId}`

Remove item from cart.

**Headers:** `Authorization: Bearer {accessToken}`

**Path Parameters:**

- `itemId`: Cart item ID

**Response (200):** Updated cart

---

### POST `/api/client/cart/checkout`

Checkout and create order from cart.

**Headers:** `Authorization: Bearer {accessToken}`

**Request:**

```json
{
  "address": "123 Main St",
  "phoneNumber": "0123456789",
  "note": "Optional delivery note"
}
```

**Response (201):**

```json
{
  "code": 201,
  "data": {
    "orderId": 1,
    "userId": 1,
    "totalPrice": 199.98,
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Client - Orders

### GET `/api/client/orders`

Get current user's orders with pagination.

**Headers:** `Authorization: Bearer {accessToken}`

**Query Parameters:**

- `page` (required): Page number (1-based)
- `size` (required): Items per page
- `status` (optional): Filter by order status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)

**Response (200):**

```json
{
  "currentPage": 1,
  "totalPages": 2,
  "totalItems": 5,
  "data": [
    {
      "orderId": 1,
      "userId": 1,
      "totalPrice": 199.98,
      "status": "PENDING",
      "address": "123 Main St",
      "phoneNumber": "0123456789",
      "orderItems": [...],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### PUT `/api/client/orders/{id}`

Cancel/update own order status.

**Headers:** `Authorization: Bearer {accessToken}`

**Request:**

```json
{
  "status": "CANCELLED"
}
```

**Response (200):** Updated order

---

## Admin - Products

All admin endpoints require authentication and ADMIN role.

### GET `/api/admin/products`

Get all products with pagination and filters.

**Headers:** `Authorization: Bearer {adminAccessToken}`

**Query Parameters:**

- `page` (required): Page number (1-based)
- `size` (required): Items per page
- `name` (optional): Search by product name
- `productStatus` (optional): Filter by status (DRAFT, PUBLISHED, ARCHIVED)
- `categoryId` (optional): Filter by category

**Response (200):** Paginated products list

---

### GET `/api/admin/products/{id}`

Get product detail by ID.

**Response (200):** Single product object

---

### POST `/api/admin/products`

Create new product.

**Request:**

```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "quantity": 100,
  "categoryId": 1,
  "status": "DRAFT"
}
```

**Response (201):** Created product

---

### PUT `/api/admin/products/{id}`

Update product information.

**Request:** Same as POST

**Response (200):** Updated product

---

### DELETE `/api/admin/products/{id}`

Delete product.

**Response (200):** Success message

---

## Admin - Categories

### POST `/api/admin/categories`

Create new product category.

**Request:**

```json
{
  "name": "Electronics",
  "description": "Electronic devices"
}
```

**Response (201):** Created category

---

### GET `/api/admin/categories`

Get categories with pagination.

**Query Parameters:**

- `page` (required): Page number (1-based)
- `size` (required): Items per page
- `name` (required): Search by name

**Response (200):** Paginated categories

---

### GET `/api/admin/categories/{id}`

Get category by ID.

**Response (200):** Category object

---

### PUT `/api/admin/categories/{id}`

Update category.

**Request:**

```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response (200):** Updated category

---

### DELETE `/api/admin/categories/{id}`

Delete category.

**Response (200):** Success message

---

## Admin - Users

### POST `/api/admin/users`

Create new user (admin can set role).

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "User Name",
  "role": "CLIENT"
}
```

**Response (201):** Created user

---

### GET `/api/admin/users`

Get users with pagination.

**Query Parameters:**

- `page` (required): Page number (1-based)
- `size` (required): Items per page
- `fullName` (required): Search by name

**Response (200):** Paginated users

---

### PUT `/api/admin/users/{id}`

Update user information (admin can update role).

**Request:**

```json
{
  "email": "user@example.com",
  "fullName": "Updated Name",
  "role": "CLIENT"
}
```

**Response (200):** Updated user

---

### DELETE `/api/admin/users/{id}`

Delete user account.

**Response (200):** Success message

---

### PUT `/api/admin/users/lock/{id}`

Lock/disable user account.

**Response (200):** Success message

---

## Admin - Orders

### GET `/api/admin/orders`

Get all orders with pagination and filters.

**Query Parameters:**

- `page` (required): Page number (1-based)
- `size` (required): Items per page
- `name` (optional): Search by customer name
- `status` (optional): Filter by order status

**Response (200):** Paginated orders

---

### PUT `/api/admin/orders/{id}`

Update order status.

**Request:**

```json
{
  "status": "SHIPPED"
}
```

**Response (200):** Updated order

---

## Admin - Dashboard

### GET `/api/admin/dashboard/summary`

Get dashboard statistics.

**Response (200):**

```json
{
  "code": 200,
  "data": {
    "userCount": 150,
    "productCount": 250,
    "orderSuccessCount": 1200,
    "totalRevenue": 50000.00
  }
}
```

---

## Response Format

All API responses follow this format:

```json
{
  "code": 200,
  "message": "Success message",
  "data": {},
  "error": null
}
```

---

## Error Handling

Common HTTP status codes:

- `200 OK` - Successful GET request
- `201 Created` - Successful POST/PUT request (resource created)
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User doesn't have permission (e.g., not admin)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Authentication

Use JWT Bearer tokens for protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Refresh token is stored as HttpOnly cookie. To refresh, the client should automatically include it in requests.

---

## User Roles

- **CLIENT** - Regular user, can purchase products
- **ADMIN** - Administrator, can manage products, users, and orders
