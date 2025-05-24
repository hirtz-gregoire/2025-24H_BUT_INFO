import { gsap } from 'gsap';

class GestionnaireModal {
  constructor() {
    this.modalActive = false;
    this.init();
  }

  init() {
    this.creerModal();
    this.configurerEvenements();
  }

  creerModal() {
    const container = document.getElementById('modal-container');

    container.innerHTML = `
      <div id="modal-overlay" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300 z-[9999]">
        <div id="modal-content" class="glassmorphism rounded-xl max-w-2xl w-full mx-4 p-6 transform scale-95 transition-transform duration-300 z-[10000]">
          <div class="flex justify-between items-start mb-4">
            <h2 id="modal-titre" class="text-2xl font-bold text-neon-rose glow-text"></h2>
            <button id="modal-fermer" class="text-gray-400 hover:text-white text-4xl z-50 relative" aria-label="Fermer">×</button>
          </div>

          <div id="modal-body" class="space-y-4">
            <div id="modal-image" class="w-full h-48 bg-sombre-800 rounded-lg overflow-hidden"></div>
            <p id="modal-description" class="text-gray-300 leading-relaxed"></p>
            <div id="modal-video" class="w-full h-64 bg-sombre-800 rounded-lg overflow-hidden"></div>
          </div>
        </div>
      </div>
    `;
  }

  configurerEvenements() {
    const overlay = document.getElementById('modal-overlay');
    const btnFermer = document.getElementById('modal-fermer');

    btnFermer.addEventListener('click', () => this.fermerModal());

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.fermerModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalActive) {
        this.fermerModal();
      }
    });

    window.addEventListener('poi-atteint', (event) => {
      this.afficherModalPoi(event.detail);
    });

    window.addEventListener('jeu-termine', (event) => {
      this.afficherModalVictoire(event.detail);
    });
  }

  afficherModalPoi(poi) {
    const titre = document.getElementById('modal-titre');
    const image = document.getElementById('modal-image');
    const description = document.getElementById('modal-description');
    const video = document.getElementById('modal-video');

    titre.textContent = poi.nom;
    description.textContent = poi.description || `Vous avez découvert ${poi.nom} ! Un lieu emblématique de la Fête des Lumières.`;

    image.innerHTML = `
      <img src="${poi.imgPath}" alt="${poi.nom}" class="w-full h-full object-cover" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIGluZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4='" />
    `;

    video.innerHTML = `
      <div class="w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden" style="pointer-events: auto; z-index: 10001;">
        <iframe
          id="youtube-iframe"
          src="https://www.youtube.com/embed/${poi.youtubeId}?controls=1&modestbranding=1&rel=0"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          class="w-full h-full"
          title="Vidéo ${poi.nom}"
          style="pointer-events: auto;"
        ></iframe>
      </div>
    `;

    this.ouvrirModal();

    // Add a global event listener for the Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.fermerModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };

    document.addEventListener('keydown', escapeHandler);
  }

  afficherModalVictoire(data) {
    const titre = document.getElementById('modal-titre');
    const image = document.getElementById('modal-image');
    const description = document.getElementById('modal-description');
    const video = document.getElementById('modal-video');

    titre.textContent = '🎉 Mission accomplie !';

    const minutes = Math.floor(data.tempsTotal / 60000);
    const secondes = Math.floor((data.tempsTotal % 60000) / 1000);
    const tempsFormate = `${minutes}:${secondes.toString().padStart(2, '0')}`;

    description.innerHTML = `
      <div class="text-center space-y-4">
        <p class="text-xl text-neon-cyan">Félicitations ! Vous avez découvert tous les lieux de la Fête des Lumières.</p>
        <div class="bg-sombre-800 rounded-lg p-4">
          <p class="text-lg">⏱️ Temps total : <span class="text-neon-rose font-bold">${tempsFormate}</span></p>
          <p class="text-sm text-gray-400 mt-2">Lieux visités : ${data.poiVisites.length}/5</p>
        </div>
      </div>
    `;

    image.innerHTML = `
      <div class="w-full h-full bg-gradient-to-br from-neon-rose to-neon-bleu rounded-lg flex items-center justify-center">
        <div class="text-center text-white">
          <div class="text-6xl mb-4">🏆</div>
          <div class="text-2xl font-bold">Explorateur de Lyon</div>
        </div>
      </div>
    `;

    video.innerHTML = `
      <div class="w-full h-full bg-sombre-800 rounded-lg flex items-center justify-center">
        <div class="text-center text-gray-400">
          <div class="text-4xl mb-4">🌟</div>
          <p>Merci d'avoir exploré Lyon !</p>
        </div>
      </div>
    `;

    this.ouvrirModal();
  }

  formaterTemps(ms) {
    const minutes = Math.floor(ms / 60000);
    const secondes = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${secondes.toString().padStart(2, '0')}`;
  }

  ouvrirModal() {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    const btnFermer = document.getElementById('modal-fermer');

    this.modalActive = true;
    overlay.classList.remove('pointer-events-none');

    gsap.to(overlay, { opacity: 1, duration: 0.3 });
    gsap.to(content, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });

    overlay.setAttribute('aria-hidden', 'false');
    content.focus();

    // Ensure the close button is visible and clickable
    btnFermer.style.position = 'relative';
    btnFermer.style.zIndex = '50';
    btnFermer.style.pointerEvents = 'auto';
  }

  fermerModal() {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    this.modalActive = false;

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        overlay.classList.add('pointer-events-none');
      }
    });
    gsap.to(content, { scale: 0.95, duration: 0.3 });

    overlay.setAttribute('aria-hidden', 'true');

    // Forcer la fermeture du modal en le cachant complètement
    setTimeout(() => {
      if (overlay) {
        overlay.style.display = 'none';
        setTimeout(() => {
          overlay.style.display = '';
        }, 100);
      }
    }, 300);

    // Reset any YouTube iframes to prevent continued playback
    const youtubeIframe = document.getElementById('youtube-iframe');
    if (youtubeIframe) {
      youtubeIframe.src = 'about:blank';
    }
  }
}

export function initModal() {
  window.gestionnaireModal = new GestionnaireModal();
}
