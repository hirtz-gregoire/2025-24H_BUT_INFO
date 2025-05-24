import { gsap } from "gsap";

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
    const container = document.getElementById("hud-container");

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
  
  creerCarteContainer() {
    const ancienContainer = document.getElementById('map-container');
    if (ancienContainer) {
      ancienContainer.remove();
    }
    
    const mapContainer = document.createElement('div');
    mapContainer.id = 'map-container';
    mapContainer.className = 'rounded-lg overflow-hidden glassmorphism border border-neon-rose';
    document.body.appendChild(mapContainer);
    
    return mapContainer;
  }

  configurerEvenements() {
    window.addEventListener("streetview-pret", (event) => {
      this.initialiserMission(event.detail);
      this.initialiserCarte();
    });

    window.addEventListener("poi-atteint", (event) => {
      this.marquerPoiVisite(event.detail);
    });
    
    window.addEventListener("position-changed", (event) => {
      if (this.map && event.detail) {
        this.mettreAJourPositionCarte(event.detail.lat, event.detail.lng);
      }
    });
  }
  
  async initialiserCarte() {
    try {
      this.creerCarteContainer();
      
      if (!window.google || !window.google.maps) {
        await new Promise(resolve => {
          const checkGoogleMaps = setInterval(() => {
            if (window.google && window.google.maps) {
              clearInterval(checkGoogleMaps);
              resolve();
            }
          }, 100);
        });
      }
      
      const mapOptions = {
        center: { lat: 45.7579, lng: 4.8320 },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
          { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
          { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
          { featureType: "poi", elementType: "geometry", stylers: [{ color: "#283d6a" }] },
          { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
          { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
          { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
        ]
      };
      
      this.map = new google.maps.Map(document.getElementById("map-container"), mapOptions);
      
      this.positionMarker = new google.maps.Marker({
        position: { lat: 45.7579, lng: 4.8320 },
        map: this.map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#f72585",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2
        },
        title: "Votre position"
      });
      
      this.poiActuels.forEach(poi => {
        new google.maps.Marker({
          position: { lat: poi.lat, lng: poi.lng },
          map: this.map,
          title: poi.nom,
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${poi.visite ? '#4ade80' : '#ffffff'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24)
          }
        });
      });
      
      if (this.poiActuels.length > 0) {
        const premierPoi = this.poiActuels[0];
        this.mettreAJourPositionCarte(premierPoi.lat, premierPoi.lng);
      }
      
      if (window.gestionnaireStreetView && window.gestionnaireStreetView.panorama) {
        window.gestionnaireStreetView.panorama.addListener("position_changed", () => {
          const position = window.gestionnaireStreetView.panorama.getPosition();
          if (position) {
            window.dispatchEvent(new CustomEvent("position-changed", {
              detail: {
                lat: position.lat(),
                lng: position.lng()
              }
            }));
          }
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error);
    }
  }
  
  mettreAJourPositionCarte(lat, lng) {
    if (!this.map || !this.positionMarker) return;
    
    const position = new google.maps.LatLng(lat, lng);
    this.positionMarker.setPosition(position);
    this.map.panTo(position);
  }

  initialiserMission(data) {
    this.poiActuels = data.poiActuels;
    this.tempsDebut = data.tempsDebut;

    this.mettreAJourListePoi();

    gsap.to("#hud-content", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      delay: 0.5,
    });
  }

  mettreAJourListePoi() {
    const listePoi = document.getElementById("liste-poi");

    listePoi.innerHTML = this.poiActuels
      .map((poi) => {
        let string = "";
        poi.etiquettes.forEach((etiquette, index) => {
          string += `

        data-poi-etiquette${index}-heading="${etiquette.heading}"
        data-poi-etiquette${index}-pitch="${etiquette.pitch}"
        data-poi-etiquette${index}-text="${etiquette.text}"
        `;
        });
        return `
      <button 
        class="w-full flex items-center space-x-3 p-2 rounded ${
          poi.visite ? "bg-green-900 bg-opacity-50" : "bg-sombre-800"
        } hover:bg-opacity-80 transition-all"
        data-poi-id="${poi.id}"
        data-poi-lat="${poi.lat}"
        data-poi-lng="${poi.lng}"
        data-poi-heading="${poi.heading}"
        data-poi-pitch="${poi.pitch}"
        ${string}
      >
        <span class="text-lg">${poi.visite ? "✅" : "📍"}</span>
        <span class="${poi.visite ? "line-through text-gray-400" : "text-white"}">${
          poi.nom
        }</span>
      </button>
    `;
      })
      .join("");

    const boutonsPoi = listePoi.querySelectorAll("button");
    boutonsPoi.forEach((bouton) => {
      bouton.addEventListener("click", () => {
        const poiId = bouton.dataset.poiId;
        const lat = parseFloat(bouton.dataset.poiLat);
        const lng = parseFloat(bouton.dataset.poiLng);
        const heading = parseFloat(bouton.dataset.poiHeading);
        const pitch = parseFloat(bouton.dataset.poiPitch);

        const etiquettes = [];
        let index = 0;
        while (true) {
          const headingKey = `poiEtiquette${index}Heading`;
          const pitchKey = `poiEtiquette${index}Pitch`;
          const textKey = `poiEtiquette${index}Text`;

          if (
            bouton.dataset[headingKey] !== undefined &&
            bouton.dataset[pitchKey] !== undefined &&
            bouton.dataset[textKey] !== undefined
          ) {
            etiquettes.push({
              heading: parseFloat(bouton.dataset[headingKey]),
              pitch: parseFloat(bouton.dataset[pitchKey]),
              text: bouton.dataset[textKey],
            });
            index++;
          } else {
            break;
          }
        }

        if (window.gestionnaireStreetView) {
          window.gestionnaireStreetView.teleporterVers(
            lat,
            lng,
            heading,
            pitch,
            etiquettes
          );

          const poiInfo = this.poiActuels.find((p) => p.id === poiId);
          if (poiInfo && window.gestionnaireModal) {
            window.gestionnaireModal.afficherModalPoi(poiInfo);
          }
        }
      });
    });
  }

  marquerPoiVisite(poi) {
    const poiIndex = this.poiActuels.findIndex((p) => p.id === poi.id);
    if (poiIndex !== -1) {
      this.poiActuels[poiIndex].visite = true;
    }

    this.mettreAJourListePoi();

    const boutons = document.querySelectorAll("#liste-poi button");
    if (boutons[poiIndex]) {
      gsap.fromTo(
        boutons[poiIndex],
        { scale: 1, backgroundColor: "rgba(34, 197, 94, 0.2)" },
        {
          scale: 1.05,
          backgroundColor: "rgba(34, 197, 94, 0.5)",
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        }
      );
    }
  }
}

export function initHUD() {
  window.gestionnaireHUD = new GestionnaireHUD();
}
