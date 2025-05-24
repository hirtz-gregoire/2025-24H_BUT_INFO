# Production Deployment

Ce document fournit les instructions pour déployer l'application en environnement de production en utilisant Docker Compose.

## Prérequis

- Docker et Docker Compose installés sur votre serveur
- Git pour cloner le dépôt

## Étapes de déploiement

1. Cloner le dépôt:
   ```bash
   git clone <url-du-dépôt>
   cd <répertoire-du-dépôt>
   ```

2. Assurez-vous d'avoir les fichiers de configuration de production:
   - `docker-compose.prod.yml`
   - `Dockerfile.prod`
   - `nginx.prod.conf`
   - `.env.production`

3. Construire et démarrer les conteneurs de production:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

4. Vérifier que l'application fonctionne:
   ```bash
   curl http://localhost:5000
   ```

## Configuration

L'application est configurée pour fonctionner sur le port HTTP 5000. Si vous devez changer ce port, modifiez le fichier `docker-compose.prod.yml`:

```yaml
frontend:
  ports:
    - "VOTRE_PORT:80"
```

## Variables d'environnement

Les variables d'environnement de production sont stockées dans `.env.production`. Vous pouvez modifier ce fichier pour changer:

- La clé API Google Maps

## Logs

Pour voir les logs des conteneurs en cours d'exécution:

```bash
# Tous les logs
docker-compose -f docker-compose.prod.yml logs

# Logs frontend uniquement
docker-compose -f docker-compose.prod.yml logs frontend

# Suivre les logs en temps réel
docker-compose -f docker-compose.prod.yml logs -f
```

## Arrêter l'application

Pour arrêter l'application:

```bash
docker-compose -f docker-compose.prod.yml down
```

## Mettre à jour l'application

Pour mettre à jour l'application avec du nouveau code:

1. Récupérer les derniers changements:
   ```bash
   git pull
   ```

2. Reconstruire et redémarrer les conteneurs:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
