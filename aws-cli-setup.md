# AWS CLI Setup and Resource Creation Guide

## 🚀 Quick Setup Instructions

### Step 1: Configure AWS CLI

You need to configure AWS CLI with your credentials. Run these commands:

```bash
# Configure AWS CLI (you'll be prompted for credentials)
aws configure

# Enter the following when prompted:
# AWS Access Key ID: [Your access key]
# AWS Secret Access Key: [Your secret key]
# Default region name: us-east-1
# Default output format: json
```

### Step 2: Verify AWS Connection

```bash
# Test your AWS connection
aws sts get-caller-identity
```

### Step 3: Run the Setup Script

```bash
# Make the script executable and run it
chmod +x setup-aws-resources.sh
./setup-aws-resources.sh
```

## 📋 What the Script Creates

The setup script will automatically create:

### 1. **ECS Service-Linked Role**
- `AWSServiceRoleForECS` - Required for ECS cluster creation

### 2. **ECR Repositories**
- `movie-management-backend` - For backend Docker images
- `movie-management-frontend` - For frontend Docker images

### 3. **ECS Cluster**
- `movie-management-cluster` - Fargate cluster for running containers

### 4. **CloudWatch Log Groups**
- `/ecs/movie-backend` - Backend application logs
- `/ecs/movie-frontend` - Frontend application logs

### 5. **IAM Roles**
- `ecsTaskExecutionRole` - For ECS task execution
- `ecsTaskRole` - For ECS task permissions

### 6. **Secrets Manager**
- `movie-management/mongodb-uri` - MongoDB connection string
- `movie-management/jwt-secret` - JWT secret key

## 🎯 After Running the Script

### Step 4: Trigger Deployment

1. **Go to GitHub Repository** → **Actions**
2. **Find "Deploy to AWS" workflow**
3. **Click "Re-run jobs"** button
4. **Monitor the deployment progress**

## 🔧 Manual Setup (Alternative)

If the script doesn't work, you can create resources manually:

### ECR Repositories
```bash
aws ecr create-repository --repository-name movie-management-backend --region us-east-1
aws ecr create-repository --repository-name movie-management-frontend --region us-east-1
```

### ECS Cluster
```bash
aws ecs create-cluster --cluster-name movie-management-cluster --region us-east-1
```

### Log Groups
```bash
aws logs create-log-group --log-group-name /ecs/movie-backend --region us-east-1
aws logs create-log-group --log-group-name /ecs/movie-frontend --region us-east-1
```

### IAM Roles
```bash
# Create execution role
aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "ecs-tasks.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}'

# Attach policy
aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

### Secrets
```bash
aws secretsmanager create-secret --name movie-management/mongodb-uri --secret-string "mongodb+srv://username:password@cluster.mongodb.net/movie-management?retryWrites=true&w=majority" --region us-east-1
aws secretsmanager create-secret --name movie-management/jwt-secret --secret-string "your-super-secret-jwt-key-here" --region us-east-1
```

## 🚨 Troubleshooting

### If AWS CLI credentials fail:
1. Check if credentials are correct
2. Ensure you have proper IAM permissions
3. Try running `aws configure` again

### If resources already exist:
- The script will show "may already exist" messages - this is normal
- Continue with the deployment

### If ECS cluster creation fails:
- Ensure the service-linked role exists
- Check IAM permissions

## ✅ Success Indicators

After running the script, you should see:
- ✅ ECR repositories created
- ✅ ECS cluster created
- ✅ Log groups created
- ✅ IAM roles created
- ✅ Secrets created

## 🚀 Next Steps

1. **Run the setup script**: `./setup-aws-resources.sh`
2. **Go to GitHub Actions**: Trigger deployment
3. **Monitor deployment**: Watch the logs
4. **Access your app**: Get the load balancer URL

Your Movie Management App will be live on AWS! 🎬
