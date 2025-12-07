// ============================================================================
// Key Vault Module
// ============================================================================

@description('Name prefix for resources')
param namePrefix string

@description('Azure region')
param location string

@description('Environment')
@allowed(['dev', 'staging', 'prod'])
param env string

@description('Tenant ID')
param tenantId string = subscription().tenantId

@description('Principal IDs to grant access')
param accessPolicies array = []

@description('Enable soft delete')
param enableSoftDelete bool = true

@description('Tags')
param tags object = {}

var keyVaultName = '${replace(namePrefix, '-', '')}kv'

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  tags: tags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: tenantId
    enabledForDeployment: true
    enabledForDiskEncryption: false
    enabledForTemplateDeployment: true
    enableSoftDelete: enableSoftDelete
    softDeleteRetentionInDays: 90
    enableRbacAuthorization: true
    enablePurgeProtection: env == 'prod'
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

// Role assignment for Key Vault Secrets User
resource roleAssignments 'Microsoft.Authorization/roleAssignments@2022-04-01' = [for policy in accessPolicies: {
  name: guid(keyVault.id, policy.principalId, 'KeyVaultSecretsUser')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6') // Key Vault Secrets User
    principalId: policy.principalId
    principalType: 'ServicePrincipal'
  }
}]

output keyVaultId string = keyVault.id
output keyVaultName string = keyVault.name
output keyVaultUri string = keyVault.properties.vaultUri
