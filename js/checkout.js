document.addEventListener("DOMContentLoaded", () => {

    const API_BASE = "http://127.0.0.1:8000/api";

    const PRODUCTS_URL = `${API_BASE}/products/`;
    const ORDERS_URL = `${API_BASE}/orders/create/`;

    // ==============================
    // ELEMENTS
    // ==============================

    const checkoutForm = document.querySelector("#checkoutForm");

    const checkoutContent =
        document.querySelector("#checkoutContent");

    const checkoutEmpty =
        document.querySelector("#emptyCheckout");

    const checkoutSummary =
        document.querySelector("#checkoutSummary");

    const successBlock =
        document.querySelector("#successBlock");

    const successOrderNumber =
        document.querySelector("#successOrderNumber");

    const cartButton =
        document.querySelector("#cartButton");

    const cartCount =
        document.querySelector("#cartCount");

    const search =
        document.querySelector("#search");

    const deliverySelect =
        document.querySelector("#delivery");

    const branchBlock =
        document.querySelector("#branchBlock");

    const addressBlock =
        document.querySelector("#addressBlock");

    const branchInput =
        document.querySelector("#branch");

    const addressInput =
        document.querySelector("#address");


    // ==============================
    // CART
    // ==============================

    let cart =
        JSON.parse(localStorage.getItem("cart")) || {};

    let products = [];


    // ==============================
    // PRICE
    // ==============================

    function formatPrice(price) {

        return Number(price).toLocaleString("uk-UA") + " грн";

    }


    // ==============================
    // CART COUNT
    // ==============================

    function getCartCount() {

        return Object.values(cart).reduce(
            (sum, quantity) => {
                return sum + Number(quantity);
            },
            0
        );

    }


    function updateCartCount() {

        if (!cartCount) {
            return;
        }

        cartCount.textContent = getCartCount();

    }


    // ==============================
    // GET CART PRODUCTS
    // ==============================

    function getCartProducts() {

        const items = [];

        for (const [id, quantity] of Object.entries(cart)) {

            const product = products.find(
                item => String(item.id) === String(id)
            );

            if (!product) {
                continue;
            }

            const qty = Number(quantity);

            if (qty <= 0) {
                continue;
            }

            items.push({
                product: product,
                quantity: qty
            });

        }

        return items;

    }


    // ==============================
    // EMPTY CART
    // ==============================

    function showEmptyCheckout() {

        if (checkoutContent) {
            checkoutContent.style.display = "none";
        }

        if (checkoutEmpty) {
            checkoutEmpty.style.display = "block";
        }

    }


    // ==============================
    // SHOW CHECKOUT
    // ==============================

    function showCheckout() {

        if (checkoutEmpty) {
            checkoutEmpty.style.display = "none";
        }

        if (checkoutContent) {
            checkoutContent.style.display = "flex";
        }

    }


    // ==============================
    // LOAD PRODUCTS
    // ==============================

    async function loadProducts() {

        try {

            const response =
                await fetch(PRODUCTS_URL);

            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }

            products =
                await response.json();

            const cartProducts =
                getCartProducts();

            if (cartProducts.length === 0) {

                showEmptyCheckout();
                return;

            }

            showCheckout();

            renderSummary();

        } catch (error) {

            console.error(
                "Помилка завантаження товарів:",
                error
            );

            if (checkoutSummary) {

                checkoutSummary.innerHTML = `
                    <div class="alert alert-danger">
                        Не вдалося завантажити товари.
                        Перевірте, чи запущений Django.
                    </div>
                `;

            }

        }

    }


    // ==============================
    // RENDER ORDER SUMMARY
    // ==============================

    function renderSummary() {

        if (!checkoutSummary) {
            return;
        }

        const items =
            getCartProducts();

        if (items.length === 0) {

            showEmptyCheckout();
            return;

        }

        let productsTotal = 0;

        let html = "";


        // ------------------------------
        // PRODUCTS
        // ------------------------------

        items.forEach(item => {

            const product =
                item.product;

            const quantity =
                item.quantity;

            const itemTotal =
                Number(product.price) * quantity;

            productsTotal += itemTotal;


            const image =
                product.image ||
                `https://picsum.photos/120/100?random=${product.id}`;


                html += `

                    <div class="checkout-product">

                        <div class="checkout-product-image">
                            <img
                                src="${image}"
                                alt="${product.name}"
                            >
                        </div>

                        <div class="checkout-product-info">

                        <div class="checkout-product-name">
                            ${product.name}
                        </div>

                        <div class="checkout-product-quantity">
                            ${quantity} ×
                            ${formatPrice(product.price)}
                        </div>

                    </div>

                    <div class="checkout-product-price">
                        ${formatPrice(itemTotal)}
                    </div>

                </div>

            `;

        });


        // ------------------------------
        // DELIVERY
        // ------------------------------

        const delivery =
            deliverySelect
                ? deliverySelect.value
                : "";


        const deliveryPrice =
            getDeliveryPrice(delivery);


        const grandTotal =
            productsTotal + deliveryPrice;


        // ------------------------------
        // TOTAL
        // ------------------------------

        html += `

            <hr>

            <div class="summary-line">

                <span>
                    Товарів:
                </span>

                <strong>
                    ${getCartCount()} шт.
                </strong>

            </div>


            <div class="summary-line">

                <span>
                    Вартість товарів:
                </span>

                <strong>
                    ${formatPrice(productsTotal)}
                </strong>

            </div>


            <div class="summary-line">

                <span>
                    Доставка:
                </span>

                <strong>
                    ${
                        deliveryPrice === 0
                            ? "За тарифами перевізника"
                            : formatPrice(deliveryPrice)
                    }
                </strong>

            </div>


            <div class="summary-grand">

                <span>
                    Разом:
                </span>

                <strong>
                    ${formatPrice(grandTotal)}
                </strong>

            </div>

        `;


        checkoutSummary.innerHTML =
            html;

    }


    // ==============================
    // DELIVERY PRICE
    // ==============================

    function getDeliveryPrice(method) {

        // Поки що не додаємо
        // доставку до вартості замовлення.

        // Нова пошта
        // Укрпошта
        // Кур'єр

        // можуть мати різну ціну,
        // тому зараз показуємо:
        // "За тарифами перевізника"

        return 0;

    }


    // ==============================
    // DELIVERY FIELDS
    // ==============================

    function updateDeliveryFields() {

        if (!deliverySelect) {
            return;
        }


        const method =
            deliverySelect.value;


        // Приховуємо все

        if (branchBlock) {
            branchBlock.style.display =
                "none";
        }

        if (addressBlock) {
            addressBlock.style.display =
                "none";
        }


        // ------------------------------
        // НОВА ПОШТА
        // ------------------------------

        if (method === "nova_poshta") {

            if (branchBlock) {
                branchBlock.style.display =
                    "block";
            }

        }


        // ------------------------------
        // УКРПОШТА
        // ------------------------------

        if (method === "ukr_poshta") {

            if (branchBlock) {
                branchBlock.style.display =
                    "block";
            }

        }


        // ------------------------------
        // САМОВИВІЗ
        // ------------------------------

        if (method === "pickup") {

            if (addressBlock) {
                addressBlock.style.display =
                    "block";
            }

        }


        renderSummary();

    }


    // ==============================
    // ORDER ITEMS
    // ==============================

    function getOrderItems() {

        const items = [];


        for (
            const [id, quantity]
            of Object.entries(cart)
        ) {

            const product =
                products.find(
                    item =>
                        String(item.id) === String(id)
                );


            if (!product) {
                continue;
            }


            const qty =
                Number(quantity);


            if (qty <= 0) {
                continue;
            }


            items.push({

                product: product.id,

                quantity: qty

            });

        }


        return items;

    }


    // ==============================
    // FORM VALUE
    // ==============================

    function getFormValue(name) {

        if (!checkoutForm) {
            return "";
        }


        const element =
            checkoutForm.querySelector(
                `[name="${name}"]`
            );


        if (!element) {
            return "";
        }


        return element.value.trim();

    }


    // ==============================
    // DELIVERY ADDRESS
    // ==============================

    function getDeliveryAddress() {

        const method =
            getFormValue(
                "delivery_method"
            );


        if (
            method === "nova_poshta" ||
            method === "ukr_poshta"
        ) {

            return branchInput
                ? branchInput.value.trim()
                : "";

        }


        if (method === "pickup") {

            return "Самовивіз";

        }


        return "";

    }


    // ==============================
    // PAYMENT
    // ==============================

    function getPaymentMethod() {

        const payment =
            checkoutForm.querySelector(
                'input[name="payment_method"]:checked'
            );


        return payment
            ? payment.value
            : "";

    }


    // ==============================
    // CREATE ORDER
    // ==============================

    async function createOrder(event) {

        event.preventDefault();


        // ------------------------------
        // CHECK CART
        // ------------------------------

        const orderItems =
            getOrderItems();


        if (orderItems.length === 0) {

            alert(
                "Ваш кошик порожній."
            );

            return;

        }


        // ------------------------------
        // BUTTON
        // ------------------------------

        const submitButton =
            checkoutForm.querySelector(
                'button[type="submit"]'
            );


        const originalText =
            submitButton
                ? submitButton.textContent
                : "Підтвердити замовлення";


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                "Оформлення...";

        }


        // ------------------------------
        // DATA
        // ------------------------------

        const orderData = {

            first_name:
                getFormValue("first_name"),

            last_name:
                getFormValue("last_name"),

            phone:
                getFormValue("phone"),

            email:
                getFormValue("email"),

            city:
                getFormValue("city"),

            delivery_method:
                getFormValue(
                    "delivery_method"
                ),

            delivery_address:
                getDeliveryAddress(),

            payment_method:
                getPaymentMethod(),

            comment:
                getFormValue("comment"),

            items:
                orderItems

        };


        console.log(
            "Відправляємо замовлення:",
            orderData
        );


        // ------------------------------
        // SEND TO DJANGO
        // ------------------------------

        try {

            const response =
                await fetch(
                    ORDERS_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            ...(window.VilkaAuth?.getToken?.()
                                ? { "Authorization": `Token ${window.VilkaAuth.getToken()}` }
                                : {})
                        },

                        body:
                            JSON.stringify(
                                orderData
                            )
                    }
                );


            const data =
                await response.json();


            console.log(
                "Відповідь Django:",
                data
            );


            // ------------------------------
            // ERROR
            // ------------------------------

            if (!response.ok) {

                console.error(
                    "Помилка API:",
                    data
                );


                let message =
                    "Не вдалося оформити замовлення.";


                if (data.items) {

                    if (
                        Array.isArray(
                            data.items
                        )
                    ) {

                        message =
                            data.items.join(
                                " "
                            );

                    } else {

                        message =
                            data.items;

                    }

                }


                else if (
                    data.delivery_address
                ) {

                    message =
                        Array.isArray(
                            data.delivery_address
                        )
                            ? data.delivery_address.join(
                                " "
                            )
                            : data.delivery_address;

                }


                else if (data.detail) {

                    message =
                        data.detail;

                }


                else {

                    const firstError =
                        Object.values(data)[0];


                    if (
                        Array.isArray(
                            firstError
                        )
                    ) {

                        message =
                            firstError.join(
                                " "
                            );

                    }

                }


                alert(message);

                return;

            }


            // ------------------------------
            // SUCCESS
            // ------------------------------

            console.log(
                "Замовлення успішно створено:",
                data
            );


            // Видаляємо кошик

            localStorage.removeItem(
                "cart"
            );

            cart = {};


            updateCartCount();


            // Ховаємо форму

            if (checkoutContent) {

                checkoutContent.style.display =
                    "none";

            }


            if (checkoutEmpty) {

                checkoutEmpty.style.display =
                    "none";

            }


            // Показуємо успіх

            if (successBlock) {

                successBlock.style.display =
                    "block";

            }


            // Номер замовлення

            if (successOrderNumber) {

                successOrderNumber.textContent =
                    data.order_number ||
                    "MY---------";

            }


            // Прокручуємо нагору

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


        } catch (error) {

            console.error(
                "Помилка з'єднання:",
                error
            );


            alert(
                "Не вдалося зв'язатися з сервером Django.\n\n" +
                "Перевірте, чи запущений backend."
            );

        } finally {

            if (submitButton) {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    originalText;

            }

        }

    }


    // ==============================
    // CART BUTTON
    // ==============================

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "cart.html";

            }
        );

    }


    // ==============================
    // SEARCH
    // ==============================

    if (search) {

        search.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Enter"
                ) {
                    return;
                }


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
        );

    }


    // ==============================
    // DELIVERY CHANGE
    // ==============================

    if (deliverySelect) {

        deliverySelect.addEventListener(
            "change",
            updateDeliveryFields
        );

    }


    // ==============================
    // FORM SUBMIT
    // ==============================

    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            createOrder
        );

    }


    // ==============================
    // START
    // ==============================

    updateCartCount();

    updateDeliveryFields();

    loadProducts();

});