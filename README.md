# Application Flask Todo

Une application simple de gestion de tâches développée avec Flask.

## Configuration Docker

Ce projet inclut deux configurations Docker :

1. **Environnement de développement** avec rechargement automatique
2. **Environnement de production** utilisant Gunicorn

## Prérequis

- Docker
- Docker Compose

## Démarrage rapide

### Environnement de développement

Pour lancer l'application en mode développement avec rechargement automatique :

```bash
docker-compose up app-dev
```

L'application sera accessible à l'adresse : http://localhost:5000 (ou le port configuré dans .env)

Les modifications apportées aux fichiers Python seront automatiquement détectées et l'application redémarrera.

### Environnement de production

Pour lancer l'application en mode production :

```bash
docker-compose -f docker-compose.prod.yml up app-prod
```

L'application sera accessible à l'adresse : http://localhost:8000 (ou le port configuré dans .env)

## Configuration des ports

Vous pouvez configurer les ports utilisés par les services en modifiant la variable suivante dans le fichier `.env` :

```
PORT=5000  # Port pour les environnements de développement et production
```

Le même port est utilisé pour les deux environnements, mais vous pouvez les lancer simultanément car ils utilisent des conteneurs différents.

## Déploiement avec Coolify

Pour déployer cette application avec Coolify :

1. Assurez-vous que Coolify est installé et configuré sur votre serveur
2. Créez un nouveau service dans Coolify
3. Pointez vers ce dépôt Git
4. Utilisez le fichier `docker/Dockerfile.prod` comme Dockerfile principal
5. Configurez les variables d'environnement nécessaires (SECRET_KEY, PORT)
6. Déployez l'application

## Structure des fichiers Docker

- `docker/Dockerfile.dev` : Configuration pour le développement avec rechargement automatique
- `docker/Dockerfile.prod` : Configuration pour la production avec Gunicorn
- `docker-compose.yml` : Configuration pour l'environnement de développement
- `docker-compose.prod.yml` : Configuration pour l'environnement de production
- `.dockerignore` : Liste des fichiers à ignorer lors de la construction des images Docker

## Variables d'environnement

- `SECRET_KEY` : Clé secrète pour Flask
- `PORT` : Port pour les environnements de développement et production
