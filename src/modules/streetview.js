import { chargeurPoi } from "./poi.js";
import { gsap } from "gsap";

class GestionnaireStreetView {
  constructor() {
    this.panorama = null;
    this.poiActuels = [];
    this.poiIndex = 0;
    this.tempsDebut = null;
    this.init();
  }

  init() {
    window.addEventListener("demarrer-streetview", () => {
      this.demarrerStreetView();
    });
  }

  async demarrerStreetView() {
    try {
      this.poiActuels = await chargeurPoi.chargerPoi();
      this.tempsDebut = Date.now();

      await this.chargerGoogleMaps();
      this.creerPanorama();
      this.positionnerSurPremierPoi();

      window.dispatchEvent(
        new CustomEvent("streetview-pret", {
          detail: {
            poiActuels: this.poiActuels,
            tempsDebut: this.tempsDebut,
          },
        })
      );
    } catch (error) {
      console.error("Erreur initialisation Street View:", error);
    }
  }

  async chargerGoogleMaps() {
    try {
      if (window.google && window.google.maps) {
        await this.chargerBibliotheques();
        return;
      }

      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_MAPS_KEY
        }`;
        script.async = true;
        script.defer = true;

        script.onload = async () => {
          try {
            await this.chargerBibliotheques();
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        script.onerror = () => reject(new Error("Erreur chargement Google Maps"));

        document.head.appendChild(script);
      });
    } catch (error) {
      console.error("Erreur lors du chargement de Google Maps:", error);
      throw error;
    }
  }

  async chargerBibliotheques() {
    try {
      const { StreetViewPanorama, StreetViewService } = await google.maps.importLibrary(
        "streetView"
      );
      const { Geometry } = await google.maps.importLibrary("geometry");

      this.StreetViewPanorama = StreetViewPanorama;
      this.StreetViewService = StreetViewService;
      this.Geometry = Geometry;
    } catch (error) {
      console.error("Erreur lors du chargement des bibliothèques:", error);
      throw error;
    }
  }

  creerPanorama() {
    const container = document.getElementById("streetview-container");

    if (!document.getElementById("streetview-filter")) {
      const filter = document.createElement("div");
      filter.id = "streetview-filter";
      filter.className = "absolute inset-0 pointer-events-none";
      filter.style.backgroundColor = "rgba(0, 0, 0, 0)";
      filter.style.backdropFilter = "blur(0px)";
      filter.style.transition = "backdrop-filter 0.3s ease-out";
      filter.style.zIndex = "5";
      container.parentNode.appendChild(filter);
    }

    const styleNuit = [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      { featureType: "poi", elementType: "geometry", stylers: [{ color: "#283d6a" }] },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ];

    this.panorama = new this.StreetViewPanorama(container, {
      position: { lat: 45.7577, lng: 4.832 },
      pov: { heading: 90, pitch: 5 },
      zoom: 1,
      addressControl: false,
      linksControl: false,
      panControl: false,
      enableCloseButton: false,
      fullscreenControl: false,
      motionTracking: false,
      motionTrackingControl: false,
      showRoadLabels: false,
      clickToGo: false,
      disableDefaultUI: true,
      scrollwheel: false,
      zoomControl: false,
      date: new Date("2024-01-01"),
      styles: styleNuit,
      visible: true,
    });

    this.panorama.setOptions({
      imageDateControl: false,
    });

    this.panorama.addListener("position_changed", () => {
      this.verifierProximitePoi();
    });

    this.panorama.addListener("pov_changed", () => {
      this.appliquerEffetTransition();
      this.prechargerPanoramasAdjacents();
    });

    this.panorama.addListener("zoom_changed", () => {
      this.appliquerEffetTransition();
    });
  }

  appliquerEffetTransition() {
    const filter = document.getElementById("streetview-filter");
    if (!filter) return;

    gsap.killTweensOf(filter);

    gsap.to(filter, {
      backdropFilter: "blur(8px)",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      duration: 0.2,
      ease: "power1.in",
      onComplete: () => {
        gsap.to(filter, {
          backdropFilter: "blur(0px)",
          backgroundColor: "rgba(0, 0, 0, 0)",
          duration: 0.5,
          delay: 0.1,
          ease: "power2.out",
        });
      },
    });
  }

  positionnerSurPremierPoi() {
    if (this.poiActuels.length > 0) {
      const premierPoi = this.poiActuels[0];
      this.panorama.setPosition({
        lat: premierPoi.lat,
        lng: premierPoi.lng,
      });
      this.panorama.setPov({
        heading: premierPoi.heading,
        pitch: premierPoi.pitch,
      });
      this.loadEtiquettes(premierPoi.etiquettes);
    }
  }

  verifierProximitePoi() {
    if (!this.panorama) return;

    const positionActuelle = this.panorama.getPosition();
    if (!positionActuelle) return;

    const poiNonVisites = this.poiActuels.filter((poi) => !poi.visite);

    poiNonVisites.forEach((poi) => {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        positionActuelle,
        new google.maps.LatLng(poi.lat, poi.lng)
      );

      if (distance <= 30) {
        this.declencherDecouverte(poi);
      }
    });
  }

  declencherDecouverte(poi) {
    poi.visite = true;
    poi.tempsDecouverte = Date.now() - this.tempsDebut;

    window.dispatchEvent(
      new CustomEvent("poi-atteint", {
        detail: poi,
      })
    );

    const poiRestants = this.poiActuels.filter((p) => !p.visite);
    if (poiRestants.length === 0) {
      window.dispatchEvent(
        new CustomEvent("jeu-termine", {
          detail: {
            tempsTotal: Date.now() - this.tempsDebut,
            poiVisites: this.poiActuels.filter((p) => p.visite),
          },
        })
      );
    }
  }

  obtenirProchainPoi() {
    return this.poiActuels.find((poi) => !poi.visite);
  }

  obtenirPositionActuelle() {
    return this.panorama ? this.panorama.getPosition() : null;
  }

  teleporterVers(lat, lng, heading, pitch, etiquettes) {
    if (!this.panorama) return;

    this.appliquerEffetTransition();

    this.panorama.setPosition({
      lat: lat,
      lng: lng,
    });

    this.panorama.setPov({
      heading: heading,
      pitch: pitch,
    });

    this.loadEtiquettes(etiquettes);

    this.verifierProximitePoi();
  }

  loadEtiquettes(etiquettes) {
    console.log(etiquettes[0].text);
  }

  async prechargerPanoramasAdjacents() {
    if (!this.panorama || !this.StreetViewService) return;

    try {
      if (!this.streetViewService) {
        this.streetViewService = new this.StreetViewService();
      }

      const positionActuelle = this.panorama.getPosition();
      if (!positionActuelle) return;

      const povActuel = this.panorama.getPov();

      const directions = [
        povActuel.heading,
        (povActuel.heading + 90) % 360,
        (povActuel.heading - 90 + 360) % 360,
      ];

      for (const heading of directions) {
        await this.prechargerPanoramaDirection(positionActuelle, heading);
      }
    } catch (error) {
      console.error("Erreur lors du préchargement des panoramas:", error);
    }
  }

  async prechargerPanoramaDirection(position, heading, tentative = 1, delaiMax = 10000) {
    if (!this.streetViewService) return;

    try {
      const point = google.maps.geometry.spherical.computeOffset(position, 10, heading);

      const resultat = await this.appelerAvecBackoff(
        () =>
          new Promise((resolve, reject) => {
            this.streetViewService.getPanorama(
              {
                location: point,
                radius: 50,
                preference: "nearest",
              },
              (data, status) => {
                if (status === "OK") {
                  resolve(data);
                } else {
                  reject(new Error(`Erreur StreetView: ${status}`));
                }
              }
            );
          })
      );

      return resultat;
    } catch (error) {
      if (tentative < 3) {
        const delai = Math.min(Math.pow(2, tentative) * 1000, delaiMax);
        console.log(`Nouvelle tentative de préchargement dans ${delai}ms...`);

        await new Promise((resolve) => setTimeout(resolve, delai));
        return this.prechargerPanoramaDirection(position, heading, tentative + 1);
      } else {
        console.error("Échec du préchargement après plusieurs tentatives:", error);
      }
    }
  }

  async appelerAvecBackoff(fn, tentative = 1, delaiMax = 10000) {
    try {
      return await fn();
    } catch (error) {
      const estErreurQuota =
        error.message &&
        (error.message.includes("OVER_QUERY_LIMIT") ||
          error.message.includes("RESOURCE_EXHAUSTED") ||
          error.message.includes("RATE_LIMIT"));

      if (estErreurQuota && tentative < 5) {
        const delai = Math.min(Math.pow(2, tentative) * 1000, delaiMax);
        console.log(`Limite de quota atteinte. Nouvelle tentative dans ${delai}ms...`);

        await new Promise((resolve) => setTimeout(resolve, delai));
        return this.appelerAvecBackoff(fn, tentative + 1);
      } else {
        throw error;
      }
    }
  }
}

export function initStreetView() {
  window.gestionnaireStreetView = new GestionnaireStreetView();
}
