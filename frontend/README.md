# Movie Management Frontend

A modern Next.js frontend application for managing your favorite movies with a beautiful, responsive UI built with Tailwind CSS.

## 🚀 Features

- **Authentication**: Secure login/registration with JWT tokens
- **Movie Management**: Create, read, update, and delete movies
- **Image Upload**: Upload and manage movie posters
- **Search & Filter**: Find movies by title and filter by year
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Updates**: State management with Redux Toolkit
- **Form Validation**: Comprehensive validation with Zod and React Hook Form
- **Modern UI**: Beautiful design inspired by streaming platforms

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **UI Components**: Custom components with Lucide React icons
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on port 3001

## 🔧 Installation

1. **Clone and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   cp env.example .env.local
   ```
   
   Update the `.env.local` file with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_NAME="Movie Management"
   NEXT_PUBLIC_APP_DESCRIPTION="Manage your favorite movies with ease"
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

The application will be available at http://localhost:3000

## 📱 Features Overview

### Authentication
- **Login Page**: Secure authentication with email/password
- **Registration**: Create new user accounts
- **Protected Routes**: Automatic redirects for unauthenticated users
- **Persistent Sessions**: Remember user login state

### Movie Management
- **Movie List**: Grid view of all user movies with pagination
- **Empty State**: Beautiful empty state when no movies exist
- **Search**: Real-time search by movie title
- **Filter**: Filter movies by publishing year
- **Create Movie**: Add new movies with poster upload
- **Edit Movie**: Update existing movie information
- **Delete Movie**: Remove movies with confirmation modal

### User Experience
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success and error notifications
- **Form Validation**: Real-time validation with helpful error messages

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── login/             # Authentication pages
│   ├── movies/            # Movie management pages
│   │   ├── create/        # Create movie page
│   │   └── [id]/edit/     # Edit movie page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (redirects)
│   ├── providers.tsx      # App providers
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── movies/           # Movie-specific components
│   ├── providers/        # Context providers
│   └── ui/               # UI components
├── lib/                   # Utility functions
│   ├── api.ts            # API client
│   ├── utils.ts          # Helper functions
│   └── validations.ts    # Form schemas
└── store/                # Redux store
    ├── slices/           # Redux slices
    └── hooks.ts          # Typed hooks
```

## 🎨 Design System

### Colors
- **Background**: Deep teal gradient (#093545 to #224957)
- **Primary**: Green accent (#22c55e)
- **Cards**: Semi-transparent backgrounds
- **Text**: White with various opacity levels

### Components
- **Buttons**: Primary, secondary, ghost, and danger variants
- **Inputs**: Clean, focused design with error states
- **Cards**: Elevated design with hover effects
- **Modals**: Backdrop blur with smooth animations

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

## 🔐 Authentication Flow

1. User visits the app
2. If not authenticated, redirected to `/login`
3. After successful login, JWT token stored in localStorage
4. Protected routes check authentication state
5. Automatic logout on token expiration

## 📝 API Integration

The frontend communicates with the backend API through:

- **Axios interceptors**: Automatic token attachment and error handling
- **Redux async thunks**: Centralized API state management
- **Error boundaries**: Graceful error handling
- **Loading states**: User feedback during API calls

## 🎯 Key Features Implementation

### Image Upload
- Drag & drop functionality
- File validation (type, size)
- Preview with removal option
- Progress indicators

### Search & Pagination
- Debounced search input
- URL-based pagination
- Filter combinations
- Results count display

### Form Validation
- Real-time validation
- Custom error messages
- Type-safe schemas
- Accessibility compliance

## 🚨 Error Handling

- **Network Errors**: Automatic retry with user notification
- **Validation Errors**: Inline form error display
- **Authentication Errors**: Automatic logout and redirect
- **404 Errors**: Graceful fallbacks for missing resources

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: Tailored layouts for different screen sizes
- **Touch-friendly**: Large tap targets and smooth interactions
- **Performance**: Optimized images and lazy loading

## 🔧 Development

### Adding New Features
1. Create components in appropriate directories
2. Add Redux slices for state management
3. Implement API integration
4. Add proper TypeScript types
5. Include form validation schemas

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- TypeScript for type safety
- Component composition patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add proper TypeScript types
5. Test thoroughly
6. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED License.
