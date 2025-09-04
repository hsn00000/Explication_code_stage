document.addEventListener('DOMContentLoaded', () => {
  // Injecter CSS dynamique
  const style = document.createElement('style');
  style.textContent = `
    .dynamic-title {
      margin: 15px 0 8px;
      color: #003A52;
      font-weight: 700;
      font-size: 1.4rem;
    }
    .attribute-block {
      padding-bottom: 20px;
      border-bottom: 1px solid #d6e5f6;
      margin-bottom: 20px;
    }
    .attribute-block:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    .badges-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding-top: 6px;
    }
    .badges-container span {
      background-color: #f0f7fb;
      border-radius: 12px;
      padding: 6px 12px;
      font-size: 14px;
      color: #003A52;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 1px 3px rgba(0,58,82,0.2);
      cursor: default;
      position: relative;
    }
    .badges-container span i {
      font-size: 16px;
    }
    /* Nouveau style pour le titre général */
    .ternary-main-title {
      font-weight: 700;
      font-size: 1.6rem;
      color: #003A52;
      margin-bottom: 12px;
    }
  `;
  document.head.appendChild(style);

  // Ajout du titre "Détails :" au-dessus du bloc ternaire
  document.querySelectorAll('.hp-listing__attributes--ternary').forEach(block => {
    // Vérifier s’il n’existe pas déjà (éviter doublon)
    if (!block.previousElementSibling || !block.previousElementSibling.classList.contains('ternary-main-title')) {
      const mainTitle = document.createElement('h2');
      mainTitle.className = 'ternary-main-title';
      mainTitle.textContent = 'Détails :';
      block.parentNode.insertBefore(mainTitle, block);
    }
  });

  const iconMap = {
  'PMR': 'fa-wheelchair',
  'Chauffage': 'fa-fire',
  'Climatisation': 'fa-snowflake',
  'Cuisine équipée': 'fa-utensils',
  'Jardin': 'fa-tree',
  'Lave-linge': 'fa-soap',
  'Lave vaisselle': 'fa-dishwasher',  // vérifier la disponibilité selon ta version FA
  'Linge de lit': 'fa-bed',
  'Ménage': 'fa-broom',
  'Parking': 'fa-parking',
  'Petit déjeuner': 'fa-coffee',
  'Piscine': 'fa-swimmer',
  'Jacuzzi / Spa': 'fa-hot-tub',
  'Chaise haute': 'fa-child',
  'Télévision': 'fa-tv',
  'Terrasse ou balcon': 'fa-umbrella-beach',
  'Wi-Fi': 'fa-wifi',
  'Barbecue': 'fa-burn'
};


  document.querySelectorAll('.hp-listing__attributes--ternary').forEach(block => {
    const attrDivs = block.querySelectorAll('.hp-listing__attribute');
    if (!attrDivs.length) return;

    attrDivs.forEach(attrDiv => {
      // Wrapper pour chaque attribut
      const wrapper = document.createElement('div');
      wrapper.className = 'attribute-block';

      // Extraire le texte complet brut
      let rawText = attrDiv.textContent.trim();

      // Séparer en items en fonction des virgules
      let items = rawText.split(',').map(i => i.trim()).filter(Boolean);

      // Si le premier item contient ":", extraire le titre
      let titleText = 'Détails';
      if (items.length > 0 && items[0].includes(':')) {
        const splitIndex = items[0].indexOf(':');
        titleText = items[0].slice(0, splitIndex).trim();

        // Remplacer le premier item par sa valeur après ":"
        items[0] = items[0].slice(splitIndex + 1).trim();
      }

      // Ajouter titre en haut
      const titleElem = document.createElement('h3');
      titleElem.className = 'dynamic-title';
      titleElem.textContent = titleText;
      wrapper.appendChild(titleElem);

      // Container badges
      const container = document.createElement('div');
      container.className = 'badges-container';

      items.forEach(item => {
        if (!item) return;
        const badge = document.createElement('span');

        // Ajout icônes uniquement si catégorie équipements
        if (attrDiv.classList.contains('hp-listing__attribute--equipements')) {
          let iconClass = '';
          for (const key in iconMap) {
            if (item.toLowerCase().includes(key.toLowerCase())) {
              iconClass = iconMap[key];
              break;
            }
          }
          if (iconClass) {
            const icon = document.createElement('i');
            icon.className = `fas ${iconClass}`;
            icon.style.fontSize = '16px';
            badge.appendChild(icon);
          }
        }

        badge.appendChild(document.createTextNode(item));
        container.appendChild(badge);
      });

      wrapper.appendChild(container);

      // Remplacer contenu de attrDiv par wrapper
      attrDiv.textContent = '';
      attrDiv.appendChild(wrapper);
    });
  });
});

