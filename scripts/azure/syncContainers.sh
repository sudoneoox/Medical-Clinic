#!/bin/bash

#  rebuild your images locally
docker build -t medical-clinic-frontend:latest ./frontend
docker build -t medical-clinic-backend:latest ./backend
docker build -t medical-clinic-migration:latest ./database

# Tag the new versions
docker tag medical-clinic-frontend:latest "$ACR_NAME.azurecr.io/medical-clinic-frontend:latest"
docker tag medical-clinic-backend:latest "$ACR_NAME.azurecr.io/medical-clinic-backend:latest"
docker tag medical-clinic-migration:latest "$ACR_NAME.azurecr.io/medical-clinic-migration:latest"

# Push new versions to ACR
docker push "$ACR_NAME.azurecr.io/medical-clinic-frontend:latest"
docker push "$ACR_NAME.azurecr.io/medical-clinic-backend:latest"
docker push "$ACR_NAME.azurecr.io/medical-clinic-migration:latest"

# Restart container group to use new images
az container restart --name medical-clinic --resource-group $RESOURCE_GROUP
