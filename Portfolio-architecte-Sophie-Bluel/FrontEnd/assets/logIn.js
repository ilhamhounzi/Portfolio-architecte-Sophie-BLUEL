// Select the login form and error alert element
var form = document.querySelector('.login-form');
var errorAlert = document.getElementById('error-alert');

// Add event listener to the form submission
form.addEventListener('submit', async function(event) {
  event.preventDefault();

  // Get the user email and password from the form inputs
  var userEmail = form.querySelector('input[name="email"]').value;
  var userPassword = form.querySelector('input[name="password"]').value;

  // Create a user object with email and password
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

    // Check the response status code
    if (response.ok) {
      // If successful, extract the token from the response data
      var data = await response.json();
      var token = data.token;
      // Store the token in local storage
      localStorage.setItem('adminToken', token);
      // Redirect to the index.html page with action buttons
      window.location.replace('/Portfolio-architecte-Sophie-Bluel/FrontEnd/index.html');
    } else if (response.status === 404 || response.status === 401) {
      // If user not found or unauthorized, display error message
      errorAlert.textContent = 'Erreur dans l’identifiant ou le mot de passe';
    } else {
      // If other error occurred, throw a generic error
      throw new Error('Une erreur s\'est produite, veuillez réessayer ultérieurement.');
    }
  } catch (error) {
    // Catch any errors that occurred during the fetch request
    errorAlert.textContent = error.message;
  }
});
