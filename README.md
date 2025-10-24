# 🎬 Movie Management Application

A full-stack movie management application built with Next.js, NestJS, and MongoDB.

## 🚀 Live Demo

- **Frontend**: [https://your-frontend-domain.com](https://your-frontend-domain.com)
- **Backend API**: [https://your-backend-domain.com](https://your-backend-domain.com)

## 📋 Features

- **User Authentication**: JWT-based login/register system
- **Movie Management**: CRUD operations for movies
- **Image Upload**: Poster upload functionality
- **Search & Filter**: Search movies by title and filter by year
- **Pagination**: Efficient movie listing with pagination
- **Responsive Design**: Mobile-first responsive UI
- **Real-time Updates**: Dynamic UI updates

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **Zod** - Validation
- **Lucide React** - Icons

### Backend
- **NestJS** - Node.js framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Passport** - Authentication strategy
- **Multer** - File uploads
- **Swagger** - API documentation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Git

### Installation

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
# Update .env with your MongoDB URI and JWT secret
npm run start:dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env.local
# Update .env.local with your backend URL
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/movie-management
JWT_SECRET=your-super-secret-jwt-key-here
UPLOAD_DEST=./uploads
PORT=3001
NODE_ENV=development
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
BACKEND_URL=http://localhost:3001
```

## 📁 Project Structure

```
MoviesProject/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── movies/         # Movies module
│   │   ├── users/          # Users module
│   │   └── main.ts         # Application entry point
│   ├── uploads/            # File uploads directory
│   └── package.json
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable components
│   │   ├── store/         # Redux store
│   │   └── lib/           # Utilities
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - Get movies with pagination
- `POST /api/movies` - Create new movie
- `GET /api/movies/:id` - Get movie by ID
- `PATCH /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie
- `POST /api/movies/upload-poster` - Upload movie poster

## 🎨 Design System

### Colors
- **Primary**: #2BD17E
- **Error**: #EB5757
- **Background**: #093545
- **Input**: #224957
- **Card**: #092C39

### Typography
- **Font**: Montserrat
- **Headings**: 48px-64px
- **Body**: 14px-20px
- **Weights**: 400, 500, 600, 700

## 🚀 Deployment

### AWS Deployment

#### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

#### Backend (AWS EC2/Elastic Beanstalk)
1. Create EC2 instance
2. Install Node.js and MongoDB
3. Clone repository
4. Set environment variables
5. Start application

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📱 Features

### Authentication
- ✅ JWT-based authentication
- ✅ Secure password hashing
- ✅ Protected routes
- ✅ Auto-logout on token expiry

### Movie Management
- ✅ Add new movies
- ✅ Edit movie details
- ✅ Delete movies
- ✅ Upload movie posters
- ✅ Search and filter
- ✅ Pagination

### UI/UX
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Form validation

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- File upload security
- Environment variable protection

## 📊 Performance

- Lazy loading components
- Image optimization
- Bundle splitting
- Database indexing
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Kunal Verma**
- GitHub: [@kunal899verma](https://github.com/kunal899verma)
- Email: kunal@gmail.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NestJS team for the robust backend framework
- MongoDB for the database solution
- All open-source contributors