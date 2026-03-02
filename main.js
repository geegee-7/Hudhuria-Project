// main.js - shared scripts for Hudhuria front-end
// includes: nav + splash, search filtering, form validation, localStorage persistence,
// mobile menu toggle, keyboard navigation, and accessibility enhancements

(function() {
  // ========== UTILITY: localStorage helpers ==========
  var Store = {
    set: function(key, value) {
      try {
        localStorage.setItem('hudhuria_' + key, JSON.stringify(value));
      } catch (e) {
        console.log('localStorage unavailable');
      }
    },
    get: function(key, defaultVal) {
      try {
        var item = localStorage.getItem('hudhuria_' + key);
        return item ? JSON.parse(item) : defaultVal;
      } catch (e) {
        return defaultVal;
      }
    },
    remove: function(key) {
      try {
        localStorage.removeItem('hudhuria_' + key);
      } catch (e) {}
    }
  };

  // ========== FORM VALIDATION ==========
  var FormValidator = {
    validateEmail: function(email) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    validatePassword: function(password) {
      return password && password.length >= 6;
    },
    validateRequired: function(value) {
      return value && value.trim().length > 0;
    },
    showError: function(input, message) {
      input.setAttribute('aria-invalid', 'true');
      var errorDiv = document.createElement('div');
      errorDiv.className = 'form-error';
      errorDiv.setAttribute('role', 'alert');
      errorDiv.textContent = message;
      var existing = input.parentNode.querySelector('.form-error');
      if (existing) {
        existing.remove();
      }
      input.parentNode.appendChild(errorDiv);
    },
    clearError: function(input) {
      input.setAttribute('aria-invalid', 'false');
      var errorDiv = input.parentNode.querySelector('.form-error');
      if (errorDiv) {
        errorDiv.remove();
      }
    }
  };

  // ========== MOBILE MENU TOGGLE ==========
  function setupMobileMenu() {
    // Create hamburger button if on mobile
    var nav = document.querySelector('.top-nav');
    if (!nav) return;

    var hamburger = document.createElement('button');
    hamburger.className = 'hamburger-toggle';
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<span></span><span></span><span></span>';

    nav.insertBefore(hamburger, nav.firstChild);

    var navLeft = document.querySelector('.nav-left');
    var navRight = document.querySelector('.nav-right');

    hamburger.addEventListener('click', function() {
      var isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      navLeft.classList.toggle('mobile-open');
      navRight.classList.toggle('mobile-open');
    });

    // Close menu on link click
    var allLinks = nav.querySelectorAll('.nav-link, .signup-btn, .login-btn');
    allLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.setAttribute('aria-expanded', 'false');
        navLeft.classList.remove('mobile-open');
        navRight.classList.remove('mobile-open');
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        hamburger.setAttribute('aria-expanded', 'false');
        navLeft.classList.remove('mobile-open');
        navRight.classList.remove('mobile-open');
      }
    });
  }

  // ========== KEYBOARD NAVIGATION ==========
  function setupKeyboardNav() {
    // Tab trap in modals if they exist
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // Escape to close modals (handled in modal setup)
      }
      // Tab cycling for forms
      if (e.key === 'Enter') {
        var activeForm = document.activeElement.closest('form');
        if (activeForm && e.target.tagName === 'INPUT') {
          // Allow Enter to submit if desired, or press Tab to continue
          if (e.target.type === 'submit') {
            activeForm.submit();
          }
        }
      }
    });
  }

  // ========== SPLASH SCREEN ==========
  function setupSplash() {
    var splash = document.querySelector('.splash-screen');
    if (splash) {
      var splashShown = Store.get('splashShown', false);
      if (splashShown) {
        splash.classList.add('hidden');
      } else {
        setTimeout(function() {
          splash.classList.add('hidden');
          Store.set('splashShown', true);
        }, 2000);
      }
    }
  }

  // ========== ACTIVE NAV LINK ==========
  function highlightActiveNav() {
    var links = document.querySelectorAll('.nav-link');
    var pathname = window.location.pathname.split('/').pop();
    links.forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === pathname || (href === 'index.html' && pathname === '')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // ========== SEARCH & FILTER ==========
  function setupSearchFilter() {
    var search = document.querySelector('.search-input');
    if (search) {
      // Restore last search term
      var lastSearch = Store.get('lastSearch', '');
      if (lastSearch) {
        search.value = lastSearch;
        filterCards(lastSearch);
      }

      search.addEventListener('input', function() {
        var term = search.value.trim().toLowerCase();
        Store.set('lastSearch', term);
        filterCards(term);
      });
    }
  }

  function filterCards(term) {
    var cards = document.querySelectorAll('.ticket-card');
    cards.forEach(function(card) {
      var titleEl = card.querySelector('.event-title');
      var venueEl = card.querySelector('.event-venue');
      var text = (titleEl ? titleEl.textContent : '') + ' ' + (venueEl ? venueEl.textContent : '');
      var match = text.toLowerCase().indexOf(term) !== -1;
      card.style.display = match ? '' : 'none';
      card.setAttribute('aria-hidden', match ? 'false' : 'true');
    });
  }

  // ========== FORM VALIDATION SETUP ==========
  function setupFormValidation() {
    var forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        var isValid = validateFormOnSubmit(form);
        if (!isValid) {
          e.preventDefault();
        }
      });

      // Real-time validation on input
      var inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
          validateField(input);
        });
        input.addEventListener('input', function() {
          FormValidator.clearError(input);
        });
      });
    });
  }

  function validateField(input) {
    var value = input.value.trim();
    var type = input.type;
    var name = input.name || input.id;

    if (type === 'email') {
      if (!value) {
        FormValidator.showError(input, 'Email is required');
        return false;
      }
      if (!FormValidator.validateEmail(value)) {
        FormValidator.showError(input, 'Please enter a valid email address');
        return false;
      }
    } else if (type === 'password') {
      if (!value) {
        FormValidator.showError(input, 'Password is required');
        return false;
      }
      if (!FormValidator.validatePassword(value)) {
        FormValidator.showError(input, 'Password must be at least 6 characters');
        return false;
      }
    } else if (input.hasAttribute('required')) {
      if (!FormValidator.validateRequired(value)) {
        FormValidator.showError(input, name.replace('_', ' ') + ' is required');
        return false;
      }
    }

    FormValidator.clearError(input);
    return true;
  }

  function validateFormOnSubmit(form) {
    var inputs = form.querySelectorAll('input, select, textarea');
    var allValid = true;
    inputs.forEach(function(input) {
      if (!validateField(input)) {
        allValid = false;
      }
    });
    return allValid;
  }

  // ========== ACCESSIBILITY ENHANCEMENTS ==========
  function makePageAccessible() {
    // Add skip-to-content link if not present
    var skipLink = document.querySelector('.skip-to-content');
    if (!skipLink) {
      skipLink = document.createElement('a');
      skipLink.className = 'skip-to-content';
      skipLink.href = '#main-content';
      skipLink.textContent = 'Skip to main content';
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Ensure main content has an ID
    var main = document.querySelector('main') || document.querySelector('.events-section') || document.querySelector('.dashboard');
    if (main && !main.id) {
      main.id = 'main-content';
    }

    // Add role="navigation" to nav if not present
    var nav = document.querySelector('.top-nav');
    if (nav && !nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
    }

    // Add role="contentinfo" to footer
    var footer = document.querySelector('.site-footer');
    if (footer && !footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }

    // Ensure all buttons have aria-labels if needed
    var buttons = document.querySelectorAll('button');
    buttons.forEach(function(btn) {
      if (!btn.textContent.trim() && !btn.hasAttribute('aria-label')) {
        btn.setAttribute('aria-label', 'Action button');
      }
    });

    // Focus visible styling for keyboard users
    document.addEventListener('keydown', function() {
      document.body.classList.add('keyboard-nav');
    });
    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-nav');
    });
  }

  // ========== DYNAMIC CONTENT LOADING ==========
  // This loads events/organizers/venues from data.json or can be extended to use an API
  window.loadDynamicContent = function(type, containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    // Check if data is cached
    var cachedData = Store.get('content_' + type, null);
    if (cachedData) {
      renderContent(cachedData, container, type);
      return;
    }

    // Try to load from data.json (you'll need to create this file)
    fetch('./data.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var content = data[type] || [];
        Store.set('content_' + type, content);
        renderContent(content, container, type);
      })
      .catch(function(error) {
        console.log('Could not load dynamic content:', error);
        // Fall back to static content already on the page
      });
  };

  function renderContent(data, container, type) {
    container.innerHTML = '';
    if (type === 'events') {
      data.forEach(function(event) {
        var card = document.createElement('a');
        card.href = 'event-details.html';
        card.className = 'ticket-card';
        card.innerHTML = '<div class="ticket-inner">' +
          '<img src="' + event.image + '" class="ticket-image" alt="' + event.title + '">' +
          '<div class="ticket-content">' +
          '<span class="event-date">' + event.date + '</span>' +
          '<h4 class="event-title">' + event.title + '</h4>' +
          '<p class="event-venue">' + event.venue + '</p>' +
          '<span class="event-price">' + event.price + '</span>' +
          '</div></div>';
        container.appendChild(card);
      });
    }
  }

  // ========== INITIALIZE ON DOM READY ==========
  document.addEventListener('DOMContentLoaded', function() {
    setupSplash();
    highlightActiveNav();
    setupSearchFilter();
    setupFormValidation();
    setupMobileMenu();
    setupKeyboardNav();
    makePageAccessible();
  });

  // Export for use in other scripts
  window.Hudhuria = {
    Store: Store,
    FormValidator: FormValidator,
    loadDynamicContent: loadDynamicContent
  };
})();
