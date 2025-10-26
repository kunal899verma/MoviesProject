# 🎬 Movie Management Application

A comprehensive full-stack movie management application built with **Next.js 14**, **NestJS**, **MongoDB**, and **TypeScript**. This application demonstrates modern web development practices, responsive design, and production-ready architecture.

## 🌟 Features

### 🔐 **Authentication & Security**
- **JWT-based Authentication** with secure token management
- **User Registration & Login** with form validation
- **Protected Routes** with automatic redirection
- **Password Security** with bcrypt hashing
- **Session Management** with Redux persistence

### 🎭 **Movie Management**
- **Complete CRUD Operations** (Create, Read, Update, Delete)
- **Image Upload** for movie posters with file validation
- **Search Functionality** by movie title
- **Year-based Filtering** with dropdown selection
- **Advanced Pagination** with page navigation
- **Movie Statistics** with analytics dashboard

### 📱 **User Experience**
- **Fully Responsive Design** optimized for all devices
- **Mobile-First Approach** with Tailwind CSS
- **Real-time Form Validation** with Zod schema validation
- **Loading States** and error handling
- **Toast Notifications** for user feedback
- **Accessibility Features** with ARIA labels and semantic HTML

### 🚀 **Performance & Architecture**
- **Server-Side Rendering** with Next.js App Router
- **State Management** with Redux Toolkit
- **Lazy Loading** for optimal performance
- **Image Optimization** with Next.js Image component
- **TypeScript** for type safety
- **API Documentation** with Swagger/OpenAPI

## 🏗️ Technical Architecture

### **Frontend Stack**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Redux Toolkit with RTK Query
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom reusable component library
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### **Backend Stack**
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport.js
- **Validation**: Class-validator and DTOs
- **File Upload**: Multer with local storage
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, input sanitization

### **Database Schema**
- **Users Collection**: Authentication and user management
- **Movies Collection**: Movie data with user relationships
- **Indexing**: Optimized queries for performance
- **Validation**: Mongoose schema validation

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **MongoDB** (local installation or Atlas)
- **npm** or **yarn**

### 1. Clone Repository
```bash
git clone https://github.com/kunal899verma/MoviesProject.git
cd MoviesProject
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment file
cp env.example .env

# Update .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb://localhost:27017/movie-management
# JWT_SECRET=your-super-secret-jwt-key-here

# Start development server
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with backend URL
# NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Start development server
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Documentation**: http://localhost:3001/api/docs

## 🐳 Docker Development

### Using Docker Compose (Recommended)
```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Services
```bash
# Backend only
cd backend
docker build -t movie-backend .
docker run -p 3001:3001 movie-backend

# Frontend only
cd frontend  
docker build -t movie-frontend .
docker run -p 3000:3000 movie-frontend
```

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Movies Endpoints
- `GET /api/movies` - Get movies with pagination, search, and filters
- `POST /api/movies` - Create new movie
- `GET /api/movies/:id` - Get specific movie
- `PATCH /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie
- `POST /api/movies/upload-poster` - Upload movie poster
- `GET /api/movies/stats` - Get user movie statistics

### Query Parameters
```typescript
// Movies list endpoint supports:
{
  page?: number;        // Page number (default: 1)
  limit?: number;       // Items per page (default: 8)
  search?: string;      // Search by movie title
  year?: number;        // Filter by publishing year
}
```

## 🎨 Design System

### Color Palette
```css
Primary: #2BD17E (Green)
Error: #EB5757 (Red)
Background: #093545 (Dark Blue)
Input: #224957 (Blue Gray)
Card: #092C39 (Dark Blue)
```

### Typography
- **Font Family**: Montserrat
- **Headings**: 48px-64px (font-weight: 600-700)
- **Body Text**: 14px-20px (font-weight: 400)
- **Responsive**: Scales down on mobile devices

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

## 🔒 Security Features

### Authentication Security
- **JWT Tokens** with secure secret
- **Password Hashing** with bcrypt
- **Token Expiration** management
- **Protected API Routes**

### Input Validation
- **Frontend Validation** with Zod schemas
- **Backend Validation** with NestJS DTOs
- **File Upload Security** with type and size validation
- **XSS Protection** with input sanitization

### CORS & Headers
- **CORS Configuration** for cross-origin requests
- **Security Headers** with Helmet
- **CSP (Content Security Policy)**

## 📊 Performance Optimizations

### Frontend Optimizations
- **Code Splitting** with dynamic imports
- **Lazy Loading** for components and images
- **Image Optimization** with Next.js Image
- **Bundle Optimization** with automatic splitting
- **Caching Strategies** for API responses

### Backend Optimizations
- **Database Indexing** for faster queries
- **Pagination** to limit response size
- **Query Optimization** with selective fields
- **File Serving** with static asset optimization

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
npm run test:cov       # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm run test           # Jest tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## 🔧 Environment Variables

### Backend (.env)
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/movie-management

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# File Upload
UPLOAD_DEST=./uploads

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# App Configuration
NEXT_PUBLIC_APP_NAME="Movie Management"
NEXT_PUBLIC_APP_DESCRIPTION="Manage your favorite movies with ease"

# Environment
NODE_ENV=development
```

## 📝 Assignment Requirements Compliance

### ✅ **Core Requirements Met**
- **✅ Login Screen** - JWT authentication with validation
- **✅ Movie Display** - Grid layout with responsive design
- **✅ Movie Creation** - Form with image upload
- **✅ Movie Editing** - Update functionality
- **✅ Movie Entity** - Title, Publishing Year, Poster fields
- **✅ Frontend & Backend** - Complete full-stack implementation

### ✅ **Additional Features Implemented**
- **✅ Mobile Responsiveness** - Optimized for all screen sizes
- **✅ Form Validation** - Comprehensive client & server validation
- **✅ Pagination** - Advanced pagination with page numbers
- **✅ State Management** - Redux Toolkit implementation
- **✅ API Documentation** - Swagger/OpenAPI documentation
- **✅ Search & Filter** - Title search and year filtering
- **✅ File Upload** - Secure image upload with validation
- **✅ Error Handling** - Comprehensive error management
- **✅ Loading States** - User feedback during operations
- **✅ Security** - Authentication, authorization, input validation

### 🎯 **Creative Additions**
- **📊 Movie Statistics** - Analytics dashboard with decade breakdown
- **🎨 Custom Design System** - Professional UI with Tailwind CSS
- **♿ Accessibility** - ARIA labels, semantic HTML, keyboard navigation
- **⚡ Performance** - Lazy loading, code splitting, optimizations
- **🔧 Developer Experience** - TypeScript, ESLint, Prettier
- **📱 Progressive Enhancement** - Works without JavaScript
- **🚀 Production Ready** - Docker, environment configs, security headers

## 🚀 Deployment Options

### Local Development
```bash
# Using npm
npm run dev

# Using Docker Compose
docker-compose up
```

### Production Deployment
- **Docker**: Multi-stage builds for optimized images
- **Environment**: Separate configs for dev/staging/production
- **Security**: Production-ready security configurations
- **Monitoring**: Health checks and logging

## 📚 Project Structure

```
MovieProject/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── movies/         # Movies module
│   │   ├── users/          # Users module
│   │   └── main.ts         # Application entry point
│   ├── uploads/            # Uploaded movie posters
│   └── env.example         # Environment template
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and configurations
│   │   └── store/         # Redux state management
│   ├── public/            # Static assets
│   └── .env.example       # Environment template
├── docker-compose.yml     # Local development setup
└── README.md             # Project documentation
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Author

**Kunal Verma**
- **GitHub**: [@kunal899verma](https://github.com/kunal899verma)
- **Repository**: [MoviesProject](https://github.com/kunal899verma/MoviesProject)

## 🔗 Links

- **🌐 Live Demo**: [Coming Soon]
- **📚 API Documentation**: http://localhost:3001/api/docs (when running locally)
- **📱 GitHub Repository**: https://github.com/kunal899verma/MoviesProject

---

**Built with ❤️ using Next.js, NestJS, MongoDB, and modern web technologies**

*This project showcases full-stack development capabilities, responsive design, security best practices, and production-ready architecture.*