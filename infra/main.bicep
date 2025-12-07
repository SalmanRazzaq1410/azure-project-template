// ============================================================================
// Main Infrastructure Deployment
// ============================================================================

targetScope = 'subscription'

@description('Organization code')
@allowed(['nl', 'pvc', 'tws', 'mys'])
param org string

@description('Environment')
@allowed(['dev', 'staging', 'prod'])
param env string

@description('Project name')
@minLength(2)
@maxLength(20)
param project string

@description('Azure region code')
@allowed(['euw', 'eus', 'wus', 'san', 'saf'])
param region string

@description('Azure location')
param location string = 'westeurope'

param deployApi bool = true
param deployWeb bool = true
param deployFunctions bool = false
param deployDatabase bool = true
param deployStorage bool = true
param deployKeyVault bool = true

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: '${org}-${env}-${project}-rg-${region}'
  location: location
  tags: {
    org: org
    env: env
    project: project
    managedBy: 'bicep'
  }
}

output resourceGroupName string = rg.name
output location string = location
