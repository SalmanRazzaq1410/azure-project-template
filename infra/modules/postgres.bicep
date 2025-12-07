// ============================================================================
// PostgreSQL Flexible Server Module
// ============================================================================

@description('Name prefix for resources')
param namePrefix string

@description('Azure region')
param location string

@description('Environment')
@allowed(['dev', 'staging', 'prod'])
param env string

@description('Administrator username')
param adminUsername string = 'pgadmin'

@description('Administrator password')
@secure()
param adminPassword string

@description('PostgreSQL version')
@allowed(['13', '14', '15', '16'])
param postgresVersion string = '16'

@description('SKU name')
param skuName string = 'Standard_B1ms'

@description('Storage size in GB')
param storageSizeGB int = 32

@description('Database name')
param databaseName string = 'app'

@description('Tags')
param tags object = {}

var serverName = '${namePrefix}-psql'

resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: serverName
  location: location
  tags: tags
  sku: {
    name: skuName
    tier: env == 'prod' ? 'GeneralPurpose' : 'Burstable'
  }
  properties: {
    version: postgresVersion
    administratorLogin: adminUsername
    administratorLoginPassword: adminPassword
    storage: {
      storageSizeGB: storageSizeGB
    }
    backup: {
      backupRetentionDays: env == 'prod' ? 35 : 7
      geoRedundantBackup: env == 'prod' ? 'Enabled' : 'Disabled'
    }
    highAvailability: {
      mode: env == 'prod' ? 'ZoneRedundant' : 'Disabled'
    }
  }
}

resource database 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-03-01-preview' = {
  parent: postgresServer
  name: databaseName
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

// Allow Azure services
resource firewallRule 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-03-01-preview' = {
  parent: postgresServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

output serverId string = postgresServer.id
output serverName string = postgresServer.name
output serverFqdn string = postgresServer.properties.fullyQualifiedDomainName
output databaseName string = database.name
output connectionString string = 'postgresql://${adminUsername}@${serverName}:{password}@${postgresServer.properties.fullyQualifiedDomainName}:5432/${databaseName}?sslmode=require'
