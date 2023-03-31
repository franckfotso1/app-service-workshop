---
sectionid: prereq
sectionclass: h2
title: Prerequisites
parent-id: intro
---

### Prerequisites

This workshop will require the following:

- Access to the [Azure Portal](https://portal.azure.com) subscription
- [Azure CLI](https://github.com/Azure/azure-cli) (**>= 2.30**)
- [VS Code](https://code.visualstudio.com/) or equivalent
- A [Github](https://github.com/join) account

### Install Azure CLI

If the CLI is not installed, just follow [this link](https://docs.microsoft.com/fr-fr/cli/azure/install-azure-cli) to do it and follow the tab corresponding to your operating system.

If your CLI is already installed, upgrade it to be sure to have the lastest version

{% collapsible %}

```bash
az version
# If version az-core <= 2.30
az upgrade
```

{% endcollapsible %}

#### Log in to your subscription

{% collapsible %}

```bash
az login
# Choose the subscription
az account set –s <subscription-id> 
# Verify subscription
az account show
```

Connect to the [Azure Portal](https://portal.azure.com) 

{% endcollapsible %}
