// Ce code permet de modifier l'ordre des élements de mon formulaire + masquer les champs importants + Ajout des descriptions etc

// Attendre que le DOM soit complètement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {
  
  // === DÉFINITION DES SÉLECTEURS CSS ===
  // Sélecteur pour le conteneur principal du formulaire
  const containerSelector = '.hp-form--listing-submit';
  // Sélecteur pour la zone des champs du formulaire
  const formSelector = `${containerSelector} .hp-form__fields`;
  // Sélecteur pour le menu déroulant des catégories
  const selectSelector = 'select[name="categories"]';

  // === DÉFINITION DES CATÉGORIES PAR ID ===
  // IDs correspondant aux hébergements (hôtels, maisons, etc.)
  const idsHebergements = ['55', '56', '57', 'NaN'];
  // IDs correspondant aux activités (visites, excursions, etc.)
  const idsActivites = ['74', '79', '83', '145', 'NaN'];
  // IDs correspondant aux véhicules (voitures, motos, etc.)
  const idsVehicules = ['95', '104', '146', '147', 'NaN'];
  // IDs correspondant aux services (jardinage, ménage, etc.)
  const idsServices = ['67', '68', '69', '70', '71', 'NaN'];

  // === CONFIGURATION DES SECTIONS POUR CHAQUE CATÉGORIE ===
  
  // Structure des sections pour les hébergements
  const sectionsHebergements = [
    { id: 'presentation', title: 'Votre hébergement', fields: ['title', 'description', 'images'] },
    { id: 'localisation', title: 'Où se situe votre logement ?', fields: ['location'] },
    { id: 'tarif', title: 'Fixez votre tarif', fields: ['unite_tarification', 'prix_dinar', 'prix_euros'] },
    { id: 'details', title: 'Détails du logement', fields: ['superficie_m', 'nombre_de_chambres', 'nombre_de_salles_de_bain', 'type_de_lit_s[]', 'pets'] },
    { id: 'equipements', title: 'Équipements disponibles', fields: ['equipements[]', 'vue_environnement[]', 'proximit_services[]'] },
    { id: 'horaires', title: 'Horaires de séjour', fields: ['heure_d_arriv_e', 'heure_de_d_part_2'] },
    { id: 'caution', title: 'Dépôt de garantie', fields: ['caution_demand_e', 'montant_de_la_caution_dzd', 'montant_de_la_caution'] },
    { id: 'reglement', title: 'Règlement intérieur', fields: ['r_glement_int_rieur_condition'] }
  ];

  // Structure des sections pour les activités
  const sectionsActivites = [
    { id: 'presentation', title: "Présentation de l'activité", fields: ['title', 'description', 'images', 'type_d_activit'] },
    { id: 'localisation', title: 'Localisation & départ', fields: ['location', 'adresse', 'heure_de_d_part', 'heure_fin_activite'] },
    { id: 'duree_disponibilite', title: 'Durée & disponibilité', fields: ['dur_e_de_l_activit', 'booking_slot_duration', 'capacit_par_cr_neau'] },
    { id: 'tarification', title: 'Tarification', fields: ['unite_tarification', 'prix_dinar', 'prix_euros'] },
    { id: 'infos_pratiques', title: 'Infos pratiques & logistique', fields: ['public_cible', 'transport_inclus', 'tenue_recommand_e', 'materiel_activite','conditions_d_annulation','purchase_note'] },
  ];

  // Structure des sections pour les véhicules
  const sectionsVehicules = [
    { id: 'presentation', title: 'Présentation du véhicule', fields: ['title', 'description', 'images'] },
    { id: 'localisation', title: 'Localisation & adresse de départ', fields: ['location', 'adresse_2'] },
    { id: 'horaires', title: 'Horaires', fields: ['heure_de_d_but', 'heure_de_fin'] },
    { id: 'tarification', title: 'Tarification', fields: ['unite_tarification', 'prix_dinar', 'prix_euros'] },
    { id: 'caution', title: 'Dépôt de garantie', fields: ['caution_demand_e', 'montant_de_la_caution_dzd', 'montant_de_la_caution'] },
    { id: 'details', title: 'Détails techniques du véhicule', fields: ['transmission', 'kilom_trage_inclus', 'assurance_incluse'] },
    { id: 'documents', title: 'Documents requis', fields: ['documents_requis[]'] },
    { id: 'options', title: 'Options supplémentaires', fields: ['options_suppl_mentair[]'] },
  ];

  // Structure des sections pour les services
  const sectionsServices = [
    { id: 'presentation', title: 'Présentation du service', fields: ['title', 'images', 'description', 'type_d_activit'] },
    { id: 'localisation', title: 'Localisation', fields: ['location', 'intervention_prestataire'] },
    { id: 'tarification', title: 'Tarification', fields: ['unite_tarification', 'prix_dinar', 'prix_euros'] },
    { id: 'duree_disponibilite', title: 'Disponibilité & durée', fields: ['booking_slot_duration', 'jours_disponibles[]', 'fr_quence_du_service[]','purchase_note'] },
    { id: 'details', title: 'Détails du prestataire', fields: ['prenom_2', 'langues_parl_es[]', 'annee_experience', 'public_accept[]', 'r_f_rences_v_rifiables[]'] },
  ];

  // Liste des champs qui doivent être masqués par défaut
  const champsMasques = ['tags[]', 'booking_min_quantity', 'booking_max_quantity', 'cr_neau_de_r_servation'];

  // === FONCTIONS UTILITAIRES ===

  /**
   * Supprime tous les anciens titres de sections du formulaire
   * @param {HTMLElement} form - L'élément formulaire
   */
  function clearOldSectionTitles(form) {
    // Trouve tous les h2 avec un id qui commence par "section-" et les supprime
    form.querySelectorAll('h2[id^="section-"]').forEach(el => el.remove());
  }

  /**
   * Trouve un champ dans le formulaire par son nom
   * @param {HTMLElement} form - L'élément formulaire
   * @param {string} fieldName - Le nom du champ à rechercher
   * @returns {HTMLElement|null} - L'élément du champ ou null si non trouvé
   */
  function findField(form, fieldName) {
    // Recherche d'abord par le nom exact
    let input = form.querySelector(`[name="${fieldName}"]`);
    
    // Si pas trouvé et que le nom se termine par [], essaie de trouver un input avec ce nom
    if (!input && fieldName.endsWith('[]')) {
      input = form.querySelector(`input[name="${fieldName}"]`);
    }
    
    // Si aucun input trouvé, retourne null
    if (!input) return null;
    
    // Retourne le conteneur parent du champ (généralement avec la classe .hp-form__field)
    return input.closest('.hp-form__field');
  }

  /**
   * Crée ou récupère un titre de section existant
   * @param {HTMLElement} form - L'élément formulaire
   * @param {string} sectionId - L'ID de la section
   * @param {string} titleText - Le texte du titre
   * @returns {HTMLElement} - L'élément h2 du titre
   */
  function getOrCreateSectionTitle(form, sectionId, titleText) {
    // Cherche si le titre existe déjà
    let h2 = form.querySelector(`h2#section-${sectionId}`);
    
    // Si pas trouvé, crée un nouveau titre
    if (!h2) {
      h2 = document.createElement('h2');
      h2.id = `section-${sectionId}`;
      h2.textContent = titleText;
      h2.style.marginTop = '2rem'; // Ajoute une marge en haut
    }
    
    return h2;
  }

  /**
   * Masque les champs qui ne sont pas dans la liste des champs à afficher
   * @param {HTMLElement} form - L'élément formulaire
   * @param {Array} fieldsToShow - Liste des noms de champs à afficher
   */
  function hideFieldsNotInList(form, fieldsToShow) {
    // Convertit la liste en Set pour une recherche plus rapide, en supprimant les [] des noms
    const toShow = new Set(fieldsToShow.map(f => f.replace('[]', '')));
    
    // Parcourt tous les champs du formulaire
    form.querySelectorAll('.hp-form__field').forEach(field => {
      // Trouve l'input, select ou textarea dans le champ
      const input = field.querySelector('input, select, textarea');
      if (!input) return;

      // Récupère et nettoie le nom du champ
      let name = input.getAttribute('name') || '';
      name = name.replace('[]', '');

      // Masque les champs qui sont dans la liste des champs masqués ET pas dans ceux à afficher
      if (champsMasques.includes(name) && !toShow.has(name)) {
        field.style.display = 'none';
        return;
      }

      // Masque spécifiquement les champs de tags
      if (field.classList.contains('hp-form__field--tags')) {
        field.style.display = 'none';
        return;
      }

      // Pour tous les autres champs, les affiche (logique pourrait être améliorée ici)
      if (toShow.has(name)) {
        field.style.display = '';
      } else {
        field.style.display = '';
      }
    });
  }

  /**
   * Retourne un exemple de titre selon la catégorie sélectionnée
   * @param {string} categoryId - L'ID de la catégorie
   * @returns {string} - Le texte d'exemple
   */
  function getTitleDescriptionForCategory(categoryId) {
    if (idsHebergements.includes(categoryId)) {
      return 'Exemple : Villa de charme avec piscine à Oran';
    } else if (idsActivites.includes(categoryId)) {
      return 'Exemple : Visite guidée dans les montagnes de Kabylie';
    } else if (idsVehicules.includes(categoryId)) {
      return 'Exemple : Location 4x4 tout terrain à Alger';
    } else if (idsServices.includes(categoryId)) {
      return 'Exemple : Service de jardinage à Alger';
    }
    return '';
  }

  // === FONCTION PRINCIPALE D'ORGANISATION DU FORMULAIRE ===

  /**
   * Réorganise le formulaire selon la catégorie sélectionnée
   */
  function organiseFormulaire() {
    // Récupère les éléments du DOM
    const form = document.querySelector(formSelector);
    const select = document.querySelector(selectSelector);
    
    // Si les éléments n'existent pas, arrête la fonction
    if (!form || !select) return;

    // Supprime les anciens titres de sections
    clearOldSectionTitles(form);

    // Récupère la valeur de la catégorie sélectionnée
    const selectedCategory = select.value;

    // === MODIFICATION SPÉCIALE POUR LE CHAMP 'IMAGES' ===
    // Change le label du champ images pour la catégorie Services
    const imagesField = findField(form, 'images');
    if (imagesField) {
      const label = imagesField.querySelector('label');
      if (label) {
        if (idsServices.includes(selectedCategory)) {
          label.textContent = "Photo d'identité + illustration liée au service";
        } else {
          label.textContent = "Images";
        }
      }
    }

    // === SÉLECTION DES SECTIONS SELON LA CATÉGORIE ===
    let sections = null;
    if (idsHebergements.includes(selectedCategory)) {
      sections = sectionsHebergements;
    } else if (idsActivites.includes(selectedCategory)) {
      sections = sectionsActivites;
    } else if (idsVehicules.includes(selectedCategory)) {
      sections = sectionsVehicules;
    } else if (idsServices.includes(selectedCategory)) {
      sections = sectionsServices;
    }

    // Si aucune section n'est définie pour cette catégorie
    if (!sections) {
      // Masque les champs spécifiés dans champsMasques
      champsMasques.forEach(slug => {
        const input = form.querySelector(`[name="${slug}"]`);
        if (input) {
          const field = input.closest('.hp-form__field');
          if (field) field.style.display = 'none';
        }
      });
      
      // Masque aussi le champ tags
      const tagsField = form.querySelector('.hp-form__field--tags');
      if (tagsField) tagsField.style.display = 'none';
      return;
    }

    // === ORGANISATION DES SECTIONS ===
    
    // Récupère tous les champs de toutes les sections
    const allSectionFields = sections.flatMap(s => s.fields);
    
    // Masque les champs qui ne sont pas dans la liste
    hideFieldsNotInList(form, allSectionFields);

    // Parcourt chaque section pour l'organiser
    sections.forEach(section => {
      // Crée ou récupère le titre de la section
      const h2 = getOrCreateSectionTitle(form, section.id, section.title);

      // Trouve le premier champ existant de la section
      let firstField = null;
      for (const fieldName of section.fields) {
        const field = findField(form, fieldName);
        if (field) {
          firstField = field;
          break;
        }
      }

      // Insert le titre avant le premier champ, ou à la fin du formulaire
      if (firstField) {
        form.insertBefore(h2, firstField);
      } else {
        form.appendChild(h2);
      }

      // Réorganise tous les champs de la section
      let lastInserted = h2; // Référence du dernier élément inséré
      
      section.fields.forEach(fieldName => {
        const field = findField(form, fieldName);
        if (!field) return; // Skip si le champ n'existe pas

        // Affiche le champ
        field.style.display = '';

        // Si le champ est déjà à la bonne position, continue
        if (lastInserted.nextSibling === field) {
          lastInserted = field;
          return;
        }

        // Sinon, déplace le champ à la bonne position
        form.insertBefore(field, lastInserted.nextSibling);
        lastInserted = field;
      });
    });

    // === AJOUT D'EXEMPLE DANS LE CHAMP TITRE ===
    const titleField = findField(form, 'title');
    if (titleField) {
      // Supprime l'ancienne description si elle existe
      const oldDesc = titleField.querySelector('.title-description');
      if (oldDesc) oldDesc.remove();

      const label = titleField.querySelector('label');
      if (label) {
        // Récupère le texte d'exemple selon la catégorie
        const descText = getTitleDescriptionForCategory(selectedCategory);
        if (descText) {
          // Crée l'élément de description
          const desc = document.createElement('span');
          desc.className = 'title-description';
          desc.textContent = descText;
          
          // Style de la description
          desc.style.marginLeft = '10px';
          desc.style.fontWeight = 'normal';
          desc.style.fontSize = '0.85em';
          desc.style.color = '#666';

          // Style du label pour affichage en ligne
          label.style.display = 'flex';
          label.style.alignItems = 'center';
          label.style.gap = '8px';

          // Ajoute la description au label
          label.appendChild(desc);
        }
      }
    }
  }

  // === OPTIMISATION DES PERFORMANCES ===

  /**
   * Fonction de débounce pour éviter trop d'appels successifs
   * @param {Function} func - La fonction à débouncer
   * @param {number} wait - Le délai d'attente en millisecondes
   * @returns {Function} - La fonction débouncée
   */
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Crée une version débouncée de la fonction d'organisation
  const debouncedOrganiseFormulaire = debounce(organiseFormulaire, 200);

  // === MISE EN PLACE DES ÉCOUTEURS D'ÉVÉNEMENTS ===

  // Observer pour les changements dans le DOM (ajout/suppression d'éléments)
  const observer = new MutationObserver(debouncedOrganiseFormulaire);
  observer.observe(document.body, { childList: true, subtree: true });

  // Écouteur pour les changements dans le menu déroulant des catégories
  document.body.addEventListener('change', e => {
    if (e.target.matches(selectSelector)) {
      organiseFormulaire();
    }
  });

  // === INITIALISATION ===
  // Organise le formulaire au chargement initial de la page
  organiseFormulaire();
});