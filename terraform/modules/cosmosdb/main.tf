resource "azurerm_cosmosdb_account" "cosmos" {
  name                = var.cosmosdb_account_name
  location            = var.location
  resource_group_name = var.resource_group_name
  offer_type          = "Standard"
  kind                = "MongoDB"
  free_tier_enabled   = true

  capabilities {
    name = "EnableMongo"
  }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = var.location
    failover_priority = 0
  }

  tags = {
    Environment = "lab"
    Project     = "devops-lab"
    ManagedBy   = "terraform"
  }
}

resource "azurerm_cosmosdb_mongo_database" "db" {
  name                = "devops-lab-db"
  resource_group_name = var.resource_group_name
  account_name        = azurerm_cosmosdb_account.cosmos.name
}
