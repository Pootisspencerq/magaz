
/* =========================================================
   VILKA — ОСОБИСТИЙ КАБІНЕТ
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const profileLoading =
        document.getElementById("profileLoading");

    const profileError =
        document.getElementById("profileError");

    const profileContent =
        document.getElementById("profileContent");

    const profileForm =
        document.getElementById("profileForm");

    const logoutButton =
        document.getElementById("logoutButton");

    const saveProfileButton =
        document.getElementById("saveProfileButton");

    const saveProfileText =
        document.getElementById("saveProfileText");

    const saveProfileSpinner =
        document.getElementById("saveProfileSpinner");

    const saveSuccess =
        document.getElementById("saveSuccess");

    const saveError =
        document.getElementById("saveError");


    /* =====================================================
       API
    ===================================================== */

    const API_BASE = "http://127.0.0.1:8000/api";
    const AUTH_BASE = `${API_BASE}/accounts`;


    /* =====================================================
       CHECK AUTHORIZATION
    ===================================================== */

    if (
        !window.VilkaAuth ||
        !window.VilkaAuth.isLoggedIn()
    ) {

        sessionStorage.setItem(
            "vilkaLoginRedirect",
            "profile.html"
        );

        window.location.href = "login.html";

        return;
    }


    /* =====================================================
       SHOW / HIDE MESSAGES
    ===================================================== */

    function showError(message) {

        profileError.textContent = message;
        profileError.classList.remove("d-none");

    }


    function hideError() {

        profileError.textContent = "";
        profileError.classList.add("d-none");

    }


    function showSaveError(message) {

        saveError.textContent = message;
        saveError.classList.remove("d-none");

    }


    function hideSaveError() {

        saveError.textContent = "";
        saveError.classList.add("d-none");

    }


    function hideSaveSuccess() {

        saveSuccess.classList.add("d-none");

    }


    /* =====================================================
       FORMAT USER DATA
    ===================================================== */

    function getFullName(user) {

        const firstName =
            user.first_name || "";

        const lastName =
            user.last_name || "";

        const fullName =
            `${firstName} ${lastName}`.trim();

        return fullName || user.username || "Користувач";

    }


    function getProfileValue(user, field) {

        if (
            user.profile &&
            user.profile[field] !== undefined &&
            user.profile[field] !== null
        ) {
            return user.profile[field];
        }

        return "";

    }


    /* =====================================================
       FILL PROFILE
    ===================================================== */

    function fillProfile(user) {

        if (!user) {
            return;
        }

        /*
         * Ліва картка профілю
         */

        document.getElementById(
            "profileFullName"
        ).textContent = getFullName(user);


        document.getElementById(
            "profileUsername"
        ).textContent = `@${user.username || ""}`;


        document.getElementById(
            "profileEmail"
        ).textContent = user.email || "Не вказано";


        document.getElementById(
            "profilePhone"
        ).textContent =
            getProfileValue(user, "phone") || "Не вказано";


        document.getElementById(
            "profileCity"
        ).textContent =
            getProfileValue(user, "city") || "Не вказано";


        /*
         * Форма редагування
         */

        document.getElementById(
            "username"
        ).value = user.username || "";


        document.getElementById(
            "firstName"
        ).value = user.first_name || "";


        document.getElementById(
            "lastName"
        ).value = user.last_name || "";


        document.getElementById(
            "email"
        ).value = user.email || "";


        document.getElementById(
            "phone"
        ).value = getProfileValue(user, "phone");


        document.getElementById(
            "city"
        ).value = getProfileValue(user, "city");

    }


    /* =====================================================
       LOAD PROFILE
    ===================================================== */

    async function loadProfile() {

        hideError();

        profileLoading.classList.remove("d-none");
        profileContent.classList.add("d-none");

        try {

            /*
             * Завантажуємо актуальні дані
             * через наявну функцію auth.js.
             */

            const user =
                await window.VilkaAuth.loadUser();

            if (!user) {

                sessionStorage.setItem(
                    "vilkaLoginRedirect",
                    "profile.html"
                );

                window.location.href = "login.html";

                return;
            }

            fillProfile(user);

            profileLoading.classList.add("d-none");
            profileContent.classList.remove("d-none");

        } catch (error) {

            console.error(
                "Помилка завантаження профілю:",
                error
            );

            profileLoading.classList.add("d-none");

            showError(
                "Не вдалося завантажити профіль. Перевірте з'єднання із сервером."
            );

        }

    }


    /* =====================================================
       SAVE PROFILE
    ===================================================== */

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                hideSaveError();
                hideSaveSuccess();


                /*
                 * Отримуємо дані з форми
                 */

                const firstName =
                    document.getElementById(
                        "firstName"
                    ).value.trim();


                const lastName =
                    document.getElementById(
                        "lastName"
                    ).value.trim();


                const email =
                    document.getElementById(
                        "email"
                    ).value.trim();


                const phone =
                    document.getElementById(
                        "phone"
                    ).value.trim();


                const city =
                    document.getElementById(
                        "city"
                    ).value.trim();


                /*
                 * Перевірка email
                 */

                if (!email) {

                    showSaveError(
                        "Будь ласка, введіть email."
                    );

                    return;
                }


                /*
                 * Перевірка авторизації
                 */

                if (!window.VilkaAuth.getToken()) {

                    showSaveError(
                        "Ваша сесія завершилася. Увійдіть знову."
                    );

                    return;
                }


                /*
                 * Блокуємо кнопку
                 */

                saveProfileButton.disabled = true;

                saveProfileText.textContent =
                    "Збереження...";

                saveProfileSpinner.classList.remove(
                    "d-none"
                );


                try {

                    /*
                     * PATCH-запит до Django REST API.
                     *
                     * Використовуємо apiRequest()
                     * з auth.js, щоб автоматично
                     * передати токен і обробити помилки.
                     */

                    const data = await apiRequest(
                        `${AUTH_BASE}/me/`,
                        {
                            method: "PATCH",

                            body: JSON.stringify({

                                first_name: firstName,

                                last_name: lastName,

                                email: email,

                                profile: {
                                    phone: phone,
                                    city: city
                                }

                            })
                        }
                    );


                    /*
                     * Зберігаємо актуальні дані
                     * користувача в localStorage.
                     */

                    saveCurrentUser(data);


                    /*
                     * Оновлюємо інформацію
                     * на сторінці.
                     */

                    fillProfile(data);


                    /*
                     * Оновлюємо ім'я у шапці.
                     */

                    await window.VilkaAuth.updateHeader();


                    /*
                     * Повідомлення про успіх.
                     */

                    saveSuccess.textContent =
                        "Дані успішно збережено.";

                    saveSuccess.classList.remove(
                        "d-none"
                    );


                } catch (error) {

                    console.error(
                        "Помилка збереження профілю:",
                        error
                    );

                    /*
                     * Форматуємо помилку
                     * через функцію з auth.js.
                     */

                    const message =
                        typeof getApiErrorMessage === "function"
                            ? getApiErrorMessage(error)
                            : error.message ||
                              "Сталася помилка під час збереження.";

                    showSaveError(message);

                } finally {

                    /*
                     * Повертаємо кнопку
                     */

                    saveProfileButton.disabled = false;

                    saveProfileText.innerHTML =
                        '<i class="bi bi-check2 me-2"></i>Зберегти зміни';

                    saveProfileSpinner.classList.add(
                        "d-none"
                    );

                }

            }
        );

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async function () {

                const confirmed = confirm(
                    "Ви дійсно хочете вийти з акаунта?"
                );

                if (!confirmed) {
                    return;
                }

                logoutButton.disabled = true;

                logoutButton.innerHTML = `
                    <span
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                    ></span>
                    Вихід...
                `;

                try {

                    /*
                     * Використовуємо logout
                     * із наявного auth.js.
                     *
                     * Функція сама очистить токен
                     * і перенаправить на index.html.
                     */

                    await window.VilkaAuth.logout();

                } catch (error) {

                    console.error(
                        "Помилка виходу:",
                        error
                    );

                    logoutButton.disabled = false;

                    logoutButton.innerHTML = `
                        <i class="bi bi-box-arrow-right me-2"></i>
                        Вийти з акаунта
                    `;

                }

            }
        );

    }


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    loadProfile();

});