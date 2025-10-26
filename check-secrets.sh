#!/bin/bash

echo "🔍 CHECKING AWS SECRETS MANAGER..."

echo "Checking movie-management/mongodb-uri..."
aws secretsmanager describe-secret --secret-id "movie-management/mongodb-uri" --region eu-north-1 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ mongodb-uri secret exists"
else
    echo "❌ mongodb-uri secret MISSING - needs to be created"
fi

echo ""
echo "Checking movie-management/jwt-secret..."
aws secretsmanager describe-secret --secret-id "movie-management/jwt-secret" --region eu-north-1 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ jwt-secret secret exists"
else
    echo "❌ jwt-secret secret MISSING - needs to be created"
fi

echo ""
echo "🎯 If any secrets are missing, create them in AWS Secrets Manager!"
