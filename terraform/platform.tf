# ===== Traefik : l'Ingress Controller =====
resource "helm_release" "traefik" {
  name             = "traefik"
  repository       = "https://traefik.github.io/charts"
  chart            = "traefik"
  version          = "41.6.0"
  namespace        = "traefik"
  create_namespace = true
  timeout          = 600

  values = [yamlencode({
    ports = {
      web       = { hostPort = 80 }
      websecure = { hostPort = 443 }
    }
    service = { spec = { type = "ClusterIP" } }
    providers = {
      kubernetesIngress = { publishedService = { enabled = false } }
    }
    additionalArguments = ["--providers.kubernetesingress.ingressendpoint.ip=127.0.0.1"]
    updateStrategy = {
      rollingUpdate = { maxSurge = 0, maxUnavailable = 1 }
    }
  })]
}

# ===== metrics-server : les mesures CPU pour le HPA =====
resource "helm_release" "metrics_server" {
  name       = "metrics-server"
  repository = "https://kubernetes-sigs.github.io/metrics-server/"
  chart      = "metrics-server"
  version    = "3.14.0"
  namespace  = "kube-system"

  values = [yamlencode({
    args = ["--kubelet-insecure-tls"]
  })]
}

# ===== Monitoring : Prometheus + Grafana =====
resource "helm_release" "monitoring" {
  name             = "monitoring"
  repository       = "https://prometheus-community.github.io/helm-charts"
  chart            = "kube-prometheus-stack"
  version          = "91.8.2"
  namespace        = "monitoring"
  create_namespace = true
  timeout          = 900

  values = [yamlencode({
    prometheus = {
      prometheusSpec = { serviceMonitorSelectorNilUsesHelmValues = false }
    }
    "prometheus-node-exporter" = {
      hostRootFsMount = { enabled = false }
    }
  })]
}

# ===== ArgoCD : le GitOps =====
resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  version          = "10.9.4"
  namespace        = "argocd"
  create_namespace = true
  timeout          = 600

  # Sur un PC chargé, le repo-server répond parfois en plus d'1 s :
  # on lui laisse plus de temps avant de le considérer comme planté
  values = [yamlencode({
    repoServer = {
      livenessProbe  = { timeoutSeconds = 10, failureThreshold = 5 }
      readinessProbe = { timeoutSeconds = 10 }
    }
  })]
}