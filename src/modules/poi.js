export const chargeurPoi = {
  async chargerPoi() {
    return this.obtenirPoiParDefault();
  },

  obtenirPoiParDefault() {
    return [
      {
        id: "bellecour",
        nom: "Place Bellecour",
        lat: 45.7579101,
        lng: 4.8321149,
        heading: 90,
        pitch: 5,
        youtubeId: "dQw4w9WgXcQ",
        imgPath: "/img/bellecour.jpg",
        description:
          "La plus grande place piétonne d'Europe, offrant une vue dégagée sur la colline de Fourvière et ses illuminations.",
      },
      {
        id: "terreaux",
        nom: "Place des Terreaux",
        lat: 45.7673055,
        lng: 4.8335643,
        heading: 0,
        pitch: 5,
        youtubeId: "JFrP9Y1jteo",
        imgPath: "/img/terreaux.jpg",
        description:
          "Place historique avec la fontaine Bartholdi et l'Hôtel de Ville, souvent mise en lumière lors d'événements culturels.",
      },
      {
        id: "fourviere",
        nom: "Basilique Notre-Dame de Fourvière",
        lat: 45.7627763,
        lng: 4.8230147,
        heading: 300,
        pitch: 5,
        youtubeId: "dQw4w9WgXcQ",
        imgPath: "/img/fourviere.jpg",
        description:
          "Perchée sur la colline, la basilique offre un panorama exceptionnel sur Lyon, particulièrement spectaculaire la nuit.",
      },
      {
        id: "institut",
        nom: "Institut Lumière",
        lat: 45.745169,
        lng: 4.869602,
        heading: 120,
        pitch: 5,
        youtubeId: "dQw4w9WgXcQ",
        imgPath: "/img/institut.jpg",
        description:
          "Berceau du cinéma, l'Institut Lumière célèbre l'art de la lumière et du mouvement dans un cadre historique.",
      },
      {
        id: "quais",
        nom: "Berges du Rhône",
        lat: 45.7575,
        lng: 4.837,
        heading: 270,
        pitch: 0,
        youtubeId: "dQw4w9WgXcQ",
        imgPath: "/img/quais.jpg",
        description:
          "Les quais du Rhône transformés en promenade lumineuse le long du fleuve, offrant une ambiance paisible en soirée.",
      },
    ];
  },
};
