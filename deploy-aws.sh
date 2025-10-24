#!/bin/bash

# AWS Deployment Script for Movie Management Application
# This script deploys both frontend and backend to AWS

echo "🚀 Starting AWS Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install it first."
    exit 1
fi

# Set variables
PROJECT_NAME="movie-management"
AWS_REGION="us-east-1"
ECR_REPOSITORY_BACKEND="movie-backend"
ECR_REPOSITORY_FRONTEND="movie-frontend"

print_status "Building Docker images..."

# Build backend image
print_status "Building backend image..."
cd backend
docker build -t $PROJECT_NAME-backend .
cd ..

# Build frontend image
print_status "Building frontend image..."
cd frontend
docker build -t $PROJECT_NAME-frontend .
cd ..

print_status "Docker images built successfully!"

# Create ECR repositories
print_status "Creating ECR repositories..."

# Backend repository
aws ecr create-repository --repository-name $ECR_REPOSITORY_BACKEND --region $AWS_REGION || print_warning "Backend repository might already exist"

# Frontend repository
aws ecr create-repository --repository-name $ECR_REPOSITORY_FRONTEND --region $AWS_REGION || print_warning "Frontend repository might already exist"

# Get ECR login token
print_status "Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Tag and push backend image
print_status "Tagging and pushing backend image..."
docker tag $PROJECT_NAME-backend:latest $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_BACKEND:latest
docker push $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_BACKEND:latest

# Tag and push frontend image
print_status "Tagging and pushing frontend image..."
docker tag $PROJECT_NAME-frontend:latest $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_FRONTEND:latest
docker push $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_FRONTEND:latest

print_status "Images pushed to ECR successfully!"

# Create deployment instructions
cat > DEPLOYMENT_INSTRUCTIONS.md << EOF
# 🚀 AWS Deployment Instructions

## ECR Repository URLs
- Backend: \`$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_BACKEND:latest\`
- Frontend: \`$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_FRONTEND:latest\`

## Next Steps

### 1. Deploy Backend (EC2/ECS)
\`\`\`bash
# Pull and run backend container
docker pull $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_BACKEND:latest
docker run -d -p 3001:3001 \\
  -e MONGODB_URI=mongodb://your-mongodb-connection-string \\
  -e JWT_SECRET=your-production-jwt-secret \\
  -e NODE_ENV=production \\
  $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_BACKEND:latest
\`\`\`

### 2. Deploy Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set environment variables:
   - \`NEXT_PUBLIC_BACKEND_URL\`: Your backend URL
   - \`BACKEND_URL\`: Your backend URL
3. Deploy

### 3. Database Setup
- Use MongoDB Atlas for production
- Update MONGODB_URI in backend environment

### 4. Domain Configuration
- Set up custom domain for frontend
- Configure CORS in backend for your domain

## Environment Variables

### Backend
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: Strong JWT secret
- NODE_ENV: production
- PORT: 3001

### Frontend
- NEXT_PUBLIC_BACKEND_URL: Backend API URL
- BACKEND_URL: Backend API URL

## Security Checklist
- [ ] Use strong JWT secret
- [ ] Configure CORS properly
- [ ] Set up HTTPS
- [ ] Configure firewall rules
- [ ] Use environment variables for secrets
EOF

print_status "Deployment completed successfully!"
print_status "Check DEPLOYMENT_INSTRUCTIONS.md for next steps"

echo -e "${GREEN}🎉 Deployment process completed!${NC}"
