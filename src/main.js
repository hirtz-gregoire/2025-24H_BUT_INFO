import './style.css';
import { initAccueil } from './modules/accueil.js';
import { initStreetView } from './modules/streetview.js';
import { initHUD } from './modules/hud.js';
import { initModal } from './modules/modal.js';
import { gestionnaireSession } from './modules/session.js';

class AppLumiere {
  constructor() {
    this.etatActuel = 'accueil';
    this.sessionId = null;
    this.init();
  }

  async init() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
      <div id="ecran-accueil" class="fixed inset-0 z-50"></div>
      <div id="ecran-jeu" class="fixed inset-0 hidden">
        <div id="streetview-container" class="w-full h-full"></div>
        <div id="hud-container" class="absolute top-0 left-0 z-10"></div>
        <div id="modal-container" class="absolute inset-0 z-20 pointer-events-none"></div>
      </div>
    `;

    await this.initModules();
    this.configurerEvenements();
  }

  async initModules() {
    initAccueil();
    initStreetView();
    initHUD();
    initModal();
  }

  configurerEvenements() {
    document.addEventListener('commencer-balade', async () => {
      await this.demarrerJeu();
    });

    document.addEventListener('poi-atteint', (event) => {
      this.gererPoiAtteint(event.detail);
    });

    document.addEventListener('jeu-termine', () => {
      this.terminerJeu();
    });
  }

  async demarrerJeu() {
    try {
      this.sessionId = await gestionnaireSession.demarrerSession();
      this.etatActuel = 'jeu';
      
      document.getElementById('ecran-accueil').classList.add('hidden');
      document.getElementById('ecran-jeu').classList.remove('hidden');
      
      window.dispatchEvent(new CustomEvent('demarrer-streetview'));
    } catch (error) {
      console.error('Erreur démarrage jeu:', error);
    }
  }

  async gererPoiAtteint(poiData) {
    if (this.sessionId) {
      await gestionnaireSession.enregistrerCheckpoint(this.sessionId, poiData.id);
    }
  }

  async terminerJeu() {
    if (this.sessionId) {
      await gestionnaireSession.terminerSession(this.sessionId);
    }
    
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
      mapContainer.remove();
    }
  }
}

new AppLumiere();
