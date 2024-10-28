#!/bin/bash

# check status:
az container show --name medical-clinic --resource-group $RESOURCE_GROUP --query instanceView.state

# check logs:
az container logs --name medical-clinic --resource-group $RESOURCE_GROUP --container frontend
az container logs --name medical-clinic --resource-group $RESOURCE_GROUP --container backend
