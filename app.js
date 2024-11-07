let products = [];
let cart = JSON.parse(localStorage.getItem('cartItems')) || [];  // Initialize cart from localStorage or an empty array

// Fetch products from API
function cartApi() {
    fetch("https://fakestoreapi.com/products")
        .then(response => response.json())
        .then(data => {
            products = data;         
            displayProducts(products);  // Display the fetched products
        });
}



// Display products on the page
function displayProducts(products) {
    let productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';  // Clear the container

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title.substring(0, 12)}...</h3>
            <p>${product.description.substring(0, 100)}...</p><hr>
            <p>Price: $${product.price}</p><hr>
            <span class><button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="showDetails(${product.id})">Details</button></span>
        `;
        productContainer.appendChild(productCard);
    });
}

// Add product to the cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);  // Find the product by its ID
    const existingProduct = cart.find(p => p.id === productId);  // Check if the product is already in the cart

    if (existingProduct) {
        // If the product already exists in the cart, just increase the quantity
        existingProduct.quantity += 1;
    } else {
        // If the product is not in the cart, add it with quantity 1 and increment the cart count
        cart.push({ ...product, quantity: 1 });
        updateCartCount();  // Increment cart count only when a new product is added
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
}

// Update the cart count in the header
function updateCartCount() {
    const cartButton = document.querySelector("#buttons a[href='./cart.html'] button");
    const cartCount = cart.length;  // Calculate the count based on the number of unique items in the cart
    cartButton.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Cart(${cartCount})`;
}

// Filter products by category
function filterproduct(category) {
    if (category === 'all') {
        displayProducts(products);  // Show all products if 'all' is selected
    } else {
        const filteredProducts = products.filter(product => product.category.toLowerCase() === category.toLowerCase());
        displayProducts(filteredProducts);  // Display only the filtered products
    }
}

function showDetails(productId) {
    const product = products.find(p => p.id === productId);  // Find the product by its ID
    const productContainer = document.getElementById('product-container');  // Get the product list container
    const detailsSection = document.getElementById('product-details');  // Get the details section
    const heroSection = document.querySelector('.hero');
    const buttons = document.querySelector('.buttons');

    // Hide the product list container
    productContainer.style.display = 'none';
    heroSection.style.display = 'none';
    buttons.style.display = 'none';

    // Show the details section with the selected product's details
    detailsSection.innerHTML = `
        <div class="product-details">
        <!-- Left: Product Image -->
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}">
        </div>

        <!-- Right: Product Information -->
        <div class="product-detailsinfo">
            <h2 class="product-title">${product.title}</h2>
            <p class="product-rating">Rating: ${product.rating.rate} <i class="fa fa-star"></i></p>
            <p class="product-price"><strong>Price:</strong> $${product.price}</p>
            <p class="product-description"><strong>Description:</strong> ${product.description}</p>
            <div class="product-actions">
                <button class="add-to-cart-button" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="go-to-cart-button" onclick="goToCart()">Go to Cart</button>
              
            </div>
        </div>
    </div>
    `;
    detailsSection.style.display = 'block';  // Make sure the details section is visible
    detailsSection.scrollIntoView({ behavior: 'smooth' });  // Smooth scroll to the details section
}

// Go back to the product list

function goToCart(){
    window.location.href='./cart.html';
}

// Event listener for DOMContentLoaded to fetch products when the page loads
document.addEventListener("DOMContentLoaded", () => {
    cartApi();  // Fetch products from API
    updateCartCount();  // Update the cart count based on localStorage
});