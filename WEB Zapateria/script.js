document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const cartBadge = document.getElementById('cart-badge');

    let cart = [];

    // Toggle Cart
    function toggleCart() {
        cartOverlay.classList.toggle('active');
        cartSidebar.classList.toggle('active');
    }

    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Format currency CL pesos
    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    }

    // Update Cart UI
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                itemCount += item.quantity;

                const cartItemEl = document.createElement('div');
                cartItemEl.classList.add('cart-item');
                cartItemEl.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="price">${formatCurrency(item.price)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="remove-item" data-index="${index}">Eliminar</button>
                        <div class="qty-control">
                            <button class="qty-dec" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-inc" data-index="${index}">+</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemEl);
            });
        }

        cartTotalPriceEl.textContent = formatCurrency(total);
        cartBadge.textContent = itemCount;
        cartBadge.style.display = itemCount > 0 ? 'flex' : 'none';

        // Add event listeners for dynamic buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1);
                updateCartUI();
            });
        });

        document.querySelectorAll('.qty-inc').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart[index].quantity++;
                updateCartUI();
            });
        });

        document.querySelectorAll('.qty-dec').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCartUI();
            });
        });
    }

    // Add to Cart Logic
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const id = card.getAttribute('data-id');
            const name = card.getAttribute('data-name');
            const price = parseInt(card.getAttribute('data-price'));
            const img = card.getAttribute('data-img');

            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id, name, price, img, quantity: 1 });
            }

            updateCartUI();
            
            // Show cart when item is added
            if (!cartSidebar.classList.contains('active')) {
                toggleCart();
            }
        });
    });

    // Initial render
    updateCartUI();
});
