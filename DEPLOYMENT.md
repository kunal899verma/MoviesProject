# 🚀 Deployment Guide

This guide covers deploying the Movie Management Application to AWS and Vercel.

## 📋 Prerequisites

### Required Accounts
- [AWS Account](https://aws.amazon.com/) - For backend hosting
- [Vercel Account](https://vercel.com/) - For frontend hosting
- [MongoDB Atlas](https://www.mongodb.com/atlas) - For database hosting
- [GitHub Account](https://github.com/) - For code repository

### Required Tools
- AWS CLI
- Vercel CLI
- Git
- Node.js 18+

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Vercel)      │◄──►│   (AWS EC2)     │◄──►│   (MongoDB      │
│   Next.js       │    │   NestJS        │    │    Atlas)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Deployment Steps

### 1. Backend Deployment (AWS EC2)

#### Step 1.1: Launch EC2 Instance
```bash
# Launch EC2 instance with:
# - Instance Type: t3.medium (2 vCPU, 4 GB RAM)
# - OS: Amazon Linux 2
# - Security Group: Allow HTTP (80), HTTPS (443), SSH (22), Custom (3001)
# - Key Pair: Create and download .pem file
```

#### Step 1.2: Configure EC2 Instance
```bash
# Connect to EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Git
sudo yum install -y git
```

#### Step 1.3: Deploy Application
```bash
# Clone repository
git clone https://github.com/kunal899verma/MoviesProject.git
cd MoviesProject

# Install dependencies
cd backend
npm install --production

# Create environment file
cat > .env << EOL
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie-management
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
```

#### Step 1.4: Configure Nginx (Optional)
```bash
# Install Nginx
sudo yum install -y nginx

# Configure Nginx
sudo nano /etc/nginx/conf.d/movie-management.conf
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Frontend Deployment (Vercel)

#### Step 2.1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2.2: Deploy to Vercel
```bash
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Step 2.3: Configure Environment Variables
In Vercel Dashboard:
- `NEXT_PUBLIC_BACKEND_URL`: https://your-api-domain.com
- `BACKEND_URL`: https://your-api-domain.com

### 3. Database Setup (MongoDB Atlas)

#### Step 3.1: Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Choose AWS as provider
4. Select region closest to your EC2 instance

#### Step 3.2: Configure Network Access
1. Add your EC2 IP address to whitelist
2. Add 0.0.0.0/0 for development (remove in production)

#### Step 3.3: Create Database User
1. Go to Database Access
2. Create a new user with read/write permissions
3. Note down username and password

#### Step 3.4: Get Connection String
1. Go to Clusters
2. Click "Connect"
3. Choose "Connect your application"
4. Copy connection string
5. Replace `<password>` with your user password

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie-management
JWT_SECRET=your-super-secret-jwt-key-here
UPLOAD_DEST=./uploads
PORT=3001
NODE_ENV=production
```

### Frontend (Vercel Environment Variables)
```env
NEXT_PUBLIC_BACKEND_URL=https://your-api-domain.com
BACKEND_URL=https://your-api-domain.com
```

## 🔒 Security Configuration

### SSL Certificates
```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

### Firewall Configuration
```bash
# Configure firewall
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

## 📊 Monitoring & Logs

### PM2 Monitoring
```bash
# View logs
pm2 logs movie-management-api

# Monitor processes
pm2 monit

# Restart application
pm2 restart movie-management-api
```

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs movie-management-api

# Restart application
pm2 restart movie-management-api
```

#### 2. Database Connection Issues
- Check MongoDB Atlas network access
- Verify connection string
- Check firewall settings

#### 3. Frontend Build Issues
- Check environment variables in Vercel
- Verify API endpoints are accessible
- Check CORS configuration

## 📈 Performance Optimization

### Backend Optimization
```bash
# Enable PM2 cluster mode
pm2 start dist/main.js -i max --name "movie-management-api"

# Monitor performance
pm2 monit
```

### Frontend Optimization
- Enable Vercel Analytics
- Configure CDN
- Optimize images
- Enable compression

## 🔄 CI/CD Pipeline

The repository includes GitHub Actions for automated deployment:

1. **Push to main branch** triggers deployment
2. **Tests run** automatically
3. **Backend deploys** to AWS EC2
4. **Frontend deploys** to Vercel

### Required Secrets
Add these to GitHub repository secrets:

- `EC2_HOST`: Your EC2 instance IP
- `EC2_USER`: ec2-user
- `EC2_SSH_KEY`: Your private key
- `VERCEL_TOKEN`: Your Vercel token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## 📝 Post-Deployment Checklist

- [ ] Backend API accessible
- [ ] Frontend application loading
- [ ] Database connection working
- [ ] Authentication flow working
- [ ] File uploads working
- [ ] SSL certificates configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented

## 🆘 Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test API endpoints
4. Check database connectivity
5. Review security group settings

---

**🎬 Happy Deploying! 🚀**
