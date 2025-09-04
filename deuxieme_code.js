// Attendre que le DOM soit complètement chargé
document.addEventListener("DOMContentLoaded", function () {
  
  // === CIBLAGE DES ZONES DE PRIX ===
  // Définit les sélecteurs CSS pour trouver les blocs contenant les prix
  // Ces blocs peuvent se trouver dans deux endroits différents :
  const selectors = [
    '.hp-listing__topbar .hp-listing__attributes--primary',    // Dans la barre du haut
    '.hp-listing__footer .hp-listing__attributes--primary'     // Dans le pied de page
  ];
  
  // === TRAITEMENT DE CHAQUE ZONE DE PRIX ===
  // Parcourt chaque sélecteur défini ci-dessus
  selectors.forEach(function (selector) {
    
    // Pour chaque sélecteur, trouve tous les éléments correspondants dans la page
    document.querySelectorAll(selector).forEach(function (bloc) {
      
      // === RÉCUPÉRATION DES ÉLÉMENTS DE PRIX ===
      // Cherche les éléments contenant les prix en dinars algériens
      const prixDZD = bloc.querySelector('.hp-listing__attribute--prix-dinar');
      
      // Cherche les éléments contenant les prix en euros
      const prixEUR = bloc.querySelector('.hp-listing__attribute--prix-euros');
      
      // Cherche l'unité de tarification (par jour, par heure, etc.)
      // D'abord dans le bloc actuel, sinon dans tout le document
      const uniteNode = bloc.querySelector('.hp-listing__attribute--unite-tarification') ||
                        document.querySelector('.hp-listing__attribute--unite-tarification');
      
      // Extrait le texte de l'unité, ou chaîne vide si pas trouvé
      const unite = uniteNode ? uniteNode.textContent.trim() : '';
      
      // === VÉRIFICATION ET TRANSFORMATION ===
      // Procède seulement si on a les prix dans les deux devises
      if (prixDZD && prixEUR) {
        
        // === CRÉATION DU NOUVEAU BLOC DE PRIX COMBINÉ ===
        // Crée un conteneur pour afficher les deux prix ensemble
        const wrapper = document.createElement('div');
        wrapper.className = 'prix-combine';
        
        // Construit le HTML avec les deux lignes de prix
        wrapper.innerHTML = `
          <div class="prix-ligne">${prixDZD.textContent.trim()}${unite && !unite.startsWith('/') ? ' / ' + unite : ' ' + unite}</div>
          <div class="prix-ligne">${prixEUR.textContent.trim()}${unite && !unite.startsWith('/') ? ' / ' + unite : ' ' + unite}</div>
        `;
        
        // === REMPLACEMENT DANS LE DOM ===
        // Remplace l'ancien élément prix DZD par le nouveau bloc combiné
        prixDZD.replaceWith(wrapper);
        
        // Supprime l'ancien élément prix EUR (maintenant intégré dans le bloc combiné)
        prixEUR.remove();
        
        // Supprime l'élément unité s'il existe et n'est pas dans le conteneur principal
        if (uniteNode && uniteNode !== uniteNode.closest('.hp-listing__attributes')) {
          uniteNode.remove();
        }
        
        // === GESTION DE LA CAUTION (SEULEMENT DANS LA TOPBAR) ===
        // Vérifie si on est dans la barre du haut (topbar)
        const topbar = bloc.closest('.hp-listing__topbar');
        if (topbar) {
          
          // Cherche le bloc d'informations secondaires
          const blocInfos = topbar.querySelector('.hp-listing__attributes--secondary');
          if (blocInfos) {
            
            // === RÉCUPÉRATION DES ÉLÉMENTS DE CAUTION ===
            // Texte indiquant si une caution est demandée
            const caution = blocInfos.querySelector('.hp-listing__attribute--caution-demand-e');
            
            // Montant de la caution en dinars
            const montantDZD = blocInfos.querySelector('.hp-listing__attribute--montant-de-la-caution-dzd');
            
            // Montant de la caution en euros
            const montantEUR = blocInfos.querySelector('.hp-listing__attribute--montant-de-la-caution');
            
            // === TRAITEMENT DE LA CAUTION ===
            // Procède si on a les informations de caution ET au moins un montant
            if (caution && (montantDZD || montantEUR)) {
              
              // Crée un nouveau bloc pour afficher la caution
              const blocCaution = document.createElement('div');
              blocCaution.className = 'bloc-caution-prix';
              
              // === CONSTRUCTION DU HTML DE LA CAUTION ===
              // Ligne avec le texte de la caution
              const ligneCaution = `<div class="ligne-caution">${caution.textContent.trim()}</div>`;
              
              // Construction de la ligne "À verser"
              let ligneMontant = '<div class="ligne-a-verser"><strong>À verser :</strong> ';
              
              // Ajoute le montant en DZD s'il existe
              if (montantDZD) ligneMontant += `<span class="montant-dzd">${montantDZD.textContent.trim()}</span>`;
              
              // Ajoute un séparateur si on a les deux montants
              if (montantDZD && montantEUR) ligneMontant += ' — ';
              
              // Ajoute le montant en EUR s'il existe
              if (montantEUR) ligneMontant += `<span class="montant-eur">${montantEUR.textContent.trim()}</span>`;
              
              ligneMontant += '</div>';
              
              // === ASSEMBLAGE FINAL DU BLOC CAUTION ===
              blocCaution.innerHTML = `
                <hr class="separateur-caution" />
                ${ligneCaution}
                ${ligneMontant}
              `;
              
              // === INTÉGRATION ET NETTOYAGE ===
              // Ajoute le bloc caution au bloc de prix combiné
              wrapper.appendChild(blocCaution);
              
              // Supprime tous les anciens éléments de caution du DOM
              caution.remove();                    // Supprime le texte de caution
              if (montantDZD) montantDZD.remove(); // Supprime le montant DZD
              if (montantEUR) montantEUR.remove(); // Supprime le montant EUR
              
              // Supprime tous les éléments "à verser" qui pourraient traîner
              blocInfos.querySelectorAll('.hp-listing__attribute--a-verser').forEach(el => el.remove());
            }
          }
        }
      }
    });
  });
});