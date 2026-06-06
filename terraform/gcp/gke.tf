variable "project_id" {
  type    = string
  default = "devopsverse-enterprise"
}

variable "region" {
  type    = string
  default = "us-central1"
}

resource "google_compute_network" "vpc" {
  name                    = "devopsverse-gcp-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name          = "devopsverse-gcp-subnet"
  region        = var.region
  network       = google_compute_network.vpc.name
  ip_cidr_range = "10.2.0.0/16"
}

resource "google_container_cluster" "gke" {
  name     = "devopsverse-gke"
  location = var.region
  
  # VPC Native settings
  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.subnet.name
  
  # Standard autopilot mode for simpler operation
  enable_autopilot = true

  ip_allocation_policy {
    use_ip_aliases = true
  }
}

output "gke_endpoint" {
  value = google_container_cluster.gke.endpoint
}
