# 🔍 AWS VERIFICATION CHECKLIST

## **PLEASE SHARE SCREENSHOTS OF THESE AWS CONSOLE PAGES:**

### **1. IAM ROLES - TRUST POLICIES** ⭐ CRITICAL
**Screenshots needed:**
- **ecsTaskExecutionRole** → Trust relationships tab
- **ecsTaskRole** → Trust relationships tab

**What I need to verify:**
- Trust policy shows `"Service": "ecs-tasks.amazonaws.com"`
- No other principals or conditions
- Exact JSON matches EXACT-IAM-TRUST-POLICY.json

---

### **2. IAM ROLES - PERMISSIONS** ⭐ CRITICAL
**Screenshots needed:**
- **ecsTaskExecutionRole** → Permissions tab
- **ecsTaskRole** → Permissions tab

**What I need to verify:**
- ecsTaskExecutionRole has `AmazonECSTaskExecutionRolePolicy`
- ecsTaskExecutionRole has Secrets Manager permissions
- ecsTaskRole exists (can be empty for basic setup)

---

### **3. SECRETS MANAGER** ⭐ CRITICAL
**Screenshots needed:**
- Secrets Manager main page showing both secrets
- Click on `movie-management/mongodb-uri` → Overview tab
- Click on `movie-management/jwt-secret` → Overview tab

**What I need to verify:**
- Both secrets exist in `eu-north-1` region
- Secret names are EXACTLY: `movie-management/mongodb-uri` and `movie-management/jwt-secret`
- Secrets are not pending deletion

---

### **4. ECS CLUSTER STATUS**
**Screenshots needed:**
- ECS Clusters page showing `movie-management-cluster`
- Click on cluster → Services tab
- Click on cluster → Tasks tab

**What I need to verify:**
- Cluster is Active
- Services exist and their current status
- Any running or failed tasks

---

### **5. ECS SERVICES DETAILS**
**Screenshots needed:**
- `movie-backend-task-service-d8tedgl6` → Service overview
- `movie-backend-task-service-d8tedgl6` → Events tab
- `movie-frontend-task-service-i306grln` → Service overview
- `movie-frontend-task-service-i306grln` → Events tab

**What I need to verify:**
- Service status and deployment state
- Recent events and error messages
- Task definition revisions being used

---

### **6. ECR REPOSITORIES**
**Screenshots needed:**
- ECR main page showing both repositories
- `movie-management-backend` repository → Images tab
- `movie-management-frontend` repository → Images tab

**What I need to verify:**
- Both repositories exist in `eu-north-1`
- Recent images are pushed (check timestamps)
- Image tags match GitHub commit SHA

---

## **🎯 PRIORITY ORDER:**
1. **IAM Roles Trust Policies** (most critical)
2. **Secrets Manager** (second most critical)
3. **ECS Services Events** (shows current errors)
4. **ECR Images** (confirms builds worked)
5. **ECS Cluster Status** (overall health)

## **📸 HOW TO SHARE:**
Share screenshots of each section above. I'll analyze them and tell you exactly what needs to be fixed!

**Start with IAM Roles - that's likely where the issue is!** 🎯
