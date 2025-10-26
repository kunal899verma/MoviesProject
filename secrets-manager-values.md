# 🔐 Secrets Manager Configuration

## **SECRET 1: MongoDB URI**

**Secret Configuration:**
- **Secret type**: Other type of secret
- **Key**: `MONGODB_URI`
- **Value**: `mongodb://localhost:27017/movie-management`
- **Secret name**: `movie-management/mongodb-uri`
- **Region**: `eu-north-1`

## **SECRET 2: JWT Secret**

**Secret Configuration:**
- **Secret type**: Other type of secret
- **Key**: `JWT_SECRET`
- **Value**: `movie-jwt-secret-key-2024-super-secure-random-string-12345`
- **Secret name**: `movie-management/jwt-secret`
- **Region**: `eu-north-1`

## **📋 STEP-BY-STEP:**

1. **Change to "Other type of secret"** (not RDS database)
2. **Add key-value pair** for each secret
3. **Use exact secret names** (movie-management/mongodb-uri and movie-management/jwt-secret)
4. **Create in eu-north-1 region**

## **🚀 AFTER CREATING BOTH SECRETS:**
- Re-run GitHub Actions deployment
- Services should start successfully
- Your Movie Management App will be LIVE! 🎬

**Note**: You can use these sample values for testing, or replace with your actual MongoDB connection string if you have one.
