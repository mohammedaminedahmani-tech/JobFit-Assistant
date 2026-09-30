variable "cluster_name" {
  description = "Nom du cluster kind"
  type        = string
  default     = "jobfit"
}

variable "repo_url" {
  description = "Dépôt Git surveillé par ArgoCD"
  type        = string
  default     = "https://github.com/mohammedaminedahmani-tech/JobFit-Assistant.git"
}

variable "huggingface_api_key" {
  description = "Clé API HuggingFace pour le backend"
  type        = string
  sensitive   = true
}