/**
 * CREAMY BITES - Main Application JavaScript
 * Handles data management, cart functionality, localStorage, and UI interactions
 * 
 * Color Palette Reference:
 * - Cream: #FFF8EF
 * - Maple syrup: #D9822B
 * - Cinnamon: #C65A2E
 * - Pistachio: #7A9B52
 * - Cocoa: #25140E
 */

// ========================================
// SAMPLE PRODUCT DATA
// Change these values to update the menu
// ========================================

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Pancake Classique',
    description: 'Pancakes moelleux avec du beurre et du miel',
    price: 45,
    image: 'assets/pancakes/pancake-classique-new.jpg',
    tags: ['classic', 'vegetarian']
  },
  {
    id: 2,
    name: 'Pancake Chocolat Fondant',
    description: 'Chocolat noir avec ganache brillante et coulis de framboise',
    price: 55,
    image: 'assets/pancakes/pancake-chocolat-neon-new.jpg',
    tags: ['chocolate', 'premium']
  },
  {
    id: 3,
    name: 'Pancake Fraise Crème',
    description: 'Fraises fraîches avec crème légère et perles de sucre',
    price: 50,
    image: 'assets/pancakes/pancake-fraise-futuriste-new.jpg',
    tags: ['fruit', 'fresh']
  },
  {
    id: 4,
    name: 'Pancake Caramel Doré',
    description: 'Caramel salé avec noix et glaçage or',
    price: 60,
    image: 'assets/pancakes/pancake-caramel-dore-new.jpg',
    tags: ['premium', 'caramel']
  },
  {
    id: 5,
    name: 'Pancake Vanille Crème',
    description: 'Vanille de Madagascar avec crème fouettée et pistache',
    price: 52,
    image: 'assets/pancakes/pancake-vanille-creme-new.jpg',
    tags: ['vanilla', 'premium']
  },
  {
    id: 6,
    name: 'Pancake Mix Gourmand',
    description: 'Mélange de fruits rouges, chocolat blanc et éclats croustillants',
    price: 65,
    image: 'assets/pancakes/pancake-cosmic-mix-new.jpg',
    tags: ['premium', 'special']
  }
];

const PRODUCT_IMAGE_VERSION = '2026-05-warm-pancake-palette';

// Admin password (CLIENT-SIDE ONLY - NOT SECURE FOR PRODUCTION)
const ADMIN_PASSWORD = 'hinsal.2007';

// ========================================
// APPLICATION STATE & STORAGE
// ========================================

class StorageManager {
  /**
   * Read JSON safely from localStorage.
   */
  static getJSON(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (error) {
      console.warn(`Invalid localStorage data for ${key}; resetting value.`, error);
      localStorage.removeItem(key);
      return fallback;
    }
  }

  /**
   * Initialize storage with default data if empty
   */
  static init() {
    const products = this.getProducts();

    if (!products) {
      this.setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem('creamy_bites_product_image_version', PRODUCT_IMAGE_VERSION);
    } else if (
      localStorage.getItem('creamy_bites_product_image_version') !== PRODUCT_IMAGE_VERSION &&
      Array.isArray(products)
    ) {
      const syncedProducts = products.map(product => {
        const defaultProduct = DEFAULT_PRODUCTS.find(item => Number(item.id) === Number(product.id));
        return defaultProduct
          ? {
              ...product,
              name: defaultProduct.name,
              description: defaultProduct.description,
              image: defaultProduct.image
            }
          : product;
      });

      this.setProducts(syncedProducts);
      localStorage.setItem('creamy_bites_product_image_version', PRODUCT_IMAGE_VERSION);
    }
    if (!this.getCart()) {
      this.setCart([]);
    }
    if (!this.getOrders()) {
      this.setOrders([]);
    }
  }

  /**
   * Get all products from localStorage
   */
  static getProducts() {
    return this.getJSON('creamy_bites_products', null);
  }

  /**
   * Save products to localStorage
   */
  static setProducts(products) {
    localStorage.setItem('creamy_bites_products', JSON.stringify(products));
  }

  /**
   * Get cart items from localStorage
   */
  static getCart() {
    const cart = this.getJSON('creamy_bites_cart', []);
    return Array.isArray(cart) ? cart : [];
  }

  /**
   * Save cart to localStorage
   */
  static setCart(cart) {
    localStorage.setItem('creamy_bites_cart', JSON.stringify(cart));
  }

  /**
   * Get all orders from localStorage
   */
  static getOrders() {
    const orders = this.getJSON('creamy_bites_orders', []);
    return Array.isArray(orders) ? orders : [];
  }

  /**
   * Save orders to localStorage
   */
  static setOrders(orders) {
    localStorage.setItem('creamy_bites_orders', JSON.stringify(orders));
  }

  /**
   * Clear all data (for testing)
   */
  static clearAll() {
    localStorage.removeItem('creamy_bites_products');
    localStorage.removeItem('creamy_bites_cart');
    localStorage.removeItem('creamy_bites_orders');
  }
}

// ========================================
// CART MANAGEMENT
// ========================================

class CartManager {
  /**
   * Add item to cart or increase quantity if already exists
   */
  static addItem(product, quantity = 1) {
    if (!product) {
      UIManager.showToast('Produit introuvable', 'error');
      return false;
    }

    const cart = StorageManager.getCart();
    const existingItem = cart.find(item => Number(item.id) === Number(product.id));
    const safeQuantity = Math.max(1, parseInt(quantity, 10) || 1);

    if (existingItem) {
      existingItem.quantity += safeQuantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price || 0),
        image: product.image,
        quantity: safeQuantity
      });
    }

    StorageManager.setCart(cart);
    UIManager.refreshCartUI();
    setTimeout(() => UIManager.openCartDrawer(), 0);
    this.showNotification(`${product.name} ajouté au panier!`, 'success');
    return true;
  }

  /**
   * Remove item from cart
   */
  static removeItem(productId) {
    let cart = StorageManager.getCart();
    cart = cart.filter(item => Number(item.id) !== Number(productId));
    StorageManager.setCart(cart);
    UIManager.refreshCartUI();
  }

  /**
   * Update item quantity
   */
  static updateQuantity(productId, quantity) {
    const cart = StorageManager.getCart();
    const item = cart.find(item => Number(item.id) === Number(productId));
    const nextQuantity = parseInt(quantity, 10) || 0;

    if (item) {
      if (nextQuantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = nextQuantity;
        StorageManager.setCart(cart);
        UIManager.refreshCartUI();
      }
    }
  }

  /**
   * Clear entire cart
   */
  static clearCart() {
    StorageManager.setCart([]);
    UIManager.refreshCartUI();
  }

  /**
   * Get cart total
   */
  static getTotal() {
    const cart = StorageManager.getCart();
    return cart.reduce((total, item) => total + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
  }

  /**
   * Get cart item count
   */
  static getItemCount() {
    const cart = StorageManager.getCart();
    return cart.reduce((count, item) => count + Number(item.quantity || 0), 0);
  }

  /**
   * Calculate order totals with checkout options.
   */
  static calculateTotals(options = {}) {
    const subtotal = this.getTotal();
    const deliveryCost = options.expressDelivery ? 50 : 0;
    const giftCost = options.giftWrap ? 20 : 0;
    const tax = (subtotal + deliveryCost + giftCost) * 0.1;
    const total = subtotal + deliveryCost + giftCost + tax;

    return {
      subtotal,
      deliveryCost,
      giftCost,
      tax,
      total
    };
  }

  /**
   * Show notification toast
   */
  static showNotification(message, type = 'info') {
    UIManager.showToast(message, type);
  }
}

// ========================================
// UI MANAGEMENT
// ========================================

class UIManager {
  /**
   * Update cart count badge in header
   */
  static updateCartCount() {
    const count = CartManager.getItemCount();
    document.querySelectorAll('.cart-count').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  /**
   * Refresh every cart-related UI surface on the current page.
   */
  static refreshCartUI() {
    this.updateCartCount();
    this.renderCart();

    if (typeof window.checkCartStatus === 'function') {
      window.checkCartStatus();
    }
  }

  /**
   * Open cart drawer.
   */
  static openCartDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    if (drawer) {
      this.renderCart();
      drawer.classList.add('open');
    }
  }

  /**
   * Toggle cart drawer visibility
   */
  static toggleCartDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    if (drawer) {
      this.renderCart();
      drawer.classList.toggle('open');
    }
  }

  /**
   * Close cart drawer
   */
  static closeCartDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    if (drawer) {
      drawer.classList.remove('open');
    }
  }

  /**
   * Render cart items in drawer
   */
  static renderCart() {
    const cart = StorageManager.getCart();
    const cartItems = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartItems) return;

    if (cart.length === 0) {
      cartItems.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">Votre panier est vide</p>';
      if (cartSummary) {
        cartSummary.innerHTML = '';
      }
      return;
    }

    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${escapeHTML(item.name)}</div>
          <div class="cart-item-price">${formatCurrency(item.price)} chacun</div>
          <div class="cart-item-controls" aria-label="Quantité">
            <button class="quantity-btn" onclick="CartManager.updateQuantity(${Number(item.id)}, ${Number(item.quantity) - 1})" aria-label="Diminuer la quantité">-</button>
            <span class="cart-item-qty">${item.quantity}</span>
            <button class="quantity-btn" onclick="CartManager.updateQuantity(${Number(item.id)}, ${Number(item.quantity) + 1})" aria-label="Augmenter la quantité">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="CartManager.removeItem(${Number(item.id)})" aria-label="Supprimer du panier">
          &times;
        </button>
      </div>
    `).join('');

    // Update summary
    const totals = CartManager.calculateTotals();
    if (cartSummary) {
      cartSummary.innerHTML = `
        <div class="summary-row">
          <span>Sous-total:</span>
          <span>${formatCurrency(totals.subtotal)}</span>
        </div>
        <div class="summary-row">
          <span>Taxe (10%):</span>
          <span>${formatCurrency(totals.tax)}</span>
        </div>
        <div class="summary-row summary-total">
          <span>Total:</span>
          <span>${formatCurrency(totals.total)}</span>
        </div>
        <div class="cart-actions">
          <button class="btn btn-secondary" onclick="window.location.href='checkout.html'">Passer la commande</button>
          <button class="btn btn-ghost btn-sm" onclick="CartManager.clearCart()">Vider</button>
        </div>
      `;
    }
  }

  /**
   * Show toast notification
   */
  static showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  /**
   * Show modal dialog
   */
  static showModal(title, message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" aria-label="Fermer">&times;</button>
        </div>
        <div class="modal-body">
          ${message}
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="modal-cancel">Annuler</button>
          <button class="btn btn-primary" id="modal-confirm">Confirmer</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeModal = () => overlay.remove();
    const confirmBtn = overlay.querySelector('#modal-confirm');
    const cancelBtn = overlay.querySelector('#modal-cancel');
    const closeBtn = overlay.querySelector('.modal-close');

    confirmBtn.addEventListener('click', () => {
      if (onConfirm) onConfirm();
      closeModal();
    });

    cancelBtn.addEventListener('click', () => {
      if (onCancel) onCancel();
      closeModal();
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  /**
   * Request password with prompt
   */
  static requestPassword(message = 'Entrez le mot de passe:') {
    return prompt(message);
  }

  /**
   * Verify admin password
   */
  static verifyAdminPassword() {
    const password = this.requestPassword('Mot de passe administrateur:');
    if (password === ADMIN_PASSWORD) {
      return true;
    } else {
      this.showToast('Mot de passe incorrect!', 'error');
      return false;
    }
  }
}

// ========================================
// PRODUCT MANAGEMENT (for menu and admin pages)
// ========================================

class ProductManager {
  /**
   * Get all products
   */
  static getAll() {
    const products = StorageManager.getProducts();
    return Array.isArray(products) ? products : [];
  }

  /**
   * Get product by ID
   */
  static getById(id) {
    const products = this.getAll();
    return products.find(p => p.id === Number(id));
  }

  /**
   * Add new product
   */
  static add(product) {
    const products = this.getAll();
    const newId = Math.max(...products.map(p => Number(p.id) || 0), 0) + 1;
    const newProduct = {
      ...product,
      id: newId,
      price: Number(product.price),
      tags: Array.isArray(product.tags) ? product.tags : []
    };
    products.push(newProduct);
    StorageManager.setProducts(products);
    return newProduct;
  }

  /**
   * Update product
   */
  static update(id, updates) {
    const products = this.getAll();
    const product = products.find(p => p.id === id);
    if (product) {
      Object.assign(product, updates);
      StorageManager.setProducts(products);
      return product;
    }
    return null;
  }

  /**
   * Delete product
   */
  static delete(id) {
    let products = this.getAll();
    products = products.filter(p => p.id !== id);
    StorageManager.setProducts(products);
  }

  /**
   * Search products
   */
  static search(query) {
    const products = this.getAll();
    return products.filter(p =>
      String(p.name || '').toLowerCase().includes(query.toLowerCase()) ||
      String(p.description || '').toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Filter by tags
   */
  static filterByTag(tag) {
    const products = this.getAll();
    return products.filter(p => Array.isArray(p.tags) && p.tags.includes(tag));
  }

  /**
   * Export products as JSON
   */
  static exportJSON() {
    const products = this.getAll();
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `creamy-bites-products-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Import products from JSON
   */
  static importJSON(jsonData) {
    try {
      const products = JSON.parse(jsonData);
      if (Array.isArray(products)) {
        StorageManager.setProducts(products);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }
}

// ========================================
// ORDER MANAGEMENT
// ========================================

class OrderManager {
  /**
   * Create new order from cart
   */
  static createOrder(customerInfo) {
    const cart = StorageManager.getCart();
    if (cart.length === 0) {
      return null;
    }

    const totals = CartManager.calculateTotals({
      expressDelivery: Boolean(customerInfo.expressDelivery),
      giftWrap: Boolean(customerInfo.giftWrap)
    });

    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: customerInfo,
      items: cart.map(item => ({ ...item })),
      subtotal: totals.subtotal,
      deliveryCost: totals.deliveryCost,
      giftCost: totals.giftCost,
      tax: totals.tax,
      total: totals.total,
      status: 'pending'
    };

    const orders = StorageManager.getOrders();
    orders.push(order);
    StorageManager.setOrders(orders);

    // Clear cart after order without switching the checkout page to the empty-cart view.
    StorageManager.setCart([]);
    UIManager.updateCartCount();
    UIManager.renderCart();

    return order;
  }

  /**
   * Get all orders
   */
  static getAll() {
    return StorageManager.getOrders();
  }

  /**
   * Get order by ID
   */
  static getById(id) {
    const orders = this.getAll();
    return orders.find(o => o.id === id);
  }

  /**
   * Update order status
   */
  static updateStatus(id, status) {
    const orders = StorageManager.getOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      StorageManager.setOrders(orders);
      return order;
    }
    return null;
  }

  /**
   * Export order as JSON
   */
  static exportJSON(orderId) {
    const order = this.getById(orderId);
    if (order) {
      const dataStr = JSON.stringify(order, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `order-${orderId}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Export all orders as JSON
   */
  static exportAllJSON() {
    const orders = this.getAll();
    const dataStr = JSON.stringify(orders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `creamy-bites-orders-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// ========================================
// EMAIL INTEGRATION (EmailJS)
// ========================================

class EmailService {
  /**
   * Initialize EmailJS
   * To use: Get your User ID from https://dashboard.emailjs.com/
   * Replace 'YOUR_USER_ID' with your actual EmailJS User ID
   */
  static init() {
    // Uncomment and replace with your EmailJS User ID
    // emailjs.init('YOUR_USER_ID');
    console.log('EmailJS not configured. To enable email sending:');
    console.log('1. Create account at https://www.emailjs.com/');
    console.log('2. Get your User ID from dashboard');
    console.log('3. Uncomment emailjs.init() in EmailService.init()');
  }

  /**
   * Send order confirmation email
   * 
   * To configure:
   * 1. Create EmailJS account at https://www.emailjs.com/
   * 2. Create email service (e.g., Gmail)
   * 3. Create email template with variables: {customer_name}, {order_id}, {total}, {items}
   * 4. Replace SERVICE_ID and TEMPLATE_ID below
   */
  static sendOrderConfirmation(order) {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
      console.log('EmailJS not loaded. Order saved locally but email not sent.');
      return false;
    }

    const templateParams = {
      customer_name: order.customer.firstName + ' ' + order.customer.lastName,
      customer_email: order.customer.email,
      order_id: order.id,
      order_date: new Date(order.date).toLocaleDateString('fr-FR'),
      items: order.items.map(item => `${item.name} x${item.quantity}`).join(', '),
      subtotal: Number(order.subtotal || 0).toFixed(2),
      delivery_cost: Number(order.deliveryCost || 0).toFixed(2),
      gift_cost: Number(order.giftCost || 0).toFixed(2),
      tax: Number(order.tax || 0).toFixed(2),
      total: Number(order.total || 0).toFixed(2)
    };

    // Replace with your actual Service ID and Template ID
    const SERVICE_ID = 'YOUR_SERVICE_ID';
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then(response => {
        console.log('Email sent successfully!', response);
        UIManager.showToast('Email de confirmation envoyé!', 'success');
        return true;
      })
      .catch(error => {
        console.error('Email send failed:', error);
        UIManager.showToast('Erreur lors de l\'envoi de l\'email', 'error');
        return false;
      });
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Escape text before inserting it into HTML templates.
 */
function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

/**
 * Format currency
 */
function formatCurrency(amount) {
  return `${Number(amount || 0).toFixed(2)} DH`;
}

/**
 * Validate email
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate phone number (Moroccan format)
 */
function isValidPhone(phone) {
  const re = /^(?:\+212|0)[1-9]\d{8}$/;
  return re.test(phone.replace(/\s/g, ''));
}

/**
 * Debounce function for search
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize storage with default data
  StorageManager.init();

  // Initialize EmailJS
  EmailService.init();

  // Update cart count on page load
  UIManager.updateCartCount();

  // Setup cart drawer toggle
  const cartIcon = document.querySelector('[data-cart-icon]');
  if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      UIManager.toggleCartDrawer();
    });
  }

  const cartClose = document.querySelector('.cart-close');
  if (cartClose) {
    cartClose.addEventListener('click', () => UIManager.closeCartDrawer());
  }

  // Close cart drawer when clicking outside
  const cartDrawer = document.querySelector('.cart-drawer');
  if (cartDrawer) {
    document.addEventListener('click', (e) => {
      if (!cartDrawer.contains(e.target) && !e.target.closest('[data-cart-icon]')) {
        UIManager.closeCartDrawer();
      }
    });
  }

  // Setup mobile navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Render cart on pages that have cart drawer
  const cartItems = document.querySelector('.cart-items');
  if (cartItems) {
    UIManager.renderCart();
  }

  console.log('Creamy Bites app initialized!');
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    StorageManager,
    CartManager,
    UIManager,
    ProductManager,
    OrderManager,
    EmailService
  };
}
