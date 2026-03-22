// =====================================
// PRODUCT ARRAY OF OBJECTS
// Products are stored in an array as required by the assignment
// =====================================
const products = [
  {
    id: 1,
    name: "Laptop",
    price: 2500000,
    category: "Electronics",
    image: "images/laptops.jpeg"
  },
  {
    id: 2,
    name: "Smart Phone",
    price: 1200000,
    category: "Electronics",
    image: "images/phones.jpeg"
  },
  {
    id: 3,
    name: "Headphones",
    price: 180000,
    category: "Electronics",
    image: "images/headphones.jpeg"
  },
  {
    id: 4,
    name: "Sneakers",
    price: 220000,
    category: "Fashion",
    image: "images/shoes.jpeg"
  },
  {
    id: 5,
    name: "T-Shirt",
    price: 75000,
    category: "Fashion",
    image: "images/tshirts.jpeg"
  },
  {
    id: 6,
    name: "JavaScript Book",
    price: 95000,
    category: "Books",
    image: "images/books.jpeg"
  }
];

// =====================================
// GET CART FROM LOCAL STORAGE
// try...catch handles errors when retrieving invalid data
// =====================================
function getCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!Array.isArray(savedCart)) {
      throw new Error("Cart data in localStorage is invalid.");
    }

    return savedCart;
  } catch (error) {
    console.error("Error retrieving cart:", error);
    return [];
  }
}

// =====================================
// SAVE CART TO LOCAL STORAGE
// =====================================
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// =====================================
// UPDATE CART COUNT IN NAVIGATION
// Uses querySelectorAll to update cart count on all pages
// =====================================
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartCountElements = document.querySelectorAll("#cart-count");
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
  });
}

// =====================================
// DISPLAY PRODUCTS DYNAMICALLY ON HOME PAGE
// Uses createElement(), innerHTML, appendChild()
// =====================================
function displayProducts(filteredProducts = products) {
  const productContainer = document.getElementById("product-container");
  if (!productContainer) return;

  productContainer.innerHTML = "";

  filteredProducts.forEach(product => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Price:</strong> UGX ${product.price.toLocaleString()}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;

    productContainer.appendChild(productCard);
  });
}

// =====================================
// ADD PRODUCT TO CART
// Adds item to cart array and updates localStorage
// =====================================
function addToCart(productId) {
  const cart = getCart();
  const product = products.find(product => product.id === productId);

  if (!product) {
    alert("Product not found.");
    return;
  }

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
  alert(`${product.name} added to cart successfully!`);
}

// =====================================
// DISPLAY CART ITEMS ON CART PAGE
// =====================================
function displayCart() {
  const cartContainer = document.getElementById("cart-container");
  const cartTotal = document.getElementById("cart-total");

  if (!cartContainer || !cartTotal) return;

  const cart = getCart();
  cartContainer.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "0";
    return;
  }

  cart.forEach(item => {
    total += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>Price:</strong> UGX ${item.price.toLocaleString()}</p>
      <p><strong>Quantity:</strong> ${item.quantity}</p>
      <p><strong>Subtotal:</strong> UGX ${(item.price * item.quantity).toLocaleString()}</p>

      <div class="cart-actions">
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
        <button onclick="changeQuantity(${item.id}, -1)">-</button>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;

    cartContainer.appendChild(cartItem);
  });

  cartTotal.textContent = total.toLocaleString();
}

// =====================================
// CHANGE PRODUCT QUANTITY
// Uses try...catch for invalid quantity handling
// =====================================
function changeQuantity(productId, change) {
  try {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (!item) {
      throw new Error("Product not found in cart.");
    }

    item.quantity += change;

    if (item.quantity < 1) {
      throw new Error("Quantity cannot be less than 1.");
    }

    saveCart(cart);
    displayCart();
    updateCartCount();

  } catch (error) {
    alert(error.message);
  }
}

// =====================================
// REMOVE ITEM FROM CART
// =====================================
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);

  saveCart(cart);
  displayCart();
  updateCartCount();
}

// =====================================
// SEARCH PRODUCTS BY NAME
// Uses addEventListener('input')
// =====================================
function setupSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    applyFilters();
  });
}

// =====================================
// FILTER PRODUCTS BY CATEGORY
// Uses addEventListener('change')
// =====================================
function setupCategoryFilter() {
  const categoryFilter = document.getElementById("category-filter");
  if (!categoryFilter) return;

  categoryFilter.addEventListener("change", () => {
    applyFilters();
  });
}

// =====================================
// APPLY SEARCH + CATEGORY FILTER TOGETHER
// =====================================
function applyFilters() {
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");

  if (!searchInput || !categoryFilter) return;

  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  let filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm)
  );

  if (selectedCategory !== "All") {
    filteredProducts = filteredProducts.filter(product =>
      product.category === selectedCategory
    );
  }

  displayProducts(filteredProducts);
}

// =====================================
// CHECKOUT FORM VALIDATION
// Uses try...catch as required by assignment
// =====================================
function setupCheckoutForm() {
  const checkoutForm = document.getElementById("checkout-form");
  const message = document.getElementById("message");

  if (!checkoutForm) return;

  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    try {
      const cart = getCart();

      if (cart.length === 0) {
        throw new Error("Your cart is empty. Please add items before checkout.");
      }

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const address = document.getElementById("address").value.trim();

      if (!name || !email || !phone || !address) {
        throw new Error("All fields are required.");
      }

      const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;
      if (!emailPattern.test(email)) {
        throw new Error("Please enter a valid email address.");
      }

      const phonePattern = /^[0-9]{10,12}$/;
      if (!phonePattern.test(phone)) {
        throw new Error("Please enter a valid phone number (10 to 12 digits).");
      }

      message.style.color = "green";
      message.textContent = "Order placed successfully! Thank you for shopping with us.";

      localStorage.removeItem("cart");
      updateCartCount();
      checkoutForm.reset();

    } catch (error) {
      message.style.color = "red";
      message.textContent = error.message;
    }
  });
}

// =====================================
// PAGE INITIALIZATION
// Runs when the page finishes loading
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  displayProducts();
  displayCart();
  setupSearch();
  setupCategoryFilter();
  setupCheckoutForm();
});
