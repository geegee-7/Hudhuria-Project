// login.js -- simple client-side behaviour for login form

document.addEventListener('DOMContentLoaded', function() {
  var form = document.querySelector('.login-form');
  if (!form) return;

  // Mark form fields as required for validation
  var emailInput = document.getElementById('email');
  var passwordInput = document.getElementById('password');
  if (emailInput) emailInput.setAttribute('required', 'required');
  if (passwordInput) passwordInput.setAttribute('required', 'required');

  // Restore last email from localStorage (optional convenience feature)
  var lastEmail = Hudhuria.Store.get('lastLoginEmail', '');
  if (lastEmail && emailInput) {
    emailInput.value = lastEmail;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // collect values (in a real app you'd validate/submit to server)
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    console.log('login attempt', email);
    alert('Submitting login form for ' + email + '. (not really sent)');
  });
});
