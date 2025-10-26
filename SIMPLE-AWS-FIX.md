# 🚀 SIMPLE AWS FIX - 3 STEPS TO SUCCESS

## **CURRENT ISSUE:**
`Error: Resource is not in the state servicesStable`

This means ECS tasks can't start. Here's the SIMPLE fix:

---

## **🔧 STEP 1: FIX IAM ROLES (2 minutes)**

### **Fix ecsTaskExecutionRole:**
1. **AWS Console** → **IAM** → **Roles** → **ecsTaskExecutionRole**
2. **Trust relationships** → **Edit trust policy**
3. **Replace ALL content** with this:
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
4. **Save changes**

### **Fix ecsTaskRole:**
1. **AWS Console** → **IAM** → **Roles** → **ecsTaskRole**
2. **Trust relationships** → **Edit trust policy**
3. **Replace ALL content** with the SAME JSON above
4. **Save changes**

---

## **🔐 STEP 2: CREATE SECRETS (1 minute)**

### **Secret 1:**
1. **AWS Console** → **Secrets Manager** → **Store a new secret**
2. **Secret type**: Other type of secret
3. **Key**: `MONGODB_URI`
4. **Value**: `mongodb://localhost:27017/movies`
5. **Secret name**: `movie-management/mongodb-uri`
6. **Create secret**

### **Secret 2:**
1. **Store a new secret**
2. **Secret type**: Other type of secret
3. **Key**: `JWT_SECRET`
4. **Value**: `simple-jwt-secret-for-interview`
5. **Secret name**: `movie-management/jwt-secret`
6. **Create secret**

---

## **🚀 STEP 3: RESTART DEPLOYMENT**

1. **Go to GitHub Actions**
2. **Cancel current deployment** (if still running)
3. **Re-run workflow**
4. **Should work in 3-5 minutes!**

---

## **✅ THAT'S IT!**

**Total time: ~5 minutes**
**Your Movie Management App will be live on AWS!** 🎬

The key was fixing the IAM trust policies - that's what was blocking everything!
