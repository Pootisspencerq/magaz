console.log("cart.js підключено!");


document.addEventListener("DOMContentLoaded", () => {


    // =====================================================
    // API
    // =====================================================

    const API_URL =
        "http://127.0.0.1:8000/api/products/";


    // =====================================================
    // КОШИК
    // =====================================================

    let cart =
        JSON.parse(localStorage.getItem("cart")) || {};


    let products = [];


    // =====================================================
    // ЕЛЕМЕНТИ
    // =====================================================

    const cartItemsContainer =
        document.querySelector("#cartItems");


    const emptyCart =
        document.querySelector("#emptyCart");


    const cartContent =
        document.querySelector("#cartContent");


    const cartCount =
        document.querySelector("#cartCount");


    const cartProductsCount =
        document.querySelector("#cartProductsCount");


    const cartTotal =
        document.querySelector("#cartTotal");


    const cartGrandTotal =
        document.querySelector("#cartGrandTotal");


    const clearCartButton =
        document.querySelector("#clearCartButton");


    const checkoutButton =
        document.querySelector("#checkoutButton");


    const cartButton =
        document.querySelector("#cartButton");



    // =====================================================
    // ФОРМАТУВАННЯ ЦІНИ
    // =====================================================

    function formatPrice(price) {

        return Number(price).toLocaleString("uk-UA");

    }



    // =====================================================
    // ЗБЕРЕГТИ КОШИК
    // =====================================================

    function saveCart() {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    }



    // =====================================================
    // ЗАГАЛЬНА КІЛЬКІСТЬ
    // =====================================================

    function getCartCount() {

        return Object.values(cart).reduce(
            (sum, quantity) => {

                return sum + Number(quantity);

            },
            0
        );

    }



    // =====================================================
    // ОНОВИТИ ЛІЧИЛЬНИК
    // =====================================================

    function updateCartCount() {

        const count =
            getCartCount();


        if (cartCount) {

            cartCount.textContent =
                count;

        }

    }



    // =====================================================
    // ЗНАЙТИ ТОВАР
    // =====================================================

    function getProductById(id) {

        return products.find(
            product =>
                String(product.id) === String(id)
        );

    }



    // =====================================================
    // ПОКАЗАТИ ПОРОЖНІЙ / НЕПОРОЖНІЙ КОШИК
    // =====================================================

    function updateCartVisibility() {

        const hasItems =
            Object.keys(cart).length > 0;


        if (emptyCart) {

            emptyCart.style.display =
                hasItems ? "none" : "block";

        }


        if (cartContent) {

            cartContent.style.display =
                hasItems ? "block" : "none";

        }

    }



    // =====================================================
    // СТВОРЕННЯ ТОВАРУ
    // =====================================================

    function createCartItem(product, quantity) {

        const item =
            document.createElement("div");


        item.className =
            "cart-item";


        const price =
            Number(product.price);


        const total =
            price * quantity;


        const image =
            product.image ||
            "https://picsum.photos/300/300?random=" +
            product.id;


        item.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${image}"
                    alt="${product.name}"
                >

            </div>


            <div class="cart-item-info">

                <h4>
                    ${product.name}
                </h4>

                <div class="cart-item-price">
                    ${formatPrice(price)} грн / шт.
                </div>

            </div>


            <div class="cart-item-quantity">

                <button
                    type="button"
                    class="quantity-minus"
                    data-id="${product.id}"
                >
                    −
                </button>


                <span>
                    ${quantity}
                </span>


                <button
                    type="button"
                    class="quantity-plus"
                    data-id="${product.id}"
                >
                    +
                </button>

            </div>


            <div class="cart-item-total">

                ${formatPrice(total)} грн

            </div>


            <button
                type="button"
                class="remove-item"
                data-id="${product.id}"
                title="Видалити товар"
            >
                🗑️
            </button>

        `;


        return item;

    }



    // =====================================================
    // ПІДСУМОК
    // =====================================================

    function updateSummary() {

        let total =
            0;


        let productsCount =
            0;


        Object.keys(cart).forEach(id => {

            const product =
                getProductById(id);


            if (!product) {

                return;

            }


            const quantity =
                Number(cart[id]);


            total +=
                Number(product.price) *
                quantity;


            productsCount +=
                quantity;

        });


        if (cartProductsCount) {

            cartProductsCount.textContent =
                productsCount;

        }


        if (cartTotal) {

            cartTotal.textContent =
                formatPrice(total) + " грн";

        }


        if (cartGrandTotal) {

            cartGrandTotal.textContent =
                formatPrice(total) + " грн";

        }


        updateCartCount();

    }



    // =====================================================
    // ВІДОБРАЖЕННЯ КОШИКА
    // =====================================================

    function renderCart() {

        if (!cartItemsContainer) {

            return;

        }


        cartItemsContainer.innerHTML =
            "";


        updateCartVisibility();


        const cartIds =
            Object.keys(cart);


        if (cartIds.length === 0) {

            updateSummary();

            return;

        }


        cartIds.forEach(id => {

            const product =
                getProductById(id);


            if (!product) {

                return;

            }


            const quantity =
                Number(cart[id]);


            const item =
                createCartItem(
                    product,
                    quantity
                );


            cartItemsContainer.appendChild(
                item
            );

        });


        updateSummary();

    }



    // =====================================================
    // ЗМІНИТИ КІЛЬКІСТЬ
    // =====================================================

    function changeQuantity(id, change) {

        if (!cart[id]) {

            return;

        }


        const product =
            getProductById(id);


        if (!product) {

            return;

        }


        const newQuantity =
            Number(cart[id]) + change;


        // НЕ МЕНШЕ 1

        if (newQuantity <= 0) {

            delete cart[id];

        } else {

            // ПЕРЕВІРКА СКЛАДУ

            if (
                product.stock > 0 &&
                newQuantity > product.stock
            ) {

                alert(
                    "На складі доступно лише " +
                    product.stock +
                    " шт."
                );

                return;

            }


            cart[id] =
                newQuantity;

        }


        saveCart();

        renderCart();

    }



    // =====================================================
    // ВИДАЛЕННЯ
    // =====================================================

    function removeFromCart(id) {

        delete cart[id];

        saveCart();

        renderCart();

    }



    // =====================================================
    // КЛІКИ ПО КОШИКУ
    // =====================================================

    if (cartItemsContainer) {

        cartItemsContainer.addEventListener(
            "click",
            event => {


                // -----------------------------------------
                // МІНУС
                // -----------------------------------------

                const minusButton =
                    event.target.closest(
                        ".quantity-minus"
                    );


                if (minusButton) {

                    changeQuantity(
                        minusButton.dataset.id,
                        -1
                    );

                    return;

                }



                // -----------------------------------------
                // ПЛЮС
                // -----------------------------------------

                const plusButton =
                    event.target.closest(
                        ".quantity-plus"
                    );


                if (plusButton) {

                    changeQuantity(
                        plusButton.dataset.id,
                        1
                    );

                    return;

                }



                // -----------------------------------------
                // ВИДАЛИТИ
                // -----------------------------------------

                const removeButton =
                    event.target.closest(
                        ".remove-item"
                    );


                if (removeButton) {

                    removeFromCart(
                        removeButton.dataset.id
                    );

                }

            }
        );

    }



    // =====================================================
    // ОЧИСТИТИ КОШИК
    // =====================================================

    if (clearCartButton) {

        clearCartButton.addEventListener(
            "click",
            () => {


                if (
                    Object.keys(cart).length === 0
                ) {

                    return;

                }


                const confirmed =
                    confirm(
                        "Ви дійсно хочете очистити кошик?"
                    );


                if (!confirmed) {

                    return;

                }


                cart = {};


                saveCart();

                renderCart();

            }
        );

    }



    // =====================================================
    // ОФОРМЛЕННЯ
    // =====================================================

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            () => {


                if (
                    Object.keys(cart).length === 0
                ) {

                    alert(
                        "Ваш кошик порожній."
                    );

                    return;

                }


                window.location.href =
                    "checkout.html";

            }
        );

    }



    // =====================================================
    // КНОПКА КОШИКА
    // =====================================================

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "cart.html";

            }
        );

    }



    // =====================================================
    // ЗАВАНТАЖЕННЯ DJANGO
    // =====================================================

    async function loadProducts() {

        try {

            const response =
                await fetch(API_URL);


            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );

            }


            products =
                await response.json();


            console.log(
                "Товари кошика з Django:",
                products
            );


            renderCart();


        } catch (error) {

            console.error(
                "Помилка завантаження товарів:",
                error
            );


            if (cartItemsContainer) {

                cartItemsContainer.innerHTML = `

                    <div class="cart-empty text-center">

                        <div class="empty-cart-icon">
                            ⚠️
                        </div>

                        <h2>
                            Не вдалося завантажити товари
                        </h2>

                        <p>
                            Перевірте, чи запущений Django сервер.
                        </p>

                        <button
                            class="btn btn-orange"
                            id="reloadCart"
                        >
                            🔄 Спробувати ще раз
                        </button>

                    </div>

                `;


                const reloadButton =
                    document.querySelector(
                        "#reloadCart"
                    );


                if (reloadButton) {

                    reloadButton.addEventListener(
                        "click",
                        loadProducts
                    );

                }

            }

        }

    }



    // =====================================================
    // СТАРТ
    // =====================================================

    updateCartCount();

    updateCartVisibility();

    loadProducts();

});