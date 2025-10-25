# 🔧 ECS Service-Linked Role Manual Creation

## 🚨 **CRITICAL ISSUE**: ECS Service-Linked Role Missing

The ECS cluster creation is failing because the `AWSServiceRoleForECS` service-linked role doesn't exist. Here's how to create it manually:

## **🔧 SOLUTION: Create Service-Linked Role via AWS CLI**

### **Step 1: Try AWS CLI Command**

Open your terminal and run:

```bash
aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com
```

### **Step 2: If CLI Doesn't Work, Use AWS Console**

1. **AWS Console** → **IAM** → **Roles**
2. **Create role** button
3. **Use case**: **AWS service** → **Elastic Container Service**
4. **Use case**: **Elastic Container Service** (select the second option)
5. **Next** button
6. **Role name**: `AWSServiceRoleForECS` (exact name required)
7. **Description**: `Service-linked role for Amazon ECS`
8. **Create role**

## **🔧 ALTERNATIVE: Use AWS CLI with Different Approach**

If the above doesn't work, try this command:

```bash
aws iam create-service-linked-role \
  --aws-service-name ecs.amazonaws.com \
  --description "Service-linked role for Amazon ECS"
```

## **🔧 VERIFICATION**

After creating the role, verify it exists:

```bash
aws iam get-role --role-name AWSServiceRoleForECS
```

## **🔧 THEN CREATE ECS CLUSTER**

Once the service-linked role exists:

1. **AWS Console** → **ECS** → **Clusters** → **Create cluster**
2. **Cluster name**: `movie-management-cluster`
3. **Infrastructure**: **AWS Fargate** (serverless)
4. **Create cluster**

## **📋 COMPLETE SETUP ORDER**

1. **✅ Create ECR Repositories** (if not done already)
2. **✅ Create ECS Service-Linked Role** (this step)
3. **✅ Create ECS Cluster** (after service-linked role)
4. **✅ Create CloudWatch Log Groups**
5. **✅ Create IAM Roles**
6. **✅ Create Secrets Manager Secrets**
7. **✅ Update GitHub Secrets**
8. **✅ Trigger Deployment**

## **🚨 IMPORTANT NOTES**

- The service-linked role **MUST** be created before the ECS cluster
- The role name **MUST** be exactly `AWSServiceRoleForECS`
- This role is automatically created by AWS in some regions, but not all
- If you're in a region where it doesn't exist, you need to create it manually

## **🎯 EXPECTED RESULT**

After creating the service-linked role:
- ECS cluster creation will succeed
- All other resources can be created
- GitHub Actions deployment will work

**The service-linked role is the missing piece! Once created, everything will work! 🎬**
