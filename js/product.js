console.log("product.js підключено!");


document.addEventListener("DOMContentLoaded", () => {


    // =====================================================
    // API
    // =====================================================

    const API_BASE =
        "http://127.0.0.1:8000/api/products/";


    // =====================================================
    // ID ТОВАРУ З URL
    // =====================================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        params.get("id");


    console.log(
        "ID товару:",
        productId
    );


    // =====================================================
    // ЕЛЕМЕНТИ
    // =====================================================

    const productPage =
        document.querySelector("#productPage");


    const productLoading =
        document.querySelector("#productLoading");


    const productError =
        document.querySelector("#productError");


    const productImage =
        document.querySelector("#productImage");


    const productName =
        document.querySelector("#productName");


    const productRating =
        document.querySelector("#productRating");


    const productDescription =
        document.querySelector("#productDescription");


    const productPrice =
        document.querySelector("#productPrice");


    const productAvailability =
        document.querySelector("#productAvailability");


    const productBrand =
        document.querySelector("#productBrand");


    const productCategory =
        document.querySelector("#productCategory");


    const productStock =
        document.querySelector("#productStock");


    const quantityElement =
        document.querySelector("#quantity");


    const quantityMinus =
        document.querySelector("#quantityMinus");


    const quantityPlus =
        document.querySelector("#quantityPlus");


    const addToCartButton =
        document.querySelector("#addToCartButton");


    const addToCartMessage =
        document.querySelector("#addToCartMessage");


    const cartButton =
        document.querySelector("#cartButton");


    const cartCount =
        document.querySelector("#cartCount");



    // =====================================================
    // ЗМІННІ
    // =====================================================

    let product = null;

    let quantity = 1;



    // =====================================================
    // КОШИК
    // =====================================================

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || {};



    // =====================================================
    // ФОРМАТ ЦІНИ
    // =====================================================

    function formatPrice(price) {

        return Number(price)
            .toLocaleString("uk-UA");

    }



    // =====================================================
    // ЛІЧИЛЬНИК КОШИКА
    // =====================================================

    function updateCartCount() {

        const count =
            Object.values(cart).reduce(
                (sum, value) => {

                    return sum + Number(value);

                },
                0
            );


        if (cartCount) {

            cartCount.textContent =
                count;

        }

    }



    // =====================================================
    // ЗБЕРЕГТИ КОШИК
    // =====================================================

    function saveCart() {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        updateCartCount();

    }



    // =====================================================
    // ПОКАЗАТИ ПОМИЛКУ
    // =====================================================

    function showError() {

        if (productLoading) {

            productLoading.style.display =
                "none";

        }


        if (productPage) {

            productPage.style.display =
                "none";

        }


        if (productError) {

            productError.style.display =
                "block";

        }

    }



    // =====================================================
    // ЗАВАНТАЖЕННЯ ТОВАРУ
    // =====================================================

    async function loadProduct() {

        // Якщо ID немає

        if (!productId) {

            console.error(
                "ID товару відсутній"
            );

            showError();

            return;

        }


        try {

            const response =
                await fetch(
                    API_BASE + productId + "/"
                );


            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );

            }


            product =
                await response.json();


            console.log(
                "Товар отримано з Django:",
                product
            );


            renderProduct();


        } catch (error) {

            console.error(
                "Не вдалося завантажити товар:",
                error
            );


            showError();

        }

    }



    // =====================================================
    // ВІДОБРАЖЕННЯ ТОВАРУ
    // =====================================================

    function renderProduct() {

        if (!product) {

            showError();

            return;

        }


        // -----------------------------------------------
        // НАЗВА ВКЛАДКИ
        // -----------------------------------------------

        document.title =
            product.name +
            " | VILKA";


        // -----------------------------------------------
        // НАЗВА
        // -----------------------------------------------

        productName.textContent =
            product.name;


        // -----------------------------------------------
        // ФОТО
        // -----------------------------------------------

        const image =
            product.image ||
            "https://picsum.photos/800/600?random=" +
            product.id;


        productImage.src =
            image;


        productImage.alt =
            product.name;


        // -----------------------------------------------
        // РЕЙТИНГ
        // -----------------------------------------------

        productRating.innerHTML =
            '<i class="bi bi-star-fill"></i> ' +
            product.rating;

        // -----------------------------------------------
        // ОПИС
        // -----------------------------------------------

        productDescription.textContent =
            product.description ||
            "Опис товару поки відсутній.";


        // -----------------------------------------------
        // ЦІНА
        // -----------------------------------------------

        productPrice.textContent =
            formatPrice(product.price) +
            " грн";


        // -----------------------------------------------
        // БРЕНД
        // -----------------------------------------------

        productBrand.textContent =
            product.brand ||
            "Не вказано";


        // -----------------------------------------------
        // КАТЕГОРІЯ
        // -----------------------------------------------

        productCategory.textContent =
            product.category ||
            "Не вказано";


        // -----------------------------------------------
        // СКЛАД
        // -----------------------------------------------

        const stock =
            Number(product.stock);


        productStock.textContent =
            stock +
            " шт.";


        // -----------------------------------------------
        // НАЯВНІСТЬ
        // -----------------------------------------------

        if (stock > 0) {

            productAvailability.textContent =
                "✓ В наявності";

            productAvailability.style.color =
                "#7ee787";


            addToCartButton.disabled =
                false;

        } else {

            productAvailability.textContent =
                "✕ Немає в наявності";

            productAvailability.style.color =
                "#ff6b6b";


            addToCartButton.disabled =
                true;

            addToCartButton.textContent =
                "Немає в наявності";

        }


        // -----------------------------------------------
        // ПОКАЗАТИ СТОРІНКУ
        // -----------------------------------------------

        productLoading.style.display =
            "none";


        productPage.style.display =
            "grid";


        updateQuantity();


    }



    // =====================================================
    // КІЛЬКІСТЬ
    // =====================================================

    function updateQuantity() {

        quantityElement.textContent =
            quantity;

    }



    // =====================================================
    // МІНУС
    // =====================================================

    if (quantityMinus) {

        quantityMinus.addEventListener(
            "click",
            () => {

                if (quantity > 1) {

                    quantity--;

                    updateQuantity();

                }

            }
        );

    }



    // =====================================================
    // ПЛЮС
    // =====================================================

    if (quantityPlus) {

        quantityPlus.addEventListener(
            "click",
            () => {

                if (!product) {

                    return;

                }


                const stock =
                    Number(product.stock);


                if (
                    stock > 0 &&
                    quantity < stock
                ) {

                    quantity++;

                    updateQuantity();

                } else {

                    alert(
                        "На складі доступно лише " +
                        stock +
                        " шт."
                    );

                }

            }
        );

    }



    // =====================================================
    // ДОДАТИ В КОШИК
    // =====================================================

    if (addToCartButton) {

        addToCartButton.addEventListener(
            "click",
            () => {

                if (!product) {

                    return;

                }


                const stock =
                    Number(product.stock);


                if (stock <= 0) {

                    alert(
                        "Цього товару немає в наявності."
                    );

                    return;

                }


                const id =
                    String(product.id);


                if (!cart[id]) {

                    cart[id] =
                        0;

                }


                const currentQuantity =
                    Number(cart[id]);


                // Перевірка складу

                if (
                    currentQuantity + quantity >
                    stock
                ) {

                    alert(
                        "На складі доступно лише " +
                        stock +
                        " шт."
                    );

                    return;

                }


                // Додаємо

                cart[id] =
                    currentQuantity +
                    quantity;


                saveCart();


                // Повідомлення

                if (addToCartMessage) {

                    addToCartMessage.style.display =
                        "block";


                    setTimeout(() => {

                        addToCartMessage.style.display =
                            "none";

                    }, 2000);

                }


                // Кнопка

                const oldText =
                    addToCartButton.textContent;


                addToCartButton.textContent =
                    "✓ Додано до кошика";


                addToCartButton.disabled =
                    true;


                setTimeout(() => {

                    addToCartButton.textContent =
                        oldText;

                    addToCartButton.disabled =
                        false;

                }, 1500);

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
    // ПОШУК
    // =====================================================

    const search =
        document.querySelector("#search");


    if (search) {

        search.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    const text =
                        search.value.trim();


                    if (!text) {

                        window.location.href =
                            "index.html";

                        return;

                    }


                    window.location.href =
                        "index.html?search=" +
                        encodeURIComponent(text);

                }

            }
        );

    }



    // =====================================================
    // СТАРТ
    // =====================================================

    updateCartCount();

    loadProduct();

});