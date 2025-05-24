import { gsap } from 'gsap';

class GestionnaireHUD {
  constructor() {
    this.poiActuels = [];
    this.tempsDebut = null;
    this.timerInterval = null;
    this.hudVisible = false;
    this.init();
  }

  init() {
    this.creerHUD();
    this.configurerEvenements();
  }

  creerHUD() {
    const container = document.getElementById('hud-container');
    
    container.innerHTML = `
      <div class="p-4 space-y-4">
        <div id="hud-content" class="glassmorphism rounded-lg p-4 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-neon-rose glow-text">Lieux à découvrir</h3>
          </div>
          
          <div id="liste-poi" class="space-y-2"></div>
        </div>
      </div>
    `;
  }

  configurerEvenements() {
    window.addEventListener('streetview-pret', (event) => {
      this.initialiserMission(event.detail);
    });

    window.addEventListener('poi-atteint', (event) => {
      this.marquerPoiVisite(event.detail);
    });
  }

  initialiserMission(data) {
    this.poiActuels = data.poiActuels;
    this.tempsDebut = data.tempsDebut;
    
    this.mettreAJourListePoi();
    
    gsap.to('#hud-content', { 
      opacity: 1, 
      y: 0, 
      duration: 0.5, 
      delay: 0.5 
    });
  }

  mettreAJourListePoi() {
    const listePoi = document.getElementById('liste-poi');
    
    listePoi.innerHTML = this.poiActuels.map(poi => `
      <button 
        class="w-full flex items-center space-x-3 p-2 rounded ${poi.visite ? 'bg-green-900 bg-opacity-50' : 'bg-sombre-800'} hover:bg-opacity-80 transition-all"
        data-poi-id="${poi.id}"
        data-poi-lat="${poi.lat}"
        data-poi-lng="${poi.lng}"
        data-poi-heading="${poi.heading}"
        data-poi-pitch="${poi.pitch}"
      >
        <span class="text-lg">${poi.visite ? '✅' : '📍'}</span>
        <span class="${poi.visite ? 'line-through text-gray-400' : 'text-white'}">${poi.nom}</span>
      </button>
    `).join('');
    
    const boutonsPoi = listePoi.querySelectorAll('button');
    boutonsPoi.forEach(bouton => {
      bouton.addEventListener('click', () => {
        const poiId = bouton.dataset.poiId;
        const lat = parseFloat(bouton.dataset.poiLat);
        const lng = parseFloat(bouton.dataset.poiLng);
        const heading = parseFloat(bouton.dataset.poiHeading);
        const pitch = parseFloat(bouton.dataset.poiPitch);
        
        if (window.gestionnaireStreetView) {
          window.gestionnaireStreetView.teleporterVers(lat, lng, heading, pitch);
          
          const poiInfo = this.poiActuels.find(p => p.id === poiId);
          if (poiInfo && window.gestionnaireModal) {
            window.gestionnaireModal.afficherModalPoi(poiInfo);
          }
        }
      });
    });
  }

  marquerPoiVisite(poi) {
    const poiIndex = this.poiActuels.findIndex(p => p.id === poi.id);
    if (poiIndex !== -1) {
      this.poiActuels[poiIndex].visite = true;
    }
    
    this.mettreAJourListePoi();
    
    const boutons = document.querySelectorAll('#liste-poi button');
    if (boutons[poiIndex]) {
      gsap.fromTo(boutons[poiIndex],
        { scale: 1, backgroundColor: 'rgba(34, 197, 94, 0.2)' },
        { scale: 1.05, backgroundColor: 'rgba(34, 197, 94, 0.5)', duration: 0.3, yoyo: true, repeat: 1 }
      );
    }
  }
}

export function initHUD() {
  window.gestionnaireHUD = new GestionnaireHUD();
}
