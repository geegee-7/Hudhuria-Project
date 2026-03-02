// booking.js -- ticket booking handler with validation & persistence

document.addEventListener('DOMContentLoaded', function() {
  var form = document.querySelector('.login-form');
  if (!form) return;

  // Mark fields as required
  var nameInput = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var ticketsSelect = document.getElementById('tickets');
  
  if (nameInput) nameInput.setAttribute('required', 'required');
  if (emailInput) emailInput.setAttribute('required', 'required');
  if (ticketsSelect) ticketsSelect.setAttribute('required', 'required');

  // Restore last booking info from localStorage
  var lastName = Hudhuria.Store.get('lastBookingName', '');
  var lastEmail = Hudhuria.Store.get('lastBookingEmail', '');
  var lastTickets = Hudhuria.Store.get('lastBookingTickets', '1');

  if (lastName && nameInput) nameInput.value = lastName;
  if (lastEmail && emailInput) emailInput.value = lastEmail;
  if (lastTickets && ticketsSelect) ticketsSelect.value = lastTickets;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Validation is now handled by main.js setupFormValidation()
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var tickets = ticketsSelect.value;
    var payment = document.getElementById('payment').value;

    if (name && email && tickets && payment) {
      // Save booking info to localStorage
      Hudhuria.Store.set('lastBookingName', name);
      Hudhuria.Store.set('lastBookingEmail', email);
      Hudhuria.Store.set('lastBookingTickets', tickets);
      
      console.log('Booking confirmed:', name, tickets, 'tickets', payment);
      alert('Booking confirmed for ' + tickets + ' ticket(s)! Confirmation sent to ' + email);
      form.reset();
    }
  });
});
