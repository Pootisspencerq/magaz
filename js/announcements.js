const API_BASE = "http://127.0.0.1:8000/api";

const ANNOUNCEMENTS_URL = `${API_BASE}/announcements/`;


/* ========================================
   ЕЛЕМЕНТИ СТОРІНКИ
======================================== */

const announcementsContainer =
    document.getElementById("announcements");

const loading =
    document.getElementById("loading");

const emptyAnnouncements =
    document.getElementById("emptyAnnouncements");

const errorMessage =
    document.getElementById("errorMessage");

const createAnnouncement =
    document.getElementById("createAnnouncement");

const announcementForm =
    document.getElementById("announcementForm");

const formError =
    document.getElementById("formError");

const submitAnnouncement =
    document.getElementById("submitAnnouncement");

const showCreateButton =
    document.getElementById("showCreateButton");

const emptyCreateButton =
    document.getElementById("emptyCreateButton");

const closeCreateButton =
    document.getElementById("closeCreateButton");

const cancelAnnouncement =
    document.getElementById("cancelAnnouncement");

const cartButton =
    document.getElementById("cartButton");

const cartCount =
    document.getElementById("cartCount");

const searchInput =
    document.getElementById("search");


/* ========================================
   ЦІНА
======================================== */

function formatPrice(price) {

    return Number(price).toLocaleString("uk-UA", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

}


/* ========================================
   КОШИК
======================================== */

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    } catch {

        return [];

    }

}


function updateCartCount() {

    const cart = getCart();

    const count = cart.reduce(
        (sum, item) => {
            return sum + Number(item.quantity || 0);
        },
        0
    );

    cartCount.textContent = count;

}


/* ========================================
   ФОРМА
======================================== */

function showCreateForm() {

    createAnnouncement.classList.remove("d-none");

    formError.classList.add("d-none");

    createAnnouncement.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


function hideCreateForm() {

    createAnnouncement.classList.add("d-none");

    formError.classList.add("d-none");

    announcementForm.reset();

}


/* ========================================
   НАЗВИ КАТЕГОРІЙ
======================================== */

function categoryName(value) {

    const categories = {

        computers: "Комп'ютери",

        phones: "Телефони",

        laptops: "Ноутбуки",

        accessories: "Аксесуари",

        gaming: "Ігрова техніка",

        other: "Інше"

    };

    return categories[value] || value;

}


/* ========================================
   СТАН ТОВАРУ
======================================== */

function conditionName(value) {

    if (value === "new") {
        return "Новий";
    }

    return "Вживаний";

}


/* ========================================
   ДАТА
======================================== */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(
        "uk-UA",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* ========================================
   СТВОРЕННЯ КАРТКИ
======================================== */

function createAnnouncementCard(item) {

    const column =
        document.createElement("div");

    column.className =
        "col-12 col-sm-6 col-lg-4";


    const card =
        document.createElement("article");

    card.className =
        "announcement-card";


    /* Фото */

    const imageBlock =
        document.createElement("div");

    imageBlock.className =
        "announcement-image";


    if (item.image) {

        const image =
            document.createElement("img");

        image.src = item.image;

        image.alt = item.title;

        image.loading = "lazy";


        image.onerror = function () {

            image.remove();

            const noImage =
                document.createElement("div");

            noImage.className =
                "announcement-no-image";

            noImage.textContent = "📷";

            imageBlock.appendChild(noImage);

        };


        imageBlock.appendChild(image);

    } else {

        const noImage =
            document.createElement("div");

        noImage.className =
            "announcement-no-image";

        noImage.textContent = "📷";

        imageBlock.appendChild(noImage);

    }


    /* Тіло */

    const body =
        document.createElement("div");

    body.className =
        "announcement-body";


    /* Назва */

    const title =
        document.createElement("h2");

    title.className =
        "announcement-title";

    title.textContent =
        item.title;


    /* Опис */

    const description =
        document.createElement("p");

    description.className =
        "announcement-description";

    description.textContent =
        item.description;


    /* Ціна */

    const price =
        document.createElement("div");

    price.className =
        "announcement-price";

    price.textContent =
        `${formatPrice(item.price)} грн`;


    /* Meta */

    const meta =
        document.createElement("div");

    meta.className =
        "announcement-meta";


    const category =
        document.createElement("span");

    category.className =
        "announcement-badge";

    category.textContent =
        categoryName(item.category);


    const condition =
        document.createElement("span");

    condition.className =
        "announcement-badge";

    condition.textContent =
        conditionName(item.condition);


    const city =
        document.createElement("span");

    city.className =
        "announcement-badge";

    city.textContent =
        `📍 ${item.city}`;


    meta.append(
        category,
        condition,
        city
    );


    /* Продавець */

    const seller =
        document.createElement("div");

    seller.className =
        "announcement-seller";

    seller.textContent =
        `Продавець: ${item.seller_name}`;


    /* Телефон */

    const phone =
        document.createElement("div");

    phone.className =
        "announcement-seller";

    phone.textContent =
        `☎ ${item.phone}`;


    /* Дата */

    const date =
        document.createElement("div");

    date.className =
        "announcement-date";

    date.textContent =
        `Опубліковано: ${formatDate(item.created_at)}`;


    body.append(
        title,
        description,
        price,
        meta,
        seller,
        phone,
        date
    );


    card.append(
        imageBlock,
        body
    );


    column.appendChild(card);


    return column;

}


/* ========================================
   ВІДОБРАЖЕННЯ ОГОЛОШЕНЬ
======================================== */

function renderAnnouncements(items) {

    announcementsContainer.innerHTML = "";

    emptyAnnouncements.classList.add("d-none");


    if (!items.length) {

        emptyAnnouncements.classList.remove(
            "d-none"
        );

        return;

    }


    items.forEach(item => {

        announcementsContainer.appendChild(
            createAnnouncementCard(item)
        );

    });

}


/* ========================================
   ЗАВАНТАЖЕННЯ ОГОЛОШЕНЬ
======================================== */

async function loadAnnouncements() {

    loading.classList.remove("d-none");

    errorMessage.classList.add("d-none");


    try {

        const response =
            await fetch(ANNOUNCEMENTS_URL);


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        const items =
            Array.isArray(data)
                ? data
                : data.results || [];


        renderAnnouncements(items);


    } catch (error) {

        console.error(
            "Помилка завантаження оголошень:",
            error
        );


        errorMessage.textContent =
            "Не вдалося завантажити оголошення. Перевірте, чи запущений Django-сервер.";


        errorMessage.classList.remove(
            "d-none"
        );

    } finally {

        loading.classList.add("d-none");

    }

}


/* ========================================
   СТВОРЕННЯ ОГОЛОШЕННЯ
======================================== */

async function createNewAnnouncement(event) {

    event.preventDefault();


    formError.classList.add("d-none");


    submitAnnouncement.disabled = true;

    submitAnnouncement.textContent =
        "Публікація...";


    try {

        const formData =
            new FormData(
                announcementForm
            );


        const response =
            await fetch(
                `${ANNOUNCEMENTS_URL}create/`,
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Відповідь Django:",
                data
            );


            let message =
                "Не вдалося створити оголошення.";


            if (
                data &&
                typeof data === "object"
            ) {

                const errors = [];


                Object.entries(data).forEach(
                    ([field, value]) => {

                        if (
                            Array.isArray(value)
                        ) {

                            errors.push(
                                `${field}: ${value.join(", ")}`
                            );

                        } else if (
                            typeof value === "string"
                        ) {

                            errors.push(
                                `${field}: ${value}`
                            );

                        }

                    }
                );


                if (errors.length) {

                    message =
                        errors.join("\n");

                }

            }


            throw new Error(message);

        }


        /* Успішне створення */

        announcementForm.reset();

        createAnnouncement.classList.add(
            "d-none"
        );


        await loadAnnouncements();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(error);


        formError.textContent =
            error.message;


        formError.classList.remove(
            "d-none"
        );

    } finally {

        submitAnnouncement.disabled = false;

        submitAnnouncement.textContent =
            "Опублікувати оголошення";

    }

}


/* ========================================
   ПОШУК
======================================== */

searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Enter") {
            return;
        }


        const query =
            searchInput.value.trim();


        if (query) {

            window.location.href =
                `index.html?search=${encodeURIComponent(query)}`;

        } else {

            window.location.href =
                "index.html";

        }

    }
);


/* ========================================
   КНОПКИ
======================================== */

showCreateButton.addEventListener(
    "click",
    showCreateForm
);


emptyCreateButton.addEventListener(
    "click",
    showCreateForm
);


closeCreateButton.addEventListener(
    "click",
    hideCreateForm
);


cancelAnnouncement.addEventListener(
    "click",
    hideCreateForm
);


announcementForm.addEventListener(
    "submit",
    createNewAnnouncement
);


cartButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "cart.html";

    }
);


/* ========================================
   ЗАПУСК
======================================== */

updateCartCount();

loadAnnouncements();