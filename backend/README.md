# Movie Management Backend

A robust Nest.js backend API for managing user movies with JWT authentication and file upload capabilities.

## 🚀 Features

- **Authentication**: JWT-based user authentication and authorization
- **Movies CRUD**: Complete movie management (Create, Read, Update, Delete)
- **File Upload**: Movie poster image upload with validation
- **Pagination**: Efficient pagination for movie listings
- **Search & Filter**: Search by title and filter by publishing year
- **Validation**: Comprehensive input validation using class-validator
- **Documentation**: Auto-generated Swagger API documentation
- **Database**: MongoDB with Mongoose ODM

## 🛠️ Technology Stack

- **Framework**: Nest.js (Node.js)
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer
- **Password Hashing**: bcrypt

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## 🔧 Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/movie-management
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=3001
   NODE_ENV=development
   ```

4. **Create uploads directory:**
   ```bash
   mkdir uploads
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The API will be available at:
- **API**: http://localhost:3001
- **Swagger Documentation**: http://localhost:3001/api/docs

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Movies
- `GET /api/movies` - Get user movies (with pagination, search, filter)
- `POST /api/movies` - Create new movie
- `GET /api/movies/:id` - Get specific movie
- `PATCH /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie
- `POST /api/movies/upload-poster` - Upload movie poster

### Health Check
- `GET /api/` - API health check
- `GET /api/health` - Detailed health status

## 🔐 Authentication

All movie endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📄 API Documentation

Visit http://localhost:3001/api/docs for interactive Swagger documentation with:
- Detailed endpoint descriptions
- Request/response schemas
- Authentication requirements
- Try-it-out functionality

## 🗂️ Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data Transfer Objects
│   ├── guards/          # Authentication guards
│   ├── strategies/      # Passport strategies
│   └── ...
├── movies/              # Movies module
│   ├── dto/             # Data Transfer Objects
│   ├── schemas/         # Mongoose schemas
│   └── ...
├── users/               # Users module
│   ├── dto/             # Data Transfer Objects
│   ├── schemas/         # Mongoose schemas
│   └── ...
├── app.module.ts        # Root module
└── main.ts              # Application entry point
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/movie-management` |
| `JWT_SECRET` | Secret key for JWT tokens | - |
| `PORT` | Application port | `3001` |
| `NODE_ENV` | Environment mode | `development` |

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- File upload restrictions (images only, 5MB limit)
- CORS protection
- MongoDB injection prevention

## 🚨 Error Handling

The API provides consistent error responses with appropriate HTTP status codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## 🔧 Development

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

### Watch Mode
```bash
npm run start:dev
```

## 📦 Building for Production

```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.
