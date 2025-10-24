# 🚨 DEPLOYMENT FIX GUIDE

## **ERROR ANALYSIS:**
GitHub Actions fail हो रहा है क्योंकि AWS credentials missing हैं।

## **🔧 IMMEDIATE FIX STEPS:**

### **Step 1: AWS Account Setup**

#### **1.1 AWS Account बनाएं:**
1. [AWS Console](https://aws.amazon.com) पर जाएं
2. **Create Account** → **Free Tier** select करें**
3. Account verification complete करें

#### **1.2 IAM User Create करें:**
1. **AWS Console** → **IAM** → **Users** → **Create User**
2. **User Name**: `github-actions-deploy`
3. **Access Type**: `Programmatic access`
4. **Permissions**: `AdministratorAccess` (temporary)
5. **Create User** → **Download .csv file**

### **Step 2: GitHub Secrets Setup**

#### **2.1 GitHub Repository में जाएं:**
1. [https://github.com/kunal899verma/MoviesProject](https://github.com/kunal899verma/MoviesProject)
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** click करें

#### **2.2 Add These Secrets:**
```
Name: AWS_ACCESS_KEY_ID
Value: AKIA... (from downloaded CSV)

Name: AWS_SECRET_ACCESS_KEY
Value: your-secret-key (from downloaded CSV)

Name: AWS_ACCOUNT_ID
Value: 123456789012 (your AWS account ID)
```

### **Step 3: AWS Infrastructure Deploy करें**

#### **3.1 CloudFormation Stack Deploy करें:**
```bash
# AWS CLI install करें (if not installed)
curl "https://awscli.amazonaws.com/awscli-exe-macos.pkg" -o "awscliv2.pkg"
sudo installer -pkg awscliv2.pkg -target /

# AWS configure करें
aws configure

# Infrastructure deploy करें
aws cloudformation create-stack \
  --stack-name movie-management-infrastructure \
  --template-body file://aws-infrastructure.yml \
  --capabilities CAPABILITY_IAM
```

#### **3.2 ECR Repositories Create करें:**
```bash
# Backend repository
aws ecr create-repository \
  --repository-name movie-management-backend \
  --region us-east-1

# Frontend repository
aws ecr create-repository \
  --repository-name movie-management-frontend \
  --region us-east-1
```

### **Step 4: Task Definitions Update करें**

#### **4.1 Account ID Replace करें:**
Task definition files में `YOUR_ACCOUNT_ID` को actual account ID से replace करें:

**Backend Task Definition:**
```json
{
  "executionRoleArn": "arn:aws:iam::YOUR_ACTUAL_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::YOUR_ACTUAL_ACCOUNT_ID:role/ecsTaskRole",
  "image": "YOUR_ACTUAL_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/movie-management-backend:latest"
}
```

**Frontend Task Definition:**
```json
{
  "executionRoleArn": "arn:aws:iam::YOUR_ACTUAL_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::YOUR_ACTUAL_ACCOUNT_ID:role/ecsTaskRole",
  "image": "YOUR_ACTUAL_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/movie-management-frontend:latest"
}
```

### **Step 5: MongoDB Atlas Setup करें**

#### **5.1 MongoDB Atlas Account:**
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) पर जाएं
2. Free cluster create करें
3. Database user create करें
4. Network access allow करें

#### **5.2 Connection String:**
```bash
# MongoDB connection string example:
mongodb+srv://username:password@cluster.mongodb.net/movie-management?retryWrites=true&w=majority
```

### **Step 6: Test Deployment**

#### **6.1 Code Push करें:**
```bash
git add .
git commit -m "Fix deployment configuration"
git push origin main
```

#### **6.2 Monitor GitHub Actions:**
1. **GitHub Repository** → **Actions** tab
2. **Deploy to AWS** workflow देखें
3. **Build और Deploy** process monitor करें

## **🔍 TROUBLESHOOTING:**

### **Common Issues:**

#### **1. AWS Credentials Error:**
```
Error: Credentials could not be loaded
```
**Solution**: GitHub Secrets में AWS credentials add करें

#### **2. ECR Repository Not Found:**
```
Error: Repository does not exist
```
**Solution**: ECR repositories create करें

#### **3. Task Definition Error:**
```
Error: Task definition not found
```
**Solution**: Account ID replace करें task definitions में

#### **4. ECS Service Error:**
```
Error: Service does not exist
```
**Solution**: ECS services create करें

## **📊 SUCCESS CHECKLIST:**

- [ ] AWS Account created
- [ ] IAM User created with credentials
- [ ] GitHub Secrets added
- [ ] CloudFormation stack deployed
- [ ] ECR repositories created
- [ ] Task definitions updated
- [ ] MongoDB Atlas configured
- [ ] GitHub Actions workflow running
- [ ] ECS services deployed
- [ ] Application accessible

## **🚀 EXPECTED RESULT:**

After completing these steps:
1. **GitHub Actions** → Success ✅
2. **AWS ECS** → Services running ✅
3. **Application** → Live and accessible ✅
4. **Automatic Deployment** → Working ✅

**🎉 आपका Movie Management Application AWS पर live हो जाएगा! 🎉**
