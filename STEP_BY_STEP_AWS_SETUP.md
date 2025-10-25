# 🚀 Step-by-Step AWS Setup Guide

## ⚠️ AWS Credentials Issue
The AWS credentials are not working with CLI. Let's create resources manually through AWS Console.

## 📋 **EXACT STEPS TO FOLLOW:**

### **🔧 Step 1: Create ECR Repositories (CRITICAL)**

1. **Go to**: https://console.aws.amazon.com/ecr/repositories
2. **Make sure region is**: `us-east-1` (N. Virginia)
3. **Click**: "Create repository"

#### Backend Repository:
- **Repository name**: `movie-management-backend`
- **Tag immutability**: Leave default
- **Scan on push**: ✅ **Enable**
- **KMS encryption**: Leave default
- **Click**: "Create repository"

#### Frontend Repository:
- **Click**: "Create repository" again
- **Repository name**: `movie-management-frontend`
- **Tag immutability**: Leave default
- **Scan on push**: ✅ **Enable**
- **KMS encryption**: Leave default
- **Click**: "Create repository"

### **🔧 Step 2: Create ECS Service-Linked Role**

1. **Go to**: https://console.aws.amazon.com/iam/home#/roles
2. **Click**: "Create role"
3. **Use case**: **AWS service** → **Elastic Container Service**
4. **Use case**: **Elastic Container Service**
5. **Click**: "Next"
6. **Role name**: `AWSServiceRoleForECS`
7. **Description**: `Service-linked role for Amazon ECS`
8. **Click**: "Create role"

### **🔧 Step 3: Create ECS Cluster**

1. **Go to**: https://console.aws.amazon.com/ecs/home#/clusters
2. **Click**: "Create cluster"
3. **Cluster name**: `movie-management-cluster`
4. **Infrastructure**: **AWS Fargate** (serverless)
5. **Click**: "Create cluster"

### **🔧 Step 4: Create CloudWatch Log Groups**

1. **Go to**: https://console.aws.amazon.com/cloudwatch/home#logsV2:log-groups
2. **Click**: "Create log group"

#### Backend Log Group:
- **Log group name**: `/ecs/movie-backend`
- **Click**: "Create log group"

#### Frontend Log Group:
- **Click**: "Create log group"
- **Log group name**: `/ecs/movie-frontend`
- **Click**: "Create log group"

### **🔧 Step 5: Create IAM Roles**

1. **Go to**: https://console.aws.amazon.com/iam/home#/roles
2. **Click**: "Create role"

#### ECS Task Execution Role:
- **Use case**: **ECS** → **ECS Task**
- **Click**: "Next"
- **Role name**: `ecsTaskExecutionRole`
- **Attach policy**: ✅ **AmazonECSTaskExecutionRolePolicy**
- **Click**: "Create role"

#### ECS Task Role:
- **Click**: "Create role"
- **Use case**: **ECS** → **ECS Task**
- **Click**: "Next"
- **Role name**: `ecsTaskRole`
- **Click**: "Create role"

### **🔧 Step 6: Create Secrets Manager Secrets**

1. **Go to**: https://console.aws.amazon.com/secretsmanager/home#/list
2. **Click**: "Store a new secret"

#### MongoDB URI Secret:
- **Secret type**: **Other type of secret**
- **Key/value pairs**:
  - **Key**: `mongodb-uri`
  - **Value**: `mongodb+srv://username:password@cluster.mongodb.net/movie-management?retryWrites=true&w=majority`
- **Secret name**: `movie-management/mongodb-uri`
- **Description**: `MongoDB connection string`
- **Click**: "Store"

#### JWT Secret:
- **Click**: "Store a new secret"
- **Secret type**: **Other type of secret**
- **Key/value pairs**:
  - **Key**: `jwt-secret`
  - **Value**: `your-super-secret-jwt-key-here`
- **Secret name**: `movie-management/jwt-secret`
- **Description**: `JWT secret key`
- **Click**: "Store"

### **🔧 Step 7: Update GitHub Secrets**

1. **Go to**: https://github.com/your-username/your-repo/settings/secrets/actions
2. **Update these secrets**:
   - `AWS_ACCESS_KEY_ID`: `AKIAQT4FE5D47UTR2RXMU`
   - `AWS_SECRET_ACCESS_KEY`: `q6HHH7Du9OZLgcpqcP39Cs0WQMs5fOVt1kdLcUsZi`
   - `AWS_ACCOUNT_ID`: `042692045049`

### **🔧 Step 8: Trigger Deployment**

1. **Go to**: https://github.com/your-username/your-repo/actions
2. **Find**: "Deploy to AWS" workflow
3. **Click**: "Re-run jobs" button

## 📋 **VERIFICATION CHECKLIST:**

After completing all steps, verify these resources exist:

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

## 🚨 **IMPORTANT NOTES:**

1. **All resources must be created in `us-east-1` region**
2. **ECR repositories are CRITICAL** - deployment will fail without them
3. **ECS service-linked role must be created** before ECS cluster
4. **GitHub secrets must be updated** with the new credentials

## 🎯 **EXPECTED RESULT:**

After completing all steps:
1. **All AWS resources created** ✅
2. **GitHub Actions deployment successful** ✅
3. **Movie Management App live on AWS** ✅

## 🚀 **QUICK REFERENCE:**

**ECR Repositories**: `movie-management-backend`, `movie-management-frontend`
**ECS Cluster**: `movie-management-cluster`
**Log Groups**: `/ecs/movie-backend`, `/ecs/movie-frontend`
**IAM Roles**: `ecsTaskExecutionRole`, `ecsTaskRole`
**Secrets**: `movie-management/mongodb-uri`, `movie-management/jwt-secret`

**🎬 Your Movie Management App will be live on AWS! 🎬**
