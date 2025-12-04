# 📡 API Reference Documentation

Complete API reference for the Task Tracker backend.

**Base URL:** `http://localhost:8000/api`

---

## 🔐 Authentication

All task endpoints require Bearer token authentication.

### Header Format
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Endpoints

### Authentication Endpoints

#### 1. Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepass123"
}
```

**Response:** `201 Created`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "user@example.com"
  }
}
```

**Errors:**
- `400` - Username or email already exists
- `422` - Validation error

---

#### 2. Login User
**POST** `/auth/login`

Authenticate user and receive access token.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepass123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "user@example.com"
  }
}
```

**Errors:**
- `401` - Invalid credentials

---

#### 3. Get Current User
**GET** `/auth/me`

Get authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "user@example.com",
  "created_at": "2025-12-02T10:30:00Z"
}
```

**Errors:**
- `401` - Invalid or expired token

---

### Task Endpoints

#### 1. List Tasks
**GET** `/tasks/`

Get paginated list of tasks with filtering and sorting.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| page_size | integer | 10 | Items per page (max: 100) |
| search | string | - | Search in title/description |
| status | string | - | Filter by status |
| priority | string | - | Filter by priority |
| sort_by | string | created_at | Sort field |
| sort_order | string | desc | Sort order (asc/desc) |

**Status Values:** `Not Started`, `In Progress`, `Completed`

**Priority Values:** `Low`, `Medium`, `High`

**Sort By Values:** `created_at`, `updated_at`, `due_date`, `priority`, `status`, `title`

**Example Request:**
```
GET /api/tasks/?page=1&page_size=10&status=In Progress&priority=High&sort_by=due_date&sort_order=asc
```

**Response:** `200 OK`
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation",
      "status": "In Progress",
      "priority": "High",
      "due_date": "2025-12-15T10:00:00Z",
      "created_at": "2025-12-01T09:00:00Z",
      "updated_at": "2025-12-02T10:30:00Z",
      "user_id": 1
    }
  ],
  "total": 25,
  "page": 1,
  "page_size": 10,
  "total_pages": 3
}
```

---

#### 2. Get Single Task
**GET** `/tasks/{task_id}`

Get details of a specific task.

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `task_id` (integer) - Task ID

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation",
  "status": "In Progress",
  "priority": "High",
  "due_date": "2025-12-15T10:00:00Z",
  "created_at": "2025-12-01T09:00:00Z",
  "updated_at": "2025-12-02T10:30:00Z",
  "user_id": 1
}
```

**Errors:**
- `404` - Task not found
- `401` - Unauthorized

---

#### 3. Create Task
**POST** `/tasks/`

Create a new task.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for all features",
  "status": "Not Started",
  "priority": "High",
  "due_date": "2025-12-15T10:00:00Z"
}
```

**Field Requirements:**
- `title` (required): 1-200 characters
- `description` (optional): max 2000 characters
- `status` (optional): Default "Not Started"
- `priority` (optional): Default "Medium"
- `due_date` (optional): ISO 8601 datetime

**Response:** `201 Created`
```json
{
  "id": 15,
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for all features",
  "status": "Not Started",
  "priority": "High",
  "due_date": "2025-12-15T10:00:00Z",
  "created_at": "2025-12-02T10:30:00Z",
  "updated_at": "2025-12-02T10:30:00Z",
  "user_id": 1
}
```

**Errors:**
- `422` - Validation error
- `401` - Unauthorized

---

#### 4. Update Task
**PUT** `/tasks/{task_id}`

Update an existing task. All fields are optional.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `task_id` (integer) - Task ID

**Request Body:**
```json
{
  "status": "Completed",
  "priority": "Medium"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation",
  "status": "Completed",
  "priority": "Medium",
  "due_date": "2025-12-15T10:00:00Z",
  "created_at": "2025-12-01T09:00:00Z",
  "updated_at": "2025-12-02T11:00:00Z",
  "user_id": 1
}
```

**Errors:**
- `404` - Task not found
- `422` - Validation error
- `401` - Unauthorized

---

#### 5. Delete Task
**DELETE** `/tasks/{task_id}`

Delete a task permanently.

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `task_id` (integer) - Task ID

**Response:** `200 OK`
```json
{
  "message": "Task deleted successfully"
}
```

**Errors:**
- `404` - Task not found
- `401` - Unauthorized

---

## 🔧 Error Responses

### Standard Error Format
```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |

---

## 📝 Data Models

### User Model
```typescript
{
  id: number
  email: string
  username: string
  created_at: datetime
}
```

### Task Model
```typescript
{
  id: number
  title: string
  description: string | null
  status: "Not Started" | "In Progress" | "Completed"
  priority: "Low" | "Medium" | "High"
  due_date: datetime | null
  created_at: datetime
  updated_at: datetime
  user_id: number
}
```

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

### Create Task
```bash
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"New Task","priority":"High","status":"Not Started"}'
```

### Get Tasks
```bash
curl -X GET "http://localhost:8000/api/tasks/?page=1&page_size=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Task
```bash
curl -X PUT http://localhost:8000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"status":"Completed"}'
```

### Delete Task
```bash
curl -X DELETE http://localhost:8000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔍 Interactive Documentation

For interactive API testing, visit:
- **Swagger UI:** http://localhost:8000/api/docs
- **ReDoc:** http://localhost:8000/api/redoc

These provide:
- Try-it-out functionality
- Request/response examples
- Schema definitions
- Authentication testing

---

## 🛡️ Security Notes

1. **Never commit tokens** to version control
2. **Tokens expire** after 30 minutes (configurable)
3. **Use HTTPS** in production
4. **Store tokens securely** (httpOnly cookies recommended for production)
5. **Validate all inputs** on backend
6. **Use strong passwords** (minimum 6 characters)

---

## 📊 Rate Limiting

Currently no rate limiting is implemented. For production:
- Implement rate limiting (e.g., 100 requests/minute)
- Add request throttling
- Monitor for abuse

---

## 🌐 CORS Configuration

Current CORS settings allow:
- Origin: `http://localhost:3000`
- Methods: All
- Headers: All
- Credentials: Yes

Update in production to match your domain.

---

**For more details, see the main README.md**
