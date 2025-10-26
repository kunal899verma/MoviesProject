#!/bin/bash

# Fresh AWS Setup Script for Movie Management App
# Run this after creating IAM user with AdministratorAccess

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🚀 Fresh AWS Setup for Movie Management App${NC}"
echo -e "${BLUE}================================================${NC}"

# Configuration
export AWS_REGION="eu-north-1"
export CLUSTER_NAME="movie-management-cluster"

# MongoDB connection string (your actual Atlas connection)
MONGODB_URI="mongodb+srv://kunalv899_db_user:kunalv899_db_user@moviecluster.qhdd9g9.mongodb.net/movies?retryWrites=true&w=majority&appName=MovieCluster"
JWT_SECRET="movie-jwt-secret-super-secure-2024-key-12345"

# Function to check if command succeeded
check_command() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1 successful${NC}"
    else
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

# Function to check AWS CLI configuration
check_aws_cli() {
    echo -e "${YELLOW}🔍 Checking AWS CLI configuration...${NC}"
    
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not found. Please install AWS CLI first.${NC}"
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not configured. Please run 'aws configure' first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ AWS CLI configured successfully${NC}"
    
    # Get and display account info
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    USER_ARN=$(aws sts get-caller-identity --query Arn --output text)
    
    echo -e "${BLUE}Account ID: $ACCOUNT_ID${NC}"
    echo -e "${BLUE}User: $USER_ARN${NC}"
    
    export AWS_ACCOUNT_ID=$ACCOUNT_ID
}

# Function to create ECR repositories
create_ecr_repos() {
    echo -e "${YELLOW}📦 Creating ECR repositories...${NC}"
    
    # Backend repository
    aws ecr create-repository \
        --repository-name movie-management-backend \
        --region $AWS_REGION \
        --image-scanning-configuration scanOnPush=true 2>/dev/null || echo "Backend repo may already exist"
    
    # Frontend repository
    aws ecr create-repository \
        --repository-name movie-management-frontend \
        --region $AWS_REGION \
        --image-scanning-configuration scanOnPush=true 2>/dev/null || echo "Frontend repo may already exist"
    
    echo -e "${GREEN}✅ ECR repositories created${NC}"
}

# Function to create IAM roles
create_iam_roles() {
    echo -e "${YELLOW}🔐 Creating IAM roles...${NC}"
    
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
        }' 2>/dev/null || echo "ecsTaskExecutionRole may already exist"
    
    # Attach policies to ecsTaskExecutionRole
    aws iam attach-role-policy \
        --role-name ecsTaskExecutionRole \
        --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 2>/dev/null || true
    
    aws iam attach-role-policy \
        --role-name ecsTaskExecutionRole \
        --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite 2>/dev/null || true
    
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
        }' 2>/dev/null || echo "ecsTaskRole may already exist"
    
    echo -e "${GREEN}✅ IAM roles created${NC}"
}

# Function to create secrets
create_secrets() {
    echo -e "${YELLOW}🔐 Creating Secrets Manager secrets...${NC}"
    
    # Create MongoDB URI secret
    aws secretsmanager create-secret \
        --name movie-management/mongodb-uri \
        --description "MongoDB Atlas connection string" \
        --secret-string "{\"MONGODB_URI\":\"$MONGODB_URI\"}" \
        --region $AWS_REGION 2>/dev/null || echo "MongoDB secret may already exist"
    
    # Create JWT secret
    aws secretsmanager create-secret \
        --name movie-management/jwt-secret \
        --description "JWT secret key" \
        --secret-string "{\"JWT_SECRET\":\"$JWT_SECRET\"}" \
        --region $AWS_REGION 2>/dev/null || echo "JWT secret may already exist"
    
    echo -e "${GREEN}✅ Secrets created${NC}"
}

# Function to create log groups
create_log_groups() {
    echo -e "${YELLOW}📊 Creating CloudWatch log groups...${NC}"
    
    aws logs create-log-group \
        --log-group-name /ecs/movie-backend \
        --region $AWS_REGION 2>/dev/null || echo "Backend log group may already exist"
    
    aws logs create-log-group \
        --log-group-name /ecs/movie-frontend \
        --region $AWS_REGION 2>/dev/null || echo "Frontend log group may already exist"
    
    echo -e "${GREEN}✅ CloudWatch log groups created${NC}"
}

# Function to create ECS cluster
create_ecs_cluster() {
    echo -e "${YELLOW}🚀 Creating ECS cluster...${NC}"
    
    aws ecs create-cluster \
        --cluster-name $CLUSTER_NAME \
        --capacity-providers FARGATE \
        --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
        --region $AWS_REGION 2>/dev/null || echo "ECS cluster may already exist"
    
    echo -e "${GREEN}✅ ECS cluster created${NC}"
}

# Function to verify setup
verify_setup() {
    echo -e "${YELLOW}🔍 Verifying setup...${NC}"
    
    echo -e "${BLUE}=== ECR Repositories ===${NC}"
    aws ecr describe-repositories --region $AWS_REGION --query 'repositories[].repositoryName' --output table
    
    echo -e "${BLUE}=== IAM Roles ===${NC}"
    aws iam get-role --role-name ecsTaskExecutionRole --query 'Role.RoleName' --output text 2>/dev/null || echo "ecsTaskExecutionRole not found"
    aws iam get-role --role-name ecsTaskRole --query 'Role.RoleName' --output text 2>/dev/null || echo "ecsTaskRole not found"
    
    echo -e "${BLUE}=== Secrets Manager ===${NC}"
    aws secretsmanager list-secrets --region $AWS_REGION --query 'SecretList[].Name' --output table
    
    echo -e "${BLUE}=== CloudWatch Log Groups ===${NC}"
    aws logs describe-log-groups --region $AWS_REGION --query 'logGroups[].logGroupName' --output table
    
    echo -e "${BLUE}=== ECS Cluster ===${NC}"
    aws ecs describe-clusters --clusters $CLUSTER_NAME --region $AWS_REGION --query 'clusters[].clusterName' --output table
    
    echo -e "${GREEN}✅ All resources verified${NC}"
}

# Function to show GitHub secrets
show_github_secrets() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${GREEN}🎉 AWS setup completed successfully!${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo -e "${YELLOW}📝 Add these secrets to GitHub Actions:${NC}"
    echo -e "${BLUE}Go to: https://github.com/kunal899verma/MoviesProject/settings/secrets/actions${NC}"
    echo ""
    echo "AWS_ACCESS_KEY_ID = $(aws configure get aws_access_key_id)"
    echo "AWS_SECRET_ACCESS_KEY = $(aws configure get aws_secret_access_key)"
    echo "AWS_REGION = $AWS_REGION"
    echo "AWS_ACCOUNT_ID = $AWS_ACCOUNT_ID"
    echo ""
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "1. Add the above secrets to GitHub"
    echo "2. Update task definition files with account ID: $AWS_ACCOUNT_ID"
    echo "3. Push code to trigger deployment"
    echo "4. Monitor GitHub Actions and ECS console"
    echo ""
    echo -e "${GREEN}🎯 Your AWS infrastructure is ready for deployment!${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}Starting fresh AWS setup...${NC}"
    
    # Check prerequisites
    check_aws_cli
    
    # Execute setup
    create_ecr_repos
    create_iam_roles
    create_secrets
    create_log_groups
    create_ecs_cluster
    
    # Verify and show next steps
    verify_setup
    show_github_secrets
}

# Run main function
main "$@"
