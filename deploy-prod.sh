#!/bin/bash

# Script de déploiement pour l'environnement de production

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

echo "🔍 Vérification des fichiers de configuration..."

# Vérifier si les fichiers nécessaires existent
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Le fichier docker-compose.prod.yml est manquant."
    exit 1
fi

if [ ! -f "nginx.prod.conf" ]; then
    echo "❌ Le fichier nginx.prod.conf est manquant."
    exit 1
fi

if [ ! -f ".env.production" ]; then
    echo "❌ Le fichier .env.production est manquant."
    exit 1
fi

echo "✅ Tous les fichiers de configuration sont présents."

# Arrêter les conteneurs existants si nécessaire
echo "🛑 Arrêt des conteneurs existants..."
docker-compose -f docker-compose.prod.yml down

# Construire et démarrer les conteneurs
echo "🚀 Construction et démarrage des conteneurs de production..."
docker-compose -f docker-compose.prod.yml up -d --build

# Vérifier si les conteneurs sont en cours d'exécution
if [ "$(docker-compose -f docker-compose.prod.yml ps -q | wc -l)" -gt 0 ]; then
    echo "✅ Les conteneurs de production sont en cours d'exécution."
    echo "🌐 L'application est accessible à l'adresse: http://localhost:5000"
    
    # Afficher les logs
    echo "📋 Affichage des logs (Ctrl+C pour quitter):"
    docker-compose -f docker-compose.prod.yml logs -f
else
    echo "❌ Erreur lors du démarrage des conteneurs de production."
    exit 1
fi
