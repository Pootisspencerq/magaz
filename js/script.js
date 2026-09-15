console.log("script.js підключено!");

document.addEventListener("DOMContentLoaded", () => {

    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    const productsContainer = document.querySelector("#products");
    const cartCount = document.querySelector("#cartCount");
    const search = document.querySelector("#search");
    const sort = document.querySelector("#sort");
    const cartButton = document.querySelector("#cartButton");

    let products = [];


    // ========================================
    // КОШИК
    // ========================================

    function getCartCount() {
        return Object.values(cart).reduce(
            (sum, quantity) => sum + quantity,
            0
        );
    }


    function updateCartCount() {
        const count = getCartCount();

        if (cartCount) {
            cartCount.textContent = count;
        }
    }


    function saveCart() {
        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        updateCartCount();
    }


    // ========================================
    // ФОРМАТУВАННЯ ЦІНИ
    // ========================================

    function formatPrice(price) {
        return Number(price).toLocaleString("uk-UA");
    }


    // ========================================
    // СТВОРЕННЯ КАРТКИ
    // ========================================

    function createProductCard(product) {

        const card = document.createElement("div");

        // Bootstrap сітка
        card.className =
            "col-12 col-sm-6 col-lg-4 col-xl-3 product-card";

        card.dataset.id = product.id;
        card.dataset.name = product.name;
        card.dataset.price = product.price;


        const image =
            product.image ||
            "https://picsum.photos/500/400?random=" +
            product.id;


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${image}"
                    alt="${product.name}"
                >

            </div>


            <div class="product-card-body">

                <h3>
                    ${product.name}
                </h3>


                <div class="product-rating">
                    ⭐ ${product.rating}
                </div>


                <p class="product-description">
                    ${product.description || ""}
                </p>


                <div class="product-card-bottom">

                    <strong class="product-price">
                        ${formatPrice(product.price)} грн
                    </strong>


                    <button
                        class="btn btn-orange buy-button"
                        type="button"
                    >
                        Купити
                    </button>

                </div>

            </div>

        `;


        return card;
    }


    // ========================================
    // ВІДОБРАЖЕННЯ ТОВАРІВ
    // ========================================

    function renderProducts(list) {

        if (!productsContainer) {
            return;
        }


        productsContainer.innerHTML = "";


        if (list.length === 0) {

            productsContainer.innerHTML = `

                <div class="no-products">

                    <h3>
                        Товарів не знайдено
                    </h3>

                    <p>
                        Спробуйте змінити пошуковий запит.
                    </p>

                </div>

            `;

            return;
        }


        list.forEach(product => {

            const card = createProductCard(product);

            productsContainer.appendChild(card);

        });

    }


    // ========================================
    // ЗАВАНТАЖЕННЯ ТОВАРІВ З DJANGO
    // ========================================

    async function loadProducts() {

        if (!productsContainer) {
            console.error("Не знайдено #products");
            return;
        }


        try {

            productsContainer.innerHTML = `

                <div class="loading-products">

                    Завантаження товарів...

                </div>

            `;


            const response = await fetch(
                "http://127.0.0.1:8000/api/products/"
            );


            if (!response.ok) {

                throw new Error(
                    "Помилка API: " + response.status
                );

            }


            products = await response.json();


            console.log(
                "Товари отримано з Django:",
                products
            );


            renderProducts(products);


        } catch (error) {

            console.error(
                "Не вдалося завантажити товари:",
                error
            );


            productsContainer.innerHTML = `

                <div class="no-products">

                    <h3>
                        Не вдалося завантажити товари
                    </h3>

                    <p>
                        Перевірте, чи запущений Django сервер.
                    </p>

                    <button
                        class="btn btn-orange"
                        id="reloadProducts"
                    >
                        🔄 Спробувати ще раз
                    </button>

                </div>

            `;


            const reloadButton =
                document.querySelector("#reloadProducts");


            if (reloadButton) {

                reloadButton.addEventListener(
                    "click",
                    loadProducts
                );

            }

        }

    }


    // ========================================
    // ПОШУК
    // ========================================

    if (search) {

        search.addEventListener(
            "input",
            () => {

                const text =
                    search.value
                        .toLowerCase()
                        .trim();


                const filtered =
                    products.filter(product => {

                        return product.name
                            .toLowerCase()
                            .includes(text);

                    });


                renderProducts(filtered);

            }
        );

    }


    // ========================================
    // СОРТУВАННЯ
    // ========================================

    if (sort) {

        sort.addEventListener(
            "change",
            () => {

                let sorted = [...products];


                if (sort.value === "cheap") {

                    sorted.sort(
                        (a, b) =>
                            Number(a.price) -
                            Number(b.price)
                    );

                }


                if (sort.value === "expensive") {

                    sorted.sort(
                        (a, b) =>
                            Number(b.price) -
                            Number(a.price)
                    );

                }


                // Якщо вибрано "Сортування"
                if (sort.value === "default") {
                    sorted = [...products];
                }


                renderProducts(sorted);

            }
        );

    }


    // ========================================
    // КЛІКИ ПО КАРТКАХ
    // ========================================

    if (productsContainer) {

        productsContainer.addEventListener(
            "click",
            (event) => {

                // --------------------------------
                // КНОПКА "КУПИТИ"
                // --------------------------------

                const buyButton =
                    event.target.closest(".buy-button");


                if (buyButton) {

                    event.stopPropagation();


                    const card =
                        buyButton.closest(".product-card");


                    if (!card) {
                        return;
                    }


                    const id =
                        card.dataset.id;


                    if (!cart[id]) {
                        cart[id] = 0;
                    }


                    cart[id]++;


                    saveCart();


                    buyButton.textContent =
                        "✓ Додано";


                    buyButton.disabled = true;


                    setTimeout(() => {

                        buyButton.textContent =
                            "Купити";

                        buyButton.disabled = false;

                    }, 1000);


                    return;
                }


                // --------------------------------
                // КЛІК ПО КАРТЦІ
                // --------------------------------

                const card =
                    event.target.closest(".product-card");


                if (!card) {
                    return;
                }


                const id =
                    card.dataset.id;


                window.location.href =
                    "product.html?id=" + id;

            }
        );

    }


    // ========================================
    // КНОПКА КОШИКА
    // ========================================

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "cart.html";

            }
        );

    }


    // ========================================
    // ПОЧАТКОВИЙ ЗАПУСК
    // ========================================

    updateCartCount();

    loadProducts();

});