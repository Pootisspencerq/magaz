console.log("product.js підключено!");

document.addEventListener("DOMContentLoaded", () => {

    const products = {

        1: {
            name: "Lenovo IdeaPad 3",
            price: 24999,
            rating: "4.8",
            brand: "Lenovo",
            category: "Ноутбуки",
            description:
                "Потужний ноутбук для навчання, роботи та повсякденного використання.",
            image: "https://picsum.photos/800/600?random=1"
        },

        2: {
            name: "Samsung Galaxy A55",
            price: 18999,
            rating: "4.9",
            brand: "Samsung",
            category: "Смартфони",
            description:
                "Сучасний смартфон з якісним дисплеєм та камерою.",
            image: "https://picsum.photos/800/600?random=2"
        },

        3: {
            name: "Sony WH-1000XM5",
            price: 9499,
            rating: "4.7",
            brand: "Sony",
            category: "Навушники",
            description:
                "Бездротові навушники з активним шумозаглушенням.",
            image: "https://picsum.photos/800/600?random=3"
        },

        4: {
            name: "Logitech G Pro Keyboard",
            price: 3899,
            rating: "4.6",
            brand: "Logitech",
            category: "Клавіатури",
            description:
                "Механічна клавіатура для роботи та ігор.",
            image: "https://picsum.photos/800/600?random=4"
        },

        5: {
            name: "Apple AirPods Pro",
            price: 7999,
            rating: "4.9",
            brand: "Apple",
            category: "Навушники",
            description:
                "Компактні бездротові навушники з шумозаглушенням.",
            image: "https://picsum.photos/800/600?random=5"
        },

        6: {
            name: "Xiaomi Robot Vacuum",
            price: 11999,
            rating: "4.5",
            brand: "Xiaomi",
            category: "Побутова техніка",
            description:
                "Робот-пилосос для автоматичного прибирання будинку.",
            image: "https://picsum.photos/800/600?random=6"
        }

    };


    // Отримуємо ID товару
    const params = new URLSearchParams(
        window.location.search
    );

    const id = params.get("id");


    // Якщо товар не знайдений
    if (!id || !products[id]) {

        document.querySelector("main").innerHTML = `
            <div class="text-center py-5">

                <h2>Товар не знайдено</h2>

                <p>
                    Перевірте адресу сторінки.
                </p>

                <a
                    href="index.html"
                    class="btn btn-orange"
                >
                    Повернутися до каталогу
                </a>

            </div>
        `;

        return;
    }


    const product = products[id];


    // Заповнюємо сторінку
    document.querySelector("#productName").textContent =
        product.name;

    document.querySelector("#productPrice").textContent =
        product.price.toLocaleString("uk-UA") + " грн";

    document.querySelector("#productRating").textContent =
        product.rating;

    document.querySelector("#productDescription").textContent =
        product.description;

    document.querySelector("#productBrand").textContent =
        product.brand;

    document.querySelector("#productCategory").textContent =
        product.category;

    document.querySelector("#productImage").src =
        product.image;

    document.querySelector("#productImage").alt =
        product.name;

    document.title =
        `${product.name} | Мій магазин`;


    // =========================
    // КІЛЬКІСТЬ
    // =========================

    let quantity = 1;

    const quantityElement =
        document.querySelector("#quantity");

    const minusButton =
        document.querySelector("#minusButton");

    const plusButton =
        document.querySelector("#plusButton");


    plusButton.addEventListener("click", () => {

        quantity++;

        quantityElement.textContent =
            quantity;

    });


    minusButton.addEventListener("click", () => {

        if (quantity > 1) {

            quantity--;

            quantityElement.textContent =
                quantity;

        }

    });


    // =========================
    // КОШИК
    // =========================

    let cart = Number(
        localStorage.getItem("cartCount")
    ) || 0;


    const cartCount =
        document.querySelector("#cartCount");


    cartCount.textContent = cart;


    // =========================
    // КУПИТИ
    // =========================

    const buyButton =
        document.querySelector("#productBuyButton");


    buyButton.addEventListener("click", () => {

        cart += quantity;

        localStorage.setItem(
            "cartCount",
            cart
        );

        cartCount.textContent =
            cart;


        const oldText =
            buyButton.textContent;


        buyButton.textContent =
            "✓ Додано до кошика";

        buyButton.disabled = true;


        setTimeout(() => {

            buyButton.textContent =
                oldText;

            buyButton.disabled = false;

        }, 1200);

    });


    // =========================
    // КНОПКА КОШИКА
    // =========================

    const cartButton =
        document.querySelector("#cartButton");


    cartButton.addEventListener("click", () => {

        alert(
            `У кошику товарів: ${cart}`
        );

    });

});