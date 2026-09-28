document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // API
    // =========================================================

    const API_BASE = "http://127.0.0.1:8000/api";

    const ANNOUNCEMENTS_URL =
        `${API_BASE}/announcements/`;


    // =========================================================
    // ЕЛЕМЕНТИ СТОРІНКИ
    // =========================================================

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


    // =========================================================
    // ЦІНА
    // =========================================================

    function formatPrice(price) {

        return Number(price).toLocaleString("uk-UA", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });

    }


    // =========================================================
    // КОШИК
    // =========================================================

    function getCart() {

        try {

            const savedCart =
                JSON.parse(
                    localStorage.getItem("cart")
                );

            if (!savedCart) {
                return {};
            }

            return savedCart;

        } catch (error) {

            console.error(
                "Помилка читання кошика:",
                error
            );

            return {};

        }

    }


    function updateCartCount() {

        if (!cartCount) {
            return;
        }

        const cart =
            getCart();


        /*
         * Формат кошика:
         *
         * {
         *     "1": 2,
         *     "3": 1,
         *     "7": 4
         * }
         */

        let count = 0;


        Object.values(cart).forEach(quantity => {

            const number =
                Number(quantity);

            if (!Number.isNaN(number)) {
                count += number;
            }

        });


        cartCount.textContent =
            count;

    }


    // =========================================================
    // ФОРМА СТВОРЕННЯ
    // =========================================================

    function showCreateForm() {

        if (!createAnnouncement) {
            return;
        }

        createAnnouncement.classList.remove(
            "d-none"
        );


        if (formError) {

            formError.classList.add(
                "d-none"
            );

            formError.textContent = "";

        }


        createAnnouncement.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    function hideCreateForm() {

        if (!createAnnouncement) {
            return;
        }

        createAnnouncement.classList.add(
            "d-none"
        );


        if (formError) {

            formError.classList.add(
                "d-none"
            );

            formError.textContent = "";

        }


        if (announcementForm) {
            announcementForm.reset();
        }

    }


    // =========================================================
    // НАЗВИ КАТЕГОРІЙ
    // =========================================================

    function categoryName(value) {

        const categories = {

            computers: "Комп'ютери",

            phones: "Телефони",

            laptops: "Ноутбуки",

            accessories: "Аксесуари",

            gaming: "Ігрова техніка",

            other: "Інше"

        };


        return categories[value] || value || "Інше";

    }


    // =========================================================
    // СТАН ТОВАРУ
    // =========================================================

    function conditionName(value) {

        if (value === "new") {
            return "Новий";
        }

        if (value === "used") {
            return "Вживаний";
        }

        return value || "Не вказано";

    }


    // =========================================================
    // ДАТА
    // =========================================================

    function formatDate(dateString) {

        if (!dateString) {
            return "";
        }


        const date =
            new Date(dateString);


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


    // =========================================================
    // BOOTSTRAP ICON
    // =========================================================

    function createIcon(
        iconClass,
        extraClass = ""
    ) {

        const icon =
            document.createElement("i");

        icon.className =
            `bi ${iconClass} ${extraClass}`.trim();

        return icon;

    }


    // =========================================================
    // СТВОРЕННЯ КАРТКИ ОГОЛОШЕННЯ
    // =========================================================

    function createAnnouncementCard(item) {

        const column =
            document.createElement("div");

        column.className =
            "col-12 col-sm-6 col-lg-4";


        const card =
            document.createElement("article");

        card.className =
            "announcement-card";


        // =====================================================
        // ФОТО
        // =====================================================

        const imageBlock =
            document.createElement("div");

        imageBlock.className =
            "announcement-image";


        if (item.image) {

            const image =
                document.createElement("img");

            image.src =
                item.image;

            image.alt =
                item.title || "Товар";

            image.loading =
                "lazy";


            image.onerror = function () {

                image.remove();

                const noImage =
                    createNoImageBlock();

                imageBlock.appendChild(
                    noImage
                );

            };


            imageBlock.appendChild(
                image
            );

        } else {

            const noImage =
                createNoImageBlock();

            imageBlock.appendChild(
                noImage
            );

        }


        // =====================================================
        // ТІЛО КАРТКИ
        // =====================================================

        const body =
            document.createElement("div");

        body.className =
            "announcement-body";


        // =====================================================
        // НАЗВА
        // =====================================================

        const title =
            document.createElement("h2");

        title.className =
            "announcement-title";

        title.textContent =
            item.title || "Без назви";


        // =====================================================
        // ОПИС
        // =====================================================

        const description =
            document.createElement("p");

        description.className =
            "announcement-description";

        description.textContent =
            item.description || "Опис відсутній";


        // =====================================================
        // ЦІНА
        // =====================================================

        const price =
            document.createElement("div");

        price.className =
            "announcement-price";

        price.textContent =
            `${formatPrice(item.price)} грн`;


        // =====================================================
        // META
        // =====================================================

        const meta =
            document.createElement("div");

        meta.className =
            "announcement-meta";


        // Категорія

        const category =
            document.createElement("span");

        category.className =
            "announcement-badge";


        const categoryIcon =
            createIcon(
                "bi-grid",
                "me-1"
            );


        category.appendChild(
            categoryIcon
        );

        category.appendChild(
            document.createTextNode(
                categoryName(item.category)
            )
        );


        // Стан

        const condition =
            document.createElement("span");

        condition.className =
            "announcement-badge";


        const conditionIcon =
            createIcon(
                "bi-box-seam",
                "me-1"
            );


        condition.appendChild(
            conditionIcon
        );

        condition.appendChild(
            document.createTextNode(
                conditionName(item.condition)
            )
        );


        // Місто

        const city =
            document.createElement("span");

        city.className =
            "announcement-badge";


        const cityIcon =
            createIcon(
                "bi-geo-alt",
                "me-1"
            );


        city.appendChild(
            cityIcon
        );

        city.appendChild(
            document.createTextNode(
                item.city || "Місто не вказано"
            )
        );


        meta.append(
            category,
            condition,
            city
        );


        // =====================================================
        // ПРОДАВЕЦЬ
        // =====================================================

        const seller =
            document.createElement("div");

        seller.className =
            "announcement-seller";


        const sellerIcon =
            createIcon(
                "bi-person",
                "me-1"
            );


        seller.appendChild(
            sellerIcon
        );

        seller.appendChild(
            document.createTextNode(
                `Продавець: ${item.seller_name || "Не вказано"}`
            )
        );


        // =====================================================
        // ТЕЛЕФОН
        // =====================================================

        const phone =
            document.createElement("div");

        phone.className =
            "announcement-seller";


        const phoneIcon =
            createIcon(
                "bi-telephone",
                "me-1"
            );


        phone.appendChild(
            phoneIcon
        );

        phone.appendChild(
            document.createTextNode(
                item.phone || "Телефон не вказано"
            )
        );


        // =====================================================
        // ДАТА
        // =====================================================

        const date =
            document.createElement("div");

        date.className =
            "announcement-date";


        const dateIcon =
            createIcon(
                "bi-calendar3",
                "me-1"
            );


        date.appendChild(
            dateIcon
        );

        date.appendChild(
            document.createTextNode(
                `Опубліковано: ${formatDate(item.created_at)}`
            )
        );


        // =====================================================
        // ДОДАЄМО ЕЛЕМЕНТИ
        // =====================================================

        body.append(
            title,
            description,
            price,
            meta,
            seller,
            phone,
            date
        );

        // Керування власним оголошенням / адміністратором
        if (item.is_owner || item.is_admin) {
            const actions = document.createElement("div");
            actions.className = "d-flex gap-2 mt-3";

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "btn btn-sm btn-outline-secondary";
            editButton.innerHTML = '<i class="bi bi-pencil me-1"></i> Редагувати';
            editButton.addEventListener("click", async () => {
                const newTitle = prompt("Назва:", item.title);
                if (newTitle === null) return;
                const newPrice = prompt("Ціна:", item.price);
                if (newPrice === null) return;
                const newDescription = prompt("Опис:", item.description);
                if (newDescription === null) return;
                const token = window.VilkaAuth?.getToken?.();
                if (!token) return alert("Увійдіть в акаунт.");
                const response = await fetch(`${ANNOUNCEMENTS_URL}${item.id}/`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` },
                    body: JSON.stringify({ title: newTitle, price: newPrice, description: newDescription })
                });
                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    alert(data.detail || "Не вдалося відредагувати оголошення.");
                    return;
                }
                await loadAnnouncements();
            });

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "btn btn-sm btn-outline-danger";
            deleteButton.innerHTML = '<i class="bi bi-trash me-1"></i> Видалити';
            deleteButton.addEventListener("click", async () => {
                if (!confirm(`Видалити «${item.title}»?`)) return;
                const token = window.VilkaAuth?.getToken?.();
                if (!token) return alert("Увійдіть в акаунт.");
                const response = await fetch(`${ANNOUNCEMENTS_URL}${item.id}/delete/`, {
                    method: "DELETE",
                    headers: { "Authorization": `Token ${token}` }
                });
                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    alert(data.detail || "Не вдалося видалити оголошення.");
                    return;
                }
                await loadAnnouncements();
            });

            actions.append(editButton, deleteButton);
            body.appendChild(actions);
        }


        card.append(
            imageBlock,
            body
        );


        column.appendChild(
            card
        );


        return column;

    }


    // =========================================================
    // БЛОК БЕЗ ФОТО
    // =========================================================

    function createNoImageBlock() {

        const noImage =
            document.createElement("div");

        noImage.className =
            "announcement-no-image";


        const icon =
            createIcon(
                "bi-image"
            );


        noImage.appendChild(
            icon
        );


        return noImage;

    }


    // =========================================================
    // ВІДОБРАЖЕННЯ ОГОЛОШЕНЬ
    // =========================================================

    function renderAnnouncements(items) {

        if (!announcementsContainer) {
            return;
        }


        announcementsContainer.innerHTML =
            "";


        if (emptyAnnouncements) {

            emptyAnnouncements.classList.add(
                "d-none"
            );

        }


        // Якщо немає оголошень

        if (!items.length) {

            if (emptyAnnouncements) {

                emptyAnnouncements.classList.remove(
                    "d-none"
                );

            }

            return;

        }


        // Виводимо оголошення

        items.forEach(item => {

            announcementsContainer.appendChild(
                createAnnouncementCard(item)
            );

        });

    }


    // =========================================================
    // ЗАВАНТАЖЕННЯ ОГОЛОШЕНЬ
    // =========================================================

    async function loadAnnouncements() {

        // Показуємо loading

        if (loading) {

            loading.classList.remove(
                "d-none"
            );

            loading.textContent =
                "Завантаження оголошень...";

        }


        // Ховаємо стару помилку

        if (errorMessage) {

            errorMessage.classList.add(
                "d-none"
            );

            errorMessage.textContent =
                "";

        }


        try {

            console.log(
                "Завантаження оголошень:",
                ANNOUNCEMENTS_URL
            );


            const response =
                await fetch(
                    ANNOUNCEMENTS_URL,
                    {
                        method: "GET",
                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );


            console.log(
                "HTTP статус:",
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


            let items = [];


            // Django REST Framework:
            // { results: [...] }

            if (
                data &&
                Array.isArray(data.results)
            ) {

                items =
                    data.results;

            }

            // Звичайний масив:
            // [...]

            else if (
                Array.isArray(data)
            ) {

                items =
                    data;

            }

            // Інший формат

            else if (
                data &&
                Array.isArray(data.announcements)
            ) {

                items =
                    data.announcements;

            }


            renderAnnouncements(
                items
            );


        } catch (error) {

            console.error(
                "Помилка завантаження оголошень:",
                error
            );


            if (errorMessage) {

                errorMessage.textContent =
                    "Не вдалося завантажити оголошення. Перевірте, чи запущений Django-сервер та чи доступний API.";

                errorMessage.classList.remove(
                    "d-none"
                );

            }


            // При помилці прибираємо старий список

            if (announcementsContainer) {

                announcementsContainer.innerHTML =
                    "";

            }


        } finally {

            // =================================================
            // ГОЛОВНЕ ВИПРАВЛЕННЯ
            // Завжди прибираємо "Завантаження..."
            // =================================================

            if (loading) {

                loading.classList.add(
                    "d-none"
                );

            }

        }

    }


    // =========================================================
    // СТВОРЕННЯ ОГОЛОШЕННЯ
    // =========================================================

    async function createNewAnnouncement(event) {

        event.preventDefault();


        if (!announcementForm) {
            return;
        }


        if (formError) {

            formError.classList.add(
                "d-none"
            );

            formError.textContent =
                "";

        }


        if (submitAnnouncement) {

            submitAnnouncement.disabled =
                true;

            submitAnnouncement.innerHTML =
                `
                    <i class="bi bi-hourglass-split me-2"></i>
                    Публікація...
                `;

        }


        try {

            const formData =
                new FormData(
                    announcementForm
                );


            console.log(
                "Відправляємо оголошення..."
            );


            const token = window.VilkaAuth?.getToken?.();

            if (!token) {
                throw new Error("Щоб створити оголошення, увійдіть у свій акаунт.");
            }

            const response =
                await fetch(
                    `${ANNOUNCEMENTS_URL}create/`,
                    {
                        method: "POST",
                        headers: { "Authorization": `Token ${token}` },
                        body: formData
                    }
                );


            let data = {};


            try {

                data =
                    await response.json();

            } catch {

                data = {};

            }


            console.log(
                "Відповідь Django:",
                data
            );


            if (!response.ok) {

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

                            } else if (
                                value &&
                                typeof value === "object"
                            ) {

                                errors.push(
                                    `${field}: ${JSON.stringify(value)}`
                                );

                            }

                        }
                    );


                    if (errors.length) {

                        message =
                            errors.join("\n");

                    }

                }


                throw new Error(
                    message
                );

            }


            // =================================================
            // УСПІШНЕ СТВОРЕННЯ
            // =================================================

            announcementForm.reset();


            if (createAnnouncement) {

                createAnnouncement.classList.add(
                    "d-none"
                );

            }


            await loadAnnouncements();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


        } catch (error) {

            console.error(
                "Помилка створення оголошення:",
                error
            );


            if (formError) {

                formError.textContent =
                    error.message ||
                    "Сталася невідома помилка.";

                formError.classList.remove(
                    "d-none"
                );

            }

        } finally {

            if (submitAnnouncement) {

                submitAnnouncement.disabled =
                    false;

                submitAnnouncement.innerHTML =
                    `
                        <i class="bi bi-cloud-arrow-up me-2"></i>
                        Опублікувати оголошення
                    `;

            }

        }

    }


    // =========================================================
    // ПОШУК
    // =========================================================

    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Enter"
                ) {
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

    }


    // =========================================================
    // КНОПКА СТВОРЕННЯ
    // =========================================================

    if (showCreateButton) {

        showCreateButton.addEventListener(
            "click",
            () => {
                if (!window.VilkaAuth?.getToken?.()) {
                    alert("Щоб створити оголошення, спочатку увійдіть у свій акаунт.");
                    window.location.href = "login.html";
                    return;
                }
                showCreateForm();
            }
        );

    }


    // =========================================================
    // КНОПКА СТВОРЕННЯ В EMPTY
    // =========================================================

    if (emptyCreateButton) {

        emptyCreateButton.addEventListener(
            "click",
            showCreateForm
        );

    }


    // =========================================================
    // ЗАКРИТТЯ
    // =========================================================

    if (closeCreateButton) {

        closeCreateButton.addEventListener(
            "click",
            hideCreateForm
        );

    }


    // =========================================================
    // СКАСУВАННЯ
    // =========================================================

    if (cancelAnnouncement) {

        cancelAnnouncement.addEventListener(
            "click",
            hideCreateForm
        );

    }


    // =========================================================
    // SUBMIT
    // =========================================================

    if (announcementForm) {

        announcementForm.addEventListener(
            "submit",
            createNewAnnouncement
        );

    }


    // =========================================================
    // КОШИК
    // =========================================================

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "cart.html";

            }
        );

    }


    // =========================================================
    // ЗАПУСК
    // =========================================================

    updateCartCount();

    loadAnnouncements();

});