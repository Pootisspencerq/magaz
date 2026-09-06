console.log("checkout.js підключено!");

document.addEventListener("DOMContentLoaded", () => {

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


    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || {};


    const checkoutContent =
        document.querySelector("#checkoutContent");

    const emptyCheckout =
        document.querySelector("#emptyCheckout");

    const checkoutItems =
        document.querySelector("#checkoutItems");

    const checkoutTotalItems =
        document.querySelector("#checkoutTotalItems");

    const checkoutProductsTotal =
        document.querySelector("#checkoutProductsTotal");

    const checkoutGrandTotal =
        document.querySelector("#checkoutGrandTotal");

    const deliveryPrice =
        document.querySelector("#deliveryPrice");

    const cartCount =
        document.querySelector("#cartCount");


    function formatPrice(price) {

        return price.toLocaleString("uk-UA") + " грн";

    }


    function getTotalItems() {

        return Object.values(cart).reduce(
            (sum, quantity) => sum + quantity,
            0
        );

    }


    function getProductsTotal() {

        let total = 0;

        Object.keys(cart).forEach(id => {

            const product = products[id];

            if (!product) {
                return;
            }

            total += product.price * cart[id];

        });

        return total;

    }


    function updateCartCount() {

        const count = getTotalItems();

        if (cartCount) {
            cartCount.textContent = count;
        }

    }


    function renderCheckout() {

        checkoutItems.innerHTML = "";

        let totalItems = 0;
        let productsTotal = 0;


        Object.keys(cart).forEach(id => {

            const quantity = cart[id];

            const product = products[id];

            if (!product || quantity <= 0) {
                return;
            }


            const itemTotal =
                product.price * quantity;


            totalItems += quantity;

            productsTotal += itemTotal;


            const item =
                document.createElement("div");

            item.className =
                "checkout-product";


            item.innerHTML = `

                <div class="checkout-product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="checkout-product-info">

                    <strong>
                        ${product.name}
                    </strong>

                    <span>
                        ${quantity} ×
                        ${formatPrice(product.price)}
                    </span>

                </div>


                <strong class="checkout-product-total">

                    ${formatPrice(itemTotal)}

                </strong>

            `;


            checkoutItems.appendChild(item);

        });


        if (totalItems === 0) {

            checkoutContent.style.display =
                "none";

            emptyCheckout.style.display =
                "block";

            return;

        }


        checkoutContent.style.display =
            "flex";

        emptyCheckout.style.display =
            "none";


        checkoutTotalItems.textContent =
            totalItems;


        checkoutProductsTotal.textContent =
            formatPrice(productsTotal);


        const selectedDelivery =
            document.querySelector("#delivery").value;


        let delivery = 0;


        if (selectedDelivery === "courier") {
            delivery = 150;
        }


        deliveryPrice.textContent =
            delivery === 0
                ? "Безкоштовно"
                : formatPrice(delivery);


        checkoutGrandTotal.textContent =
            formatPrice(productsTotal + delivery);


        updateCartCount();

    }


    // Кнопка кошика

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


    // Зміна способу доставки

    const delivery =
        document.querySelector("#delivery");

    const branchBlock =
        document.querySelector("#branchBlock");

    const addressBlock =
        document.querySelector("#addressBlock");


    delivery.addEventListener(
        "change",
        () => {

            const value =
                delivery.value;


            branchBlock.style.display =
                "none";

            addressBlock.style.display =
                "none";


            if (
                value === "nova_poshta" ||
                value === "ukrposhta"
            ) {

                branchBlock.style.display =
                    "block";

            }


            if (value === "courier") {

                addressBlock.style.display =
                    "block";

            }


            renderCheckout();

        }
    );


    // Оформлення замовлення

    const checkoutForm =
        document.querySelector("#checkoutForm");


    checkoutForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            if (getTotalItems() === 0) {

                alert(
                    "Ваш кошик порожній."
                );

                return;

            }


            const orderNumber =
                "MY-" +
                Date.now()
                    .toString()
                    .slice(-8);


            document.querySelector(
                "#orderNumber"
            ).textContent =
                orderNumber;


            // Зберігаємо замовлення

            const order = {

                number: orderNumber,

                date: new Date()
                    .toISOString(),

                customer: {

                    firstName:
                        document.querySelector(
                            "#firstName"
                        ).value,

                    lastName:
                        document.querySelector(
                            "#lastName"
                        ).value,

                    phone:
                        document.querySelector(
                            "#phone"
                        ).value,

                    email:
                        document.querySelector(
                            "#email"
                        ).value

                },

                delivery: {

                    city:
                        document.querySelector(
                            "#city"
                        ).value,

                    method:
                        delivery.value,

                    branch:
                        document.querySelector(
                            "#branch"
                        ).value,

                    address:
                        document.querySelector(
                            "#address"
                        ).value

                },

                payment:
                    document.querySelector(
                        'input[name="payment"]:checked'
                    ).value,

                comment:
                    document.querySelector(
                        "#comment"
                    ).value,

                items: cart,

                total:
                    getProductsTotal()

            };


            localStorage.setItem(
                "lastOrder",
                JSON.stringify(order)
            );


            // Очищаємо кошик

            localStorage.removeItem(
                "cart"
            );

            localStorage.setItem(
                "cartCount",
                "0"
            );

            cart = {};


            // Ховаємо форму

            checkoutContent.style.display =
                "none";


            // Показуємо успіх

            document.querySelector(
                "#successOrder"
            ).style.display =
                "block";


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    renderCheckout();

});