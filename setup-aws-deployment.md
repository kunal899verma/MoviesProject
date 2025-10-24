# 🚀 AWS Deployment Setup Guide

## GitHub से AWS तक Automatic Deployment Setup

### Step 1: AWS Account Setup

#### 1.1 AWS Account बनाएं
```bash
# AWS CLI install करें
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# AWS configure करें
aws configure
```

#### 1.2 Required AWS Services Enable करें
- **ECS (Elastic Container Service)**
- **ECR (Elastic Container Registry)**
- **CloudFormation**
- **Secrets Manager**
- **CloudWatch Logs**
- **IAM (Identity and Access Management)**

### Step 2: AWS Infrastructure Deploy करें

#### 2.1 CloudFormation Stack Deploy करें
```bash
# Infrastructure deploy करें
aws cloudformation create-stack \
  --stack-name movie-management-infrastructure \
  --template-body file://aws-infrastructure.yml \
  --capabilities CAPABILITY_IAM \
  --parameters ParameterKey=DomainName,ParameterValue=yourdomain.com
```

#### 2.2 Stack Status Check करें
```bash
# Stack status देखें
aws cloudformation describe-stacks \
  --stack-name movie-management-infrastructure \
  --query 'Stacks[0].StackStatus'
```

### Step 3: GitHub Secrets Setup करें

#### 3.1 GitHub Repository में जाएं
1. **GitHub Repository**: [https://github.com/kunal899verma/MoviesProject](https://github.com/kunal899verma/MoviesProject)
2. **Settings** → **Secrets and variables** → **Actions**

#### 3.2 Required Secrets Add करें
```bash
# GitHub Secrets में add करें:
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

### Step 4: ECR Repositories Setup करें

#### 4.1 ECR Repositories Create करें
```bash
# Backend repository
aws ecr create-repository \
  --repository-name movie-management-backend \
  --region us-east-1

# Frontend repository  
aws ecr create-repository \
  --repository-name movie-management-frontend \
  --region us-east-1
```

#### 4.2 ECR Login करें
```bash
# ECR login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

### Step 5: Task Definitions Update करें

#### 5.1 Account ID Replace करें
```bash
# Task definition files में YOUR_ACCOUNT_ID replace करें
sed -i 's/YOUR_ACCOUNT_ID/YOUR_ACTUAL_ACCOUNT_ID/g' .aws/task-definition-backend.json
sed -i 's/YOUR_ACCOUNT_ID/YOUR_ACTUAL_ACCOUNT_ID/g' .aws/task-definition-frontend.json
```

#### 5.2 Domain Name Update करें
```bash
# Frontend task definition में domain update करें
sed -i 's/yourdomain.com/YOUR_ACTUAL_DOMAIN/g' .aws/task-definition-frontend.json
```

### Step 6: ECS Services Create करें

#### 6.1 Backend Service Create करें
```bash
# Backend service create करें
aws ecs create-service \
  --cluster movie-management-cluster \
  --service-name movie-backend-service \
  --task-definition movie-backend-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345,subnet-67890],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

#### 6.2 Frontend Service Create करें
```bash
# Frontend service create करें
aws ecs create-service \
  --cluster movie-management-cluster \
  --service-name movie-frontend-service \
  --task-definition movie-frontend-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345,subnet-67890],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

### Step 7: Load Balancer Setup करें

#### 7.1 Target Groups Create करें
```bash
# Backend target group
aws elbv2 create-target-group \
  --name movie-backend-tg \
  --protocol HTTP \
  --port 3001 \
  --vpc-id vpc-12345 \
  --target-type ip \
  --health-check-path /api

# Frontend target group
aws elbv2 create-target-group \
  --name movie-frontend-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-12345 \
  --target-type ip \
  --health-check-path /
```

#### 7.2 Load Balancer Listeners Create करें
```bash
# Backend listener (port 3001)
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:loadbalancer/app/MovieApp-ALB/ID \
  --protocol HTTP \
  --port 3001 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:targetgroup/movie-backend-tg/ID

# Frontend listener (port 80)
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:loadbalancer/app/MovieApp-ALB/ID \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:targetgroup/movie-frontend-tg/ID
```

### Step 8: MongoDB Atlas Setup करें

#### 8.1 MongoDB Atlas Account बनाएं
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) पर जाएं
2. Free cluster create करें
3. Database user create करें
4. Network access allow करें

#### 8.2 Connection String Update करें
```bash
# Secrets Manager में MongoDB URI update करें
aws secretsmanager update-secret \
  --secret-id movie-management/mongodb-uri \
  --secret-string "mongodb+srv://username:password@cluster.mongodb.net/movie-management?retryWrites=true&w=majority"
```

### Step 9: Domain और SSL Setup करें

#### 9.1 Route 53 Domain Setup करें
```bash
# Hosted zone create करें
aws route53 create-hosted-zone \
  --name yourdomain.com \
  --caller-reference $(date +%s)
```

#### 9.2 SSL Certificate Request करें
```bash
# ACM certificate request करें
aws acm request-certificate \
  --domain-name yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

### Step 10: GitHub Actions Test करें

#### 10.1 Code Push करें
```bash
# Code commit और push करें
git add .
git commit -m "Add AWS deployment configuration"
git push origin main
```

#### 10.2 GitHub Actions Monitor करें
1. **GitHub Repository** → **Actions** tab
2. **Deploy to AWS** workflow देखें
3. **Build और Deploy** process monitor करें

### Step 11: Production URLs

#### 11.1 Application URLs
- **Frontend**: `http://your-load-balancer-dns`
- **Backend API**: `http://your-load-balancer-dns:3001`
- **API Documentation**: `http://your-load-balancer-dns:3001/api/docs`

#### 11.2 Health Checks
```bash
# Frontend health check
curl http://your-load-balancer-dns/

# Backend health check  
curl http://your-load-balancer-dns:3001/api
```

## 🔧 Troubleshooting

### Common Issues:

#### 1. ECR Login Issues
```bash
# ECR login fix करें
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

#### 2. Task Definition Issues
```bash
# Task definition validate करें
aws ecs describe-task-definition --task-definition movie-backend-task
```

#### 3. Service Health Issues
```bash
# Service status check करें
aws ecs describe-services \
  --cluster movie-management-cluster \
  --services movie-backend-service movie-frontend-service
```

#### 4. Logs Check करें
```bash
# CloudWatch logs देखें
aws logs describe-log-groups --log-group-name-prefix /ecs/movie
```

## 📊 Monitoring और Maintenance

### 1. CloudWatch Dashboard
- **ECS Service Metrics**
- **Application Load Balancer Metrics**
- **CloudWatch Logs**

### 2. Cost Optimization
- **Fargate Spot Instances** use करें
- **Auto Scaling** configure करें
- **Resource Monitoring** करें

### 3. Security Best Practices
- **Secrets Manager** use करें
- **IAM Roles** properly configure करें
- **Security Groups** restrict करें

## 🎉 Success Checklist

- [ ] AWS Infrastructure deployed
- [ ] GitHub Secrets configured
- [ ] ECR Repositories created
- [ ] ECS Services running
- [ ] Load Balancer configured
- [ ] MongoDB Atlas connected
- [ ] Domain and SSL setup
- [ ] GitHub Actions working
- [ ] Application accessible
- [ ] Health checks passing

**🚀 आपका Movie Management Application अब AWS पर live है! 🚀**
