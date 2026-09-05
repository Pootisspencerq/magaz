console.log("script.js підключено!");

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // КОШИК
    // =========================

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || {};

    const cartCount =
        document.querySelector("#cartCount");


    // Порахувати загальну кількість товарів
    function getCartCount() {

        return Object.values(cart).reduce(
            (sum, quantity) => sum + quantity,
            0
        );

    }


    // Оновити цифру біля кошика
    function updateCartCount() {

        const count = getCartCount();

        if (cartCount) {
            cartCount.textContent = count;
        }

        localStorage.setItem(
            "cartCount",
            count
        );

    }


    updateCartCount();


    // =========================
    // КНОПКИ "КУПИТИ"
    // =========================

    const buyButtons =
        document.querySelectorAll(".buy-button");


    buyButtons.forEach(button => {

        button.addEventListener("click", (event) => {

            // Не відкривати сторінку товару
            event.stopPropagation();


            // Знаходимо картку товару
            const card =
                button.closest(".product-card");


            if (!card) {
                return;
            }


            // ID товару
            const id =
                card.dataset.id;


            if (!id) {

                console.error(
                    "У товару немає data-id!"
                );

                return;

            }


            // Якщо товару ще немає
            if (!cart[id]) {
                cart[id] = 0;
            }


            // Додаємо одну одиницю
            cart[id]++;


            // Зберігаємо кошик
            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            // Оновлюємо кількість
            updateCartCount();


            // Анімація кнопки
            button.textContent =
                "✓ Додано";

            button.disabled = true;


            setTimeout(() => {

                button.textContent =
                    "Купити";

                button.disabled = false;

            }, 1000);

        });

    });


    // =========================
    // ВІДКРИТТЯ СТОРІНКИ ТОВАРУ
    // =========================

    const productCards =
        document.querySelectorAll(".product-card");


    productCards.forEach(card => {

        card.style.cursor = "pointer";


        card.addEventListener("click", (event) => {

            // Якщо натиснули кнопку "Купити",
            // нічого більше не робимо
            if (
                event.target.closest(".buy-button")
            ) {
                return;
            }


            const id =
                card.dataset.id;


            if (!id) {

                console.error(
                    "У картки немає data-id!"
                );

                return;

            }


            console.log(
                "Відкриваємо товар:",
                id
            );


            window.location.href =
                "product.html?id=" + id;

        });

    });


    // =========================
    // ПОШУК
    // =========================

    const search =
        document.querySelector("#search");


    if (search) {

        search.addEventListener("input", () => {

            const text =
                search.value
                    .toLowerCase()
                    .trim();


            productCards.forEach(card => {

                const name =
                    card.dataset.name
                        .toLowerCase();


                if (name.includes(text)) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });

    }


    // =========================
    // СОРТУВАННЯ
    // =========================

    const sort =
        document.querySelector("#sort");


    const productsContainer =
        document.querySelector("#products");


    if (sort && productsContainer) {

        sort.addEventListener("change", () => {

            const cards = [
                ...document.querySelectorAll(
                    ".product-card"
                )
            ];


            if (sort.value === "cheap") {

                cards.sort((a, b) => {

                    return Number(a.dataset.price)
                        - Number(b.dataset.price);

                });

            }


            if (sort.value === "expensive") {

                cards.sort((a, b) => {

                    return Number(b.dataset.price)
                        - Number(a.dataset.price);

                });

            }


            cards.forEach(card => {

                productsContainer.appendChild(card);

            });

        });

    }


    // =========================
    // КНОПКА КОШИКА
    // =========================

    const cartButton =
        document.querySelector("#cartButton");


    if (cartButton) {

        cartButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "cart.html";

            }
        );

    }

});