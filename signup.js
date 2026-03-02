// signup.js -- sign-up form with validation & persistence

document.addEventListener('DOMContentLoaded', function() {
  var form = document.querySelector('.login-form');
  if (!form) return;

  // Mark fields as required for validation
  var fullnameInput = document.getElementById('fullname');
  var emailInput = document.getElementById('email');
  var passwordInput = document.getElementById('password');
  
  if (fullnameInput) fullnameInput.setAttribute('required', 'required');
  if (emailInput) emailInput.setAttribute('required', 'required');
  if (passwordInput) passwordInput.setAttribute('required', 'required');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Validation is now handled by main.js setupFormValidation()
    var name = fullnameInput.value.trim();
    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();

    if (name && email && password) {
      // Save signup info to localStorage (in a real app, send to server)
      Hudhuria.Store.set('signupName', name);
      Hudhuria.Store.set('signupEmail', email);
      console.log('Signup:', name, email);
      alert('Thank you for signing up, ' + name + '! Check your email for verification.');
      form.reset();
    }
  });
});
