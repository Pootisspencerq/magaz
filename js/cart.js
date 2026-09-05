console.log("cart.js підключено!");

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // ТОВАРИ
    // =========================

    const products = {

        1: {
            name: "Lenovo IdeaPad 3",
            price: 24999,
            image: "https://picsum.photos/500/400?random=1"
        },

        2: {
            name: "Samsung Galaxy A55",
            price: 18999,
            image: "https://picsum.photos/500/400?random=2"
        },

        3: {
            name: "Sony WH-1000XM5",
            price: 9499,
            image: "https://picsum.photos/500/400?random=3"
        },

        4: {
            name: "Logitech G Pro Keyboard",
            price: 3899,
            image: "https://picsum.photos/500/400?random=4"
        },

        5: {
            name: "Apple AirPods Pro",
            price: 7999,
            image: "https://picsum.photos/500/400?random=5"
        },

        6: {
            name: "Xiaomi Robot Vacuum",
            price: 11999,
            image: "https://picsum.photos/500/400?random=6"
        }

    };


    // =========================
    // ОТРИМУЄМО КОШИК
    // =========================

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || {};


    // =========================
    // ЕЛЕМЕНТИ
    // =========================

    const cartItems =
        document.querySelector("#cartItems");

    const emptyCart =
        document.querySelector("#emptyCart");

    const cartContent =
        document.querySelector("#cartContent");

    const cartCount =
        document.querySelector("#cartCount");

    const totalItems =
        document.querySelector("#totalItems");

    const totalPrice =
        document.querySelector("#totalPrice");

    const grandTotal =
        document.querySelector("#grandTotal");


    // =========================
    // ФОРМАТУВАННЯ ЦІНИ
    // =========================

    function formatPrice(price) {

        return price.toLocaleString("uk-UA") + " грн";

    }


    // =========================
    // ЗБЕРЕГТИ КОШИК
    // =========================

    function saveCart() {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    }


    // =========================
    // ОНОВИТИ КІЛЬКІСТЬ
    // =========================

    function updateCartCount() {

        let count = 0;

        Object.values(cart).forEach(quantity => {

            count += quantity;

        });

        cartCount.textContent = count;

    }


    // =========================
    // ПОКАЗАТИ КОШИК
    // =========================

    function renderCart() {

        cartItems.innerHTML = "";

        let total = 0;
        let itemsCount = 0;


        Object.keys(cart).forEach(id => {

            const quantity = cart[id];

            const product = products[id];


            // Якщо товар не існує
            if (!product) {
                return;
            }


            const itemTotal =
                product.price * quantity;


            total += itemTotal;
            itemsCount += quantity;


            const item = document.createElement("div");

            item.className = "cart-item";


            item.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="cart-item-info">

                    <h4>
                        ${product.name}
                    </h4>

                    <div class="cart-item-price">
                        ${formatPrice(product.price)}
                    </div>

                </div>


                <div class="cart-item-quantity">

                    <button
                        class="quantity-minus"
                        data-id="${id}"
                    >
                        −
                    </button>

                    <span>
                        ${quantity}
                    </span>

                    <button
                        class="quantity-plus"
                        data-id="${id}"
                    >
                        +
                    </button>

                </div>


                <div class="cart-item-total">

                    ${formatPrice(itemTotal)}

                </div>


                <button
                    class="remove-item"
                    data-id="${id}"
                    title="Видалити"
                >
                    🗑
                </button>

            `;


            cartItems.appendChild(item);

        });


        // =========================
        // ПОРОЖНІЙ КОШИК
        // =========================

        if (itemsCount === 0) {

            emptyCart.style.display = "block";
            cartContent.style.display = "none";

        } else {

            emptyCart.style.display = "none";
            cartContent.style.display = "block";

        }


        // =========================
        // ПІДСУМОК
        // =========================

        totalItems.textContent =
            itemsCount;

        totalPrice.textContent =
            formatPrice(total);

        grandTotal.textContent =
            formatPrice(total);


        updateCartCount();

        saveCart();

    }


    // =========================
    // КНОПКИ КІЛЬКОСТІ
    // =========================

    cartItems.addEventListener("click", (event) => {

        const minus =
            event.target.closest(".quantity-minus");

        const plus =
            event.target.closest(".quantity-plus");

        const remove =
            event.target.closest(".remove-item");


        // МІНУС

        if (minus) {

            const id = minus.dataset.id;

            if (cart[id] > 1) {

                cart[id]--;

            } else {

                delete cart[id];

            }

            renderCart();

        }


        // ПЛЮС

        if (plus) {

            const id = plus.dataset.id;

            cart[id]++;

            renderCart();

        }


        // ВИДАЛЕННЯ

        if (remove) {

            const id = remove.dataset.id;

            delete cart[id];

            renderCart();

        }

    });


    // =========================
    // ОЧИСТИТИ КОШИК
    // =========================

    document
        .querySelector("#clearCart")
        .addEventListener("click", () => {

            if (
                confirm(
                    "Очистити весь кошик?"
                )
            ) {

                cart = {};

                saveCart();

                renderCart();

            }

        });


    // =========================
    // ОФОРМИТИ ЗАМОВЛЕННЯ
    // =========================

    document
        .querySelector("#checkoutButton")
        .addEventListener("click", () => {

            alert(
                "Замовлення оформлено! Дякуємо за покупку ❤️"
            );

        });


    // =========================
    // КНОПКА КОШИКА
    // =========================

    document
        .querySelector("#cartButton")
        .addEventListener("click", () => {

            window.location.href =
                "cart.html";

        });


    // =========================
    // ПОКАЗАТИ
    // =========================

    renderCart();

});