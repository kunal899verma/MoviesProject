# 🎬 Movie Management Application

A full-stack movie management application built with Next.js, NestJS, MongoDB, and deployed on AWS.

## 🌟 Features

- **User Authentication**: JWT-based login/register system
- **Movie Management**: CRUD operations for movies
- **Image Upload**: Poster image upload and management
- **Search & Filter**: Search movies by title and filter by year
- **Pagination**: Efficient pagination for large movie lists
- **Responsive Design**: Mobile-friendly interface
- **Production Ready**: Optimized for production deployment

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom reusable components
- **Authentication**: JWT token management

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport
- **Validation**: Class-validator and DTOs
- **File Upload**: Multer for image handling
- **Security**: Helmet, CORS, input validation

### Database (MongoDB)
- **Collections**: Users, Movies
- **Indexing**: Optimized queries
- **Validation**: Schema validation
- **Security**: User authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/kunal899verma/MoviesProject.git
   cd MoviesProject
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:3001" > .env.local
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/api/docs

## 🐳 Docker Deployment

### Using Docker Compose

1. **Clone and setup**
   ```bash
   git clone https://github.com/kunal899verma/MoviesProject.git
   cd MoviesProject
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - MongoDB: localhost:27017

### Individual Services

**Backend only:**
```bash
cd backend
docker build -t movie-backend .
docker run -p 3001:3001 movie-backend
```

**Frontend only:**
```bash
cd frontend
docker build -t movie-frontend .
docker run -p 3000:3000 movie-frontend
```

## ☁️ AWS Deployment

### Option 1: AWS CloudFormation (Recommended)

1. **Deploy using CloudFormation**
   ```bash
   aws cloudformation create-stack \
     --stack-name movie-management-app \
     --template-body file://aws-deploy.yml \
     --parameters ParameterKey=KeyPairName,ParameterValue=your-key-pair \
     --capabilities CAPABILITY_IAM
   ```

2. **Get the Load Balancer DNS**
   ```bash
   aws cloudformation describe-stacks \
     --stack-name movie-management-app \
     --query 'Stacks[0].Outputs'
   ```

### Option 2: AWS Elastic Beanstalk

1. **Backend Deployment**
   ```bash
   cd backend
   zip -r backend.zip . -x node_modules/\*
   # Upload to Elastic Beanstalk
   ```

2. **Frontend Deployment**
   ```bash
   cd frontend
   npm run build
   zip -r frontend.zip .next public package.json
   # Upload to Elastic Beanstalk
   ```

### Option 3: AWS ECS with Fargate

1. **Build and push Docker images**
   ```bash
   # Build backend
   docker build -t movie-backend ./backend
   docker tag movie-backend:latest your-account.dkr.ecr.region.amazonaws.com/movie-backend:latest
   docker push your-account.dkr.ecr.region.amazonaws.com/movie-backend:latest
   
   # Build frontend
   docker build -t movie-frontend ./frontend
   docker tag movie-frontend:latest your-account.dkr.ecr.region.amazonaws.com/movie-frontend:latest
   docker push your-account.dkr.ecr.region.amazonaws.com/movie-frontend:latest
   ```

2. **Create ECS cluster and services**
   - Use the pushed images in ECS task definitions
   - Configure load balancer and networking

## 🔧 Environment Variables

### Backend (.env)
```bash
MONGODB_URI=mongodb://localhost:27017/movie-management
JWT_SECRET=your-super-secret-jwt-key-here
UPLOAD_DEST=./uploads
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
BACKEND_URL=http://localhost:3001
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - Get movies list (with pagination, search, filter)
- `POST /api/movies` - Create new movie
- `GET /api/movies/:id` - Get movie by ID
- `PATCH /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie
- `POST /api/movies/upload-poster` - Upload movie poster

## 🎨 Design System

### Colors
- Primary: #2BD17E
- Error: #EB5757
- Background: #093545
- Input: #224957
- Card: #092C39

### Typography
- Font: Montserrat
- Headings: 48px-64px
- Body: 14px-20px
- Weights: 400, 500, 600, 700

### Spacing
- Based on 8px grid system
- Responsive breakpoints
- Consistent padding/margins

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive form validation
- **CORS Protection**: Configured for production
- **Helmet Security**: Security headers
- **Password Hashing**: bcrypt encryption
- **Environment Variables**: No hardcoded secrets

## 📊 Performance Optimizations

- **Lazy Loading**: Component-level code splitting
- **Image Optimization**: Next.js Image component
- **Bundle Splitting**: Automatic code splitting
- **Database Indexing**: Optimized MongoDB queries
- **Caching**: Efficient data caching
- **Compression**: Gzip compression enabled

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:coverage
```

## 📈 Monitoring & Logging

### Production Monitoring
- **Health Checks**: Built-in health endpoints
- **Error Tracking**: Comprehensive error handling
- **Performance Metrics**: Response time monitoring
- **Log Management**: Structured logging

### AWS CloudWatch
- Application logs
- Performance metrics
- Error tracking
- Custom dashboards

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to AWS
        run: |
          # Deploy backend
          # Deploy frontend
          # Run tests
```

## 📚 Documentation

- **API Documentation**: Available at `/api/docs` (Swagger)
- **Component Documentation**: Storybook (coming soon)
- **Deployment Guide**: See `PRODUCTION_DEPLOYMENT_GUIDE.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API docs

## 🔗 Links

- **GitHub Repository**: [https://github.com/kunal899verma/MoviesProject](https://github.com/kunal899verma/MoviesProject)
- **Live Demo**: [Coming Soon]
- **API Documentation**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

**Built with ❤️ using Next.js, NestJS, MongoDB, and AWS**

<!-- Updated: 2025-10-24 - Fixed AWS Account ID in task definitions -->