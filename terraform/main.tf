terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

module "aks" {
  source              = "./modules/aks"
  cluster_name        = var.aks_cluster_name
  location            = var.location
  resource_group_name = var.resource_group_name
  node_count          = var.node_count
  node_size           = var.node_size
}

module "acr" {
  source              = "./modules/acr"
  acr_name            = var.acr_name
  location            = var.location
  resource_group_name = var.resource_group_name
}

module "cosmosdb" {
  source                = "./modules/cosmosdb"
  cosmosdb_account_name = var.cosmosdb_account_name
  location              = var.location
  resource_group_name   = var.resource_group_name
}
