/* =========================================================
   VILKA — PROFILE
========================================================= */

document.addEventListener("DOMContentLoaded", async function () {

    const loadingElement =
        document.getElementById("profileLoading");

    const contentElement =
        document.getElementById("profileContent");

    const errorElement =
        document.getElementById("profileError");

    const profileForm =
        document.getElementById("profileForm");

    const logoutButton =
        document.getElementById("logoutButton");

    const saveButton =
        document.getElementById("saveProfileButton");

    const saveButtonText =
        document.getElementById("saveProfileText");

    const saveSpinner =
        document.getElementById("saveProfileSpinner");

    const saveSuccess =
        document.getElementById("saveSuccess");

    const saveError =
        document.getElementById("saveError");


    /* =====================================================
       ПЕРЕВІРКА АВТОРИЗАЦІЇ
    ===================================================== */

    if (!window.VilkaAuth || !VilkaAuth.isLoggedIn()) {

        sessionStorage.setItem(
            "vilkaLoginRedirect",
            "profile.html"
        );

        window.location.href = "login.html";

        return;
    }


    /* =====================================================
       ЗАВАНТАЖЕННЯ ПРОФІЛЮ
    ===================================================== */

    let user;

    try {

        user = await VilkaAuth.loadUser();

        if (!user) {

            sessionStorage.setItem(
                "vilkaLoginRedirect",
                "profile.html"
            );

            window.location.href =
                "login.html";

            return;
        }

    } catch (error) {

        console.error(
            "Помилка завантаження профілю:",
            error
        );

        loadingElement.classList.add("d-none");

        errorElement.textContent =
            "Не вдалося завантажити профіль.";

        errorElement.classList.remove("d-none");

        return;
    }


    /* =====================================================
       ВІДОБРАЖЕННЯ ДАНИХ
    ===================================================== */

    fillProfile(user);


    loadingElement.classList.add("d-none");

    contentElement.classList.remove("d-none");


    /* =====================================================
       ЗБЕРЕЖЕННЯ
    ===================================================== */

    profileForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            saveSuccess.classList.add("d-none");
            saveError.classList.add("d-none");


            const data = {

                first_name:
                    document
                        .getElementById("firstName")
                        .value
                        .trim(),

                last_name:
                    document
                        .getElementById("lastName")
                        .value
                        .trim(),

                email:
                    document
                        .getElementById("email")
                        .value
                        .trim(),

                profile: {

                    phone:
                        document
                            .getElementById("phone")
                            .value
                            .trim(),

                    city:
                        document
                            .getElementById("city")
                            .value
                            .trim()

                }

            };


            saveButton.disabled = true;

            saveButtonText.textContent =
                "Збереження...";

            saveSpinner.classList.remove(
                "d-none"
            );


            try {

                const updatedUser =
                    await apiRequest(
                        `${AUTH_BASE}/me/`,
                        {
                            method: "PATCH",

                            body: JSON.stringify(
                                data
                            )
                        }
                    );


                /* Зберігаємо оновленого користувача */

                localStorage.setItem(
                    "vilkaUser",
                    JSON.stringify(updatedUser)
                );


                /* Оновлюємо сторінку */

                fillProfile(
                    updatedUser
                );


                saveSuccess.classList.remove(
                    "d-none"
                );


            } catch (error) {

                console.error(
                    "Помилка збереження профілю:",
                    error
                );


                saveError.innerHTML =
                    getApiErrorMessage(
                        error
                    );

                saveError.classList.remove(
                    "d-none"
                );


            } finally {

                saveButton.disabled = false;

                saveButtonText.innerHTML =
                    '<i class="bi bi-check2 me-2"></i>Зберегти зміни';

                saveSpinner.classList.add(
                    "d-none"
                );

            }

        }
    );


    /* =====================================================
       LOGOUT
    ===================================================== */

    logoutButton.addEventListener(
        "click",
        async function () {

            logoutButton.disabled = true;

            logoutButton.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2"></span>Вихід...';

            await VilkaAuth.logout();

        }
    );

});


/* =========================================================
   ЗАПОВНЕННЯ ПРОФІЛЮ
========================================================= */

function fillProfile(user) {

    if (!user) {
        return;
    }


    const profile =
        user.profile || {};


    /* =====================================================
       FORM
    ===================================================== */

    const username =
        document.getElementById("username");

    const firstName =
        document.getElementById("firstName");

    const lastName =
        document.getElementById("lastName");

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    const city =
        document.getElementById("city");


    if (username) {
        username.value =
            user.username || "";
    }

    if (firstName) {
        firstName.value =
            user.first_name || "";
    }

    if (lastName) {
        lastName.value =
            user.last_name || "";
    }

    if (email) {
        email.value =
            user.email || "";
    }

    if (phone) {
        phone.value =
            profile.phone || "";
    }

    if (city) {
        city.value =
            profile.city || "";
    }


    /* =====================================================
       LEFT PROFILE CARD
    ===================================================== */

    const fullName =
        document.getElementById(
            "profileFullName"
        );

    const usernameElement =
        document.getElementById(
            "profileUsername"
        );

    const emailElement =
        document.getElementById(
            "profileEmail"
        );

    const phoneElement =
        document.getElementById(
            "profilePhone"
        );

    const cityElement =
        document.getElementById(
            "profileCity"
        );


    const fullNameText =
        `${user.first_name || ""} ${user.last_name || ""}`
            .trim();


    if (fullName) {

        fullName.textContent =
            fullNameText ||
            user.username ||
            "Користувач";
    }


    if (usernameElement) {

        usernameElement.textContent =
            `@${user.username || ""}`;
    }


    if (emailElement) {

        emailElement.textContent =
            user.email || "Не вказано";
    }


    if (phoneElement) {

        phoneElement.textContent =
            profile.phone ||
            "Не вказано";
    }


    if (cityElement) {

        cityElement.textContent =
            profile.city ||
            "Не вказано";
    }

}