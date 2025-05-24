# Lumière sur Lyon

Visite virtuelle de Lyon façon GeoGuessr, centrée sur le Vieux-Lyon illuminé avec mission de découverte de 5 lieux phares de la Fête des Lumières.

## Fonctionnalités

- Navigation Street View 360° - Exploration immersive de Lyon de nuit
- Mission gamifiée - 5 POI à découvrir avec système de checkpoints
- Design néon - Interface sombre avec effets lumineux
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
- Node.js 18+
- Docker & Docker Compose
- Clé API Google Maps

### Configuration

1. Cloner le projet
```bash
git clone <repository-url>
cd lumiere-sur-lyon
```

2. Variables d'environnement
```bash
cp .env.sample .env
# Éditer .env avec votre clé Google Maps
```

3. Google Maps API
- Activer Maps JavaScript API
- Créer une clé API
- Restreindre aux domaines autorisés

## Développement

### Démarrage rapide
```bash
# Lancer l'environnement de développement
docker compose -f docker-compose.dev.yml up --build

# Frontend: http://localhost:5173
```

### Commandes utiles
```bash
# Installation des dépendances
npm install

# Lancement manuel
npm run dev

# Linting
npm run lint
npm run lint:fix
```

## Production

### Build local
```bash
npm run build
docker compose -f docker-compose.prod.yml up -d
```

### Variables de production
```env
VITE_MAPS_KEY=your_production_google_maps_key
NODE_ENV=production
```

## Utilisation

### Parcours utilisateur
1. Accueil - Présentation avec effets néon
2. Street View - Navigation 360° depuis Place Bellecour
3. Mission - HUD avec liste des 5 POI à découvrir
4. Découverte - Proximité ≤30m déclenche modal info + vidéo
5. Victoire - Affichage du temps final

### Points d'intérêt
- Place Bellecour
- Place des Terreaux  
- Basilique Fourvière
- Institut Lumière
- Berges du Rhône

## Personnalisation

### Couleurs néon
```css
--neon-rose: #f72585
--neon-bleu: #3a86ff  
--neon-violet: #7209b7
--neon-cyan: #4cc9f0
```

### Ajouter des POI
Éditer le fichier `src/modules/poi.js` avec nouvelles coordonnées et métadonnées.

### Modifier les animations
Fichiers GSAP dans `src/modules/`.

## Dépannage

### Erreurs courantes

**Google Maps ne charge pas**
- Vérifier la clé API dans `.env`
- Contrôler les restrictions de domaine
- Vérifier le quota/facturation

**Build échoue**
- Nettoyer les node_modules
- Vérifier les versions Node.js
- Contrôler l'espace disque

### Logs utiles
```bash
# Logs frontend  
docker compose logs front
```

## Licence

MIT License - Voir fichier LICENSE

## Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

---

**Développé pour le concours 24H de l'INFO** 🏆
