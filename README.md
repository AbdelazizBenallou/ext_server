# 🚀 ext_server – Secure Educational Management API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/DB-PostgreSQL-blue.svg)](https://www.postgresql.org/)
[![Cache](https://img.shields.io/badge/Cache-Redis-red.svg)](https://redis.io/)
[![Storage](https://img.shields.io/badge/Storage-Minio-orange.svg)](https://min.io/)
[![Security](https://img.shields.io/badge/Security-Argon2%20%7C%20JWT-blueviolet.svg)](https://github.com/ranisalt/node-argon2)

## 📖 Overview

**ext_server** is a production-grade, secure RESTful API designed for managing educational structures, modules, and file distributions. Built with **Node.js** and **Express**, it emphasizes **security**, **performance**, and **scalability**.

The system handles complex academic relationships (Study Levels → Semesters → Modules → Files) while ensuring data integrity through **Sequelize ORM** and high-speed retrieval via **Redis caching**. File storage is offloaded to **Minio (S3-compatible)** with presigned URL generation for secure downloads.

> **"Security is not an feature, it's a foundation."**  
> This API implements industry-standard security practices including **Argon2id password hashing**, **JWT rotation**, **Rate Limiting**, and **HTTP Header Hardening**.

---

## 🛠 Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js | Server Environment |
| **Framework** | Express.js | HTTP Server & Routing |
| **Database** | PostgreSQL | Relational Data Storage |
| **ORM** | Sequelize | Database Modeling & Relations |
| **Cache** | Redis (ioredis) | High-speed Data Caching |
| **Storage** | Minio | Object Storage (S3 Compatible) |
| **Auth** | JWT (Access + Refresh) | Stateless Authentication |
| **Hashing** | Argon2id | Password Security |
| **Security** | Helmet, HPP, CORS | HTTP Hardening |
| **Validation** | Validator, Custom Logic | Input Sanitization |

---

## 🏗 System Architecture

```
┌─────────────┐      HTTPS       ┌─────────────────────────────────┐
│   Client    │ ◄──────────────► │           ext_server            │
│ (Web/Mobile)│                  │  (Node.js + Express)            │
└─────────────┘                  └───────────────┬─────────────────┘
                                                 │
                     ┌───────────────────────────┼───────────────────────────┐
                     │                           │                           │
                     ▼                           ▼                           ▼
            ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
            │   PostgreSQL    │         │      Redis      │         │      Minio      │
            │   (Persistent)  │         │   (Cache/TTL)   │         │  (File Storage) │
            └─────────────────┘         └─────────────────┘         └─────────────────┘
```

### 🔐 Security Flow
1.  **Login:** User credentials validated against Argon2 hash.
2.  **Tokens:** Access Token (15m) + Refresh Token (14d) issued.
3.  **Refresh:** Access token rotated using Refresh token (with revocation tracking).
4.  **Access:** Protected routes require valid Bearer Token.
5.  **Audit:** Every login recorded in `login_history` with IP, User-Agent, and Device ID.

---

## 🗂 Repository Structure

```text
ext_server/
├── src/
│   ├── config/             # Database, Redis, Minio configurations
│   ├── controllers/        # Request handlers (Logic separation)
│   ├── middlewere/         # Auth, Error Handling, Rate Limiting
│   ├── models/             # Sequelize ORM Definitions (14 Models)
│   ├── routes/             # API Endpoint Definitions
│   ├── services/           # Business Logic & Cache Management
│   ├── utils/              # Helpers (JWT, Hashing, Response formatting)
│   └── index.js            # Entry Point
├── .env                    # Environment Variables (Not committed)
├── package.json            # Dependencies & Scripts
└── README.md
```

---

## 🗄️ Database Schema

The system uses a normalized relational schema with **14 core models**:

| Model | Description | Key Relationships |
|-------|-------------|-------------------|
| `User` | Authentication credentials | HasOne `Profile`, HasMany `ModuleFiles` |
| `Profile` | User personal details | BelongsTo `User`, `StudyLevel`, `Specialization` |
| `StudyLevel` | Academic Level (e.g., License, Master) | HasMany `Semester`, `Specialization` |
| `Semester` | Academic Term | BelongsTo `StudyLevel`, HasMany `Module` |
| `Module` | Course Unit | BelongsTo `Semester`, BelongsToMany `FileType` |
| `FileType` | Allowed File Types (PDF, ZIP, etc.) | BelongsToMany `Module` |
| `ModuleFiles` | Uploaded Content | BelongsTo `Module`, `User`, `FileType`, `StudyYear` |
| `Specialization` | Major/Track | BelongsTo `StudyLevel`, HasMany `Profile` |
| `Requests` | Contact/Support Forms | Standalone (Public) |
| `LoginHistory` | Security Audit Log | BelongsTo `User` |
| `RefreshTokens` | Token Blacklist/Store | BelongsTo `User` |

---

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/v1/login` | Public | Login (Returns Access + Refresh Token) |
| `POST` | `/api/v1/refresh` | Public | Refresh Access Token |
| `POST` | `/api/v1/logout` | Public | Revoke Refresh Token |

### 🎓 Academic Structure
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/v1/studyYear` | Authenticated | Get all study years (Cached) |
| `GET` | `/api/v1/studyYear/:id` | Authenticated | Get specific study year |
| `GET` | `/api/v1/studyLevel/:id/semesters` | Authenticated | Get semesters for a level |
| `GET` | `/api/v1/semesters/:id/modules` | Authenticated | Get modules for a semester |
| `GET` | `/api/v1/modules/:id/filesTypes` | Authenticated | Get allowed file types for module |

### 📂 File Management
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/v1/studyYear/:yId/modules/:mId/fileTypes/:fId/files` | Authenticated | List files (Cached) |
| `GET` | `/api/v1/.../files/:fileId/download` | Public* | Get Presigned Download URL |

*\*Download endpoint uses presigned URLs valid for 1 hour.*

### 📬 Public Services
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/v1/request` | Public | Submit support/contact request (Rate Limited) |

---

## 🔐 Security Implementation Details

### 1. Password Hashing (Argon2id)
Passwords are never stored in plaintext. Argon2id is used for memory-hard hashing.
```javascript
// src/services/user_ser.js
const isValid = await argon2.verify(user.password_hash, password);
```

### 2. JWT Strategy
*   **Access Token:** Short-lived (15 minutes).
*   **Refresh Token:** Long-lived (14 days), stored in DB with hash.
*   **Revocation:** Logout invalidates the refresh token in the database.

### 3. Rate Limiting
Configured per endpoint to prevent brute-force and abuse.
```javascript
// src/middlewere/rateLimiter.js
loginLimiter: 5 requests / 15 mins
downloadLimiter: 30 requests / 10 mins
singleRequestPerHourLimiter: 1 request / 1 hour (Contact Form)
```

### 4. HTTP Hardening
*   **Helmet:** Sets secure HTTP headers (X-Content-Type-Options, etc.).
*   **HPP:** Protects against Parameter Pollution.
*   **CORS:** Configured for cross-origin requests.

---

## 🚀 Installation & Configuration

### Prerequisites
*   Node.js (v14+)
*   PostgreSQL (v12+)
*   Redis (v6+)
*   Minio Server

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/ext_server.git
cd ext_server
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Server
DEFAULT_PORT=3000

# Database (PostgreSQL)
DB_NAME=salah_ben
DB_USER=admin
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Minio (Object Storage)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# JWT Secrets (Use strong random strings)
ACCESS_JWT_SECRET=your_access_secret
REFRESH_JWT_SECRET=your_refresh_secret
```

### 3. Database Migration
Ensure your PostgreSQL database matches the Sequelize models. You may need to run a migration script or sync manually:
```javascript
// In a temporary script
sequelize.sync({ alter: true });
```

### 4. Run Server
```bash
npm start
```
Server will start on `http://127.0.0.1:3000`.

---

## 🧪 Testing & Verification

### Check Database Connection
```bash
# Server logs should show:
✅ Database connection has been established successfully.
✅ Connected to Redis: Redis is connected ✅
```

### Test Login Endpoint
```bash
curl -X POST http://127.0.0.1:3000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepassword"}'
```

### Test Protected Route
```bash
curl -X GET http://127.0.0.1:3000/api/v1/studyYear \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Redis connection error` | Ensure Redis server is running on port 6379. |
| `Database connection failed` | Check `.env` credentials and PostgreSQL service status. |
| `Minio access denied` | Verify `MINIO_ACCESS_KEY` and bucket permissions. |
| `JWT Invalid` | Ensure Access Token is not expired; use Refresh Token endpoint. |
| `Rate Limit Exceeded` | Wait for the window to reset (e.g., 15 mins for login). |

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
*   [ ] Add Swagger/OpenAPI documentation.
*   [ ] Implement Unit Tests (Jest/Mocha).
*   [ ] Add Email Verification for user registration.
*   [ ] Implement File Upload Endpoint (currently assumes files exist in Minio).

### How to Contribute
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**.

**Copyright (c) 2025 Abdelaziz Benallou**

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 📬 Contact & Support

For questions regarding API endpoints, database schema, or deployment:
*   📧 Open an issue on the repository.
*   📖 Review the `src/controllers` directory for endpoint logic.
*   🔍 Check the `src/middlewere` for security configurations.

**Happy Coding!** 🚀💻
