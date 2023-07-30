// Select the login form using its CSS class '.login-form'
document.addEventListener('DOMContentLoaded', function() {
  // Select the login form using its CSS class '.login-form'
  var form = document.querySelector('.login-form');

  // Select the error alert element by its ID 'error-alert'
  var errorAlert = document.getElementById('error-alert');

  // Add an event listener for form submission
  form.addEventListener('submit', async function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Retrieve the values entered by the user for email and password fields
    var userEmail = form.querySelector('input[name="email"]').value;
    var userPassword = form.querySelector('input[name="password"]').value;

    // Create a 'user' object containing the user's login data
    var user = {
      email: userEmail,
      password: userPassword
    };

    try {
      // Send a POST request to the login API
      var response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      // Check if the request is successful (status code 200-299)
      if (response.ok) {
        // Extract the data from the response in JSON format
        var data = await response.json();
        // Retrieve the authentication token ('token') for the user
        var token = data.token;
        // Store the token in the local storage ('localStorage')
        localStorage.setItem('adminToken', token);

        // Redirect the user to the homepage after successful login
        window.location.replace('/FrontEnd/index.html');
      } else if (response.status === 404 || response.status === 401) {
        // Display an error message if the login credentials are incorrect
        errorAlert.textContent = 'Erreur dans l’identifiant ou le mot de passe';
      } else {
        // If the request fails with a status code other than 200-299, throw an error
        throw new Error('Une erreur s\'est produite, veuillez réessayer ultérieurement.');
      }
    } catch (error) {
      // In case of an error during the request, display the error message in 'errorAlert'
      errorAlert.textContent = error.message;
    }
  });
});

// Update the 'submitLoginForm' function to display the logout button
function submitLoginForm() {


  if (response.ok) {

    // Redirect the user to the homepage after successful login
    window.location.replace('/FrontEnd/index.html');

    // Display the logout button in the header
    showLogoutButton();
  }

}

// Function to display the logout button in the header
function showLogoutButton() {
  // Create the logout button element
  var logoutButton = document.createElement('button');
  logoutButton.textContent = 'Logout';
  logoutButton.id = 'logout-button';

  // Add an event listener to the logout button to handle logout
  logoutButton.addEventListener('click', function() {
    // Remove the token from local storage to log out the user
    localStorage.removeItem('adminToken');

    // Reload the page after logout
    window.location.reload();
  });

  // Select the container where you want to display the logout button
  var logoutButtonContainer = document.getElementById('logout-button-container');

  // Add the logout button to the container
  logoutButtonContainer.appendChild(logoutButton);
}
