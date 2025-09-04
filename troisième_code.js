// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', () => {
  
  // === INJECTION DU CSS DYNAMIQUE ===
  // Crée un élément <style> pour ajouter du CSS personnalisé à la page
  const style = document.createElement('style');
  style.textContent = `
    /* Style pour les titres de sections dynamiques */
    .dynamic-title {
      margin: 15px 0 8px;      /* Espacement autour du titre */
      color: #003A52;          /* Couleur bleu foncé */
      font-weight: 700;        /* Texte en gras */
      font-size: 1.4rem;       /* Taille de police */
    }
    
    /* Style pour chaque bloc d'attributs */
    .attribute-block {
      padding-bottom: 20px;              /* Espacement en bas */
      border-bottom: 1px solid #d6e5f6;  /* Ligne de séparation */
      margin-bottom: 20px;               /* Marge en bas */
    }
    
    /* Le dernier bloc n'a pas de bordure ni marge en bas */
    .attribute-block:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    
    /* Conteneur pour les badges (disposition flexible) */
    .badges-container {
      display: flex;           /* Affichage en ligne flexible */
      flex-wrap: wrap;         /* Retour à la ligne si nécessaire */
      gap: 10px;              /* Espacement entre les badges */
      padding-top: 6px;       /* Espacement en haut */
    }
    
    /* Style pour chaque badge individuel */
    .badges-container span {
      background-color: #f0f7fb;        /* Arrière-plan bleu très clair */
      border-radius: 12px;              /* Coins arrondis */
      padding: 6px 12px;                /* Espacement interne */
      font-size: 14px;                  /* Taille de police */
      color: #003A52;                   /* Couleur du texte */
      display: inline-flex;             /* Affichage flexible en ligne */
      align-items: center;              /* Alignement vertical centré */
      gap: 6px;                         /* Espacement entre icône et texte */
      box-shadow: 0 1px 3px rgba(0,58,82,0.2);  /* Ombre légère */
      cursor: default;                  /* Curseur par défaut (pas de main) */
      position: relative;               /* Position relative pour effets futurs */
    }
    
    /* Style pour les icônes dans les badges */
    .badges-container span i {
      font-size: 16px;         /* Taille des icônes */
    }
    
    /* Style pour le titre principal au-dessus des blocs */
    .ternary-main-title {
      font-weight: 700;        /* Texte en gras */
      font-size: 1.6rem;       /* Taille plus grande que les sous-titres */
      color: #003A52;          /* Même couleur que les autres titres */
      margin-bottom: 12px;     /* Espacement en bas */
    }
  `;
  // Ajoute le CSS au <head> de la page
  document.head.appendChild(style);

  // === AJOUT DU TITRE PRINCIPAL "Détails :" ===
  // Parcourt tous les blocs d'attributs tertiaires
  document.querySelectorAll('.hp-listing__attributes--ternary').forEach(block => {
    
    // Vérification pour éviter les doublons
    // Vérifie si l'élément précédent n'est pas déjà le titre principal
    if (!block.previousElementSibling || !block.previousElementSibling.classList.contains('ternary-main-title')) {
      
      // Crée le titre principal
      const mainTitle = document.createElement('h2');
      mainTitle.className = 'ternary-main-title';
      mainTitle.textContent = 'Détails :';
      
      // Insère le titre avant le bloc d'attributs
      block.parentNode.insertBefore(mainTitle, block);
    }
  });

  // === MAPPING DES ICÔNES ===
  // Dictionnaire qui associe chaque équipement à son icône FontAwesome
  const iconMap = {
    'PMR': 'fa-wheelchair',              // Personnes à mobilité réduite
    'Chauffage': 'fa-fire',              // Chauffage
    'Climatisation': 'fa-snowflake',     // Climatisation
    'Cuisine équipée': 'fa-utensils',    // Ustensiles de cuisine
    'Jardin': 'fa-tree',                 // Arbre pour jardin
    'Lave-linge': 'fa-soap',             // Savon pour lave-linge
    'Lave vaisselle': 'fa-dishwasher',   // Lave-vaisselle (vérifier disponibilité)
    'Linge de lit': 'fa-bed',            // Lit
    'Ménage': 'fa-broom',                // Balai pour ménage
    'Parking': 'fa-parking',             // Parking
    'Petit déjeuner': 'fa-coffee',       // Café
    'Piscine': 'fa-swimmer',             // Nageur
    'Jacuzzi / Spa': 'fa-hot-tub',       /* Jacuzzi */
    'Chaise haute': 'fa-child',          // Enfant
    'Télévision': 'fa-tv',               // Télévision
    'Terrasse ou balcon': 'fa-umbrella-beach',  // Parasol de plage
    'Wi-Fi': 'fa-wifi',                  // Wi-Fi
    'Barbecue': 'fa-burn'                // Flamme pour barbecue
  };

  // === TRAITEMENT PRINCIPAL DES BLOCS D'ATTRIBUTS ===
  // Parcourt chaque bloc d'attributs tertiaires
  document.querySelectorAll('.hp-listing__attributes--ternary').forEach(block => {
    
    // Récupère tous les attributs dans ce bloc
    const attrDivs = block.querySelectorAll('.hp-listing__attribute');
    
    // Si aucun attribut trouvé, passe au bloc suivant
    if (!attrDivs.length) return;

    // === TRAITEMENT DE CHAQUE ATTRIBUT ===
    attrDivs.forEach(attrDiv => {
      
      // Crée un conteneur pour encapsuler l'attribut transformé
      const wrapper = document.createElement('div');
      wrapper.className = 'attribute-block';

      // === EXTRACTION ET PARSING DU CONTENU ===
      // Récupère tout le texte brut de l'attribut
      let rawText = attrDiv.textContent.trim();

      // Divise le texte en éléments séparés par des virgules
      // Exemple: "Équipements: Wi-Fi, Parking, Piscine" → ["Wi-Fi", "Parking", "Piscine"]
      let items = rawText.split(',').map(i => i.trim()).filter(Boolean);

      // === EXTRACTION DU TITRE DE SECTION ===
      let titleText = 'Détails';  // Titre par défaut
      
      // Si le premier élément contient ":", c'est le titre de la section
      if (items.length > 0 && items[0].includes(':')) {
        const splitIndex = items[0].indexOf(':');
        
        // Extrait la partie avant ":" comme titre
        titleText = items[0].slice(0, splitIndex).trim();
        // Exemple: "Équipements: Wi-Fi" → titleText = "Équipements"

        // Remplace le premier élément par ce qui vient après ":"
        items[0] = items[0].slice(splitIndex + 1).trim();
        // Exemple: "Équipements: Wi-Fi" → items[0] = "Wi-Fi"
      }

      // === CRÉATION DU TITRE DE SECTION ===
      const titleElem = document.createElement('h3');
      titleElem.className = 'dynamic-title';
      titleElem.textContent = titleText;
      wrapper.appendChild(titleElem);

      // === CRÉATION DU CONTENEUR DE BADGES ===
      const container = document.createElement('div');
      container.className = 'badges-container';

      // === CRÉATION DES BADGES INDIVIDUELS ===
      items.forEach(item => {
        // Ignore les éléments vides
        if (!item) return;
        
        // Crée un badge pour cet élément
        const badge = document.createElement('span');

        // === AJOUT D'ICÔNES POUR LES ÉQUIPEMENTS ===
        // Ajoute des icônes seulement si c'est un attribut "équipements"
        if (attrDiv.classList.contains('hp-listing__attribute--equipements')) {
          let iconClass = '';
          
          // Cherche dans le mapping si l'élément correspond à une icône
          for (const key in iconMap) {
            // Comparaison insensible à la casse
            if (item.toLowerCase().includes(key.toLowerCase())) {
              iconClass = iconMap[key];
              break;  // Arrête à la première correspondance trouvée
            }
          }
          
          // Si une icône est trouvée, l'ajoute au badge
          if (iconClass) {
            const icon = document.createElement('i');
            icon.className = `fas ${iconClass}`;  // Classes FontAwesome
            icon.style.fontSize = '16px';
            badge.appendChild(icon);
          }
        }

        // === AJOUT DU TEXTE AU BADGE ===
        // Ajoute le texte de l'élément après l'icône (si présente)
        badge.appendChild(document.createTextNode(item));
        
        // Ajoute le badge au conteneur
        container.appendChild(badge);
      });

      // === ASSEMBLAGE FINAL ===
      // Ajoute le conteneur de badges au wrapper
      wrapper.appendChild(container);

      // === REMPLACEMENT DANS LE DOM ===
      // Vide le contenu original de l'attribut
      attrDiv.textContent = '';
      
      // Remplace par le nouveau contenu stylisé
      attrDiv.appendChild(wrapper);
    });
  });
});