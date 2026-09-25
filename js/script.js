
console.log("script.js підключено!");

document.addEventListener("DOMContentLoaded", () => {

    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    const productsContainer = document.querySelector("#products");
    const cartCount = document.querySelector("#cartCount");
    const search = document.querySelector("#search");
    const sort = document.querySelector("#sort");
    const cartButton = document.querySelector("#cartButton");

    let products = [];

    let selectedCategory =
        new URLSearchParams(window.location.search).get("category") || "";

    let searchText = "";
    let sortType = "default";


    // ========================================
    // КОШИК
    // ========================================

    function getCartCount() {

        return Object.values(cart).reduce(
            (sum, quantity) => sum + Number(quantity),
            0
        );

    }


    function updateCartCount() {

        if (cartCount) {
            cartCount.textContent = getCartCount();
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
    // НОРМАЛІЗАЦІЯ КАТЕГОРІЇ
    // ========================================

    function getProductCategory(product) {

        let category = product.category;

        if (category && typeof category === "object") {

            category = category.slug || category.name || "";

        }

        category = String(category || "")
            .toLowerCase()
            .trim();

        const categoryMap = {

            "комп'ютери": "computers",
            "комп’ютери": "computers",

            "телефони": "phones",

            "ноутбуки": "laptops",

            "аксесуари": "accessories"

        };

        return categoryMap[category] || category;

    }


    // ========================================
    // СТВОРЕННЯ КАРТКИ
    // ========================================

    function createProductCard(product) {

        const card = document.createElement("div");

        card.className =
            "col-12 col-sm-6 col-lg-4 col-xl-3 product-card";

        card.dataset.id = product.id;
        card.dataset.name = product.name || "";
        card.dataset.price = product.price || 0;


        const image =
            product.image ||
            "https://picsum.photos/500/400?random=" + product.id;


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${image}"
                    alt="${product.name || "Товар"}"
                >

            </div>


            <div class="product-card-body">

                <h3>
                    ${product.name || "Без назви"}
                </h3>


                <div class="product-rating">
                    <i class="bi bi-star-fill"></i> ${product.rating || "0.0"}
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
    // ФІЛЬТРАЦІЯ ТА СОРТУВАННЯ
    // ========================================

    function getFilteredProducts() {

        let result = [...products];


        // Фільтрація за категорією

        if (selectedCategory) {

            result = result.filter(product => {

                return getProductCategory(product) ===
                    selectedCategory.toLowerCase();

            });

        }


        // Пошук

        if (searchText) {

            result = result.filter(product => {

                const name = String(product.name || "")
                    .toLowerCase();

                const description = String(product.description || "")
                    .toLowerCase();

                const category = getProductCategory(product);

                return (
                    name.includes(searchText) ||
                    description.includes(searchText) ||
                    category.includes(searchText)
                );

            });

        }


        // Сортування

        if (sortType === "cheap") {

            result.sort((a, b) => {

                return Number(a.price) - Number(b.price);

            });

        }


        if (sortType === "expensive") {

            result.sort((a, b) => {

                return Number(b.price) - Number(a.price);

            });

        }


        return result;

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
                        Спробуйте змінити пошук або категорію.
                    </p>

                    <button
                        type="button"
                        class="btn btn-orange"
                        id="resetFilters"
                    >
                        Показати всі товари
                    </button>

                </div>

            `;

            return;

        }


        list.forEach(product => {

            const card = createProductCard(product);

            productsContainer.appendChild(card);

        });

    }


    function refreshProducts() {

        renderProducts(getFilteredProducts());

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


            refreshProducts();


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
                        type="button"
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

        search.addEventListener("input", () => {

            searchText = search.value
                .toLowerCase()
                .trim();

            refreshProducts();

        });

    }


    // ========================================
    // СОРТУВАННЯ
    // ========================================

    if (sort) {

        sort.addEventListener("change", () => {

            sortType = sort.value;

            refreshProducts();

        });

    }


    // ========================================
    // КЛІКИ ПО КАРТКАХ
    // ========================================

    if (productsContainer) {

        productsContainer.addEventListener("click", event => {


            // Кнопка скидання фільтрів

            const resetButton =
                event.target.closest("#resetFilters");


            if (resetButton) {

                selectedCategory = "";
                searchText = "";

                if (search) {
                    search.value = "";
                }

                refreshProducts();

                return;

            }


            // Кнопка "Купити"

            const buyButton =
                event.target.closest(".buy-button");


            if (buyButton) {

                event.stopPropagation();


                const card =
                    buyButton.closest(".product-card");


                if (!card) {
                    return;
                }


                const id = card.dataset.id;


                if (!cart[id]) {
                    cart[id] = 0;
                }


                cart[id]++;


                saveCart();


                buyButton.textContent = "✓ Додано";

                buyButton.disabled = true;


                setTimeout(() => {

                    buyButton.textContent = "Купити";

                    buyButton.disabled = false;

                }, 1000);


                return;

            }


            // Клік по картці

            const card =
                event.target.closest(".product-card");


            if (!card) {
                return;
            }


            const id = card.dataset.id;


            window.location.href =
                "product.html?id=" + encodeURIComponent(id);

        });

    }


    // ========================================
    // КНОПКА КОШИКА
    // ========================================

    if (cartButton) {

        cartButton.addEventListener("click", () => {

            window.location.href = "cart.html";

        });

    }


    // ========================================
    // ПОЧАТКОВИЙ ЗАПУСК
    // ========================================

    updateCartCount();

    loadProducts();

});