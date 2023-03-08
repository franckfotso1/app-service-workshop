---
sectionid: lab4-intro
sectionclass: h2
title: Contexte
parent-id: lab-4
---


- Key Vault

```bash
# name of the Key vault
$APP_VAULT = "kv4789"
# Create an Azure Key Vault to store credentials of 
az keyvault create --name $APP_VAULT -g $RESOURCE_GROUP -l $LOCATION
```

```bash
# Add a secret to the Azure key Vault
$SERVER_ADMIN_USER = $ (az keyvault secret set --vault-name $APP_VAULT --name SERVERADMINUSER --value <secret-value> --query id --output tsv ) # secret value = admin 
$PASSWORD = $ (az keyvault secret set --vault-name $APP_VAULT --name PASSWORD --value <secret-value> --query id --output tsv ) # secret value = password12376@ 
```
