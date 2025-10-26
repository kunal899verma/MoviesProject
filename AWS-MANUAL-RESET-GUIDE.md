# 🖱️ AWS MANUAL RESET GUIDE (Console Method)

## 🎯 **यह guide AWS Console के through manual reset के लिए है**

---

## 🗑️ **PHASE 1: MANUAL CLEANUP (AWS Console)**

### **Step 1: Delete ECS Services**

1. **Go to**: https://console.aws.amazon.com/ecs/home?region=eu-north-1#/clusters
2. **Click**: `movie-management-cluster`
3. **Services tab** में जाएं
4. **Select**: `movie-backend-task-service-d8tedgl6`
5. **Update** → **Desired count: 0** → **Update service**
6. **Wait 2 minutes**
7. **Delete** → **Type service name** → **Delete**
8. **Repeat for**: `movie-frontend-task-service-i306grln`

### **Step 2: Delete Task Definitions**

1. **Go to**: https://console.aws.amazon.com/ecs/home?region=eu-north-1#/taskDefinitions
2. **Select**: `movie-backend-task`
3. **Actions** → **Deregister** → **Deregister**
4. **Repeat for**: `movie-frontend-task`

### **Step 3: Delete ECS Cluster**

1. **Go to**: https://console.aws.amazon.com/ecs/home?region=eu-north-1#/clusters
2. **Select**: `movie-management-cluster`
3. **Delete cluster** → **Type cluster name** → **Delete**

### **Step 4: Delete ECR Repositories**

1. **Go to**: https://console.aws.amazon.com/ecr/repositories?region=eu-north-1
2. **Select**: `movie-management-backend`
3. **Delete** → **Type "delete"** → **Delete**
4. **Repeat for**: `movie-management-frontend`

### **Step 5: Delete Secrets Manager**

1. **Go to**: https://console.aws.amazon.com/secretsmanager/home?region=eu-north-1
2. **Select**: `movie-management/mongodb-uri`
3. **Actions** → **Delete secret**
4. **Schedule deletion**: **7 days** → **Schedule deletion**
5. **Immediately delete**: **Delete secret** → **Type secret name** → **Delete**
6. **Repeat for**: `movie-management/jwt-secret`

### **Step 6: Delete CloudWatch Log Groups**

1. **Go to**: https://console.aws.amazon.com/cloudwatch/home?region=eu-north-1#logsV2:log-groups
2. **Select**: `/ecs/movie-backend`
3. **Actions** → **Delete log group** → **Delete**
4. **Repeat for**: `/ecs/movie-frontend`

### **Step 7: Delete IAM Roles**

1. **Go to**: https://console.aws.amazon.com/iam/home#/roles
2. **Search**: `ecsTaskExecutionRole`
3. **Click on role**
4. **Permissions tab** → **Detach all policies**
5. **Trust relationships tab** → Note the policy
6. **Delete role** → **Type role name** → **Delete**
7. **Repeat for**: `ecsTaskRole`

---

## 🚀 **PHASE 2: MANUAL RECREATION (AWS Console)**

### **Step 1: Setup MongoDB Atlas (CRITICAL FIRST STEP)**

1. **Go to**: https://www.mongodb.com/atlas
2. **Sign up** for free account
3. **Create organization** → **Create project**
4. **Build a Database** → **FREE (M0 Sandbox)**
5. **Cloud Provider**: **AWS**
6. **Region**: **eu-north-1 (Stockholm)**
7. **Cluster Name**: `MovieCluster`
8. **Create Cluster**

#### **Database Access**:
1. **Database Access** → **Add New Database User**
2. **Username**: `movieuser`
3. **Password**: `MoviePass123!`
4. **Database User Privileges**: **Read and write to any database**
5. **Add User**

#### **Network Access**:
1. **Network Access** → **Add IP Address**
2. **Access List Entry**: `0.0.0.0/0` (Allow access from anywhere)
3. **Comment**: `Allow all IPs for ECS`
4. **Confirm**

#### **Get Connection String**:
1. **Clusters** → **Connect** → **Connect your application**
2. **Driver**: **Node.js**
3. **Copy connection string**:
   ```
   mongodb+srv://movieuser:MoviePass123!@moviecluster.xxxxx.mongodb.net/movies?retryWrites=true&w=majority
   ```
4. **Replace `<password>` with**: `MoviePass123!`
5. **Replace `<dbname>` with**: `movies`

### **Step 2: Create ECR Repositories**

1. **Go to**: https://console.aws.amazon.com/ecr/repositories?region=eu-north-1
2. **Create repository**
3. **Repository name**: `movie-management-backend`
4. **Tag immutability**: **Disabled**
5. **Scan on push**: **Enabled**
6. **KMS encryption**: **Disabled**
7. **Create repository**
8. **Repeat for**: `movie-management-frontend`

### **Step 3: Create IAM Roles**

#### **ecsTaskExecutionRole**:
1. **Go to**: https://console.aws.amazon.com/iam/home#/roles
2. **Create role**
3. **Trusted entity type**: **AWS service**
4. **Use case**: **Elastic Container Service** → **Elastic Container Service Task**
5. **Next**
6. **Add permissions**: 
   - Search and select: `AmazonECSTaskExecutionRolePolicy`
   - Search and select: `SecretsManagerReadWrite`
7. **Next**
8. **Role name**: `ecsTaskExecutionRole`
9. **Create role**

#### **ecsTaskRole**:
1. **Create role**
2. **Trusted entity type**: **AWS service**
3. **Use case**: **Elastic Container Service** → **Elastic Container Service Task**
4. **Next**
5. **Skip permissions** (no policies needed)
6. **Next**
7. **Role name**: `ecsTaskRole`
8. **Create role**

### **Step 4: Create Secrets Manager Secrets**

#### **MongoDB URI Secret**:
1. **Go to**: https://console.aws.amazon.com/secretsmanager/home?region=eu-north-1
2. **Store a new secret**
3. **Secret type**: **Other type of secret**
4. **Key/value pairs**:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://movieuser:MoviePass123!@moviecluster.xxxxx.mongodb.net/movies?retryWrites=true&w=majority`
5. **Next**
6. **Secret name**: `movie-management/mongodb-uri`
7. **Description**: `MongoDB Atlas connection string`
8. **Next** → **Next** → **Store**

#### **JWT Secret**:
1. **Store a new secret**
2. **Secret type**: **Other type of secret**
3. **Key/value pairs**:
   - **Key**: `JWT_SECRET`
   - **Value**: `movie-jwt-secret-super-secure-2024-key-12345`
4. **Next**
5. **Secret name**: `movie-management/jwt-secret`
6. **Description**: `JWT secret key for authentication`
7. **Next** → **Next** → **Store**

### **Step 5: Create CloudWatch Log Groups**

1. **Go to**: https://console.aws.amazon.com/cloudwatch/home?region=eu-north-1#logsV2:log-groups
2. **Create log group**
3. **Log group name**: `/ecs/movie-backend`
4. **Retention setting**: **30 days**
5. **Create**
6. **Repeat for**: `/ecs/movie-frontend`

### **Step 6: Create ECS Cluster**

1. **Go to**: https://console.aws.amazon.com/ecs/home?region=eu-north-1#/clusters
2. **Create cluster**
3. **Cluster name**: `movie-management-cluster`
4. **Infrastructure**: **AWS Fargate (serverless)**
5. **Create**

---

## 🔧 **PHASE 3: GITHUB SETUP**

### **Step 1: Update GitHub Secrets**

1. **Go to**: https://github.com/kunal899verma/MoviesProject/settings/secrets/actions
2. **New repository secret** for each:

```
AWS_ACCESS_KEY_ID = your-access-key-id
AWS_SECRET_ACCESS_KEY = your-secret-access-key  
AWS_REGION = eu-north-1
AWS_ACCOUNT_ID = 042692045049
```

### **Step 2: Test MongoDB Connection**

Before deploying, test your MongoDB Atlas connection:

1. **MongoDB Atlas** → **Clusters** → **Connect** → **Connect with MongoDB Compass**
2. **Download Compass** and test connection
3. **Create database**: `movies`
4. **Create collection**: `users`

---

## 🎯 **PHASE 4: DEPLOYMENT**

### **Step 1: Push Code to GitHub**

```bash
git add .
git commit -m "Fresh AWS setup - manual reset complete"
git push origin main
```

### **Step 2: Monitor GitHub Actions**

1. **Go to**: https://github.com/kunal899verma/MoviesProject/actions
2. **Watch deployment progress**
3. **Check for any errors**

### **Step 3: Verify ECS Services**

1. **Go to**: https://console.aws.amazon.com/ecs/home?region=eu-north-1#/clusters/movie-management-cluster/services
2. **Check both services are running**
3. **Check tasks are healthy**

---

## ✅ **VERIFICATION CHECKLIST**

### **After Cleanup:**
- [ ] All ECS services deleted
- [ ] ECS cluster deleted  
- [ ] ECR repositories deleted
- [ ] Secrets Manager secrets deleted
- [ ] CloudWatch log groups deleted
- [ ] IAM roles deleted

### **After Recreation:**
- [ ] MongoDB Atlas cluster running
- [ ] ECR repositories created
- [ ] IAM roles created with correct policies
- [ ] Secrets Manager secrets created
- [ ] CloudWatch log groups created
- [ ] ECS cluster created

### **After Deployment:**
- [ ] GitHub Actions successful
- [ ] ECR images pushed
- [ ] ECS services running
- [ ] Tasks healthy (no exit code 1)
- [ ] Application accessible

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues:**

1. **MongoDB Connection Failed**:
   - Check Atlas cluster is running
   - Verify connection string is correct
   - Ensure network access allows 0.0.0.0/0

2. **IAM Role Issues**:
   - Verify trust policy allows ecs-tasks.amazonaws.com
   - Check policies are attached correctly

3. **Secrets Manager Issues**:
   - Ensure secrets are in eu-north-1 region
   - Verify secret names are exact matches
   - Check key-value format is correct

4. **GitHub Actions Failed**:
   - Check AWS credentials in GitHub secrets
   - Verify account ID is correct (042692045049)
   - Ensure region is eu-north-1

---

**🎯 Follow this guide step-by-step for a complete fresh AWS setup!**
