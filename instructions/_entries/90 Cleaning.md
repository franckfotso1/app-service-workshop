---
sectionid: cleaning
sectionclass: h1
title: Nettoyage
is-parent: yes
---


##### Créez une base de donnée SQL

```bash
# Create a SQL Database server
echo "Creating $server"
az sql server create --name $APP_DB_SERVER --resource-group $RESOURCE_GROUP --location "$LOCATION" --admin-user $SERVER_ADMIN_USER --admin-password $PASSWORD
```

```bash
# Configure firewall for Azure access
echo "Creating firewall rule with starting ip of $START_IP" and ending ip of $END_IP
az sql server firewall-rule create \
--server $APP_DB_SERVER \
--resource-group $RESOURCE_GROUP \
--name AllowYourIp \
--start-ip-address $START_IP --end-ip-address $END_IP
```

```bash
# Create an sql database 
echo "Creating $database"
az sql db create --server $APP_DB_SERVER \
 --resource-group $RESOURCE_GROUP --name $APP_DATABASE \
--service-objective S0
```
