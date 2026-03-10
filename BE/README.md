# TechStore Backend API

Spring Boot backend (port **8082**). Base URL: `http://localhost:8082`

---

## Auth — `api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login (body: `LoginDTO`) |
| POST | `/api/auth/register` | Register (body: `CreateUserDTO`) |

---

## Public / Client — Products — `api/products`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all published products |
| GET | `/api/products/{id}` | Get product detail by ID |

---

## Client — User — `api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get current user profile |
| PUT | `/api/users/profile` | Update current user (body: `UpdateUserDTO`) |
| DELETE | `/api/users/{id}` | Disable/delete own account |

---

## Client — Cart — `api/client/cart` (authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/client/cart` | Get current user's cart |
| POST | `/api/client/cart/add` | Add item to cart (body: `CartRequest`) |
| PUT | `/api/client/cart/update/{itemId}` | Update cart item quantity (query: `quantity`) |
| DELETE | `/api/client/cart/remove/{itemId}` | Remove item from cart |
| DELETE | `/api/client/cart/clear` | Clear entire cart |

---

## Admin — Products — `api/admin/products`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/products` | List all products |
| GET | `/api/admin/products/{id}` | Get product by ID |
| POST | `/api/admin/products` | Create product (body: `Product`) |
| PUT | `/api/admin/products/{id}` | Update product (body: `Product`) |
| DELETE | `/api/admin/products/{id}` | Delete product |

---

## Admin — Users — `api/admin/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| POST | `/api/admin/users` | Create user (body: `CreateUserByAdminDTO`) |
| PUT | `/api/admin/users/{id}` | Update user (body: `UpdateUserByAdminDTO`) |
| DELETE | `/api/admin/users/{id}` | Delete/disable user |

---

## Admin — Dashboard — `api/admin`

| Method | Endpoint | Description |
|--------|----------|-------------|
| — | — | No active endpoints (dashboard summary commented out) |

---

## Admin — Orders — `api/admin`

`AdminOrderController` exists but has no endpoints yet.

## Client — Orders — `api/...`

`OrderController` exists but has no endpoints yet.
