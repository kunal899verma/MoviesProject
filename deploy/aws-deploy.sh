#!/bin/bash

# AWS Deployment Script for Movie Management Application
# This script deploys the backend to AWS EC2

set -e

echo "🚀 Starting AWS deployment..."

# Configuration
EC2_INSTANCE_IP="your-ec2-ip"
EC2_USER="ec2-user"
KEY_PATH="your-key.pem"
APP_NAME="movie-management"
BACKEND_DIR="/home/ec2-user/movie-management/backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Preparing deployment package...${NC}"

# Create deployment package
tar -czf movie-management-backend.tar.gz backend/

echo -e "${YELLOW}📤 Uploading to EC2 instance...${NC}"

# Upload to EC2
scp -i $KEY_PATH movie-management-backend.tar.gz $EC2_USER@$EC2_INSTANCE_IP:/home/$EC2_USER/

echo -e "${YELLOW}🔧 Setting up on EC2 instance...${NC}"

# SSH into EC2 and setup
ssh -i $KEY_PATH $EC2_USER@$EC2_INSTANCE_IP << 'EOF'
    # Update system
    sudo yum update -y
    
    # Install Node.js 18
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
    
    # Install PM2 globally
    sudo npm install -g pm2
    
    # Install MongoDB
    sudo yum install -y mongodb-server
    sudo systemctl start mongod
    sudo systemctl enable mongod
    
    # Create application directory
    mkdir -p /home/ec2-user/movie-management
    cd /home/ec2-user/movie-management
    
    # Extract application
    tar -xzf movie-management-backend.tar.gz
    
    # Install dependencies
    cd backend
    npm install --production
    
    # Create environment file
    cat > .env << EOL
MONGODB_URI=mongodb://localhost:27017/movie-management
JWT_SECRET=your-super-secret-jwt-key-here
UPLOAD_DEST=./uploads
PORT=3001
NODE_ENV=production
EOL
    
    # Create uploads directory
    mkdir -p uploads
    
    # Build application
    npm run build
    
    # Start with PM2
    pm2 start dist/main.js --name "movie-management-api"
    pm2 save
    pm2 startup
    
    # Configure firewall
    sudo firewall-cmd --permanent --add-port=3001/tcp
    sudo firewall-cmd --reload
    
    echo "✅ Backend deployment completed!"
EOF

echo -e "${GREEN}🎉 AWS deployment completed successfully!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Update your frontend environment variables"
echo "2. Configure your domain name"
echo "3. Set up SSL certificates"
echo "4. Configure MongoDB Atlas for production"
