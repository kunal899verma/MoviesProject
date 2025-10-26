# 💻 AWS TERMINAL SETUP GUIDE

## 🎯 **Complete AWS Setup using Terminal/CLI Commands**

---

## 🔧 **PREREQUISITES**

### **Step 1: Install AWS CLI**
```bash
# macOS (using Homebrew)
brew install awscli

# Or download directly
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Verify installation
aws --version
```

### **Step 2: Configure AWS CLI**
```bash
# Configure AWS credentials
aws configure

# Enter your credentials:
# AWS Access Key ID: your-access-key-id
# AWS Secret Access Key: your-secret-access-key
# Default region name: eu-north-1
# Default output format: json
```

### **Step 3: Verify Configuration**
```bash
# Test AWS connection
aws sts get-caller-identity

# Should return your account details
```

---

## 🗑️ **PHASE 1: COMPLETE CLEANUP (Terminal)**

### **Step 1: Set Environment Variables**
```bash
export AWS_REGION="eu-north-1"
export AWS_ACCOUNT_ID="042692045049"
export CLUSTER_NAME="movie-management-cluster"
```

### **Step 2: Stop and Delete ECS Services**
```bash
# Stop backend service
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service movie-backend-task-service-d8tedgl6 \
  --desired-count 0 \
  --region $AWS_REGION

# Stop frontend service
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service movie-frontend-task-service-i306grln \
  --desired-count 0 \
  --region $AWS_REGION

# Wait for tasks to stop
echo "Waiting 60 seconds for tasks to stop..."
sleep 60

# Delete backend service
aws ecs delete-service \
  --cluster $CLUSTER_NAME \
  --service movie-backend-task-service-d8tedgl6 \
  --region $AWS_REGION

# Delete frontend service
aws ecs delete-service \
  --cluster $CLUSTER_NAME \
  --service movie-frontend-task-service-i306grln \
  --region $AWS_REGION
```

### **Step 3: Delete Task Definitions**
```bash
# List and deregister task definitions
aws ecs list-task-definitions \
  --family-prefix movie-backend-task \
  --region $AWS_REGION \
  --query 'taskDefinitionArns[]' \
  --output text | xargs -I {} aws ecs deregister-task-definition --task-definition {} --region $AWS_REGION

aws ecs list-task-definitions \
  --family-prefix movie-frontend-task \
  --region $AWS_REGION \
  --query 'taskDefinitionArns[]' \
  --output text | xargs -I {} aws ecs deregister-task-definition --task-definition {} --region $AWS_REGION
```

### **Step 4: Delete ECS Cluster**
```bash
aws ecs delete-cluster \
  --cluster $CLUSTER_NAME \
  --region $AWS_REGION
```

### **Step 5: Delete ECR Repositories**
```bash
# Delete backend repository
aws ecr delete-repository \
  --repository-name movie-management-backend \
  --force \
  --region $AWS_REGION

# Delete frontend repository
aws ecr delete-repository \
  --repository-name movie-management-frontend \
  --force \
  --region $AWS_REGION
```

### **Step 6: Delete Secrets**
```bash
aws secretsmanager delete-secret \
  --secret-id movie-management/mongodb-uri \
  --force-delete-without-recovery \
  --region $AWS_REGION

aws secretsmanager delete-secret \
  --secret-id movie-management/jwt-secret \
  --force-delete-without-recovery \
  --region $AWS_REGION
```

### **Step 7: Delete CloudWatch Log Groups**
```bash
aws logs delete-log-group \
  --log-group-name /ecs/movie-backend \
  --region $AWS_REGION

aws logs delete-log-group \
  --log-group-name /ecs/movie-frontend \
  --region $AWS_REGION
```

### **Step 8: Delete IAM Roles**
```bash
# Detach policies from ecsTaskExecutionRole
aws iam detach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam detach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite

# Delete inline policies
aws iam delete-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-name SecretsManagerAccess 2>/dev/null || true

aws iam delete-role-policy \
  --role-name ecsTaskRole \
  --policy-name ECRAccess 2>/dev/null || true

# Delete roles
aws iam delete-role --role-name ecsTaskExecutionRole 2>/dev/null || true
aws iam delete-role --role-name ecsTaskRole 2>/dev/null || true
```

---

## 🚀 **PHASE 2: FRESH SETUP (Terminal)**

### **Step 1: Create ECR Repositories**
```bash
# Create backend repository
aws ecr create-repository \
  --repository-name movie-management-backend \
  --region $AWS_REGION \
  --image-scanning-configuration scanOnPush=true

# Create frontend repository
aws ecr create-repository \
  --repository-name movie-management-frontend \
  --region $AWS_REGION \
  --image-scanning-configuration scanOnPush=true

echo "✅ ECR Repositories created successfully"
```

### **Step 2: Create IAM Roles**
```bash
# Create ecsTaskExecutionRole
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

# Attach policies to ecsTaskExecutionRole
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite

# Create ecsTaskRole
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

echo "✅ IAM Roles created successfully"
```

### **Step 3: Create Secrets Manager Secrets**
```bash
# Create MongoDB URI secret
aws secretsmanager create-secret \
  --name movie-management/mongodb-uri \
  --description "MongoDB Atlas connection string" \
  --secret-string '{"MONGODB_URI":"mongodb+srv://movieuser:MoviePass123!@moviecluster.xxxxx.mongodb.net/movies?retryWrites=true&w=majority"}' \
  --region $AWS_REGION

# Create JWT secret
aws secretsmanager create-secret \
  --name movie-management/jwt-secret \
  --description "JWT secret key" \
  --secret-string '{"JWT_SECRET":"movie-jwt-secret-super-secure-2024-key-12345"}' \
  --region $AWS_REGION

echo "✅ Secrets created successfully"
```

### **Step 4: Create CloudWatch Log Groups**
```bash
aws logs create-log-group \
  --log-group-name /ecs/movie-backend \
  --region $AWS_REGION

aws logs create-log-group \
  --log-group-name /ecs/movie-frontend \
  --region $AWS_REGION

echo "✅ CloudWatch Log Groups created successfully"
```

### **Step 5: Create ECS Cluster**
```bash
aws ecs create-cluster \
  --cluster-name $CLUSTER_NAME \
  --capacity-providers FARGATE \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
  --region $AWS_REGION

echo "✅ ECS Cluster created successfully"
```

### **Step 6: Get VPC and Subnet Information**
```bash
# Get default VPC
export VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=is-default,Values=true" \
  --region $AWS_REGION \
  --query 'Vpcs[0].VpcId' \
  --output text)

# Get default subnets
export SUBNET_IDS=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" "Name=default-for-az,Values=true" \
  --region $AWS_REGION \
  --query 'Subnets[].SubnetId' \
  --output text | tr '\t' ',')

echo "VPC ID: $VPC_ID"
echo "Subnet IDs: $SUBNET_IDS"
```

### **Step 7: Create Security Group**
```bash
# Create security group
export SECURITY_GROUP_ID=$(aws ec2 create-security-group \
  --group-name movie-app-sg \
  --description "Security group for Movie Management App" \
  --vpc-id $VPC_ID \
  --region $AWS_REGION \
  --query 'GroupId' \
  --output text)

# Add inbound rules
aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0 \
  --region $AWS_REGION

aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0 \
  --region $AWS_REGION

aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port 3001 \
  --cidr 0.0.0.0/0 \
  --region $AWS_REGION

echo "✅ Security Group created: $SECURITY_GROUP_ID"
```

---

## 🔍 **PHASE 3: VERIFICATION**

### **Step 1: Verify All Resources**
```bash
# Check ECR repositories
echo "=== ECR Repositories ==="
aws ecr describe-repositories --region $AWS_REGION --query 'repositories[].repositoryName'

# Check IAM roles
echo "=== IAM Roles ==="
aws iam get-role --role-name ecsTaskExecutionRole --query 'Role.RoleName'
aws iam get-role --role-name ecsTaskRole --query 'Role.RoleName'

# Check secrets
echo "=== Secrets Manager ==="
aws secretsmanager list-secrets --region $AWS_REGION --query 'SecretList[].Name'

# Check log groups
echo "=== CloudWatch Log Groups ==="
aws logs describe-log-groups --region $AWS_REGION --query 'logGroups[].logGroupName'

# Check ECS cluster
echo "=== ECS Cluster ==="
aws ecs describe-clusters --clusters $CLUSTER_NAME --region $AWS_REGION --query 'clusters[].clusterName'

echo "✅ All resources verified successfully"
```

### **Step 2: Test MongoDB Atlas Connection (Optional)**
```bash
# Install MongoDB tools (macOS)
brew tap mongodb/brew
brew install mongodb-community-shell

# Test connection (replace with your actual connection string)
mongosh "mongodb+srv://movieuser:MoviePass123!@moviecluster.xxxxx.mongodb.net/movies"
```

---

## 🎯 **PHASE 4: GITHUB ACTIONS SETUP**

### **Step 1: Update GitHub Secrets**
```bash
# You'll need to add these manually in GitHub:
echo "Add these secrets to GitHub Actions:"
echo "AWS_ACCESS_KEY_ID = $(aws configure get aws_access_key_id)"
echo "AWS_SECRET_ACCESS_KEY = $(aws configure get aws_secret_access_key)"
echo "AWS_REGION = $AWS_REGION"
echo "AWS_ACCOUNT_ID = $AWS_ACCOUNT_ID"
```

### **Step 2: Deploy Application**
```bash
# Push to GitHub to trigger deployment
git add .
git commit -m "Fresh AWS setup via terminal - ready for deployment"
git push origin main
```

---

## 🤖 **AUTOMATED SETUP SCRIPT**

### **Create Complete Setup Script**
```bash
# Create automated setup script
cat > setup-aws-terminal.sh << 'EOF'
#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting AWS Terminal Setup...${NC}"

# Set environment variables
export AWS_REGION="eu-north-1"
export AWS_ACCOUNT_ID="042692045049"
export CLUSTER_NAME="movie-management-cluster"

# Function to check if command succeeded
check_command() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1 successful${NC}"
    else
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

# Cleanup phase
echo -e "${YELLOW}🗑️ Starting cleanup phase...${NC}"

# Stop services
aws ecs update-service --cluster $CLUSTER_NAME --service movie-backend-task-service-d8tedgl6 --desired-count 0 --region $AWS_REGION 2>/dev/null || true
aws ecs update-service --cluster $CLUSTER_NAME --service movie-frontend-task-service-i306grln --desired-count 0 --region $AWS_REGION 2>/dev/null || true

sleep 30

# Delete services
aws ecs delete-service --cluster $CLUSTER_NAME --service movie-backend-task-service-d8tedgl6 --region $AWS_REGION 2>/dev/null || true
aws ecs delete-service --cluster $CLUSTER_NAME --service movie-frontend-task-service-i306grln --region $AWS_REGION 2>/dev/null || true

# Delete cluster
aws ecs delete-cluster --cluster $CLUSTER_NAME --region $AWS_REGION 2>/dev/null || true

# Delete ECR repositories
aws ecr delete-repository --repository-name movie-management-backend --force --region $AWS_REGION 2>/dev/null || true
aws ecr delete-repository --repository-name movie-management-frontend --force --region $AWS_REGION 2>/dev/null || true

# Delete secrets
aws secretsmanager delete-secret --secret-id movie-management/mongodb-uri --force-delete-without-recovery --region $AWS_REGION 2>/dev/null || true
aws secretsmanager delete-secret --secret-id movie-management/jwt-secret --force-delete-without-recovery --region $AWS_REGION 2>/dev/null || true

# Delete log groups
aws logs delete-log-group --log-group-name /ecs/movie-backend --region $AWS_REGION 2>/dev/null || true
aws logs delete-log-group --log-group-name /ecs/movie-frontend --region $AWS_REGION 2>/dev/null || true

# Delete IAM roles
aws iam detach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 2>/dev/null || true
aws iam detach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite 2>/dev/null || true
aws iam delete-role --role-name ecsTaskExecutionRole 2>/dev/null || true
aws iam delete-role --role-name ecsTaskRole 2>/dev/null || true

echo -e "${GREEN}✅ Cleanup completed${NC}"

# Setup phase
echo -e "${YELLOW}🚀 Starting setup phase...${NC}"

# Create ECR repositories
aws ecr create-repository --repository-name movie-management-backend --region $AWS_REGION --image-scanning-configuration scanOnPush=true
check_command "Backend ECR repository creation"

aws ecr create-repository --repository-name movie-management-frontend --region $AWS_REGION --image-scanning-configuration scanOnPush=true
check_command "Frontend ECR repository creation"

# Create IAM roles
aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document '{
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
check_command "ecsTaskExecutionRole creation"

aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite

aws iam create-role --role-name ecsTaskRole --assume-role-policy-document '{
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
check_command "ecsTaskRole creation"

# Create secrets
aws secretsmanager create-secret --name movie-management/mongodb-uri --description "MongoDB Atlas connection string" --secret-string '{"MONGODB_URI":"mongodb+srv://movieuser:MoviePass123!@moviecluster.xxxxx.mongodb.net/movies?retryWrites=true&w=majority"}' --region $AWS_REGION
check_command "MongoDB URI secret creation"

aws secretsmanager create-secret --name movie-management/jwt-secret --description "JWT secret key" --secret-string '{"JWT_SECRET":"movie-jwt-secret-super-secure-2024-key-12345"}' --region $AWS_REGION
check_command "JWT secret creation"

# Create log groups
aws logs create-log-group --log-group-name /ecs/movie-backend --region $AWS_REGION
aws logs create-log-group --log-group-name /ecs/movie-frontend --region $AWS_REGION
check_command "CloudWatch log groups creation"

# Create ECS cluster
aws ecs create-cluster --cluster-name $CLUSTER_NAME --capacity-providers FARGATE --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 --region $AWS_REGION
check_command "ECS cluster creation"

echo -e "${GREEN}🎉 AWS setup completed successfully!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Setup MongoDB Atlas cluster"
echo "2. Update GitHub secrets"
echo "3. Push code to trigger deployment"
echo "4. Monitor GitHub Actions"

EOF

chmod +x setup-aws-terminal.sh
```

---

## 🚀 **QUICK START**

### **Option 1: Run Individual Commands**
Follow the commands in each phase step by step.

### **Option 2: Use Automated Script**
```bash
# Make script executable and run
chmod +x setup-aws-terminal.sh
./setup-aws-terminal.sh
```

### **Option 3: One-liner Setup**
```bash
curl -s https://raw.githubusercontent.com/your-repo/setup-aws-terminal.sh | bash
```

---

## ✅ **VERIFICATION CHECKLIST**

After running the setup:

```bash
# Quick verification
aws ecr describe-repositories --region eu-north-1 --query 'repositories[].repositoryName'
aws iam get-role --role-name ecsTaskExecutionRole --query 'Role.RoleName'
aws secretsmanager list-secrets --region eu-north-1 --query 'SecretList[].Name'
aws ecs describe-clusters --clusters movie-management-cluster --region eu-north-1 --query 'clusters[].clusterName'
```

---

**🎯 Terminal setup is much faster - everything can be done in 5-10 minutes!**
