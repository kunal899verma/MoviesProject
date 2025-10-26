# 🚀 COMPLETE FRESH SETUP GUIDE - Zero to Production

## 🎯 **OVERVIEW**
Fresh AWS account के साथ complete setup - MongoDB से AWS तक सब कुछ step-by-step।

---

## 📊 **PHASE 1: MONGODB ATLAS SETUP (CRITICAL FIRST STEP)**

### **Step 1: Create MongoDB Atlas Account**

1. **Go to**: https://www.mongodb.com/atlas
2. **Click**: "Try Free"
3. **Sign up** with email या Google account
4. **Verify email** if required

### **Step 2: Create Organization & Project**

1. **Organization Name**: `MovieManagement` (या कोई भी नाम)
2. **Project Name**: `MovieProject`
3. **Click**: "Create Project"

### **Step 3: Create Free Cluster**

1. **Click**: "Build a Database"
2. **Choose**: **FREE (M0 Sandbox)** - $0/month
3. **Cloud Provider**: **AWS**
4. **Region**: **eu-north-1 (Stockholm)** (AWS region के साथ match करने के लिए)
5. **Cluster Name**: `MovieCluster`
6. **Click**: "Create Cluster"

⏱️ **Wait**: 3-5 minutes for cluster creation

### **Step 4: Create Database User**

1. **Security** → **Database Access**
2. **Click**: "Add New Database User"
3. **Authentication Method**: Password
4. **Username**: `movieuser`
5. **Password**: `MoviePass123!` (strong password)
6. **Database User Privileges**: **Read and write to any database**
7. **Click**: "Add User"

### **Step 5: Configure Network Access**

1. **Security** → **Network Access**
2. **Click**: "Add IP Address"
3. **Access List Entry**: `0.0.0.0/0` (Allow access from anywhere)
4. **Comment**: `Allow all IPs for ECS deployment`
5. **Click**: "Confirm"

⚠️ **Important**: Production में specific IPs use करें, लेकिन development के लिए यह OK है।

### **Step 6: Get Connection String**

1. **Deployment** → **Clusters**
2. **Click**: "Connect" on your cluster
3. **Choose**: "Connect your application"
4. **Driver**: **Node.js**
5. **Version**: **4.1 or later**
6. **Copy connection string**:

```
mongodb+srv://movieuser:<password>@moviecluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

7. **Replace** `<password>` with `MoviePass123!`
8. **Add database name** `/movies` before the `?`:

**Final Connection String**:
```
mongodb+srv://movieuser:MoviePass123!@moviecluster.xxxxx.mongodb.net/movies?retryWrites=true&w=majority
```

### **Step 7: Test Connection (Optional)**

1. **Click**: "Connect" → "Connect with MongoDB Compass"
2. **Download MongoDB Compass** (GUI tool)
3. **Test connection** with your connection string
4. **Create database**: `movies`
5. **Create collections**: `users`, `movies`

✅ **MongoDB Atlas Setup Complete!**

---

## ☁️ **PHASE 2: AWS FRESH SETUP**

### **Step 1: AWS Account Verification**

1. **Login to**: https://console.aws.amazon.com/
2. **Verify**: Account is active and billing is setup
3. **Check region**: Switch to **eu-north-1 (Stockholm)**

### **Step 2: Create IAM User for CLI/Deployment**

#### **2.1: Create IAM User**
1. **Go to**: https://console.aws.amazon.com/iam/home#/users
2. **Click**: "Create user"
3. **User name**: `movie-deployment-user`
4. **Select**: "Provide user access to the AWS Management Console" (optional)
5. **Console password**: Custom password या Auto-generated
6. **Click**: "Next"

#### **2.2: Attach Policies**
1. **Permission options**: "Attach policies directly"
2. **Search and select these policies**:
   - ✅ `AdministratorAccess` (for full setup - production में restrict करें)
   - या specific policies:
     - `AmazonECS_FullAccess`
     - `AmazonEC2ContainerRegistryFullAccess`
     - `IAMFullAccess`
     - `SecretsManagerReadWrite`
     - `CloudWatchFullAccess`
3. **Click**: "Next" → "Create user"

#### **2.3: Create Access Keys**
1. **Click** on created user: `movie-deployment-user`
2. **Security credentials** tab
3. **Access keys** → "Create access key"
4. **Use case**: "Command Line Interface (CLI)"
5. **Confirmation**: ✅ Check the box
6. **Click**: "Next"
7. **Description**: `Movie Management App Deployment`
8. **Click**: "Create access key"
9. **Download .csv file** या copy keys:
   - **Access Key ID**: `AKIA...`
   - **Secret Access Key**: `...`

⚠️ **CRITICAL**: Save these keys securely - आप इन्हें दोबारा नहीं देख सकेंगे!

### **Step 3: Configure AWS CLI**

```bash
aws configure

# Enter details:
AWS Access Key ID: AKIA... (your new access key)
AWS Secret Access Key: ... (your new secret key)
Default region name: eu-north-1
Default output format: json
```

### **Step 4: Verify AWS CLI**

```bash
# Test connection
aws sts get-caller-identity

# Should return:
{
    "UserId": "AIDA...",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/movie-deployment-user"
}
```

---

## 🏗️ **PHASE 3: AWS INFRASTRUCTURE SETUP**

### **Step 1: Create ECR Repositories**

#### **Via AWS Console**:
1. **Go to**: https://console.aws.amazon.com/ecr/repositories?region=eu-north-1
2. **Click**: "Create repository"

**Backend Repository**:
- **Repository name**: `movie-management-backend`
- **Tag immutability**: Disabled
- **Scan on push**: ✅ Enabled
- **KMS encryption**: Disabled
- **Click**: "Create repository"

**Frontend Repository**:
- **Repository name**: `movie-management-frontend`
- **Same settings as above**
- **Click**: "Create repository"

#### **Via CLI**:
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

### **Step 2: Create IAM Roles for ECS**

#### **2.1: ecsTaskExecutionRole**

**Via Console**:
1. **Go to**: https://console.aws.amazon.com/iam/home#/roles
2. **Click**: "Create role"
3. **Trusted entity type**: AWS service
4. **Use case**: Elastic Container Service → Elastic Container Service Task
5. **Click**: "Next"
6. **Add permissions**:
   - ✅ `AmazonECSTaskExecutionRolePolicy`
   - ✅ `SecretsManagerReadWrite`
7. **Role name**: `ecsTaskExecutionRole`
8. **Click**: "Create role"

**Via CLI**:
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

#### **2.2: ecsTaskRole**

**Via Console**:
1. **Create role** (same process)
2. **Use case**: Elastic Container Service Task
3. **Skip permissions** (no policies needed for basic setup)
4. **Role name**: `ecsTaskRole`

**Via CLI**:
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

### **Step 3: Create Secrets Manager Secrets**

#### **3.1: MongoDB URI Secret**

**Via Console**:
1. **Go to**: https://console.aws.amazon.com/secretsmanager/home?region=eu-north-1
2. **Click**: "Store a new secret"
3. **Secret type**: Other type of secret
4. **Key/value pairs**:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://movieuser:MoviePass123!@moviecluster.xxxxx.mongodb.net/movies?retryWrites=true&w=majority`
5. **Next**
6. **Secret name**: `movie-management/mongodb-uri`
7. **Description**: `MongoDB Atlas connection string for Movie Management App`
8. **Next** → **Next** → **Store**

**Via CLI**:
```bash
aws secretsmanager create-secret \
  --name movie-management/mongodb-uri \
  --description "MongoDB Atlas connection string" \
  --secret-string '{"MONGODB_URI":"mongodb+srv://movieuser:MoviePass123!@moviecluster.xxxxx.mongodb.net/movies?retryWrites=true&w=majority"}' \
  --region eu-north-1
```

#### **3.2: JWT Secret**

**Via Console**:
1. **Store a new secret**
2. **Secret type**: Other type of secret
3. **Key/value pairs**:
   - **Key**: `JWT_SECRET`
   - **Value**: `movie-jwt-secret-super-secure-2024-key-12345`
4. **Secret name**: `movie-management/jwt-secret`
5. **Description**: `JWT secret key for authentication`

**Via CLI**:
```bash
aws secretsmanager create-secret \
  --name movie-management/jwt-secret \
  --description "JWT secret key" \
  --secret-string '{"JWT_SECRET":"movie-jwt-secret-super-secure-2024-key-12345"}' \
  --region eu-north-1
```

### **Step 4: Create CloudWatch Log Groups**

**Via Console**:
1. **Go to**: https://console.aws.amazon.com/cloudwatch/home?region=eu-north-1#logsV2:log-groups
2. **Create log group**
3. **Log group name**: `/ecs/movie-backend`
4. **Retention setting**: 30 days
5. **Create**
6. **Repeat for**: `/ecs/movie-frontend`

**Via CLI**:
```bash
aws logs create-log-group \
  --log-group-name /ecs/movie-backend \
  --region eu-north-1

aws logs create-log-group \
  --log-group-name /ecs/movie-frontend \
  --region eu-north-1
```

### **Step 5: Create ECS Cluster**

**Via Console**:
1. **Go to**: https://console.aws.amazon.com/ecs/home?region=eu-north-1#/clusters
2. **Click**: "Create cluster"
3. **Cluster name**: `movie-management-cluster`
4. **Infrastructure**: AWS Fargate (serverless)
5. **Create**

**Via CLI**:
```bash
aws ecs create-cluster \
  --cluster-name movie-management-cluster \
  --capacity-providers FARGATE \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
  --region eu-north-1
```

---

## 🔐 **PHASE 4: GITHUB ACTIONS SETUP**

### **Step 1: Get Your AWS Account ID**

```bash
aws sts get-caller-identity --query Account --output text
```

### **Step 2: Update GitHub Secrets**

1. **Go to**: https://github.com/kunal899verma/MoviesProject/settings/secrets/actions
2. **Click**: "New repository secret" for each:

```
AWS_ACCESS_KEY_ID = AKIA... (your access key)
AWS_SECRET_ACCESS_KEY = ... (your secret key)
AWS_REGION = eu-north-1
AWS_ACCOUNT_ID = 123456789012 (your account ID)
```

### **Step 3: Update Task Definition Files**

आपको project में task definition files update करनी होंगी:

1. **Find files**: `.aws/task-definition-backend.json` और `.aws/task-definition-frontend.json`
2. **Replace**: `YOUR_ACCOUNT_ID` with your actual account ID
3. **Update**: Region to `eu-north-1` if needed

---

## 🧪 **PHASE 5: TESTING & DEPLOYMENT**

### **Step 1: Test MongoDB Connection**

```bash
# Install MongoDB shell (optional)
brew tap mongodb/brew
brew install mongodb-community-shell

# Test connection
mongosh "mongodb+srv://movieuser:MoviePass123!@moviecluster.xxxxx.mongodb.net/movies"
```

### **Step 2: Verify AWS Resources**

```bash
# Check ECR repositories
aws ecr describe-repositories --region eu-north-1

# Check IAM roles
aws iam get-role --role-name ecsTaskExecutionRole
aws iam get-role --role-name ecsTaskRole

# Check secrets
aws secretsmanager list-secrets --region eu-north-1

# Check ECS cluster
aws ecs describe-clusters --clusters movie-management-cluster --region eu-north-1
```

### **Step 3: Deploy Application**

```bash
# Commit and push to trigger GitHub Actions
git add .
git commit -m "Fresh AWS setup - ready for deployment"
git push origin main
```

### **Step 4: Monitor Deployment**

1. **GitHub Actions**: https://github.com/kunal899verma/MoviesProject/actions
2. **ECS Console**: https://console.aws.amazon.com/ecs/home?region=eu-north-1
3. **CloudWatch Logs**: https://console.aws.amazon.com/cloudwatch/home?region=eu-north-1#logsV2:log-groups

---

## ✅ **VERIFICATION CHECKLIST**

### **MongoDB Atlas**:
- [ ] Cluster created and running
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string tested

### **AWS Infrastructure**:
- [ ] ECR repositories created
- [ ] IAM roles created with correct trust policies
- [ ] Secrets Manager secrets created
- [ ] CloudWatch log groups created
- [ ] ECS cluster created

### **GitHub Integration**:
- [ ] GitHub secrets updated
- [ ] Task definition files updated
- [ ] Repository has latest code

### **Deployment**:
- [ ] GitHub Actions runs successfully
- [ ] Docker images pushed to ECR
- [ ] ECS services created and running
- [ ] Application accessible

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**:

1. **MongoDB Connection Failed**:
   - Check cluster is running
   - Verify connection string
   - Check network access settings

2. **AWS Permissions**:
   - Verify IAM user has required policies
   - Check AWS CLI configuration
   - Ensure correct region (eu-north-1)

3. **GitHub Actions Failed**:
   - Check GitHub secrets are correct
   - Verify AWS credentials
   - Check task definition files

4. **ECS Tasks Failing**:
   - Check CloudWatch logs
   - Verify secrets exist and are accessible
   - Check IAM role trust policies

---

## 🎯 **SUCCESS METRICS**

आपका setup successful है अगर:
- ✅ MongoDB Atlas cluster accessible है
- ✅ AWS resources properly created हैं
- ✅ GitHub Actions successfully deploy करता है
- ✅ ECS services running हैं
- ✅ Application frontend और backend accessible हैं

---

**🚀 Follow this guide step-by-step for guaranteed success!**
