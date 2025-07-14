
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function () {
                const item = this.closest('.cart-item');
                const partId = item.dataset.partId;

                fetch('/Cart/Remove', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(parseInt(partId))
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            item.remove();
                            updateTotalPrice();
                            checkEmptyCart();
                        }
                    });
            });
        });

        document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const newValue = parseInt(input.value) + 1;
            if (newValue < 21) {
                input.value = newValue;
                updateQuantity(this, newValue);
            }
            
        });
        });

        document.querySelectorAll('.minus-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.nextElementSibling;
            const newValue = Math.max(parseInt(input.value) - 1, 1);
            
            input.value = newValue;
            updateQuantity(this, newValue);
        });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function () {
                let value = this.value;
                if (isNaN(value)) value = 1;
                if (value < 1) value = 1;
                if (value > 20) value = 20;
                this.value = value;
                updateQuantity(this, value);
            });
            input.addEventListener('keypress', function (e) {
                if (e.key === 'e' || e.key === '-' || e.key === '+') {
                    e.preventDefault();
                }
            });

        
            

        
        });

    function updateQuantity(element, newValue) {
            const item = element.closest('.cart-item');
    const partId = item.dataset.partId;

    const formData = new FormData();
    formData.append('carPartId', partId);
    formData.append('quantity', newValue);

    fetch('/Cart/UpdateQuantity', {
        method: 'POST',
    body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
        updateTotalPrice();
                }
            });
        }

    function updateTotalPrice() {
            let total = 0;
            
            document.querySelectorAll('.cart-item').forEach(item => {
                const priceText = item.querySelector('.cart-item-price').textContent;
            const price = parseInt(priceText.replace(/\D/g, ''));
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            total += price * quantity;
            });

    document.querySelector('.total-price').textContent = `Итого: ${total.toLocaleString()} ₽`;
        }

    function checkEmptyCart() {
            if (document.querySelectorAll('.cart-item').length === 0) {
                const cartItems = document.querySelector('.cart-items');
                cartItems.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
                const summary = document.querySelector('.cart-summary');
                summary.innerHTML = '<a class="search-button" href="/CarParts/Catalog">К каталогу</a>';
            }
        }
    });
