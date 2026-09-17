/* ==========================================================================
   North Star Bakery - script.js
   ========================================================================== */

const BAKERY_CATALOG = [
  { id: 'item-1', name: 'Country White Sourdough', price: '$8.00' },
  { id: 'item-2', name: 'Spelt & Seeded Batard', price: '$9.00' },
  { id: 'item-3', name: 'Classic Butter Croissant', price: '$4.25' },
  { id: 'item-4', name: 'Dark Chocolate Pain au Chocolat', price: '$5.00' },
  { id: 'item-5', name: 'Carrot & Walnut Layer Cake', price: '$38.00' }
];

let userFavorites = [];

// Load storage immediately
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

  // Sync button text and styles
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

// Global click handler (delegation)
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

// Run UI sync when DOM is ready
document.addEventListener('DOMContentLoaded', updateFavoritesUI);
window.addEventListener('load', updateFavoritesUI);