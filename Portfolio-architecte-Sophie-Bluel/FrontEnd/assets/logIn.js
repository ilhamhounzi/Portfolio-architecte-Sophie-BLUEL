
var form = document.querySelector('.login-form');
var errorAlert = document.getElementById('error-alert');


form.addEventListener('submit', async function(event) {
  event.preventDefault();


  var userEmail = form.querySelector('input[name="email"]').value;
  var userPassword = form.querySelector('input[name="password"]').value;


  var user = {
    email: userEmail,
    password: userPassword
  };

  try {
    // Send a POST request to the login API endpoint
    var response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    
    if (response.ok) {

      var data = await response.json();
      var token = data.token;
     
      localStorage.setItem('adminToken', token);

      window.location.replace('/Portfolio-architecte-Sophie-Bluel/FrontEnd/index.html');
    } else if (response.status === 404 || response.status === 401) {

      errorAlert.textContent = 'Erreur dans l’identifiant ou le mot de passe';
    } else {
    
      throw new Error('Une erreur s\'est produite, veuillez réessayer ultérieurement.');
    }
  } catch (error) {
 
    errorAlert.textContent = error.message;
  }
});
