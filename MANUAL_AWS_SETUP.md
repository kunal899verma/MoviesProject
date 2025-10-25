# 🚀 Manual AWS Setup Guide

## ⚠️ IMPORTANT: AWS Credentials Issue

The AWS credentials provided seem to have a signature mismatch. Please follow these steps:

## 🔧 Step 1: Get Fresh AWS Credentials

### Option A: Create New IAM User
1. **AWS Console** → **IAM** → **Users** → **Create user**
2. **User name**: `movie-management-deploy`
3. **Access type**: ✅ **Programmatic access**
4. **Attach policies**: 
   - ✅ `AmazonECS_FullAccess`
   - ✅ `AmazonECR_FullAccess`
   - ✅ `IAMFullAccess`
   - ✅ `CloudFormationFullAccess`
   - ✅ `SecretsManagerFullAccess`
   - ✅ `CloudWatchLogsFullAccess`
5. **Create user** → **Download credentials**

### Option B: Use Existing User
1. **AWS Console** → **IAM** → **Users** → **Your User**
2. **Security credentials** tab
3. **Create access key** → **Command Line Interface (CLI)**
4. **Download credentials**

## 🔧 Step 2: Configure AWS CLI

```bash
# Configure with new credentials
aws configure

# Enter the NEW credentials when prompted:
# AWS Access Key ID: [Your new access key]
# AWS Secret Access Key: [Your new secret key]
# Default region name: us-east-1
# Default output format: json
```

## 🔧 Step 3: Test Connection

```bash
# Verify AWS connection works
aws sts get-caller-identity
```

## 🔧 Step 4: Create AWS Resources

### 4.1: Create ECS Service-Linked Role
```bash
aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com
```

### 4.2: Create ECR Repositories
```bash
# Backend repository
aws ecr create-repository \
  --repository-name movie-management-backend \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true

# Frontend repository
aws ecr create-repository \
  --repository-name movie-management-frontend \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true
```

### 4.3: Create ECS Cluster
```bash
aws ecs create-cluster \
  --cluster-name movie-management-cluster \
  --capacity-providers FARGATE \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1
```

### 4.4: Create CloudWatch Log Groups
```bash
aws logs create-log-group --log-group-name /ecs/movie-backend
aws logs create-log-group --log-group-name /ecs/movie-frontend
```

### 4.5: Create IAM Roles

#### ECS Task Execution Role:
```bash
# Create role
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ecs-tasks.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

# Attach policy
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

#### ECS Task Role:
```bash
# Create role
aws iam create-role \
  --role-name ecsTaskRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ecs-tasks.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'
```

### 4.6: Create Secrets Manager Secrets
```bash
# MongoDB URI
aws secretsmanager create-secret \
  --name movie-management/mongodb-uri \
  --description "MongoDB connection string" \
  --secret-string "mongodb+srv://username:password@cluster.mongodb.net/movie-management?retryWrites=true&w=majority"

# JWT Secret
aws secretsmanager create-secret \
  --name movie-management/jwt-secret \
  --description "JWT secret key" \
  --secret-string "your-super-secret-jwt-key-here"
```

## 🔧 Step 5: Update GitHub Secrets

1. **GitHub Repository** → **Settings** → **Secrets and variables** → **Actions**
2. **Update secrets with NEW credentials**:
   - `AWS_ACCESS_KEY_ID`: [Your new access key]
   - `AWS_SECRET_ACCESS_KEY`: [Your new secret key]
   - `AWS_ACCOUNT_ID`: `042692045049`

## 🔧 Step 6: Trigger Deployment

1. **GitHub Repository** → **Actions**
2. **"Deploy to AWS" workflow**
3. **"Re-run jobs"** button

## 📋 Verification Checklist

After running all commands, verify these resources exist:

- ✅ **ECR Repositories**: `movie-management-backend`, `movie-management-frontend`
- ✅ **ECS Cluster**: `movie-management-cluster`
- ✅ **Log Groups**: `/ecs/movie-backend`, `/ecs/movie-frontend`
- ✅ **IAM Roles**: `ecsTaskExecutionRole`, `ecsTaskRole`
- ✅ **Secrets**: `movie-management/mongodb-uri`, `movie-management/jwt-secret`

## 🚨 Troubleshooting

### If credentials still fail:
1. **Double-check** the access key and secret key
2. **Ensure** the IAM user has proper permissions
3. **Try** creating a new IAM user with different credentials

### If resources already exist:
- That's fine! The deployment will use existing resources
- Continue with the GitHub Actions deployment

## 🎯 Expected Result

After completing all steps:
1. **All AWS resources created** ✅
2. **GitHub Actions deployment successful** ✅
3. **Movie Management App live on AWS** ✅

## 🚀 Quick Commands Summary

```bash
# 1. Configure AWS CLI
aws configure

# 2. Test connection
aws sts get-caller-identity

# 3. Create all resources (run these one by one)
aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com
aws ecr create-repository --repository-name movie-management-backend --region us-east-1
aws ecr create-repository --repository-name movie-management-frontend --region us-east-1
aws ecs create-cluster --cluster-name movie-management-cluster
aws logs create-log-group --log-group-name /ecs/movie-backend
aws logs create-log-group --log-group-name /ecs/movie-frontend
aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ecs-tasks.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
aws iam create-role --role-name ecsTaskRole --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ecs-tasks.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
aws secretsmanager create-secret --name movie-management/mongodb-uri --secret-string "mongodb+srv://username:password@cluster.mongodb.net/movie-management?retryWrites=true&w=majority"
aws secretsmanager create-secret --name movie-management/jwt-secret --secret-string "your-super-secret-jwt-key-here"

# 4. Update GitHub secrets with new credentials
# 5. Trigger GitHub Actions deployment
```

**🎬 Your Movie Management App will be live on AWS! 🎬**
