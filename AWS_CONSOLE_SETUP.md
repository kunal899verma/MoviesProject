# 🚀 AWS Console Manual Setup Guide

## ⚠️ AWS CLI Credentials Issue

The AWS credentials are not working with CLI. Let's create all resources manually through the AWS Console.

## 🔧 Step-by-Step Manual Setup

### **Step 1: Create ECR Repositories**

1. **AWS Console** → **ECR** → **Repositories** → **Create repository**

#### Backend Repository:
- **Repository name**: `movie-management-backend`
- **Region**: `us-east-1` (N. Virginia)
- **Scan on push**: ✅ **Enable**
- **Create repository**

#### Frontend Repository:
- **Repository name**: `movie-management-frontend`
- **Region**: `us-east-1` (N. Virginia)
- **Scan on push**: ✅ **Enable**
- **Create repository**

### **Step 2: Create ECS Service-Linked Role**

**⚠️ IMPORTANT**: The `AWSServiceRoleForECS` role is automatically created by AWS when you create an ECS cluster. You don't need to create it manually.

**Skip this step** - the service-linked role will be created automatically in Step 3 when you create the ECS cluster.

### **Step 3: Create ECS Cluster**

1. **AWS Console** → **ECS** → **Clusters** → **Create cluster**
2. **Cluster name**: `movie-management-cluster`
3. **Infrastructure**: **AWS Fargate** (serverless)
4. **Create cluster**

**✅ Note**: This will automatically create the `AWSServiceRoleForECS` service-linked role if it doesn't exist.

### **Step 4: Create CloudWatch Log Groups**

1. **AWS Console** → **CloudWatch** → **Logs** → **Log groups** → **Create log group**

#### Backend Log Group:
- **Log group name**: `/ecs/movie-backend`
- **Create log group**

#### Frontend Log Group:
- **Log group name**: `/ecs/movie-frontend`
- **Create log group**

### **Step 5: Create IAM Roles**

#### ECS Task Execution Role:
1. **AWS Console** → **IAM** → **Roles** → **Create role**
2. **Use case**: **ECS** → **ECS Task**
3. **Role name**: `ecsTaskExecutionRole`
4. **Attach policy**: ✅ **AmazonECSTaskExecutionRolePolicy**
5. **Create role**

#### ECS Task Role:
1. **Create role** button
2. **Use case**: **ECS** → **ECS Task**
3. **Role name**: `ecsTaskRole`
4. **Create role**

### **Step 6: Create Secrets Manager Secrets**

1. **AWS Console** → **Secrets Manager** → **Secrets** → **Store a new secret**

#### MongoDB URI Secret:
- **Secret name**: `movie-management/mongodb-uri`
- **Secret value**: `mongodb+srv://username:password@cluster.mongodb.net/movie-management?retryWrites=true&w=majority`
- **Store**

#### JWT Secret:
- **Secret name**: `movie-management/jwt-secret`
- **Secret value**: `your-super-secret-jwt-key-here`
- **Store**

## 🔧 Step 7: Update GitHub Secrets

1. **GitHub Repository** → **Settings** → **Secrets and variables** → **Actions**
2. **Update these secrets**:
   - `AWS_ACCESS_KEY_ID`: `AKIAQT4FE5D47UTR2RXMU`
   - `AWS_SECRET_ACCESS_KEY`: `q6HHH7Du9OZLgcpqcP39Cs0WQMs5fOVt1kdLcUsZi`
   - `AWS_ACCOUNT_ID`: `042692045049`

## 🔧 Step 8: Trigger Deployment

1. **GitHub Repository** → **Actions**
2. **"Deploy to AWS" workflow**
3. **"Re-run jobs"** button

## 📋 Verification Checklist

After creating all resources, verify these exist:

- ✅ **ECR Repositories**: 
  - `movie-management-backend`
  - `movie-management-frontend`
- ✅ **ECS Cluster**: `movie-management-cluster`
- ✅ **Log Groups**: 
  - `/ecs/movie-backend`
  - `/ecs/movie-frontend`
- ✅ **IAM Roles**: 
  - `ecsTaskExecutionRole`
  - `ecsTaskRole`
- ✅ **Secrets**: 
  - `movie-management/mongodb-uri`
  - `movie-management/jwt-secret`

## 🚨 Important Notes

1. **All resources must be created in `us-east-1` region**
2. **ECR repositories are critical** - deployment will fail without them
3. **ECS service-linked role must be created** before ECS cluster
4. **GitHub secrets must be updated** with the new credentials

## 🎯 Expected Result

After completing all steps:
1. **All AWS resources created** ✅
2. **GitHub Actions deployment successful** ✅
3. **Movie Management App live on AWS** ✅

## 🚀 Quick Reference

**ECR Repositories**: `movie-management-backend`, `movie-management-frontend`
**ECS Cluster**: `movie-management-cluster`
**Log Groups**: `/ecs/movie-backend`, `/ecs/movie-frontend`
**IAM Roles**: `ecsTaskExecutionRole`, `ecsTaskRole`
**Secrets**: `movie-management/mongodb-uri`, `movie-management/jwt-secret`

**🎬 Your Movie Management App will be live on AWS! 🎬**
