// Ferme de la Piloterie — interactions du site

// Fermer le menu mobile après un clic sur un lien
var liensNav = document.querySelectorAll('.nav-principale a');
for (var i = 0; i < liensNav.length; i++) {
  liensNav[i].addEventListener('click', function () {
    document.querySelector('.nav-principale').classList.remove('ouvert');
  });
}

// Envoi générique d'un formulaire vers Formspree, en AJAX,
// avec message de confirmation ou d'erreur affiché sur la page.
function connecterFormulaireFormspree(idFormulaire, idNote, messageOk) {
  const form = document.getElementById(idFormulaire);
  if (!form) return;
  const note = document.getElementById(idNote);

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const bouton = form.querySelector('button[type="submit"]');
    const libelleInitial = bouton.textContent;
    bouton.disabled = true;
    bouton.textContent = 'Envoi en cours...';
    if (note) { note.textContent = ''; note.style.color = ''; }

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          if (note) {
            note.textContent = messageOk;
            note.style.color = 'var(--vert-feuille-deep)';
            note.style.fontWeight = '600';
          }
        } else {
          response.json().then(function (data) {
            if (note) {
              note.textContent = (data && data.errors)
                ? "Une erreur est survenue : " + data.errors.map(function (er) { return er.message; }).join(', ')
                : "Une erreur est survenue lors de l'envoi. Vous pouvez nous écrire directement à fromagerielapiloterie@gmail.com.";
              note.style.color = '#B23A2E';
            }
          });
        }
      })
      .catch(function () {
        if (note) {
          note.textContent = "Impossible d'envoyer le formulaire (pas de connexion ?). Vous pouvez nous écrire directement à fromagerielapiloterie@gmail.com.";
          note.style.color = '#B23A2E';
        }
      })
      .finally(function () {
        bouton.disabled = false;
        bouton.textContent = libelleInitial;
      });
  });
}

connecterFormulaireFormspree('form-contact', 'note-contact', 'Message envoyé, merci ! Nous vous répondons au plus vite.');
connecterFormulaireFormspree('form-devis', 'note-devis', 'Votre demande de devis a bien été envoyée, merci ! Nous revenons vers vous très vite.');

// Affichage dynamique des animations selon l'âge du public et alerte grand groupe
(function () {
  const selectPublic = document.getElementById('d-public');
  const champPersonnes = document.getElementById('d-personnes');
  const fieldsetJunior = document.getElementById('fieldset-junior');
  const fieldsetSenior = document.getElementById('fieldset-senior');
  const alerteGroupe = document.getElementById('alerte-grand-groupe');
  if (!selectPublic || !champPersonnes) return;

  function majAnimations() {
    const valeur = selectPublic.value;
    const afficherJunior = (valeur === 'Jeune public (enfants)' || valeur === 'Groupe mixte (enfants et adultes)');
    const afficherSenior = (valeur === 'Seniors / personnes à besoin spécifique' || valeur === 'Groupe mixte (enfants et adultes)');
    fieldsetJunior.style.display = afficherJunior ? 'block' : 'none';
    fieldsetSenior.style.display = afficherSenior ? 'block' : 'none';
  }

  function majAlerteGroupe() {
    const nb = parseInt(champPersonnes.value, 10);
    alerteGroupe.style.display = (nb && nb > 20) ? 'block' : 'none';
  }

  selectPublic.addEventListener('change', majAnimations);
  champPersonnes.addEventListener('input', majAlerteGroupe);
  majAnimations();
  majAlerteGroupe();
})();
