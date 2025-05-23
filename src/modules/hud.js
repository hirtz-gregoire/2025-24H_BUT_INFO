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
        <div id="hud-toggle" class="glassmorphism rounded-lg p-3 cursor-pointer hover:bg-opacity-90 transition-all">
          <div class="flex items-center space-x-2">
            <span class="text-neon-cyan">📍</span>
            <span class="font-medium">Mission</span>
            <span id="toggle-icon" class="text-neon-rose">▼</span>
          </div>
        </div>
        
        <div id="hud-content" class="glassmorphism rounded-lg p-4 space-y-4 transform transition-all duration-300 origin-top scale-y-0">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-neon-rose glow-text">Lieux à découvrir</h3>
          </div>
          
          <div id="liste-poi" class="space-y-2"></div>
        </div>
      </div>
    `;
  }

  configurerEvenements() {
    const toggle = document.getElementById('hud-toggle');
    const content = document.getElementById('hud-content');
    const toggleIcon = document.getElementById('toggle-icon');

    toggle.addEventListener('click', () => {
      this.hudVisible = !this.hudVisible;
      
      if (this.hudVisible) {
        gsap.to(content, { scaleY: 1, duration: 0.3, ease: 'power2.out' });
        toggleIcon.textContent = '▲';
      } else {
        gsap.to(content, { scaleY: 0, duration: 0.3, ease: 'power2.in' });
        toggleIcon.textContent = '▼';
      }
    });

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
    
    gsap.to('#hud-toggle', { 
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
    
    // Ajouter des écouteurs d'événements pour les boutons de téléportation
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
        }
      });
    });
  }

  marquerPoiVisite(poi) {
    // Mettre à jour le POI comme visité
    const poiIndex = this.poiActuels.findIndex(p => p.id === poi.id);
    if (poiIndex !== -1) {
      this.poiActuels[poiIndex].visite = true;
    }
    
    // Mettre à jour l'affichage
    this.mettreAJourListePoi();
    
    // Animer le bouton du POI visité
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
