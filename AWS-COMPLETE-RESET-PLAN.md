# 🔄 AWS COMPLETE RESET & RECREATION PLAN

## 🎯 **OVERVIEW**
यह guide आपको AWS setup को completely reset करके fresh start देगी। सभी resources को properly recreate करेंगे।

---

## 🗑️ **PHASE 1: COMPLETE AWS CLEANUP (DELETE ALL)**

### **Step 1: Delete ECS Services & Tasks**
```bash
# Stop all running tasks
aws ecs update-service \
  --cluster movie-management-cluster \
  --service movie-backend-task-service-d8tedgl6 \
  --desired-count 0 \
  --region eu-north-1

aws ecs update-service \
  --cluster movie-management-cluster \
  --service movie-frontend-task-service-i306grln \
  --desired-count 0 \
  --region eu-north-1

# Wait 2 minutes, then delete services
aws ecs delete-service \
  --cluster movie-management-cluster \
  --service movie-backend-task-service-d8tedgl6 \
  --region eu-north-1

aws ecs delete-service \
  --cluster movie-management-cluster \
  --service movie-frontend-task-service-i306grln \
  --region eu-north-1
```

### **Step 2: Delete Task Definitions**
```bash
# Deregister task definitions
aws ecs deregister-task-definition \
  --task-definition movie-backend-task:1 \
  --region eu-north-1

aws ecs deregister-task-definition \
  --task-definition movie-frontend-task:1 \
  --region eu-north-1
```

### **Step 3: Delete ECS Cluster**
```bash
aws ecs delete-cluster \
  --cluster movie-management-cluster \
  --region eu-north-1
```

### **Step 4: Delete ECR Repositories**
```bash
# Delete backend repository (this will delete all images)
aws ecr delete-repository \
  --repository-name movie-management-backend \
  --force \
  --region eu-north-1

# Delete frontend repository
aws ecr delete-repository \
  --repository-name movie-management-frontend \
  --force \
  --region eu-north-1
```

### **Step 5: Delete Secrets Manager Secrets**
```bash
aws secretsmanager delete-secret \
  --secret-id movie-management/mongodb-uri \
  --force-delete-without-recovery \
  --region eu-north-1

aws secretsmanager delete-secret \
  --secret-id movie-management/jwt-secret \
  --force-delete-without-recovery \
  --region eu-north-1
```

### **Step 6: Delete CloudWatch Log Groups**
```bash
aws logs delete-log-group \
  --log-group-name /ecs/movie-backend \
  --region eu-north-1

aws logs delete-log-group \
  --log-group-name /ecs/movie-frontend \
  --region eu-north-1
```

### **Step 7: Delete IAM Roles**
```bash
# Detach policies first
aws iam detach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam detach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite

# Delete inline policies
aws iam delete-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-name SecretsManagerAccess

aws iam delete-role-policy \
  --role-name ecsTaskRole \
  --policy-name ECRAccess

# Delete roles
aws iam delete-role --role-name ecsTaskExecutionRole
aws iam delete-role --role-name ecsTaskRole
```

---

## 🚀 **PHASE 2: FRESH AWS SETUP (RECREATE ALL)**

### **Step 1: Setup MongoDB Atlas (FIRST - CRITICAL)**

1. **Go to**: https://www.mongodb.com/atlas
2. **Create free account**
3. **Create free cluster** (M0 Sandbox)
4. **Database Access**:
   - Username: `movieuser`
   - Password: `MoviePass123!`
5. **Network Access**: Add `0.0.0.0/0` (allow from anywhere)
6. **Get connection string**:
   ```
   mongodb+srv://movieuser:MoviePass123!@cluster0.xxxxx.mongodb.net/movies?retryWrites=true&w=majority
   ```

### **Step 2: Create ECR Repositories**
```bash
# Backend repository
aws ecr create-repository \
  --repository-name movie-management-backend \
  --region eu-north-1 \
  --image-scanning-configuration scanOnPush=true

# Frontend repository  
aws ecr create-repository \
  --repository-name movie-management-frontend \
  --region eu-north-1 \
  --image-scanning-configuration scanOnPush=true
```

### **Step 3: Create IAM Roles (CORRECT TRUST POLICIES)**

#### **ecsTaskExecutionRole**:
```bash
# Create role
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "ecs-tasks.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'

# Attach policies
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite
```

#### **ecsTaskRole**:
```bash
aws iam create-role \
  --role-name ecsTaskRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "ecs-tasks.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'
```

### **Step 4: Create Secrets Manager Secrets**

#### **MongoDB URI Secret**:
```bash
aws secretsmanager create-secret \
  --name movie-management/mongodb-uri \
  --description "MongoDB Atlas connection string" \
  --secret-string '{"MONGODB_URI":"mongodb+srv://movieuser:MoviePass123!@cluster0.xxxxx.mongodb.net/movies?retryWrites=true&w=majority"}' \
  --region eu-north-1
```

#### **JWT Secret**:
```bash
aws secretsmanager create-secret \
  --name movie-management/jwt-secret \
  --description "JWT secret key" \
  --secret-string '{"JWT_SECRET":"movie-jwt-secret-super-secure-2024-key-12345"}' \
  --region eu-north-1
```

### **Step 5: Create CloudWatch Log Groups**
```bash
aws logs create-log-group \
  --log-group-name /ecs/movie-backend \
  --region eu-north-1

aws logs create-log-group \
  --log-group-name /ecs/movie-frontend \
  --region eu-north-1
```

### **Step 6: Create ECS Cluster**
```bash
aws ecs create-cluster \
  --cluster-name movie-management-cluster \
  --capacity-providers FARGATE \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
  --region eu-north-1
```

### **Step 7: Create VPC & Networking (if needed)**
```bash
# Get default VPC
aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --region eu-north-1

# Get default subnets
aws ec2 describe-subnets --filters "Name=default-for-az,Values=true" --region eu-north-1

# Create security group
aws ec2 create-security-group \
  --group-name movie-app-sg \
  --description "Security group for Movie Management App" \
  --vpc-id vpc-xxxxxxxxx \
  --region eu-north-1

# Add inbound rules
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0 \
  --region eu-north-1

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0 \
  --region eu-north-1

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 3001 \
  --cidr 0.0.0.0/0 \
  --region eu-north-1
```

---

## 🔧 **PHASE 3: GITHUB ACTIONS SETUP**

### **Step 1: Update GitHub Secrets**
Go to: https://github.com/kunal899verma/MoviesProject/settings/secrets/actions

Add these secrets:
```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=eu-north-1
AWS_ACCOUNT_ID=042692045049
```

### **Step 2: Update Task Definition Files**
Replace YOUR_ACCOUNT_ID with 042692045049 in:
- `.aws/task-definition-backend.json`
- `.aws/task-definition-frontend.json`

### **Step 3: Test Deployment**
```bash
git add .
git commit -m "Fresh AWS setup - reset complete"
git push origin main
```

---

## 🎯 **PHASE 4: VERIFICATION CHECKLIST**

### **✅ After Reset - Verify These:**

1. **ECR Repositories**: Both repositories exist and are empty
2. **IAM Roles**: Both roles have correct trust policies
3. **Secrets Manager**: Both secrets exist with correct values
4. **ECS Cluster**: Cluster is active with no services
5. **CloudWatch**: Log groups exist
6. **MongoDB Atlas**: Cluster is running and accessible

### **✅ After Recreation - Verify These:**

1. **GitHub Actions**: Deployment runs successfully
2. **ECR Images**: Images are pushed successfully
3. **ECS Services**: Services are running with desired count
4. **Tasks**: Tasks are running without exit code 1
5. **Application**: Frontend and backend are accessible
6. **Database**: MongoDB connection is working

---

## 🚨 **IMPORTANT NOTES:**

1. **Region Consistency**: Everything MUST be in `eu-north-1`
2. **MongoDB Atlas**: Use Atlas instead of localhost MongoDB
3. **Trust Policies**: Use EXACT trust policies provided
4. **Secret Format**: Use key-value format in secrets
5. **Account ID**: Replace with your actual account ID (042692045049)

---

## 🆘 **IF SOMETHING GOES WRONG:**

1. **Check CloudWatch Logs** for exact error messages
2. **Verify IAM Role Trust Policies** are correct
3. **Test MongoDB Atlas Connection** separately
4. **Ensure all resources are in eu-north-1**
5. **Check GitHub Actions logs** for deployment errors

---

**🎯 This plan will give you a completely fresh, working AWS setup!**
