#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🚀 AWS Movie Management App - Terminal Setup${NC}"
echo -e "${BLUE}================================================${NC}"

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

# Function to check AWS CLI configuration
check_aws_cli() {
    echo -e "${YELLOW}🔍 Checking AWS CLI configuration...${NC}"
    
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not found. Please install AWS CLI first.${NC}"
        echo "Install with: brew install awscli"
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not configured. Please run 'aws configure' first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ AWS CLI configured successfully${NC}"
    aws sts get-caller-identity
}

# Function for cleanup
cleanup_aws() {
    echo -e "${YELLOW}🗑️ Starting cleanup phase...${NC}"
    
    # Stop services
    echo "Stopping ECS services..."
    aws ecs update-service --cluster $CLUSTER_NAME --service movie-backend-task-service-d8tedgl6 --desired-count 0 --region $AWS_REGION 2>/dev/null || true
    aws ecs update-service --cluster $CLUSTER_NAME --service movie-frontend-task-service-i306grln --desired-count 0 --region $AWS_REGION 2>/dev/null || true
    
    echo "Waiting 30 seconds for tasks to stop..."
    sleep 30
    
    # Delete services
    echo "Deleting ECS services..."
    aws ecs delete-service --cluster $CLUSTER_NAME --service movie-backend-task-service-d8tedgl6 --region $AWS_REGION 2>/dev/null || true
    aws ecs delete-service --cluster $CLUSTER_NAME --service movie-frontend-task-service-i306grln --region $AWS_REGION 2>/dev/null || true
    
    # Delete task definitions
    echo "Deregistering task definitions..."
    aws ecs list-task-definitions --family-prefix movie-backend-task --region $AWS_REGION --query 'taskDefinitionArns[]' --output text | xargs -I {} aws ecs deregister-task-definition --task-definition {} --region $AWS_REGION 2>/dev/null || true
    aws ecs list-task-definitions --family-prefix movie-frontend-task --region $AWS_REGION --query 'taskDefinitionArns[]' --output text | xargs -I {} aws ecs deregister-task-definition --task-definition {} --region $AWS_REGION 2>/dev/null || true
    
    # Delete cluster
    echo "Deleting ECS cluster..."
    aws ecs delete-cluster --cluster $CLUSTER_NAME --region $AWS_REGION 2>/dev/null || true
    
    # Delete ECR repositories
    echo "Deleting ECR repositories..."
    aws ecr delete-repository --repository-name movie-management-backend --force --region $AWS_REGION 2>/dev/null || true
    aws ecr delete-repository --repository-name movie-management-frontend --force --region $AWS_REGION 2>/dev/null || true
    
    # Delete secrets
    echo "Deleting secrets..."
    aws secretsmanager delete-secret --secret-id movie-management/mongodb-uri --force-delete-without-recovery --region $AWS_REGION 2>/dev/null || true
    aws secretsmanager delete-secret --secret-id movie-management/jwt-secret --force-delete-without-recovery --region $AWS_REGION 2>/dev/null || true
    
    # Delete log groups
    echo "Deleting CloudWatch log groups..."
    aws logs delete-log-group --log-group-name /ecs/movie-backend --region $AWS_REGION 2>/dev/null || true
    aws logs delete-log-group --log-group-name /ecs/movie-frontend --region $AWS_REGION 2>/dev/null || true
    
    # Delete IAM roles
    echo "Deleting IAM roles..."
    aws iam detach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 2>/dev/null || true
    aws iam detach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite 2>/dev/null || true
    aws iam delete-role --role-name ecsTaskExecutionRole 2>/dev/null || true
    aws iam delete-role --role-name ecsTaskRole 2>/dev/null || true
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Function for fresh setup
setup_aws() {
    echo -e "${YELLOW}🚀 Starting fresh setup phase...${NC}"
    
    # Create ECR repositories
    echo "Creating ECR repositories..."
    aws ecr create-repository \
        --repository-name movie-management-backend \
        --region $AWS_REGION \
        --image-scanning-configuration scanOnPush=true
    check_command "Backend ECR repository creation"
    
    aws ecr create-repository \
        --repository-name movie-management-frontend \
        --region $AWS_REGION \
        --image-scanning-configuration scanOnPush=true
    check_command "Frontend ECR repository creation"
    
    # Create IAM roles
    echo "Creating IAM roles..."
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
    check_command "ecsTaskExecutionRole creation"
    
    aws iam attach-role-policy \
        --role-name ecsTaskExecutionRole \
        --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
    
    aws iam attach-role-policy \
        --role-name ecsTaskExecutionRole \
        --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite
    
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
    check_command "ecsTaskRole creation"
    
    # Create secrets
    echo "Creating Secrets Manager secrets..."
    aws secretsmanager create-secret \
        --name movie-management/mongodb-uri \
        --description "MongoDB Atlas connection string" \
        --secret-string '{"MONGODB_URI":"mongodb+srv://movieuser:MoviePass123!@moviecluster.xxxxx.mongodb.net/movies?retryWrites=true&w=majority"}' \
        --region $AWS_REGION
    check_command "MongoDB URI secret creation"
    
    aws secretsmanager create-secret \
        --name movie-management/jwt-secret \
        --description "JWT secret key" \
        --secret-string '{"JWT_SECRET":"movie-jwt-secret-super-secure-2024-key-12345"}' \
        --region $AWS_REGION
    check_command "JWT secret creation"
    
    # Create log groups
    echo "Creating CloudWatch log groups..."
    aws logs create-log-group \
        --log-group-name /ecs/movie-backend \
        --region $AWS_REGION
    
    aws logs create-log-group \
        --log-group-name /ecs/movie-frontend \
        --region $AWS_REGION
    check_command "CloudWatch log groups creation"
    
    # Create ECS cluster
    echo "Creating ECS cluster..."
    aws ecs create-cluster \
        --cluster-name $CLUSTER_NAME \
        --capacity-providers FARGATE \
        --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
        --region $AWS_REGION
    check_command "ECS cluster creation"
    
    echo -e "${GREEN}✅ Fresh setup completed${NC}"
}

# Function to verify setup
verify_setup() {
    echo -e "${YELLOW}🔍 Verifying setup...${NC}"
    
    echo "=== ECR Repositories ==="
    aws ecr describe-repositories --region $AWS_REGION --query 'repositories[].repositoryName' --output table
    
    echo "=== IAM Roles ==="
    aws iam get-role --role-name ecsTaskExecutionRole --query 'Role.RoleName' --output text
    aws iam get-role --role-name ecsTaskRole --query 'Role.RoleName' --output text
    
    echo "=== Secrets Manager ==="
    aws secretsmanager list-secrets --region $AWS_REGION --query 'SecretList[].Name' --output table
    
    echo "=== CloudWatch Log Groups ==="
    aws logs describe-log-groups --region $AWS_REGION --query 'logGroups[].logGroupName' --output table
    
    echo "=== ECS Cluster ==="
    aws ecs describe-clusters --clusters $CLUSTER_NAME --region $AWS_REGION --query 'clusters[].clusterName' --output table
    
    echo -e "${GREEN}✅ All resources verified successfully${NC}"
}

# Function to show next steps
show_next_steps() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${GREEN}🎉 AWS setup completed successfully!${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "1. 🍃 Setup MongoDB Atlas cluster:"
    echo "   - Go to https://www.mongodb.com/atlas"
    echo "   - Create free cluster"
    echo "   - Update the MongoDB URI secret with real connection string"
    echo ""
    echo "2. 🔐 Update GitHub secrets:"
    echo "   - Go to https://github.com/kunal899verma/MoviesProject/settings/secrets/actions"
    echo "   - Add: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_ACCOUNT_ID"
    echo ""
    echo "3. 🚀 Deploy application:"
    echo "   git add ."
    echo "   git commit -m \"Fresh AWS setup via terminal\""
    echo "   git push origin main"
    echo ""
    echo "4. 📊 Monitor deployment:"
    echo "   - GitHub Actions: https://github.com/kunal899verma/MoviesProject/actions"
    echo "   - ECS Console: https://console.aws.amazon.com/ecs/home?region=eu-north-1"
    echo ""
    echo -e "${GREEN}🎯 Your AWS infrastructure is ready!${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}Starting AWS setup process...${NC}"
    
    # Check prerequisites
    check_aws_cli
    
    # Ask user for confirmation
    echo -e "${YELLOW}⚠️  This will reset your entire AWS setup. Continue? (y/N)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    
    # Execute setup
    cleanup_aws
    setup_aws
    verify_setup
    show_next_steps
}

# Run main function
main "$@"
