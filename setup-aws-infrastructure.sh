#!/bin/bash

# AWS Infrastructure Setup Script
# This script creates the necessary AWS resources for deployment

echo "🚀 Setting up AWS infrastructure for Movie Management App..."

# Set AWS region
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="042692045049"

echo "📋 Creating ECR repositories..."

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
  }' || echo "Repository may already exist"

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
  }' || echo "Repository may already exist"

echo "📋 Creating ECS cluster..."

# Create ECS cluster
aws ecs create-cluster \
  --cluster-name movie-management-cluster \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
  --region $AWS_REGION || echo "Cluster may already exist"

echo "📋 Creating CloudWatch log groups..."

# Create log groups
aws logs create-log-group \
  --log-group-name /ecs/movie-backend \
  --region $AWS_REGION || echo "Log group may already exist"

aws logs create-log-group \
  --log-group-name /ecs/movie-frontend \
  --region $AWS_REGION || echo "Log group may already exist"

echo "📋 Creating IAM roles..."

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
  }' || echo "Role may already exist"

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
  }' || echo "Role may already exist"

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
  }' || echo "Policy may already exist"

# Attach policy to task role
aws iam attach-role-policy \
  --role-name ecsTaskRole \
  --policy-arn arn:aws:iam::$AWS_ACCOUNT_ID:policy/ECRAccessPolicy || echo "Policy may already be attached"

echo "📋 Creating Secrets Manager secrets..."

# Create MongoDB URI secret
aws secretsmanager create-secret \
  --name movie-management/mongodb-uri \
  --description "MongoDB connection string" \
  --secret-string "mongodb+srv://username:password@cluster.mongodb.net/movie-management?retryWrites=true&w=majority" \
  --region $AWS_REGION || echo "Secret may already exist"

# Create JWT secret
aws secretsmanager create-secret \
  --name movie-management/jwt-secret \
  --description "JWT secret key" \
  --secret-string "your-super-secret-jwt-key-here" \
  --region $AWS_REGION || echo "Secret may already exist"

echo "✅ AWS infrastructure setup complete!"
echo "📋 Created resources:"
echo "  - ECR repositories: movie-management-backend, movie-management-frontend"
echo "  - ECS cluster: movie-management-cluster"
echo "  - Log groups: /ecs/movie-backend, /ecs/movie-frontend"
echo "  - IAM roles: ecsTaskExecutionRole, ecsTaskRole"
echo "  - Secrets: movie-management/mongodb-uri, movie-management/jwt-secret"
echo ""
echo "🚀 Ready for deployment!"
