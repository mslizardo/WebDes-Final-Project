const CART_STORAGE_KEY = 'artCart';

const products = [
  {
    id: 'caran',
    name: 'Caran d’Ache Supracolor Metal Box Set of 30',
    price: 94,
    image: 'https://pyxis.nymag.com/v1/imgs/b3e/20a/ca7573d9ad7bf20cafe74b0bfb1dbf7b9d-3888-330-Supracolor-Aquarelle-box-o.rsquare.w600.jpg'
  },
  {
    id: 'faber',
    name: 'Faber-Castell Albrecht Dürer Watercolor Pencils, 36 Colors',
    price: 59,
    image: 'https://www.craftcarrot.com/cdn/shop/products/albdur36_grande.jpg?v=1478171937'
  },
  {
    id: 'kitaboshi',
    name: 'Kitaboshi Pencils, Set of 12',
    price: 14,
    image: 'https://pyxis.nymag.com/v1/imgs/4ba/adb/418ecbd4ee25c336e5a916a41ee0795add.rdeep-vertical.w245.jpg'
  },
  {
    id: 'fabriano',
    name: 'Fabriano Set 24 Watercolor Pencils',
    price: 51,
    image: 'https://pyxis.nymag.com/v1/imgs/6db/937/5fc6550af8e67b33b2c39571847a8185a9.rdeep-vertical.w245.jpg'
  }
];

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function getProductById(productId) {
  return products.find((product) => product.id === productId);
}

function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const cart = getCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
}

function updateQuantity(productId, change) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    const updatedCart = cart.filter((entry) => entry.id !== productId);
    saveCart(updatedCart);
    renderCartPage();
    return;
  }

  saveCart(cart);
  renderCartPage();
}

function removeFromCart(productId) {
  const updatedCart = getCart().filter((item) => item.id !== productId);
  saveCart(updatedCart);
  renderCartPage();
}

function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = getCartCount();
  }
}

function renderCartPage() {
  const cartItems = document.getElementById('cart-items');
  const emptyState = document.getElementById('cart-empty');
  const subtotal = document.getElementById('cart-subtotal');
  const total = document.getElementById('cart-total');
  const checkoutButton = document.getElementById('checkout-btn');

  if (!cartItems) return;

  const cart = getCart();
  const subtotalValue = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    cartItems.innerHTML = '';
    emptyState?.classList.remove('d-none');
    checkoutButton?.setAttribute('disabled', 'true');
  } else {
    emptyState?.classList.add('d-none');
    checkoutButton?.removeAttribute('disabled');

    cartItems.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item-row p-3 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div class="d-flex align-items-center gap-3 w-100">
              <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
              <div>
                <h6 class="fw-bold mb-1">${item.name}</h6>
                <p class="text-muted mb-2">$${item.price.toFixed(2)} each</p>
                <div class="d-flex align-items-center gap-2">
                  <button class="btn btn-outline-secondary btn-sm" data-action="decrease" data-id="${item.id}">−</button>
                  <span class="fw-bold">${item.quantity}</span>
                  <button class="btn btn-outline-secondary btn-sm" data-action="increase" data-id="${item.id}">+</button>
                </div>
              </div>
            </div>
            <div class="text-md-end">
              <p class="fw-bold mb-2">$${(item.price * item.quantity).toFixed(2)}</p>
              <button class="btn btn-link text-danger p-0" data-action="remove" data-id="${item.id}">Remove</button>
            </div>
          </div>
        `
      )
      .join('');
  }

  subtotal.textContent = `$${subtotalValue.toFixed(2)}`;
  total.textContent = `$${subtotalValue.toFixed(2)}`;
}

function attachShopEvents() {
  document.querySelectorAll('.add-cart-btn').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.productId);
      button.textContent = 'Added to cart';
      button.classList.remove('btn-primary');
      button.classList.add('btn-primary');

      setTimeout(() => {
        button.textContent = 'Add to cart';
        button.classList.remove('btn-primary');
        button.classList.add('btn-primary');
      }, 1000);
    });
  });
}

function attachCartEvents() {
  const cartItems = document.getElementById('cart-items');

  cartItems?.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const { action, id } = button.dataset;

    if (action === 'increase') {
      updateQuantity(id, 1);
    } else if (action === 'decrease') {
      updateQuantity(id, -1);
    } else if (action === 'remove') {
      removeFromCart(id);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  attachShopEvents();
  attachCartEvents();
  renderCartPage();
});
