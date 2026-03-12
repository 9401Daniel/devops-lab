# DevOps Lab - Azure + Kubernetes + CI/CD

Documentacion del proceso de despliegue de una aplicacion web (HTML/CSS/JS) en Azure usando Kubernetes, Terraform, GitHub Actions y Argo CD. El objetivo es construir un pipeline CI/CD completo siguiendo practicas usadas en entornos empresariales reales.

---

## Arquitectura del Proyecto

```
Mac local (desarrollo)
    |
    | git push
    v
GitHub (repositorio remoto)
    |
    | GitHub Actions (CI/CD)
    v
Azure Container Registry (ACR)
    |
    | imagen Docker
    v
Argo CD --> AKS (Azure Kubernetes Service)
                |
                v
         Aplicacion Web <--> Azure Cosmos DB (Free Tier)
```

---

## Stack Tecnologico

| Herramienta | Uso |
|---|---|
| Terraform | Infraestructura como codigo (IaC) |
| Azure VM (B1s) | Maquina de control para Terraform y kubectl |
| AKS | Cluster de Kubernetes en Azure |
| Azure Container Registry | Almacen de imagenes Docker |
| Cosmos DB Free Tier | Base de datos NoSQL con API MongoDB |
| GitHub Actions | Pipeline CI/CD automatizado |
| Argo CD | GitOps - sincronizacion automatica cluster/repositorio |
| Docker + Nginx | Contenedorizacion y servidor web de la app |

---

## Costos Estimados

Cuenta: Azure for Students (100 USD de credito)

| Recurso | Costo aprox/mes |
|---|---|
| VM B1s (control) | ~7 USD |
| AKS nodo B2s | ~30 USD |
| Azure Container Registry | ~5 USD |
| Cosmos DB Free Tier | 0 USD |
| Total activo | ~42 USD/mes |

Con terraform destroy al terminar cada sesion y apagando la VM, el costo real es proporcional solo a las horas de uso.

---

## Flujo de Trabajo del Dia a Dia

```bash
# Hacer cambios en la app localmente
git add .
git commit -m "descripcion del cambio"
git push origin main

# GitHub Actions construye la imagen Docker y la sube al ACR
# Argo CD detecta el cambio y despliega automaticamente en AKS
```

---

## Estructura del Repositorio

```
devops-lab/
|-- app/                        # Codigo fuente HTML/CSS/JS
|-- terraform/                  # Infraestructura como codigo
|   |-- main.tf
|   |-- variables.tf
|   |-- outputs.tf
|   `-- modules/
|       |-- aks/
|       |-- acr/
|       `-- cosmosdb/
|-- kubernetes/                 # Manifiestos de Kubernetes
|   |-- deployment.yaml
|   `-- service.yaml
|-- .github/
|   `-- workflows/
|       `-- ci-cd.yaml          # Pipeline GitHub Actions
|-- Dockerfile
`-- README.md
```

---

## Configuracion Inicial - Paso a Paso

### 1. Prerrequisitos en Azure
- [x] Cuenta Azure for Students activa
- [x] Acceso al portal: portal.azure.com
- [x] Resource Group creado: rg-devops-lab (Region: East US 2)
- [x] Subscription ID anotado

### 2. VM de Control
- [x] Crear VM: Ubuntu 22.04 LTS, B1s, East US 2, IP estatica
- [x] Clave SSH guardada localmente (Ed25519)
- [x] Conexion por SSH verificada
- [x] Sistema actualizado (apt update && apt upgrade)
- [x] Herramientas instaladas: Azure CLI, Terraform, Docker, kubectl, git
- [x] Service Principal creado para Terraform
- [x] Variables de entorno ARM configuradas en .bashrc

### 3. Infraestructura con Terraform
- [x] terraform init y terraform validate sin errores
- [x] AKS provisionado: aks-devops-lab, 1 nodo B2s, Kubernetes v1.33.6
- [x] ACR provisionado: acrdevopslab2025daniel.azurecr.io
- [x] Cosmos DB provisionado: Free Tier, API MongoDB
- [x] kubectl conectado al cluster AKS

### 4. Contenedorizacion de la App
- [x] Dockerfile creado con Nginx alpine
- [x] Imagen construida localmente (26 MB)
- [x] Imagen subida al ACR
- [x] imagePullSecret configurado en deployment.yaml

### 5. Despliegue en Kubernetes
- [x] deployment.yaml y service.yaml creados
- [x] App desplegada con IP publica accesible desde internet
- [x] Argo CD instalado en el cluster (v2.13.0)
- [x] Repositorio GitHub conectado a Argo CD
- [x] Sincronizacion automatica funcionando (Auto-Sync + Self Heal + Prune)

### 6. Pipeline CI/CD con GitHub Actions
- [x] Secrets configurados en GitHub (Azure SP, ACR)
- [x] Workflow ci-cd.yaml creado
- [x] Pipeline probado exitosamente
- [x] Permisos de escritura al repo configurados para el bot de Actions

---

## Pendientes

- [ ] Instalar Helm en la VM
- [ ] Monitoreo con Prometheus + Grafana + Alertmanager (via Helm)
- [ ] HTTPS con cert-manager y nip.io (via Helm)
- [ ] Integrar Cosmos DB con la app (reemplazar almacenamiento local en JSON)
- [ ] Estructura multi-ambiente: dev / staging / prod en Terraform
- [ ] Chaos Engineering con Litmus Chaos (simulacion de fallas)
- [ ] Dominio personalizado (opcional, ~10 USD/anio en Porkbun o Cloudflare)

---

## Como Retomar el Proyecto

### Levantar toda la infraestructura

```bash
# 1. Encender la VM desde portal.azure.com
# Maquinas virtuales -> vm-control-devops -> Iniciar

# 2. Conectarse a la VM
ssh -i "/Users/daniel/Documents/PERSONAL PROJECTs/Devops CI:CD/vm-control-devops_key.pem" azureuser@<IP_VM>

# 3. Actualizar el repo local
cd ~/devops-lab
git pull

# 4. Levantar infraestructura con Terraform
cd ~/devops-lab/terraform
terraform init
terraform apply

# 5. Reconectar kubectl al AKS
az aks get-credentials --resource-group rg-devops-lab --name aks-devops-lab

# 6. Verificar que el nodo esta listo
kubectl get nodes

# 7. Crear el secret de acceso al ACR (obligatorio despues de cada terraform apply)
az acr update -n acrdevopslab2025daniel --admin-enabled true

ACR_USERNAME=$(az acr credential show -n acrdevopslab2025daniel --query username -o tsv)
ACR_PASSWORD=$(az acr credential show -n acrdevopslab2025daniel --query passwords[0].value -o tsv)

kubectl create secret docker-registry acr-secret \
  --docker-server=acrdevopslab2025daniel.azurecr.io \
  --docker-username=$ACR_USERNAME \
  --docker-password=$ACR_PASSWORD

# 8. Verificar que la imagen existe en el ACR
az acr repository list --name acrdevopslab2025daniel --output table

# Si el ACR esta vacio (terraform destroy borra las imagenes), reconstruir y subir:
az acr login --name acrdevopslab2025daniel
cd ~/devops-lab
docker build -t acrdevopslab2025daniel.azurecr.io/devops-lab-app:latest .
docker push acrdevopslab2025daniel.azurecr.io/devops-lab-app:latest

# 9. Reinstalar Argo CD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.13.0/manifests/install.yaml

# Esperar 2-3 minutos y verificar pods
kubectl get pods -n argocd

# 10. Aplicar manifiestos de Kubernetes
cd ~/devops-lab
kubectl apply -f kubernetes/

# 11. Obtener IP publica de la app
kubectl get service devops-lab-app

# 12. Acceder a la UI de Argo CD
# En la VM:
kubectl port-forward svc/argocd-server -n argocd 8080:443

# En una segunda terminal del Mac:
ssh -i "/Users/daniel/Documents/PERSONAL PROJECTs/Devops CI:CD/vm-control-devops_key.pem" -L 8080:localhost:8080 azureuser@<IP_VM>

# Abrir en el navegador: https://localhost:8080
# Usuario: admin
# Password:
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### Destruir todo para evitar costos

```bash
cd ~/devops-lab/terraform
terraform destroy

# Luego apagar la VM desde el portal de Azure
# portal.azure.com -> Maquinas virtuales -> vm-control-devops -> Detener
```

---

## Notas Importantes

El ACR pierde todas las imagenes cuando se hace terraform destroy. Siempre verificar con `az acr repository list` antes de aplicar los manifiestos y reconstruir la imagen si es necesario.

El secret acr-secret vive dentro del cluster AKS. Como el cluster se destruye con terraform destroy, el secret hay que recrearlo en cada sesion. El deployment.yaml ya tiene configurado imagePullSecrets para usarlo automaticamente.

---

## Base de Datos - Cosmos DB

- Tipo: NoSQL con API de MongoDB
- Plan: Free Tier (1,000 RU/s + 25 GB almacenamiento)
- Costo: 0 USD, persiste aunque se haga terraform destroy
- Migracion futura a MongoDB en cluster: solo cambiar la URL de conexion en las variables de entorno de Kubernetes, el codigo de la app no cambia

---

## Decisiones Tecnicas

**Cosmos DB Free Tier sobre MongoDB en cluster:** Los datos persisten entre sesiones de terraform destroy. Si se usara MongoDB dentro del cluster, los datos se perderian cada vez que se destruye la infraestructura.

**VM B1s como maquina de control:** La VM solo ejecuta comandos de Terraform y kubectl. La app corre en AKS. En un entorno empresarial real esto se reemplazaria por Terraform Cloud y acceso local con Azure CLI.

**Argo CD v2.13.0 sobre v3.x:** La version 3 presenta problemas de compatibilidad con el cluster AKS de Azure for Students. La v2.13.0 es estable y tiene todas las funcionalidades necesarias.

**Un solo nodo en AKS:** Para minimizar costos en el ambiente de laboratorio. En produccion se usarian al menos 3 nodos distribuidos en zonas de disponibilidad diferentes.

**GitOps con Argo CD:** Ningun cambio se aplica directamente al cluster. Todo cambio pasa por GitHub y Argo CD lo despliega automaticamente. Esto permite auditoria completa, rollbacks faciles y elimina el acceso humano directo a produccion.

**imagePullSecret en lugar de managed identity:** El secret acr-secret con credenciales de admin del ACR es mas confiable que los permisos de managed identity de AKS, que pueden tardar en propagarse o no aplicar correctamente despues de recrear el cluster.

---

## Conceptos Clave

**GitOps:** El repositorio de Git es la unica fuente de verdad para el estado de la infraestructura y las aplicaciones. Todo cambio pasa por un Pull Request y es desplegado automaticamente.

**IaC (Infraestructura como Codigo):** La infraestructura se define en archivos de codigo en lugar de configurarse manualmente. Permite recrear entornos identicos con un solo comando.

**CI/CD:** Integracion Continua (construir y probar automaticamente) y Despliegue Continuo (desplegar automaticamente al cluster cuando hay cambios).

**Chaos Engineering:** Practica de introducir fallas controladas en el sistema para verificar que se recupera solo. Empresas como Netflix lo usan en produccion constantemente.

**RTO (Recovery Time Objective):** Tiempo que tarda el sistema en recuperarse de una falla. En Kubernetes este valor suele ser de segundos gracias a la auto-recuperacion de pods.
