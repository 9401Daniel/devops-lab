variable "resource_group_name" {
  description = "Nombre del resource group"
  type        = string
  default     = "rg-devops-lab"
}

variable "location" {
  description = "Region de Azure"
  type        = string
  default     = "eastus2"
}

variable "aks_cluster_name" {
  description = "Nombre del cluster AKS"
  type        = string
  default     = "aks-devops-lab"
}

variable "acr_name" {
  description = "Nombre del Azure Container Registry"
  type        = string
  default     = "acrdevopslab2025daniel"
}

variable "cosmosdb_account_name" {
  description = "Nombre de la cuenta Cosmos DB"
  type        = string
  default     = "cosmos-devops-lab"
}

variable "node_count" {
  description = "Numero de nodos del cluster AKS"
  type        = number
  default     = 1
}

variable "node_size" {
  description = "Tamaño de los nodos del cluster AKS"
  type        = string
  default     = "Standard_B2s"
}
