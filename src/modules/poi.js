export const chargeurPoi = {
  async chargerPoi() {
    try {
      const response = await fetch('/poi.json');
      const data = await response.json();
      return data.poi.map(poi => ({
        ...poi,
        visite: false,
        tempsDecouverte: null
      }));
    } catch (error) {
      console.error('Erreur chargement POI:', error);
      return this.obtenirPoiParDefaut();
    }
  },

  obtenirPoiParDefaut() {
    return [
      {
        id: 'bellecour',
        nom: 'Place Bellecour',
        lat: 45.7577,
        lng: 4.8320,
        heading: 90,
        pitch: 5,
        youtubeId: 'dQw4w9WgXcQ',
        imgPath: '/img/bellecour.jpg',
        description: 'La plus grande place piétonne d\'Europe, magnifiquement illuminée pour la Fête des Lumières.',
        visite: false,
        tempsDecouverte: null
      },
      {
        id: 'terreaux',
        nom: 'Place des Terreaux',
        lat: 45.7673,
        lng: 4.8339,
        heading: 0,
        pitch: 5,
        youtubeId: 'dQw4w9WgXcQ',
        imgPath: '/img/terreaux.jpg',
        description: 'Place historique avec sa fontaine de Bartholdi et l\'Hôtel de Ville illuminés.',
        visite: false,
        tempsDecouverte: null
      },
      {
        id: 'fourviere',
        nom: 'Basilique Fourvière',
        lat: 45.7622,
        lng: 4.8229,
        heading: 200,
        pitch: 10,
        youtubeId: 'dQw4w9WgXcQ',
        imgPath: '/img/fourviere.jpg',
        description: 'Perchée sur la colline, la basilique offre un spectacle lumineux exceptionnel.',
        visite: false,
        tempsDecouverte: null
      },
      {
        id: 'institut',
        nom: 'Institut Lumière',
        lat: 45.7445,
        lng: 4.8652,
        heading: 120,
        pitch: 5,
        youtubeId: 'dQw4w9WgXcQ',
        imgPath: '/img/institut.jpg',
        description: 'Berceau du cinéma, l\'Institut Lumière célèbre l\'art de la lumière et du mouvement.',
        visite: false,
        tempsDecouverte: null
      },
      {
        id: 'quais',
        nom: 'Berges du Rhône',
        lat: 45.7575,
        lng: 4.8370,
        heading: 270,
        pitch: 0,
        youtubeId: 'dQw4w9WgXcQ',
        imgPath: '/img/quais.jpg',
        description: 'Les quais du Rhône transformés en promenade lumineuse le long du fleuve.',
        visite: false,
        tempsDecouverte: null
      }
    ];
  }
};
