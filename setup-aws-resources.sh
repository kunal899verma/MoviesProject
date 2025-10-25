#!/bin/bash

# AWS Resources Setup Script for Movie Management App
# This script creates all required AWS resources for deployment

echo "🚀 Setting up AWS resources for Movie Management App..."

# Set AWS region
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="042692045049"

echo "📋 Step 1: Creating ECS Service-Linked Role..."

# Create ECS service-linked role
aws iam create-service-linked-role \
  --aws-service-name ecs.amazonaws.com \
  --region $AWS_REGION || echo "Service-linked role may already exist"

echo "📋 Step 2: Creating ECR Repositories..."

# Create backend ECR repository
echo "Creating backend ECR repository..."
aws ecr create-repository \
  --repository-name movie-management-backend \
  --region $AWS_REGION \
  --image-scanning-configuration scanOnPush=true \
  --lifecycle-policy-text '{
    "rules": [
      {
        "rulePriority": 1,
        "description": "Keep last 10 images",
        "selection": {
          "tagStatus": "any",
          "countType": "imageCountMoreThan",
          "countNumber": 10
        },
        "action": {
          "type": "expire"
        }
      }
    ]
  }' || echo "Backend repository may already exist"

# Create frontend ECR repository
echo "Creating frontend ECR repository..."
aws ecr create-repository \
  --repository-name movie-management-frontend \
  --region $AWS_REGION \
  --image-scanning-configuration scanOnPush=true \
  --lifecycle-policy-text '{
    "rules": [
      {
        "rulePriority": 1,
        "description": "Keep last 10 images",
        "selection": {
          "tagStatus": "any",
          "countType": "imageCountMoreThan",
          "countNumber": 10
        },
        "action": {
          "type": "expire"
        }
      }
    ]
  }' || echo "Frontend repository may already exist"

echo "📋 Step 3: Creating ECS Cluster..."

# Create ECS cluster
aws ecs create-cluster \
  --cluster-name movie-management-cluster \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
  --region $AWS_REGION || echo "Cluster may already exist"

echo "📋 Step 4: Creating CloudWatch Log Groups..."

# Create log groups
aws logs create-log-group \
  --log-group-name /ecs/movie-backend \
  --region $AWS_REGION || echo "Backend log group may already exist"

aws logs create-log-group \
  --log-group-name /ecs/movie-frontend \
  --region $AWS_REGION || echo "Frontend log group may already exist"

echo "📋 Step 5: Creating IAM Roles..."

# Create ECS task execution role
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
  }' || echo "ECS task execution role may already exist"

# Attach policy to execution role
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy || echo "Policy may already be attached"

# Create ECS task role
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
  }' || echo "ECS task role may already exist"

# Create policy for ECS task role
aws iam create-policy \
  --policy-name ECRAccessPolicy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ],
        "Resource": "*"
      }
    ]
  }' || echo "ECR access policy may already exist"

# Attach policy to task role
aws iam attach-role-policy \
  --role-name ecsTaskRole \
  --policy-arn arn:aws:iam::$AWS_ACCOUNT_ID:policy/ECRAccessPolicy || echo "Policy may already be attached"

echo "📋 Step 6: Creating Secrets Manager Secrets..."

# Create MongoDB URI secret
aws secretsmanager create-secret \
  --name movie-management/mongodb-uri \
  --description "MongoDB connection string" \
  --secret-string "mongodb+srv://username:password@cluster.mongodb.net/movie-management?retryWrites=true&w=majority" \
  --region $AWS_REGION || echo "MongoDB secret may already exist"

# Create JWT secret
aws secretsmanager create-secret \
  --name movie-management/jwt-secret \
  --description "JWT secret key" \
  --secret-string "your-super-secret-jwt-key-here" \
  --region $AWS_REGION || echo "JWT secret may already exist"

echo "✅ AWS resources setup complete!"
echo "📋 Created resources:"
echo "  - ECS Service-Linked Role: AWSServiceRoleForECS"
echo "  - ECR repositories: movie-management-backend, movie-management-frontend"
echo "  - ECS cluster: movie-management-cluster"
echo "  - Log groups: /ecs/movie-backend, /ecs/movie-frontend"
echo "  - IAM roles: ecsTaskExecutionRole, ecsTaskRole"
echo "  - Secrets: movie-management/mongodb-uri, movie-management/jwt-secret"
echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Go to GitHub Repository → Actions"
echo "2. Click 'Re-run jobs' on the 'Deploy to AWS' workflow"
echo "3. Monitor the deployment progress"
