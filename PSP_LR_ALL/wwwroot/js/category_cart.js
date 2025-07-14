

document.addEventListener('DOMContentLoaded', function () {
    const cartButtonContainer = document.getElementById('cartButtonContainer');
    var partId = parseInt(cartButtonContainer.dataset.partId);
    var iscarted = false;
    var quant = 0;
    console.log(partId);

    cartButtonContainer.addEventListener('click', async function (e) {
        const target = e.target;
       
        if (target.id === 'add') {
            addToCart(partId);
            
        }
        if (target.id === 'remove') {
            removeFromCart(partId);
        }
        if (target.id === 'less-quant') {
            const quantityInput = cartButtonContainer.querySelector('.quantity-input');
            let value = parseInt(quantityInput.value) - 1;
            if (value > 0) {
                changeamount(partId, value);
            }
        }
        if (target.id === 'more-quant') {
            const quantityInput = cartButtonContainer.querySelector('.quantity-input');
            let value = parseInt(quantityInput.value) + 1;
            if (value < 21) {
                changeamount(partId, value);
            }
        }
    });

    cartButtonContainer.addEventListener('change', async function (e) {
        if (e.target.classList.contains('quantity-input')){
            let value = parseInt(e.target.value);
            if (isNaN(value)) value = 1;
            if (value < 1) value = 1;
            if (value > 20) value = 20;

            e.target.value = value;
            changeamount(partId, value);

            
        }
    });

    cartButtonContainer.addEventListener('keypress', function (e) {
        if (e.target.classList.contains('quantity-input')){
            if (e.key === 'e' || e.key === '-' || e.key === '+') {
                e.preventDefault();
            }
        }
    })

    async function addToCart(partId) {

        try {
            const response = await fetch('/Cart/Add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(partId)
            })
            const data = await response.json();

            if (data.success) {
                iscarted = true;
                quant = 1;
                updateCartUI(quant, 'Товар добавлен в корзину');
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Произошла ошибка сети");
        }
            

    }

    async function removeFromCart(partId) {
        try {
            const response = await fetch('/Cart/Remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(partId)
            })
            const data = await response.json();

            if (data.success) {
                iscarted = false;
                quant = 0;
                resetCartUI();
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Произошла ошибка");
        }
    }

    async function changeamount(partId,amount) {
        const formData = new FormData();
        formData.append('carPartId', partId);
        formData.append('quantity', amount);

        try {
            const response = await fetch('/Cart/UpdateQuantity', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                quant = data.newQuantity;
                updateCartUI(quant,'Количество товара в корзине обновлено');
            }
            else {
                console.log("asdads");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Произошла ошибка");
        }
    }

    function updateCartUI(quantity,prestring) {
        cartButtonContainer.innerHTML = `
            <div class="cart-quantity-controls">
                        <p class="cart-notice highlight">${prestring}</p>
                        <p class = "cart-notice"> Количество:</p>
                        <div class="quantity-control-group">
                            <button class="quantity-btn" id="less-quant">-</button>
                            <input type="number"
                                   class="quantity-input"
                                   value=${quantity}
                                   min="1"
                                   max="20"
                                   step="1">
                            <button class="quantity-btn" id="more-quant">+</button>
                        </div>
                        <button class="btn" id="remove">Удалить из корзины</button>
                    </div>
        `;
        if (prestring === 'Количество товара в корзине обновлено') {
            const noticeElement = cartButtonContainer.querySelector('.highlight');
            noticeElement.style.transition = 'none';
            noticeElement.style.color = '#2196F3FF';


            setTimeout(() => {
                noticeElement.style.transition = 'color 0.5s ease';
                noticeElement.style.color = '';
            }, 100);
        }

    }

    function resetCartUI() {
        cartButtonContainer.innerHTML = `
            <p class="cart-notice">Товар удалён из корзины.</p>
            <button class="btn" id="add">Добавить в корзину</button>
        `;
    }

    


    
})