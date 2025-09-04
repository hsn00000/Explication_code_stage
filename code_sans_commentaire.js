document.addEventListener('DOMContentLoaded', () => {
  const containerSelector = '.hp-form--listing-submit';
  const formSelector = `${containerSelector} .hp-form__fields`;
  const selectSelector = 'select[name="categories"]';

  const idsHebergements = ['55', '56', '57', 'NaN'];
  const idsActivites = ['74', '79', '83', '145', 'NaN'];
  const idsVehicules = ['95', '104', '146', '147', 'NaN'];
  const idsServices = ['67', '68', '69', '70', '71', 'NaN'];

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

  const sectionsActivites = [
    { id: 'presentation', title: "Présentation de l'activité", fields: ['title', 'description', 'images', 'type_d_activit'] },
    { id: 'localisation', title: 'Localisation & départ', fields: ['location', 'adresse', 'heure_de_d_part', 'heure_fin_activite'] },
    { id: 'duree_disponibilite', title: 'Durée & disponibilité', fields: ['dur_e_de_l_activit', 'booking_slot_duration', 'capacit_par_cr_neau'] },
    { id: 'tarification', title: 'Tarification', fields: ['unite_tarification', 'prix_dinar', 'prix_euros'] },
    { id: 'infos_pratiques', title: 'Infos pratiques & logistique', fields: ['public_cible', 'transport_inclus', 'tenue_recommand_e', 'materiel_activite','conditions_d_annulation','purchase_note'] },
  ];

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

  const sectionsServices = [
    { id: 'presentation', title: 'Présentation du service', fields: ['title', 'images', 'description', 'type_d_activit'] },
    { id: 'localisation', title: 'Localisation', fields: ['location', 'intervention_prestataire'] },
    { id: 'tarification', title: 'Tarification', fields: ['unite_tarification', 'prix_dinar', 'prix_euros'] },
    { id: 'duree_disponibilite', title: 'Disponibilité & durée', fields: ['booking_slot_duration', 'jours_disponibles[]', 'fr_quence_du_service[]','purchase_note'] },
    { id: 'details', title: 'Détails du prestataire', fields: ['prenom_2', 'langues_parl_es[]', 'annee_experience', 'public_accept[]', 'r_f_rences_v_rifiables[]'] },
  ];

  const champsMasques = ['tags[]', 'booking_min_quantity', 'booking_max_quantity', 'cr_neau_de_r_servation'];

  function clearOldSectionTitles(form) {
    form.querySelectorAll('h2[id^="section-"]').forEach(el => el.remove());
  }

  function findField(form, fieldName) {
    let input = form.querySelector(`[name="${fieldName}"]`);
    if (!input && fieldName.endsWith('[]')) {
      input = form.querySelector(`input[name="${fieldName}"]`);
    }
    if (!input) return null;
    return input.closest('.hp-form__field');
  }

  function getOrCreateSectionTitle(form, sectionId, titleText) {
    let h2 = form.querySelector(`h2#section-${sectionId}`);
    if (!h2) {
      h2 = document.createElement('h2');
      h2.id = `section-${sectionId}`;
      h2.textContent = titleText;
      h2.style.marginTop = '2rem';
    }
    return h2;
  }

  function hideFieldsNotInList(form, fieldsToShow) {
    const toShow = new Set(fieldsToShow.map(f => f.replace('[]', '')));
    form.querySelectorAll('.hp-form__field').forEach(field => {
      const input = field.querySelector('input, select, textarea');
      if (!input) return;

      let name = input.getAttribute('name') || '';
      name = name.replace('[]', '');

      if (champsMasques.includes(name) && !toShow.has(name)) {
        field.style.display = 'none';
        return;
      }

      if (field.classList.contains('hp-form__field--tags')) {
        field.style.display = 'none';
        return;
      }

      if (toShow.has(name)) {
        field.style.display = '';
      } else {
        field.style.display = '';
      }
    });
  }

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

  function organiseFormulaire() {
    const form = document.querySelector(formSelector);
    const select = document.querySelector(selectSelector);
    if (!form || !select) return;

    clearOldSectionTitles(form);

    const selectedCategory = select.value;

    // === Modification du label 'images' pour la catégorie Services ===
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

    if (!sections) {
      champsMasques.forEach(slug => {
        const input = form.querySelector(`[name="${slug}"]`);
        if (input) {
          const field = input.closest('.hp-form__field');
          if (field) field.style.display = 'none';
        }
      });
      const tagsField = form.querySelector('.hp-form__field--tags');
      if (tagsField) tagsField.style.display = 'none';
      return;
    }

    const allSectionFields = sections.flatMap(s => s.fields);
    hideFieldsNotInList(form, allSectionFields);

    sections.forEach(section => {
      const h2 = getOrCreateSectionTitle(form, section.id, section.title);

      let firstField = null;
      for (const fieldName of section.fields) {
        const field = findField(form, fieldName);
        if (field) {
          firstField = field;
          break;
        }
      }

      if (firstField) {
        form.insertBefore(h2, firstField);
      } else {
        form.appendChild(h2);
      }

      let lastInserted = h2;
      section.fields.forEach(fieldName => {
        const field = findField(form, fieldName);
        if (!field) return;

        field.style.display = '';

        if (lastInserted.nextSibling === field) {
          lastInserted = field;
          return;
        }

        form.insertBefore(field, lastInserted.nextSibling);
        lastInserted = field;
      });
    });

    // --- Ajout exemple à droite du label 'Titre' ---
    const titleField = findField(form, 'title');
    if (titleField) {
      // Supprimer ancienne description
      const oldDesc = titleField.querySelector('.title-description');
      if (oldDesc) oldDesc.remove();

      const label = titleField.querySelector('label');
      if (label) {
        // Récupérer le texte d'exemple dynamique
        const descText = getTitleDescriptionForCategory(selectedCategory);
        if (descText) {
          const desc = document.createElement('span');
          desc.className = 'title-description';
          desc.textContent = descText;
          desc.style.marginLeft = '10px';
          desc.style.fontWeight = 'normal';
          desc.style.fontSize = '0.85em';
          desc.style.color = '#666';

          label.style.display = 'flex';
          label.style.alignItems = 'center';
          label.style.gap = '8px';

          label.appendChild(desc);
        }
      }
    }
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  const debouncedOrganiseFormulaire = debounce(organiseFormulaire, 200);

  const observer = new MutationObserver(debouncedOrganiseFormulaire);
  observer.observe(document.body, { childList: true, subtree: true });

  document.body.addEventListener('change', e => {
    if (e.target.matches(selectSelector)) {
      organiseFormulaire();
    }
  });

  organiseFormulaire();
});
