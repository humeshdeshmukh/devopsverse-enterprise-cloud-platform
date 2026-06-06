# Root Terraform configuration orchestrating AWS, Azure, and GCP configurations

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "gcp_project_id" {
  type    = string
  default = "devopsverse-enterprise"
}

variable "gcp_region" {
  type    = string
  default = "us-central1"
}

module "aws_kubernetes" {
  source = "./aws"
  region = var.aws_region
}

module "azure_kubernetes" {
  source = "./azure"
}

module "gcp_kubernetes" {
  source     = "./gcp"
  project_id = var.gcp_project_id
  region     = var.gcp_region
}

output "eks_cluster_endpoint" {
  value = module.aws_kubernetes.eks_endpoint
}

output "aks_cluster_fqdn" {
  value = module.azure_kubernetes.aks_fqdn
}

output "gke_cluster_endpoint" {
  value = module.gcp_kubernetes.gke_endpoint
}
