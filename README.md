# Blogs Backend 📝

A RESTful API for a blogging platform built with **Express.js**, **MySQL**, and **JWT authentication**.

---

## 1️⃣ Approach

### Architecture Overview

**Layered Architecture** separating concerns:

- **Routes** → **Middleware** → **Controllers** → **Database**

```
Routes (Express Router)
    ↓
Middleware (JWT, Ownership validation)
    ↓
Controllers (Business logic)
    ↓
MySQL Database
```

### Folder Structure

```
Blogs-Backend/
├── server.js
├── package.json
├── src/
│   ├── app.js                  # Express config & middleware
│   ├── config/db.js            # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js   # Signup, login
│   │   └── articleController.js # CRUD operations
│   ├── middleware/
│   │   ├── verifyJWT.js         # Token verification
│   │   └── checkOwnership.js    # Authorization checks
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── articleRoutes.js
│   └── utils/
│       └── generateToken.js    # JWT utility
```

### Key Design Decisions

| Decision                       | Rationale                                                                |
| ------------------------------ | ------------------------------------------------------------------------ |
| **Middleware-based security**  | JWT verification at route level; flexibility for public/protected routes |
| **Connection pooling**         | Better performance under concurrent requests                             |
| **Bcrypt password hashing**    | Security: salt rounds = 10                                               |
| **Stateless JWT auth**         | No session storage needed; scalable                                      |
| **Ownership middleware**       | Prevents unauthorized article edits                                      |
| **Consistent error responses** | JSON format with proper HTTP status codes                                |

---

## 2️⃣ AI Usage

### AI Tools Used

- **GitHub Copilot** - Code generation, debugging, middleware patterns
- **ChatGPT** - Architecture planning, API design

### Where AI Helped ✅

| Area                | AI Contribution                                      | Manual Review                        |
| ------------------- | ---------------------------------------------------- | ------------------------------------ |
| **Code Generation** | Express boilerplate, CRUD functions, error patterns  | Added validation, error handling     |
| **SQL Queries**     | SELECT/INSERT/UPDATE/DELETE queries                  | Verified efficiency, added indexing  |
| **Middleware**      | JWT parser, ownership check patterns                 | Enhanced error handling, test cases  |
| **API Design**      | RESTful route structure `/api/auth`, `/api/articles` | Standardized response format         |
| **Security**        | Bcrypt implementation, CORS setup                    | Configured salt rounds, token expiry |

### What Was Manually Corrected 🔧

1. **Database Config** - Added connection pooling (AI suggested simple connection)
2. **Error Messages** - Made user-friendly with proper HTTP status codes
3. **Validation** - Email format, password strength, required fields
4. **Response Format** - Standardized to `{ success, message, data }`
5. **Edge Cases** - Duplicate entry handling, authorization checks
6. **Token Management** - Added expiration times and refresh strategy

**Example Correction:**

```javascript
// AI-generated initial version
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  // ... incomplete validation
};

// Manually enhanced:
// ✓ Email uniqueness check
// ✓ Password strength validation
// ✓ Proper error status codes (400, 409, 500)
// ✓ Comprehensive try-catch
// ✓ JWT token generation on success
```

---

## 3️⃣ Setup Instructions

### Prerequisites

```bash
# Check you have:
node --version       # v16+
npm --version        # v8+
mysql --version      # v8.0+
```

### Environment Variables

Create `.env` in project root:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=manager
DB_NAME=knowledge_platform

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Backend Setup

**1. Clone & Install:**

```bash
git clone https://github.com/Ektasinha25/Blogs-Backend.git
cd Blogs-Backend
npm install
```

**2. Create MySQL Database:**

```bash
mysql -u root -p
```

```sql
CREATE DATABASE knowledge_platform;
USE knowledge_platform;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  author_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_author_id ON articles(author_id);
CREATE INDEX idx_email ON users(email);
```

**3. Start Server:**

```bash
npm run dev    # Development mode (auto-restart)
npm start      # Production mode
```

Expected: `Server running on port 5000`

**4. Test API:**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass123"}'
```

### Frontend Setup

**1. Create React App:**

```bash
npx create-react-app blogs-frontend
cd blogs-frontend
npm install axios react-router-dom
```

**2. Create API Service** (`src/services/api.js`):

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Auto-attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

**3. Create `.env`:**

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**4. Start Frontend:**

```bash
npm start    # Opens http://localhost:3000
```

**5. Key Components to Build:**

- `src/context/AuthContext.jsx` - Auth state
- `src/components/Auth/Login.jsx` - Login form
- `src/components/Auth/Signup.jsx` - Registration
- `src/components/Articles/ArticleList.jsx` - Display articles
- `src/components/Articles/ArticleDetail.jsx` - Article view
- `src/components/Articles/CreateArticle.jsx` - New article
- `src/pages/Home.jsx` - Home page
- `src/App.jsx` - Routes

### Run Both Services

**Terminal 1 (Backend):**

```bash
cd Blogs-Backend && npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd blogs-frontend && npm start
```

- Frontend: `http://localhost:3000`
- API: `http://localhost:5000/api`

---

## API Quick Reference

| Endpoint            | Method | Auth | Purpose             |
| ------------------- | ------ | ---- | ------------------- |
| `/api/auth/signup`  | POST   | ❌   | Register            |
| `/api/auth/login`   | POST   | ❌   | Login               |
| `/api/articles`     | GET    | ❌   | List articles       |
| `/api/articles/:id` | GET    | ❌   | Get article         |
| `/api/articles`     | POST   | ✅   | Create article      |
| `/api/articles/:id` | PUT    | ✅\* | Update (owner only) |
| `/api/articles/:id` | DELETE | ✅\* | Delete (owner only) |

\*Requires ownership verification

---

## Troubleshooting

| Problem                | Solution                                               |
| ---------------------- | ------------------------------------------------------ |
| MySQL connection fails | Check credentials in `.env`, MySQL service running     |
| Port 5000 in use       | Change `PORT` in `.env` or `taskkill /PID <pid> /F`    |
| JWT token expired      | Clear localStorage: `localStorage.removeItem("token")` |

---

## License

ISC | [GitHub](https://github.com/Ektasinha25/Blogs-Backend)
