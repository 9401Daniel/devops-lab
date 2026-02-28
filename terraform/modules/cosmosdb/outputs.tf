output "connection_string" {
  value     = azurerm_cosmosdb_account.cosmos.primary_mongodb_connection_string
  sensitive = true
}

output "endpoint" {
  value = azurerm_cosmosdb_account.cosmos.endpoint
}
