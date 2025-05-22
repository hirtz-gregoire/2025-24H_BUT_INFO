#!/bin/bash

# Script pour réinitialiser la base de données sans reconstruire l'image Docker
# Ce script permet de réinitialiser la base de données à la demande, sans avoir
# à reconstruire l'image Docker ou redémarrer le conteneur.

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Vérifier si le conteneur est en cours d'exécution
if [ "$(docker ps -q -f name=flask-todo-dev)" ]; then
    echo -e "${YELLOW}Réinitialisation de la base de données...${NC}"
    
    # Exécuter le script de réinitialisation de la base de données dans le conteneur
    docker exec flask-todo-dev python -m src.data.seed_database
    
    # Copier la base de données réinitialisée de /app/instance/database.db vers /app/src/instance/database.db
    docker exec flask-todo-dev bash -c "cp /app/instance/database.db /app/src/instance/database.db"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Base de données réinitialisée avec succès!${NC}"
    else
        echo -e "${RED}Erreur lors de la réinitialisation de la base de données.${NC}"
        exit 1
    fi
else
    echo -e "${RED}Le conteneur flask-todo-dev n'est pas en cours d'exécution.${NC}"
    echo -e "${YELLOW}Démarrez d'abord le conteneur avec 'docker-compose up -d'${NC}"
    echo -e "${YELLOW}Puis exécutez à nouveau ce script pour réinitialiser la base de données.${NC}"
    exit 1
fi
