# Lumière sur Lyon

Visite virtuelle nocturne de Lyon façon GeoGuessr, centrée sur le Vieux-Lyon illuminé avec mission de découverte de 5 lieux phares de la Fête des Lumières.

## 🌟 Fonctionnalités

- **Navigation Street View 360°** - Exploration immersive de Lyon de nuit
- **Mission gamifiée** - 5 POI à découvrir avec système de checkpoints
- **Guidage intelligent** - Système d'indices avec flèches directionnelles
- **Leaderboard temps réel** - Classement des meilleurs temps
- **Design néon** - Interface sombre avec effets lumineux
- **Responsive & accessible** - Compatible mobile et normes a11y

## 🏗️ Architecture

### Frontend
- **Vite** + Vanilla JS (ES Modules)
- **TailwindCSS 3** pour le design
- **GSAP 3** pour les animations
- **Google Maps Street View API**

### Backend
- **Node.js 18** + Express 5
- **Prisma ORM** + SQLite
- **Rate limiting** (30 req/min)
- **CORS** configuré

### Infrastructure
- **Docker** multi-stage
- **Nginx** reverse proxy
- **Coolify** compatible (Traefik SSL)

## 🚀 Installation

### Prérequis
- Node.js 18+
- Docker & Docker Compose
- Clé API Google Maps

### Configuration

1. **Cloner le projet**
```bash
git clone <repository-url>
cd lumiere-sur-lyon
```

2. **Variables d'environnement**
```bash
cp .env.sample .env
# Éditer .env avec votre clé Google Maps
```

3. **Google Maps API**
- Activer Maps JavaScript API
- Créer une clé API
- Restreindre aux domaines autorisés

## 🛠️ Développement

### Démarrage rapide
```bash
# Lancer l'environnement de développement
docker compose -f docker-compose.dev.yml up --build

# Frontend: http://localhost:5173
# API: http://localhost:4000
```

### Commandes utiles
```bash
# Installation des dépendances
npm install
cd api && npm install

# Lancement manuel
npm run dev          # Frontend
cd api && npm run dev # Backend

# Linting
npm run lint
npm run lint:fix

# Base de données
cd api
npx prisma migrate dev
npx prisma studio
```

## 📦 Production

### Build local
```bash
npm run build
docker compose -f docker-compose.prod.yml up -d
```

### Déploiement Coolify

1. **Créer un nouveau projet** dans Coolify
2. **Connecter le repository** Git
3. **Configurer les variables d'environnement** :
   - `VITE_MAPS_KEY` : Clé Google Maps
   - `VITE_API_BASE` : `/api`
4. **Déployer** avec `docker-compose.prod.yml`

Coolify détectera automatiquement :
- Les labels Traefik pour SSL
- La configuration multi-services
- Les volumes persistants

### Variables de production
```env
VITE_MAPS_KEY=your_production_google_maps_key
VITE_API_BASE=/api
NODE_ENV=production
DATABASE_URL=file:/data/data.db
```

## 🎮 Utilisation

### Parcours utilisateur
1. **Accueil** - Présentation avec effets néon
2. **Street View** - Navigation 360° depuis Place Bellecour
3. **Mission** - HUD avec liste des 5 POI à découvrir
4. **Découverte** - Proximité ≤30m déclenche modal info + vidéo
5. **Victoire** - Temps final et accès au leaderboard

### Points d'intérêt
- Place Bellecour
- Place des Terreaux  
- Basilique Fourvière
- Institut Lumière
- Berges du Rhône

## 🔧 API Endpoints

```
POST /api/session/start     # Démarrer une session
POST /api/checkpoint        # Enregistrer un checkpoint
POST /api/session/end       # Terminer une session
GET  /api/leaderboard       # Top 10 des meilleurs temps
GET  /api/stats            # Statistiques globales
GET  /api/health           # Health check
```

## 📊 Monitoring

### Health check
```bash
curl http://localhost:4000/api/health
```

### Logs Docker
```bash
docker compose logs -f api
docker compose logs -f front
```

### Base de données
```bash
cd api
npx prisma studio  # Interface web
```

## 🎨 Personnalisation

### Couleurs néon
```css
--neon-rose: #f72585
--neon-bleu: #3a86ff  
--neon-violet: #7209b7
--neon-cyan: #4cc9f0
```

### Ajouter des POI
Éditer `poi.json` avec nouvelles coordonnées et métadonnées.

### Modifier les animations
Fichiers GSAP dans `src/modules/`.

## 🐛 Dépannage

### Erreurs courantes

**Google Maps ne charge pas**
- Vérifier la clé API dans `.env`
- Contrôler les restrictions de domaine
- Vérifier le quota/facturation

**API inaccessible**
- Vérifier le port 4000
- Contrôler les logs Docker
- Tester le health check

**Build échoue**
- Nettoyer les node_modules
- Vérifier les versions Node.js
- Contrôler l'espace disque

### Logs utiles
```bash
# Logs API
docker compose logs api

# Logs frontend  
docker compose logs front

# Logs base de données
cd api && npx prisma studio
```

## 📝 Licence

MIT License - Voir fichier LICENSE

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

---

**Développé pour le concours 24H de l'INFO** 🏆
