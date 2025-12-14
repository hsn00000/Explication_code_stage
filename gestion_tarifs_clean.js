document.addEventListener("DOMContentLoaded", function () {
  // On cible tous les blocs prix dans les fiches
  const selectors = [
    '.hp-listing__topbar .hp-listing__attributes--primary',
    '.hp-listing__footer .hp-listing__attributes--primary'
  ];

  selectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (bloc) {
      const prixDZD = bloc.querySelector('.hp-listing__attribute--prix-dinar');
      const prixEUR = bloc.querySelector('.hp-listing__attribute--prix-euros');
      const uniteNode = bloc.querySelector('.hp-listing__attribute--unite-tarification') ||
                        document.querySelector('.hp-listing__attribute--unite-tarification');
      const unite = uniteNode ? uniteNode.textContent.trim() : '';

      if (prixDZD && prixEUR) {
        const wrapper = document.createElement('div');
        wrapper.className = 'prix-combine';

        wrapper.innerHTML = `
          <div class="prix-ligne">${prixDZD.textContent.trim()}${unite && !unite.startsWith('/') ? ' / ' + unite : ' ' + unite}</div>
          <div class="prix-ligne">${prixEUR.textContent.trim()}${unite && !unite.startsWith('/') ? ' / ' + unite : ' ' + unite}</div>
        `;

        prixDZD.replaceWith(wrapper);
        prixEUR.remove();

        if (uniteNode && uniteNode !== uniteNode.closest('.hp-listing__attributes')) {
          uniteNode.remove();
        }

        const topbar = bloc.closest('.hp-listing__topbar');
        if (topbar) {
          const blocInfos = topbar.querySelector('.hp-listing__attributes--secondary');
          if (blocInfos) {
            const caution = blocInfos.querySelector('.hp-listing__attribute--caution-demand-e');
            const montantDZD = blocInfos.querySelector('.hp-listing__attribute--montant-de-la-caution-dzd');
            const montantEUR = blocInfos.querySelector('.hp-listing__attribute--montant-de-la-caution');

            if (caution && (montantDZD || montantEUR)) {
              const blocCaution = document.createElement('div');
              blocCaution.className = 'bloc-caution-prix';

              const ligneCaution = `<div class="ligne-caution">${caution.textContent.trim()}</div>`;
              let ligneMontant = '<div class="ligne-a-verser"><strong>À verser :</strong> ';
              if (montantDZD) ligneMontant += `<span class="montant-dzd">${montantDZD.textContent.trim()}</span>`;
              if (montantDZD && montantEUR) ligneMontant += ' — ';
              if (montantEUR) ligneMontant += `<span class="montant-eur">${montantEUR.textContent.trim()}</span>`;
              ligneMontant += '</div>';

              blocCaution.innerHTML = `
                <hr class="separateur-caution" />
                ${ligneCaution}
                ${ligneMontant}
              `;

              wrapper.appendChild(blocCaution);

              caution.remove();
              if (montantDZD) montantDZD.remove();
              if (montantEUR) montantEUR.remove();
              blocInfos.querySelectorAll('.hp-listing__attribute--a-verser').forEach(el => el.remove());
            }
          }
        }
      }
    });
  });
});
