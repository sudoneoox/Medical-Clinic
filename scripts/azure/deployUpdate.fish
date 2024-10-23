function deploy_update
    set RESOURCE_GROUP "medical-clinic-rg"
    set LOCATION "eastus" 
    set ACR_NAME "medicalclinicregistry" 
    set APP_NAME "medical-clinic"
    # Rebuild images
    docker build -t medical-clinic-frontend:latest ./frontend
    docker build -t medical-clinic-backend:latest ./backend
    docker build -t medical-clinic-migration:latest ./database

    # Tag images
    docker tag medical-clinic-frontend:latest "$ACR_NAME.azurecr.io/medical-clinic-frontend:latest"
    docker tag medical-clinic-backend:latest "$ACR_NAME.azurecr.io/medical-clinic-backend:latest"
    docker tag medical-clinic-migration:latest "$ACR_NAME.azurecr.io/medical-clinic-migration:latest"

    # Push images
    docker push "$ACR_NAME.azurecr.io/medical-clinic-frontend:latest"
    docker push "$ACR_NAME.azurecr.io/medical-clinic-backend:latest"
    docker push "$ACR_NAME.azurecr.io/medical-clinic-migration:latest"

    # Restart container group
    az container restart --name medical-clinic --resource-group $RESOURCE_GROUP
    
    # Get and display the IP
    set -x PUBLIC_IP (az container show \
        --resource-group $RESOURCE_GROUP \
        --name medical-clinic \
        --query ipAddress.ip \
        --output tsv)
    
    echo "Deployment updated!"
    echo "Frontend: http://$PUBLIC_IP"
    echo "Backend: http://$PUBLIC_IP:5000"
end
