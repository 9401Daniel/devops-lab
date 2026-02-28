output "aks_cluster_name" {
  description = "Nombre del cluster AKS"
  value       = module.aks.cluster_name
}

output "acr_login_server" {
  description = "URL del Azure Container Registry"
  value       = module.acr.login_server
}

output "cosmosdb_connection_string" {
  description = "Connection string de Cosmos DB"
  value       = module.cosmosdb.connection_string
  sensitive   = true
}
