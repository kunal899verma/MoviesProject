# 🚀 Create AWS Resources in eu-north-1 Region

## ❌ **CURRENT ERROR:**
```
Error: Cluster not found.
```

The ECS cluster `imaginary-eagle-7g4dse` doesn't exist in the `eu-north-1` region.

## ✅ **SOLUTION: Create Required AWS Resources**

### **Step 1: Create ECS Cluster**
1. **AWS Console** → **ECS** → **Clusters**
2. **Create cluster** button
3. **Cluster name**: `imaginary-eagle-7g4dse`
4. **Infrastructure**: **AWS Fargate**
5. **Region**: **eu-north-1** (Stockholm)
6. **Create cluster**

### **Step 2: Create CloudWatch Log Groups**
1. **AWS Console** → **CloudWatch** → **Logs** → **Log groups**
2. **Region**: **eu-north-1** (Stockholm)

#### Backend Log Group:
- **Create log group**
- **Log group name**: `/ecs/movie-backend`
- **Create log group**

#### Frontend Log Group:
- **Create log group**
- **Log group name**: `/ecs/movie-frontend`
- **Create log group**

### **Step 3: Create IAM Roles**
1. **AWS Console** → **IAM** → **Roles**
2. **Region**: **Global** (IAM is global)

#### ECS Task Execution Role:
- **Create role**
- **Use case**: **ECS** → **ECS Task**
- **Role name**: `ecsTaskExecutionRole`
- **Attach policy**: ✅ **AmazonECSTaskExecutionRolePolicy**
- **Create role**

#### ECS Task Role:
- **Create role**
- **Use case**: **ECS** → **ECS Task**
- **Role name**: `ecsTaskRole`
- **Create role**

### **Step 4: Create Secrets Manager Secrets**
1. **AWS Console** → **Secrets Manager** → **Secrets**
2. **Region**: **eu-north-1** (Stockholm)

#### MongoDB URI Secret:
- **Store a new secret**
- **Secret name**: `movie-management/mongodb-uri`
- **Secret value**: `mongodb+srv://username:password@cluster.mongodb.net/movie-management?retryWrites=true&w=majority`
- **Store**

#### JWT Secret:
- **Store a new secret**
- **Secret name**: `movie-management/jwt-secret`
- **Secret value**: `your-super-secret-jwt-key-here`
- **Store**

## 🔧 **ALTERNATIVE: AWS CLI Commands**

If you prefer using AWS CLI, run these commands:

```bash
# Set region
export AWS_DEFAULT_REGION=eu-north-1

# Create ECS cluster
aws ecs create-cluster --cluster-name imaginary-eagle-7g4dse --region eu-north-1

# Create log groups
aws logs create-log-group --log-group-name /ecs/movie-backend --region eu-north-1
aws logs create-log-group --log-group-name /ecs/movie-frontend --region eu-north-1

# Create IAM roles
aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "ecs-tasks.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}'

aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam create-role --role-name ecsTaskRole --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "ecs-tasks.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}'

# Create secrets
aws secretsmanager create-secret --name movie-management/mongodb-uri --secret-string "mongodb+srv://username:password@cluster.mongodb.net/movie-management?retryWrites=true&w=majority" --region eu-north-1

aws secretsmanager create-secret --name movie-management/jwt-secret --secret-string "your-super-secret-jwt-key-here" --region eu-north-1
```

## 📋 **VERIFICATION CHECKLIST**

After creating resources, verify these exist in **eu-north-1** region:

- ✅ **ECS Cluster**: `imaginary-eagle-7g4dse`
- ✅ **ECR Repositories**: `movie-management-backend`, `movie-management-frontend` (already exist)
- ✅ **Log Groups**: `/ecs/movie-backend`, `/ecs/movie-frontend`
- ✅ **IAM Roles**: `ecsTaskExecutionRole`, `ecsTaskRole` (global)
- ✅ **Secrets**: `movie-management/mongodb-uri`, `movie-management/jwt-secret`

## 🚀 **AFTER CREATING RESOURCES**

1. **Go to GitHub Actions**: https://github.com/kunal899verma/MoviesProject/actions
2. **Re-run the failed deployment**
3. **Monitor progress** - should now succeed

## 🎯 **EXPECTED RESULT**

After creating all resources:
- ✅ **ECS cluster** exists for deployment
- ✅ **Task definitions** will be registered
- ✅ **ECS services** will be created
- ✅ **Movie Management App** will be live on AWS

**The deployment should succeed once all resources are created in eu-north-1! 🎬**
