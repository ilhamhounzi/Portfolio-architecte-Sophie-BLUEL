// Sélectionne le formulaire de connexion en utilisant sa classe CSS '.login-form'
document.addEventListener('DOMContentLoaded', function() {
 
  var form = document.querySelector('.login-form');

// Sélectionne l'élément d'alerte d'erreur par son ID 'error-alert'
  var errorAlert = document.getElementById('error-alert');

// Ajout d'un écouteur d'événement pour la soumission de formulaire
  form.addEventListener('submit', async function(event) {
// Empêcher le comportement de soumission de formulaire par défaut
    event.preventDefault();

// Récupérer les valeurs saisies par l'utilisateur pour les champs email et mot de passe
    var userEmail = form.querySelector('input[name="email"]').value;
    var userPassword = form.querySelector('input[name="password"]').value;

  // Crée un objet 'user' contenant les données de connexion de l'utilisateur
    var user = {
      email: userEmail,
      password: userPassword
    };

    try {
    // Envoie une requête POST à ​​l'API de connexion
      var response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

  // Vérifie si la requête est réussi (code d'état 200-299)
      if (response.ok) {
        // Extraire les données de la réponse au format JSON
        var data = await response.json();
        // Récupérer le jeton d'authentification ('token') pour l'utilisateur
        var token = data.token;
        // Stocke le jeton dans le stockage local ('localStorage')
        localStorage.setItem('adminToken', token);

        // Rediriger l'utilisateur vers la page d'accueil après une connexion réussie
        window.location.replace('/FrontEnd/index.html');
      } else if (response.status === 404 || response.status === 401) {
       // Affiche un message d'erreur si les identifiants de connexion sont incorrects
        errorAlert.textContent = 'Erreur dans l’identifiant ou le mot de passe';
      } else {
       // Si la requête échoue avec un code d'état autre que 200-299, génère une erreur
        throw new Error('Une erreur s\'est produite, veuillez réessayer ultérieurement.');
      }
    } catch (error) {
     // En cas d'erreur lors de la requête, affiche le message d'erreur dans 'errorAlert'
      errorAlert.textContent = error.message;
    }
  });
});

// Mise à jour de la fonction 'submitLoginForm' pour afficher le bouton de déconnexion
function submitLoginForm() {


  if (response.ok) {

  // Rediriger l'utilisateur vers la page d'accueil après une connexion réussie
    window.location.replace('/FrontEnd/index.html');

 // Affiche le bouton de déconnexion dans l'en-tête
    showLogoutButton();
  }

}

// Fonction pour afficher le bouton de déconnexion dans l'en-tête
function showLogoutButton() {
// Crée l'élément du bouton de déconnexion
  var logoutButton = document.createElement('button');
  logoutButton.textContent = 'Logout';
  logoutButton.id = 'logout-button';

 // Ajoute un écouteur d'événement au bouton de déconnexion pour gérer la déconnexion
  logoutButton.addEventListener('click', function() {
// Supprimer le jeton du stockage local pour déconnecter l'utilisateur
    localStorage.removeItem('adminToken');

// Recharger la page après la déconnexion
    window.location.reload();
  });

// Sélectionnez le conteneur dans lequel vous souhaitez afficher le bouton de déconnexion
  var logoutButtonContainer = document.getElementById('logout-button-container');

// Ajoute le bouton de déconnexion au conteneur
  logoutButtonContainer.appendChild(logoutButton);
}
