function redeploy_server
    set RESOURCE_GROUP "medical-clinic-rg"
    set LOCATION "eastus" 
    set ACR_NAME "medicalclinicregistry" 
    set APP_NAME "medical-clinic"

    az deployment group create \
    --resource-group $RESOURCE_GROUP \
    --template-file azuredeploy.json \
    --parameters acrName=$ACR_NAME
end
