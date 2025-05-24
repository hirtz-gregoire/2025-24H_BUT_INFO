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
        heading: 120,
        pitch: 5,
        youtubeId: "tQpghHw7L_g",
        imgPath: "/img/bellecour.jpg",
        description:
          "La plus grande place piétonne d'Europe, offrant une vue dégagée sur la colline de Fourvière et ses illuminations.",
        etiquettes: [
          {
            heading: 130,
            pitch: 25,
            text: "La place Bellecour\n\nSituée au cœur de Lyon,\nla Place Bellecour est l’une des plus grandes places piétonnes d’Europe.\nDominée par la statue équestre de Louis XIV.\n\nElle constitue un point de repère emblématique de la ville.\nEntourée de boutiques, de cafés et offrant une vue sur la colline de Fourvière,\nc’est un lieu central pour les rendez-vous,\nles événements et les balades.",
          },
        ],
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
        etiquettes: [
          {
            heading: 0,
            pitch: 15,
            text: "La place des Terreaux\n\nSituée en plein cœur de Lyon,\nla Place des Terreaux est une large esplanade entourée de façades classiques.\n\nTrès animée, elle offre un bel équilibre entre culture, patrimoine et vie urbaine.\nOn y trouve la célèbre fontaine de Bartholdi, symbole fort de la place.",
          },
          {
            heading: 60,
            pitch: 5,
            text: "Hôtel de Ville de Lyon\n\nL’Hôtel de Ville, qui borde la Place des Terreaux, est un bâtiment majestueux datant du XVIIe siècle.\nSon architecture riche et sa façade sculptée en font l’un des édifices les plus impressionnants de la ville.\n\nIl abrite encore aujourd’hui la mairie centrale de Lyon.",
          },
        ],
      },
      {
        id: "fourviere",
        nom: "Basilique Notre-Dame de Fourvière",
        lat: 45.7627763,
        lng: 4.8230147,
        heading: 300,
        pitch: 5,
        youtubeId: "V3TA1RGOEKA",
        imgPath: "/img/fourviere.jpg",
        description:
          "Perchée sur la colline, la basilique offre un panorama exceptionnel sur Lyon, particulièrement spectaculaire la nuit.",
        etiquettes: [
          {
            heading: 280,
            pitch: 20,
            text: "Fourvière\n\nPerchée au- dessus de la ville,\nla colline de Fourvière offre un panorama exceptionnel sur tout Lyon.\n\nSurnommée la “colline qui prie”,\nelle est un lieu de promenade, de recueillement et de patrimoine,\nmêlant nature, histoire et spiritualité.",
          },
          {
            heading: 30,
            pitch: 20,
            text: "Basilique Notre-Dame de Fourvière\n\nConstruite à la fin du XIXe siècle,\nla basilique Notre-Dame de Fourvière domine Lyon de son allure unique.\n\nSon style mêle inspiration romane et byzantine,\net son intérieur richement décoré attire chaque année des milliers de visiteurs.",
          }
        ],
      },
      {
        id: "republique",
        nom: "Rue de la République",
        lat: 45.7630008,
        lng: 4.8357851,
        heading: 120,
        pitch: 5,
        youtubeId: "dQw4w9WgXcQ",
        imgPath: "/img/republique.jpg",
        description:
          "Une rue commerçante emblématique de Lyon, bordée de boutiques et de bâtiments historiques.",
        etiquettes: [
          {
            heading: 100,
            pitch: 10,
            text: "Rue de la République\n\nLa rue de la République est l’une des principales artères commerçantes de Lyon.\n\nElle relie la place Bellecour à la place de la Comédie, et est entièrement piétonne,\nidéale pour le shopping ou une balade en centre-ville.",
          },
          {
            heading: 200,
            pitch: 10,
            text: "Une rue vivante et centrale.\n\nTrès fréquentée, la 'Rue de la Ré' incarne l’énergie du centre- ville lyonnais.\n\nBordée de boutiques, de cinémas et de cafés,\nelle attire autant les locaux que les visiteurs,\ndans un décor haussmannien élégant.",
          }
        ],
      },
      {
        id: "jacobins",
        nom: "Place des Jacobins",
        lat: 45.7602592,
        lng: 4.8335169,
        heading: 0,
        pitch: 0,
        youtubeId: "XpGWHP0-zjE",
        imgPath: "/img/jacobins.jpg",
        description:
          "Une place centrale animée avec une fontaine emblématique, entourée de cafés et de boutiques.",
        etiquettes: [
          {
            heading: 25,
            pitch: 20,
            text: "Place des Jacobins\n\nNichée au cœur du quartier Presqu'île, la Place des Jacobins est l'une des plus élégantes de Lyon.\n\nSon charme tient à son architecture harmonieuse et à sa magnifique fontaine blanche au centre.",
          },
          {
            heading: 25,
            pitch: 10,
            text: "Un écrin de calme et de beauté\n\nEntourée de bâtiments haussmanniens et de terrasses accueillantes,\nla place offre un cadre paisible pour faire une pause ou simplement admirer le décor.\n\nUn vrai bijou au cœur de la ville.",
          }
        ],
      },
    ];
  },
};
