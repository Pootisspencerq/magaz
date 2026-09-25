/* =========================================================
   ОГОЛОШЕННЯ НА ГОЛОВНІЙ СТОРІНЦІ
========================================================= */

const HOME_ANNOUNCEMENTS_URL =
    "http://127.0.0.1:8000/api/announcements/";


/* =========================================================
   ELEMENT
========================================================= */

const homeAnnouncements =
    document.getElementById("homeAnnouncements");


/* =========================================================
   ПЕРЕВІРКА ELEMENT
========================================================= */

if (!homeAnnouncements) {

    console.error(
        "Не знайдено елемент #homeAnnouncements"
    );

}


/* =========================================================
   ЦІНА
========================================================= */

function formatHomePrice(price) {

    const number =
        Number(price);

    if (Number.isNaN(number)) {
        return "0";
    }

    return number.toLocaleString(
        "uk-UA",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

}


/* =========================================================
   КАТЕГОРІЯ
========================================================= */

function getCategoryName(category) {

    const categories = {

        computers: "Комп'ютери",

        phones: "Телефони",

        laptops: "Ноутбуки",

        accessories: "Аксесуари",

        gaming: "Ігрова техніка",

        other: "Інше"

    };

    return categories[category] || category || "Інше";

}


/* =========================================================
   СТАН
========================================================= */

function getConditionName(condition) {

    if (condition === "new") {
        return "Новий";
    }

    return "Вживаний";

}


/* =========================================================
   URL ЗОБРАЖЕННЯ
========================================================= */

function getAnnouncementImageUrl(image) {

    if (!image) {
        return null;
    }

    /*
     * Якщо Django вже повернув повний URL:
     *
     * http://127.0.0.1:8000/media/...
     *
     * залишаємо його як є.
     */

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {

        return image;

    }


    /*
     * Якщо Django повернув:
     *
     * /media/announcements/...
     */

    if (image.startsWith("/")) {

        return (
            "http://127.0.0.1:8000" +
            image
        );

    }


    /*
     * Якщо прийшло:
     *
     * media/announcements/...
     */

    return (
        "http://127.0.0.1:8000/" +
        image
    );

}


/* =========================================================
   СТВОРЕННЯ КАРТКИ
========================================================= */

function createHomeAnnouncement(item) {

    const column =
        document.createElement("div");

    column.className =
        "col-12 col-sm-6 col-lg-4";


    const card =
        document.createElement("article");

    card.className =
        "announcement-card";


    /* =====================================================
       ФОТО
    ===================================================== */

    const imageBlock =
        document.createElement("div");

    imageBlock.className =
        "announcement-image";


    const imageUrl =
        getAnnouncementImageUrl(item.image);


    if (imageUrl) {

        const image =
            document.createElement("img");

        image.src =
            imageUrl;

        image.alt =
            item.title || "Оголошення";

        image.loading =
            "lazy";


        image.onerror =
            function () {

                image.remove();

                const noImage =
                    document.createElement("div");

                noImage.className =
                    "announcement-no-image";

                noImage.innerHTML =
                    '<i class="bi bi-image"></i>';

                imageBlock.appendChild(
                    noImage
                );

            };


        imageBlock.appendChild(
            image
        );

    } else {

        const noImage =
            document.createElement("div");

        noImage.className =
            "announcement-no-image";

        noImage.innerHTML =
            '<i class="bi bi-image"></i>';

        imageBlock.appendChild(
            noImage
        );

    }


    /* =====================================================
       ТІЛО КАРТКИ
    ===================================================== */

    const body =
        document.createElement("div");

    body.className =
        "announcement-body";


    /* =====================================================
       НАЗВА
    ===================================================== */

    const title =
        document.createElement("h3");

    title.className =
        "announcement-title";

    title.textContent =
        item.title || "Без назви";


    /* =====================================================
       ОПИС
    ===================================================== */

    const description =
        document.createElement("p");

    description.className =
        "announcement-description";

    description.textContent =
        item.description || "Опис відсутній";


    /* =====================================================
       ЦІНА
    ===================================================== */

    const price =
        document.createElement("div");

    price.className =
        "announcement-price";

    price.textContent =
        `${formatHomePrice(item.price)} грн`;


    /* =====================================================
       META
    ===================================================== */

    const meta =
        document.createElement("div");

    meta.className =
        "announcement-meta";


    /* КАТЕГОРІЯ */

    const category =
        document.createElement("span");

    category.className =
        "announcement-badge";

    category.innerHTML =
        `
            <i class="bi bi-grid me-1"></i>
            ${getCategoryName(item.category)}
        `;


    /* СТАН */

    const condition =
        document.createElement("span");

    condition.className =
        "announcement-badge";

    condition.innerHTML =
        `
            <i class="bi bi-box-seam me-1"></i>
            ${getConditionName(item.condition)}
        `;


    /* МІСТО */

    const city =
        document.createElement("span");

    city.className =
        "announcement-badge";

    city.innerHTML =
        `
            <i class="bi bi-geo-alt me-1"></i>
            ${item.city || "Місто не вказано"}
        `;


    meta.append(
        category,
        condition,
        city
    );


    /* =====================================================
       ПРОДАВЕЦЬ
    ===================================================== */

    const seller =
        document.createElement("div");

    seller.className =
        "announcement-seller";

    seller.innerHTML =
        `
            <i class="bi bi-person me-1"></i>
            Продавець:
            ${item.seller_name || "Не вказано"}
        `;


    /* =====================================================
       КНОПКА
    ===================================================== */

    const button =
        document.createElement("a");

    button.href =
        "announcements.html";

    button.className =
        "btn btn-orange w-100 mt-3";

    button.innerHTML =
        `
            <i class="bi bi-megaphone me-2"></i>
            Переглянути оголошення
        `;


    /* =====================================================
       ЗБИРАЄМО КАРТКУ
    ===================================================== */

    body.append(
        title,
        description,
        price,
        meta,
        seller,
        button
    );


    card.append(
        imageBlock,
        body
    );


    column.appendChild(
        card
    );


    return column;

}


/* =========================================================
   ПОКАЗ ПОМИЛКИ
========================================================= */

function showHomeAnnouncementsError(message) {

    if (!homeAnnouncements) {
        return;
    }


    homeAnnouncements.innerHTML = `

        <div class="col-12">

            <div class="alert alert-danger">

                <i class="bi bi-exclamation-triangle me-2"></i>

                ${message}

            </div>

        </div>

    `;

}


/* =========================================================
   ПОКАЗ ПУСТОГО СПИСКУ
========================================================= */

function showEmptyAnnouncements() {

    if (!homeAnnouncements) {
        return;
    }


    homeAnnouncements.innerHTML = `

        <div class="col-12">

            <div class="text-center py-5">

                <div
                    class="mb-3"
                    style="font-size: 45px;"
                >

                    <i class="bi bi-megaphone"></i>

                </div>


                <h3>
                    Оголошень поки немає
                </h3>


                <p class="text-light opacity-75">

                    Станьте першим,
                    хто додасть оголошення.

                </p>


                <a
                    href="announcements.html"
                    class="btn btn-orange"
                >

                    <i class="bi bi-plus-lg me-2"></i>

                    Додати оголошення

                </a>

            </div>

        </div>

    `;

}


/* =========================================================
   ЗАВАНТАЖЕННЯ ОГОЛОШЕНЬ
========================================================= */

async function loadHomeAnnouncements() {

    if (!homeAnnouncements) {
        return;
    }


    /*
     * Показуємо індикатор завантаження
     */

    homeAnnouncements.innerHTML = `

        <div class="col-12">

            <div class="text-center py-5">

                <div
                    class="spinner-border"
                    role="status"
                >

                    <span class="visually-hidden">
                        Завантаження...
                    </span>

                </div>


                <p class="mt-3 text-light opacity-75">

                    Завантаження оголошень...

                </p>

            </div>

        </div>

    `;


    try {

        console.log(
            "Завантаження оголошень:",
            HOME_ANNOUNCEMENTS_URL
        );


        const response =
            await fetch(
                HOME_ANNOUNCEMENTS_URL,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


        console.log(
            "Статус API:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Дані оголошень:",
            data
        );


        /*
         * Django REST Framework може
         * повернути або масив,
         * або:
         *
         * {
         *     "count": 10,
         *     "results": [...]
         * }
         */

        const announcements =
            Array.isArray(data)
                ? data
                : Array.isArray(data.results)
                    ? data.results
                    : [];


        console.log(
            "Кількість оголошень:",
            announcements.length
        );


        /*
         * Немає оголошень
         */

        if (
            announcements.length === 0
        ) {

            showEmptyAnnouncements();

            return;

        }


        /*
         * Очищаємо loading
         */

        homeAnnouncements.innerHTML =
            "";


        /*
         * Максимум 6 оголошень
         */

        const latest =
            announcements.slice(0, 6);


        latest.forEach(
            item => {

                homeAnnouncements.appendChild(
                    createHomeAnnouncement(item)
                );

            }
        );


    } catch (error) {

        console.error(
            "Помилка завантаження оголошень:",
            error
        );


        showHomeAnnouncementsError(
            `
                Не вдалося завантажити оголошення.
                <br>
                Перевірте, чи запущений
                Django-сервер.
                <br><br>
                <small>
                    ${error.message}
                </small>
            `
        );

    }

}


/* =========================================================
   ЗАПУСК
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadHomeAnnouncements();

    }
);