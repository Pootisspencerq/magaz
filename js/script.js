
console.log("JavaScript підключено!");

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(".buy-button");
    const cartCount = document.querySelector("#cartCount");
    const search = document.querySelector("#search");
    const sort = document.querySelector("#sort");
    const productsContainer = document.querySelector("#products");

    let cart = 0;

    /* =========================
       КОШИК
    ========================= */

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            cart++;

            cartCount.textContent = cart;

            button.textContent = "Додано ✓";

            button.disabled = true;

            setTimeout(() => {
                button.textContent = "Купити";
                button.disabled = false;
            }, 1000);

        });

    });


    /* =========================
       ПОШУК
    ========================= */

    search.addEventListener("input", () => {

        const text = search.value.toLowerCase().trim();

        const products = document.querySelectorAll(".product-card");

        products.forEach(product => {

            const name = product
                .dataset.name
                .toLowerCase();

            if (name.includes(text)) {
                product.style.display = "";
            } else {
                product.style.display = "none";
            }

        });

    });


    /* =========================
       СОРТУВАННЯ
    ========================= */

    sort.addEventListener("change", () => {

        const products = [
            ...document.querySelectorAll(".product-card")
        ];

        if (sort.value === "cheap") {

            products.sort((a, b) => {
                return Number(a.dataset.price)
                    - Number(b.dataset.price);
            });

        }

        if (sort.value === "expensive") {

            products.sort((a, b) => {
                return Number(b.dataset.price)
                    - Number(a.dataset.price);
            });

        }

        products.forEach(product => {
            productsContainer.appendChild(product);
        });

    });

});
