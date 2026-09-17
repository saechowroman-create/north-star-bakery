/* ==========================================================================
   North Star Bakery - script.js
   ========================================================================== */

// --- 1. Product Catalog & Favorites ---
const BAKERY_CATALOG = [
  { id: 'item-1', name: 'Country White Sourdough', price: '$8.00' },
  { id: 'item-2', name: 'Spelt & Seeded Batard', price: '$9.00' },
  { id: 'item-3', name: 'Classic Butter Croissant', price: '$4.25' },
  { id: 'item-4', name: 'Dark Chocolate Pain au Chocolat', price: '$5.00' },
  { id: 'item-5', name: 'Carrot & Walnut Layer Cake', price: '$38.00' }
];

let userFavorites = [];
try {
  const saved = localStorage.getItem('northStarFavorites');
  if (saved) userFavorites = JSON.parse(saved);
} catch (e) {
  userFavorites = [];
}

function updateFavoritesUI() {
  const listElement = document.getElementById('favorites-items-list');
  const countBadge = document.getElementById('favorites-count');

  if (countBadge) {
    countBadge.textContent = userFavorites.length;
  }

  if (listElement) {
    listElement.innerHTML = '';
    if (userFavorites.length === 0) {
      listElement.innerHTML = '<li>No items saved to your favorites yet. Click "Save to Favorites" below!</li>';
    } else {
      userFavorites.forEach(id => {
        const item = BAKERY_CATALOG.find(p => p.id === id);
        const li = document.createElement('li');
        li.textContent = item ? `${item.name} (${item.price})` : id;
        listElement.appendChild(li);
      });
    }
  }

  document.querySelectorAll('.favorite-btn').forEach(btn => {
    const id = btn.getAttribute('data-item-id');
    if (userFavorites.includes(id)) {
      btn.textContent = '★ Saved in Favorites';
      btn.style.backgroundColor = '#6B3E26';
      btn.style.color = '#FFF8F0';
    } else {
      btn.textContent = '☆ Save to Favorites';
      btn.style.backgroundColor = '#FFF8F0';
      btn.style.color = '#6B3E26';
    }
  });
}

document.addEventListener('click', function (e) {
  const btn = e.target.closest('.favorite-btn');
  if (!btn) return;

  const itemId = btn.getAttribute('data-item-id');
  if (!itemId) return;

  const index = userFavorites.indexOf(itemId);
  if (index > -1) {
    userFavorites.splice(index, 1);
  } else {
    userFavorites.push(itemId);
  }

  localStorage.setItem('northStarFavorites', JSON.stringify(userFavorites));
  updateFavoritesUI();
});

// --- 2. Form Validation Functions ---
function displayFieldError(inputElement, message) {
  inputElement.classList.add('input-error');
  inputElement.style.borderColor = '#C0392B';
  inputElement.style.backgroundColor = '#FDEDEC';

  const errorSpan = document.createElement('span');
  errorSpan.className = 'error-text';
  errorSpan.textContent = message;
  errorSpan.style.color = '#C0392B';
  errorSpan.style.display = 'block';
  errorSpan.style.fontSize = '0.85rem';
  errorSpan.style.fontWeight = 'bold';
  errorSpan.style.marginTop = '4px';

  inputElement.insertAdjacentElement('afterend', errorSpan);
}

function clearValidationErrors() {
  document.querySelectorAll('.error-text').forEach(el => el.remove());
  document.querySelectorAll('.input-error').forEach(el => {
    el.classList.remove('input-error');
    el.style.borderColor = '';
    el.style.backgroundColor = '';
  });
}

function attachFormHandler() {
  const form = document.getElementById('bakery-form') || document.querySelector('form');
  if (!form) return;

  // Prefill saved customer name/email if stored
  const savedName = localStorage.getItem('northStarCustomerName');
  const savedEmail = localStorage.getItem('northStarCustomerEmail');
  const nameField = document.getElementById('full-name');
  const emailField = document.getElementById('email-address');
  if (nameField && savedName) nameField.value = savedName;
  if (emailField && savedEmail) emailField.value = savedEmail;

  form.onsubmit = function (event) {
    event.preventDefault();
    event.stopPropagation();

    clearValidationErrors();

    let isValid = true;

    // 1. Validate Name
    const nameInput = document.getElementById('full-name');
    if (!nameInput || !nameInput.value.trim() || nameInput.value.trim().length < 3) {
      if (nameInput) displayFieldError(nameInput, 'Please enter your full name (minimum 3 characters).');
      isValid = false;
    }

    // 2. Validate Email
    const emailInput = document.getElementById('email-address');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
      if (emailInput) displayFieldError(emailInput, 'Please enter a valid email address (e.g., name@domain.com).');
      isValid = false;
    }

    // 3. Validate Date
    const dateInput = document.getElementById('pickup-date');
    if (!dateInput || !dateInput.value) {
      if (dateInput) displayFieldError(dateInput, 'Please select a requested pickup date.');
      isValid = false;
    }

    // 4. Validate Details
    const detailsInput = document.getElementById('item-details');
    if (!detailsInput || !detailsInput.value.trim() || detailsInput.value.trim().length < 10) {
      if (detailsInput) displayFieldError(detailsInput, 'Please provide order details with at least 10 characters.');
      isValid = false;
    }

    if (!isValid) {
      return false;
    }

    // Save and alert if valid
    localStorage.setItem('northStarCustomerName', nameInput.value.trim());
    localStorage.setItem('northStarCustomerEmail', emailInput.value.trim());
    alert('Thank you! Your pre-order request has been received.');
    return false;
  };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  updateFavoritesUI();
  attachFormHandler();
});

// Fallback execution
attachFormHandler();
updateFavoritesUI();