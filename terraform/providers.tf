terraform {
  required_version = ">= 1.6"

  required_providers {
    kind = {
      source  = "tehcyx/kind"
      version = "~> 0.9"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 3.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.35"
    }
  }
}

# Helm et Kubernetes se connectent au cluster créé par kind
provider "helm" {
  kubernetes = {
    host                   = kind_cluster.jobfit.endpoint
    client_certificate     = kind_cluster.jobfit.client_certificate
    client_key             = kind_cluster.jobfit.client_key
    cluster_ca_certificate = kind_cluster.jobfit.cluster_ca_certificate
  }
}

provider "kubernetes" {
  host                   = kind_cluster.jobfit.endpoint
  client_certificate     = kind_cluster.jobfit.client_certificate
  client_key             = kind_cluster.jobfit.client_key
  cluster_ca_certificate = kind_cluster.jobfit.cluster_ca_certificate
}