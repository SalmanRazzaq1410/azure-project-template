// ============================================================================
// App Service Module
// ============================================================================

@description('Name prefix for resources')
param namePrefix string

@description('Azure region')
param location string

@description('Environment')
@allowed(['dev', 'staging', 'prod'])
param env string

@description('App Service Plan SKU')
@allowed(['B1', 'B2', 'S1', 'S2', 'P1v3', 'P2v3'])
param sku string = 'B1'

@description('Container image to deploy (optional)')
param containerImage string = ''

@description('Application Insights connection string (optional)')
param appInsightsConnectionString string = ''

@description('Key Vault URI for secrets (optional)')
param keyVaultUri string = ''

@description('Tags')
param tags object = {}

var appServicePlanName = '${namePrefix}-plan'
var appServiceName = '${namePrefix}-app'

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: appServicePlanName
  location: location
  tags: tags
  sku: {
    name: sku
    capacity: env == 'prod' ? 2 : 1
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource appService 'Microsoft.Web/sites@2022-09-01' = {
  name: appServiceName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: containerImage != '' ? 'DOCKER|${containerImage}' : 'PYTHON|3.11'
      alwaysOn: env != 'dev'
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      appSettings: concat([
        {
          name: 'ENVIRONMENT'
          value: env
        }
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
      ], appInsightsConnectionString != '' ? [
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsightsConnectionString
        }
      ] : [], keyVaultUri != '' ? [
        {
          name: 'KEY_VAULT_URI'
          value: keyVaultUri
        }
      ] : [])
    }
  }
}

// Health check
resource healthCheck 'Microsoft.Web/sites/config@2022-09-01' = {
  parent: appService
  name: 'web'
  properties: {
    healthCheckPath: '/health'
  }
}

output appServiceId string = appService.id
output appServiceName string = appService.name
output appServiceHostname string = appService.properties.defaultHostName
output principalId string = appService.identity.principalId
