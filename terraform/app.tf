# ===== Namespace de l'application =====
resource "kubernetes_namespace_v1" "jobfit" {
  metadata {
    name = "jobfit"
  }
  depends_on = [kind_cluster.jobfit]
}

# ===== Secret avec la clé HuggingFace =====
resource "kubernetes_secret_v1" "jobfit" {
  metadata {
    name      = "jobfit-secrets"
    namespace = kubernetes_namespace_v1.jobfit.metadata[0].name
  }
  data = {
    HUGGINGFACE_API_KEY = var.huggingface_api_key
  }
}

# ===== Application ArgoCD : déploie le chart depuis GitHub =====
resource "helm_release" "jobfit_app" {
  name       = "jobfit-app"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argocd-apps"
  version    = "2.0.6"
  namespace  = "argocd"

  values = [yamlencode({
    applications = {
      jobfit = {
        namespace = "argocd"
        project   = "default"
        source = {
          repoURL        = var.repo_url
          targetRevision = "main"
          path           = "helm/jobfit"
        }
        destination = {
          server    = "https://kubernetes.default.svc"
          namespace = "jobfit"
        }
        syncPolicy = {
          automated = { prune = true, selfHeal = true }
        }
      }
    }
  })]

  # L'application ne démarre qu'une fois toute la plateforme prête
  depends_on = [
    helm_release.argocd,
    helm_release.traefik,
    helm_release.monitoring,
    helm_release.metrics_server,
    kubernetes_secret_v1.jobfit,
  ]
}