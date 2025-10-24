# 🔧 AWS Manual Setup Guide

## **🚨 ISSUE IDENTIFIED:**
ECR repositories don't exist yet. The deployment is failing because:
```
name unknown: The repository with name 'movie-management-backend' does not exist in the registry
```

## **🔧 MANUAL SETUP STEPS:**

### **Step 1: Create ECR Repositories**

#### **Backend Repository:**
1. **AWS Console** → **ECR** → **Repositories**
2. **Create repository** → **Name**: `movie-management-backend`
3. **Region**: `us-east-1`
4. **Scan on push**: ✅ Enabled
5. **Create repository**

#### **Frontend Repository:**
1. **AWS Console** → **ECR** → **Repositories**
2. **Create repository** → **Name**: `movie-management-frontend`
3. **Region**: `us-east-1`
4. **Scan on push**: ✅ Enabled
5. **Create repository**

### **Step 2: Create ECS Cluster**

1. **AWS Console** → **ECS** → **Clusters**
2. **Create cluster** → **Name**: `movie-management-cluster`
3. **Infrastructure**: **AWS Fargate**
4. **Create cluster**

### **Step 3: Create CloudWatch Log Groups**

1. **AWS Console** → **CloudWatch** → **Logs** → **Log groups**
2. **Create log group** → **Name**: `/ecs/movie-backend`
3. **Create log group** → **Name**: `/ecs/movie-frontend`

### **Step 4: Create IAM Roles**

#### **ECS Task Execution Role:**
1. **AWS Console** → **IAM** → **Roles**
2. **Create role** → **Use case**: **ECS** → **ECS Task**
3. **Name**: `ecsTaskExecutionRole`
4. **Attach policy**: `AmazonECSTaskExecutionRolePolicy`
5. **Create role**

#### **ECS Task Role:**
1. **AWS Console** → **IAM** → **Roles**
2. **Create role** → **Use case**: **ECS** → **ECS Task**
3. **Name**: `ecsTaskRole`
4. **Create role**

### **Step 5: Create Secrets Manager Secrets**

1. **AWS Console** → **Secrets Manager** → **Secrets**
2. **Store a new secret** → **Name**: `movie-management/mongodb-uri`
3. **Value**: `mongodb+srv://username:password@cluster.mongodb.net/movie-management?retryWrites=true&w=majority`
4. **Store a new secret** → **Name**: `movie-management/jwt-secret`
5. **Value**: `your-super-secret-jwt-key-here`

## **🚀 AFTER SETUP:**

### **Step 6: Trigger New Deployment**
1. **GitHub Repository** → **Actions**
2. **"Deploy to AWS"** workflow
3. **"Re-run jobs"** button click करें

### **Expected Result:**
The deployment should now work because:
- ✅ ECR repositories exist
- ✅ ECS cluster exists
- ✅ Log groups exist
- ✅ IAM roles exist
- ✅ Secrets exist

## **📋 QUICK SETUP COMMANDS:**

### **Using AWS CLI (if available):**
```bash
# Create ECR repositories
aws ecr create-repository --repository-name movie-management-backend --region us-east-1
aws ecr create-repository --repository-name movie-management-frontend --region us-east-1

# Create ECS cluster
aws ecs create-cluster --cluster-name movie-management-cluster --region us-east-1

# Create log groups
aws logs create-log-group --log-group-name /ecs/movie-backend --region us-east-1
aws logs create-log-group --log-group-name /ecs/movie-frontend --region us-east-1
```

## **🎯 CURRENT STATUS:**

**✅ Docker Build**: Working  
**✅ AWS Credentials**: Working  
**❌ ECR Repositories**: Need to be created  
**✅ Next Step**: Create AWS resources manually  
**✅ Goal**: Successful deployment to AWS  

**🚀 आपका Movie Management Application AWS पर live होने वाला है! 🚀**
