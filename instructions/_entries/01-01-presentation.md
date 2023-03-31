---
sectionid: discover
sectionclass: h2
title: Foreword
parent-id: intro
---

[Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/) is a service for hosting web applications, REST APIs, and mobile backends. It offers automatic scaling, automated management, and security for your various applications running in Windows or Linux environments.

**Why AppService?**

It is a fully managed **PaaS** service for developers offering this non-exhaustive list of features:

- **Multiple languages and frameworks**: Offers support for .NET, Java, Ruby, Node.js, PHP, or Python.
- **Global scaling with high availability**: host your applications anywhere and benefit from the high availability of its SLA
- **Managed production infrastructure**: updates the OS, the frameworks and allows you to focus on the application code.
- **Containerization**: dockerize your application and host a Windows or Linux container. Use Docker Compose for a multi-container application.
- **DevOps**: configure continuous integration and deployment with Azure DevOps, GitHub, BitBucket, etc (see source).
- **Security and Compliance**: Authenticate users with Azure AD, Google, Facebook, Twitter or even a Microsoft account.
- **Connection to Saas platforms**: connect to your business systems such as SAP, Salesforce, etc.
- **App Templates**: Take advantage of a comprehensive list of app templates on Azure Marketplace, such as WordPress.

Azure offers other services that can be used for hosting web sites and applications. For most scenarios, App Service is the best choice. If you need more control over the virtual machines running your applications, use [Azure Virtual Machine](https://learn.microsoft.com/en-us/azure/virtual-machines/) instead. On the other hand, orient yourself towards [Azure Spring Apps](https://learn.microsoft.com/en-us/azure/spring-apps/), [Service Fabric](https://learn.microsoft.com/en-us/azure/service-fabric/), or [Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/) for a microservices architecture.

With App Service, you pay for the Azure compute resources you use.
these resources are determined by the **App Service plan** your apps are running on.