# NGSkillForge Backend API

A comprehensive REST API for NGSkillForge online learning platform built with Node.js, Express, and MongoDB. Features OTP-based authentication, JWT tokens, course management, enrollments, and file uploads.

## 🚀 Features

✅ **OTP Email Verification** - Secure 6-digit OTP sent to user's email with 5-minute expiry
✅ **JWT Authentication** - Dual-token system (15m access + 7d refresh tokens)
✅ **Role-Based Authorization** - Admin and user roles with fine-grained access control
✅ **Course Management** - Full CRUD operations with pagination and search
✅ **Enrollment System** - Users can enroll in courses with duplicate prevention
✅ **File Uploads** - Upload assignments to courses via Multer + Cloudinary integration
✅ **User Profiles** - Get current user profile and public user lookups
✅ **Security** - Helmet.js, CORS, HTTP-only cookies, bcrypt password hashing
✅ **Rate Limiting** - Express rate-limit middleware (15 req/15 min)
✅ **Logging** - Morgan HTTP request logging
✅ **API Documentation** - Swagger/OpenAPI 3.0 documentation

## 📋 Tech Stack

- **Runtime**: Node.js v20+
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT (jsonwebtoken), Bcryptjs, Nodemailer
- **File Upload**: Multer, Cloudinary
- **Validation**: Express-validator
- **Security**: Helmet, CORS, rate-limit
- **Documentation**: Swagger-ui-express, yamljs
- **Logging**: Morgan, Winston
- **Development**: Nodemon

## 🛠️ Installation

### Prerequisites
- Node.js v20 or higher
- npm or yarn
- MongoDB Atlas account
- Cloudinary account (for file uploads)
- Email service credentials (Gmail, etc.)

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the backend directory:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ngskillforge

# JWT Secrets
JWT_ACCESS_SECRET=your-super-secret-access-token-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-in-production

# JWT Expiry
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Email Configuration (Gmail recommended)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

4. **Start the development server**
```bash
npm run dev
```

The server will start on `http://localhost:5000` and connect to MongoDB.

## 📚 API Documentation

### Access Swagger UI
Once the server is running, visit:
```
http://localhost:5000/api-docs
```

### Base URL
```
http://localhost:5000
```

## 🔐 Authentication Flow

### 1. Send OTP
```bash
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 2. Verify OTP & Register
```bash
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepass123",
  "otp": "123456"
}
```

### 3. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}
```
Response includes access and refresh tokens as HTTP-only cookies.

### 4. Refresh Token
```bash
POST /api/auth/refresh-token
```

### 5. Logout
```bash
POST /api/auth/logout
```

## 📖 API Endpoints

### Health Check
- `GET /` - Server health check
- `GET /api/health` - API health status

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP & register
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Get new access token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:userId` - Get public user profile

### Courses
- `POST /api/v1/courses` - Create course (admin only)
- `GET /api/v1/courses` - List courses (pagination, search, sort)
- `GET /api/v1/courses/:id` - Get single course
- `PATCH /api/v1/courses/:id` - Update course (admin only)
- `DELETE /api/v1/courses/:id` - Delete course (admin only)

### Enrollments
- `POST /api/v1/enrollments` - Enroll in course
- `GET /api/v1/enrollments/my` - Get my enrollments

### Assignments
- `POST /api/v1/assignments/upload` - Upload assignment
- `GET /api/v1/assignments/my` - Get my assignments

## 📝 Query Parameters

### Pagination
```
?page=1&limit=10
```

### Sorting (Courses)
```
?sort=latest    # newest first
?sort=oldest    # oldest first
```

### Search (Courses)
```
?search=React   # case-insensitive title search
```

## 🧪 Testing with Postman

1. Import the Postman collection: `NGSkillForge.postman_collection.json`
2. Set the `baseUrl` environment variable to `http://localhost:5000`
3. Follow the authentication flow:
   - Send OTP
   - Verify OTP & Register
   - Login (tokens auto-saved)
   - Test other endpoints

### Complete Test Flow

```bash
# 1. Start server
npm run dev

# 2. In another terminal, send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check email for OTP code (e.g., 123456)

# 3. Register with OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "name":"Test User",
    "password":"Test@123",
    "otp":"123456"
  }' \
  -c cookies.txt

# 4. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}' \
  -c cookies.txt

# 5. Get profile
curl -X GET http://localhost:5000/api/users/me -b cookies.txt

# 6. Create course (admin only)
curl -X POST http://localhost:5000/api/v1/courses \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"React Basics","description":"Learn React fundamentals"}'

# 7. List courses
curl -X GET "http://localhost:5000/api/v1/courses?page=1&search=React&sort=latest"
```

## 🔒 Security Features

- **Password Hashing**: Bcryptjs with automatic salt generation
- **JWT Tokens**: Separate secrets for access and refresh tokens
- **HTTP-Only Cookies**: Tokens stored in secure, HTTP-only cookies
- **CORS**: Configured with appropriate origins
- **Helmet**: Sets security HTTP headers
- **Rate Limiting**: 15 requests per 15 minutes per IP
- **Input Validation**: Express-validator on all endpoints
- **Error Handling**: Comprehensive error middleware with proper status codes

## 📊 Database Schema

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: "user", "admin", default: "user"),
  isVerified: Boolean (default: false),
  timestamps: true
}
```

### Course
```javascript
{
  title: String (required),
  description: String (required),
  instructor: ObjectId (ref: User),
  timestamps: true
}
```

### Enrollment
```javascript
{
  user: ObjectId (ref: User, required),
  course: ObjectId (ref: Course, required),
  timestamps: true
}
```

### Assignment
```javascript
{
  user: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  fileUrl: String (required, Cloudinary URL),
  publicId: String (required, Cloudinary public ID),
  timestamps: true
}
```

### OTP
```javascript
{
  email: String,
  otp: String,
  expireAt: Date (TTL index auto-deletes after 5 minutes),
  timestamps: true
}
```

## 🚨 Error Handling

All errors return consistent JSON format:
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Common Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🔄 Middleware Stack

1. CORS - Enable cross-origin requests
2. Helmet - Security headers
3. Morgan - HTTP request logging
4. Express.json() - Parse JSON bodies
5. Cookie Parser - Parse cookies
6. Rate Limiter - Limit requests per IP
7. Routes - Application routes
8. Error Middleware - Global error handler

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify MONGODB_URI in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure correct username/password

### OTP Not Sending
- Verify EMAIL_USER and EMAIL_PASS in `.env`
- For Gmail, use an app-specific password
- Check email provider spam folder

### File Upload Issues
- Verify Cloudinary credentials in `.env`
- Check file size (max 5MB)
- Allowed formats: PDF, PNG, JPEG

### Token Validation Error
- Clear browser cookies
- Ensure JWT secrets match between token generation and validation
- Check token expiration

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route handlers
│   ├── docs/           # API documentation (Swagger)
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic (email, OTP, etc.)
│   ├── utils/          # Utilities (errors, responses, helpers)
│   ├── validators/     # Input validation rules
│   └── uploads/        # Temporary file storage
├── tests/              # Test files
├── app.js              # Express app setup
├── server.js           # Server entry point
├── package.json        # Dependencies
└── .env                # Environment variables
```

## 🚀 Deployment

### Environment Setup for Production
Update `.env` for production:
```env
NODE_ENV=production
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
# Set appropriate CORS origins
# Use production MongoDB cluster
```

### Recommended Deployment Platforms
- Heroku
- Render
- Railway
- DigitalOcean
- AWS EC2

## 📄 API Response Examples

### Success Response
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isVerified": true
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid credentials",
  "statusCode": 401
}
```

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Email: support@ngskillforge.com
- Documentation: http://localhost:5000/api-docs

## 📄 License

ISC License - feel free to use and modify

## ✨ Contributors

- NGSkillForge Development Team

---

**Happy coding! 🎉**
