---
sectionid: lab2-monitoring
sectionclass: h2
title: Observabilité
parent-id: lab-2
---

#### Tracer les appels entre services

En déployant Dapr localement, une instance de [Zipkin](https://zipkin.io) est déployée à l'adresse : http://localhost:9411

Dapr est configuré pour utiliser cette instance, et permet de retrouver les appels entre les services. 





##### Get Logs

Metrics are important, but it is also important to be able to get the logs of the application to be able to debug or understand any misbehavior.

In Azure Container Apps, logging agents are capable of capturing all *stdout/stderror* messages sent by containers. The messages are then pushed to Azure Log Analytics, allowing you to have in one place, without any specific tooling, all logging in one place.

Try to retrieve the logs on the `UI` container. You can do it using command-line or through the portal

{% collapsible %}

On the Azure Portal, open Logs Analytics. You can use the left part of the screen to see the tables and columns and build a query using Kusto language.

The query to get the logs of the `UI` container is :

``` bash
ContainerAppConsoleLogs_CL 
| where ContainerAppName_s == 'ui'
```

![Get Logs using CLI](/media/lab2/monitor/logs-ui.png)

The second way of doing it is to use the command line and the Azure CLI. (it may ask you to install a CLI extension first).

``` bash
az monitor log-analytics query \
  --workspace <LOG_ANALYTICS_WORKSPACE_CLIENT_ID> \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'ui' | project ContainerAppName_s, Log_s, TimeGenerated | take 3" \
  --out table
```

Here, the query is more complex to select the columns to display and the number of lines we want to return.

![Get Logs using CLI](/media/lab2/monitor/logs-cli.png)

{% endcollapsible %}

That's it. No need to install specific monitoring tool (i.e. Prometheus) nor need to connect interactively to your container to retrieve its logs.

##### Get Metrics

Application Insights, a feature of Azure Monitor, is an extensible Application Performance Management (APM) service for developers and DevOps professionals. Use it to monitor your live applications. It will automatically detect performance anomalies, and includes powerful analytics tools to help you diagnose issues and to understand what users actually do with your app.

Lucky for us, Application Insights has been automatically deployed and uses the metrics/logs stored automatically in Log Analytics by Azure Container Apps. As you can see, if you dig a little big, Application Insights can help to see metrics, errors, users flow, and so much more.

Start by opening Application Insights and watch the main metrics of the platform.

{% collapsible %}

In the resource group, look for the Application Insights resource. Once you open it, you can see main metrics such as failures (should be empty), the average response time and the requests per second.

![Overview metrics](/media/lab2/monitor/overview-metrics.png)

If you click on one chart (i.e. response time), you'd be brought to performance tab where you can see specific metrics for each micro-service.

![Detailed performance](/media/lab2/monitor/performance.png)

{% endcollapsible %}

Another way to get the health of your platform is to use the "magic map" feature of Application Insights to get an overview of the whole platform. Find and analyze the application's map.

{% collapsible %}

On the left part, open the `Application Map` menu. From the logs only, it is capable of drawing a map of your microservices platform, showing interactions between components, average performance and even failure rates when an error occurs.

![App Insights - application map](/media/lab2/monitor/logs-app-insights-maps.png)

{% endcollapsible %}

Use the map to quickly get the logs of a specific micro-service, for instance, the receipts generator service:

{% collapsible %}

On the map, click on one micro-services, then in the side panel which opens, click on `View logs`.

![App Insights - get logs](/media/lab2/monitor/logs-app-insights-logs-app.png)

It should open Logs analytics and automatically generate for you the query which was used to draw this micro-services on the map.

![Display specific logs](/media/lab2/monitor/service-logs.png)

{% endcollapsible %}

It's just the overview of observability but it shows how well integrated monitoring is within Azure Container Apps.
