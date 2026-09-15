const HOME_ANNOUNCEMENTS_URL =
    "http://127.0.0.1:8000/api/announcements/";


const homeAnnouncements =
    document.getElementById("homeAnnouncements");


function formatHomePrice(price) {

    return Number(price).toLocaleString("uk-UA", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

}


function getCategoryName(category) {

    const categories = {
        computers: "Комп'ютери",
        phones: "Телефони",
        laptops: "Ноутбуки",
        accessories: "Аксесуари",
        gaming: "Ігрова техніка",
        other: "Інше"
    };

    return categories[category] || category;

}


function getConditionName(condition) {

    return condition === "new"
        ? "Новий"
        : "Вживаний";

}


function createHomeAnnouncement(item) {

    const column =
        document.createElement("div");

    column.className =
        "col-12 col-sm-6 col-lg-4";


    const card =
        document.createElement("div");

    card.className =
        "announcement-card";


    /* =====================================
       ФОТО
    ===================================== */

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


    /* =====================================
       ТІЛО КАРТКИ
    ===================================== */

    const body =
        document.createElement("div");

    body.className =
        "announcement-body";


    /* Назва */

    const title =
        document.createElement("h3");

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
        `${formatHomePrice(item.price)} грн`;


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
        getCategoryName(item.category);


    const condition =
        document.createElement("span");

    condition.className =
        "announcement-badge";

    condition.textContent =
        getConditionName(item.condition);


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


    /* Кнопка */

    const button =
        document.createElement("a");

    button.href =
        "announcements.html";

    button.className =
        "btn btn-orange w-100 mt-3";

    button.textContent =
        "Переглянути оголошення";


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


    column.appendChild(card);


    return column;

}


async function loadHomeAnnouncements() {

    try {

        const response =
            await fetch(
                HOME_ANNOUNCEMENTS_URL
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        const announcements =
            Array.isArray(data)
                ? data
                : data.results || [];


        homeAnnouncements.innerHTML = "";


        if (!announcements.length) {

            homeAnnouncements.innerHTML = `
                <div class="col-12">
                    <div class="text-center py-5">
                        <div style="font-size: 45px;">
                            📢
                        </div>

                        <h3 class="mt-3">
                            Оголошень поки немає
                        </h3>

                        <p class="text-light">
                            Станьте першим, хто додасть оголошення.
                        </p>

                        <a
                            href="announcements.html"
                            class="btn btn-orange"
                        >
                            Додати оголошення
                        </a>
                    </div>
                </div>
            `;

            return;

        }


        /*
         * Беремо максимум 6 останніх оголошень
         */

        const latest =
            announcements.slice(0, 6);


        latest.forEach(item => {

            homeAnnouncements.appendChild(
                createHomeAnnouncement(item)
            );

        });


    } catch (error) {

        console.error(
            "Помилка завантаження оголошень:",
            error
        );


        homeAnnouncements.innerHTML = `
            <div class="col-12">

                <div class="alert alert-danger">

                    Не вдалося завантажити оголошення.

                    <br>

                    Перевірте, чи запущений
                    Django-сервер.

                </div>

            </div>
        `;

    }

}


/* ==========================================
   ЗАПУСК
========================================== */

loadHomeAnnouncements();