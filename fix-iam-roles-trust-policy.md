# 🚨 CRITICAL FIX: IAM Role Trust Policies

## **ROOT CAUSE IDENTIFIED:**
Your ECS services are failing because the IAM roles don't have proper trust relationships. The error shows:
```
ECS was unable to assume the role 'arn:aws:iam::042692045049:role/ecsTaskRole'
```

## **🔧 IMMEDIATE FIXES REQUIRED:**

### **1. Fix ecsTaskExecutionRole Trust Policy**

**AWS Console** → **IAM** → **Roles** → **ecsTaskExecutionRole** → **Trust relationships** → **Edit trust policy**

Replace with this EXACT policy:
```json
{
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
}
```

### **2. Fix ecsTaskRole Trust Policy**

**AWS Console** → **IAM** → **Roles** → **ecsTaskRole** → **Trust relationships** → **Edit trust policy**

Replace with this EXACT policy:
```json
{
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
}
```

### **3. Add Secrets Manager Permissions**

**ecsTaskExecutionRole** → **Permissions** → **Add permissions** → **Attach policies**

Add these policies:
- `AmazonECSTaskExecutionRolePolicy` (should already exist)
- `SecretsManagerReadWrite` (add this)

### **4. Create Missing Secrets in Secrets Manager**

**AWS Console** → **Secrets Manager** → **Store a new secret**

**Secret 1:**
- Secret type: Other type of secret
- Key: `MONGODB_URI`
- Value: `mongodb://your-mongodb-connection-string`
- Secret name: `movie-management/mongodb-uri`
- Region: `eu-north-1`

**Secret 2:**
- Secret type: Other type of secret  
- Key: `JWT_SECRET`
- Value: `your-jwt-secret-key-here`
- Secret name: `movie-management/jwt-secret`
- Region: `eu-north-1`

## **🚀 AFTER FIXING:**
1. **Re-run GitHub Actions deployment**
2. **Services should start successfully**
3. **Tasks will launch and run**

**These trust policy fixes are CRITICAL for ECS to work!** 🎯
