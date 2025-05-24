# Lumière sur Lyon

Visite virtuelle de Lyon façon GeoGuessr, centrée sur le Vieux-Lyon illuminé avec mission de découverte de 5 lieux phares de la Fête des Lumières.

## Fonctionnalités

- Navigation Street View 360° - Exploration immersive de Lyon de nuit
- Mission gamifiée - 5 POI à découvrir avec système de checkpoints
- Bulle d'information spaciale
- Responsive & accessible

## Architecture

### Frontend
- Vite + Vanilla JS (ES Modules)
- TailwindCSS 3 pour le design
- GSAP 3 pour les animations
- Google Maps Street View API

### Infrastructure
- Docker multi-stage
- Nginx pour servir l'application

## Installation

### Prérequis
- Docker & Docker Compose
- Clé API Google Maps

### Configuration

1. Cloner le projet

2. Variables d'environnement
```bash
cp .env.sample .env
# Éditer .env avec votre clé Google Maps
```

3. Google Maps API
- Activer Maps JavaScript API
- Créer une clé API

---

**Développé pour le concours 24H de l'INFO** 🏆
