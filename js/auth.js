const API_BASE = "http://127.0.0.1:8000/api";
const AUTH_BASE = `${API_BASE}/accounts`;


/* ========================================
   TOKEN
======================================== */

function getAuthToken() {
    return localStorage.getItem("vilkaToken");
}


function saveAuthToken(token) {
    localStorage.setItem("vilkaToken", token);
}


function removeAuthToken() {
    localStorage.removeItem("vilkaToken");
}


function getCurrentUser() {
    const user = localStorage.getItem("vilkaUser");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}


function saveCurrentUser(user) {
    localStorage.setItem(
        "vilkaUser",
        JSON.stringify(user)
    );
}


function removeCurrentUser() {
    localStorage.removeItem("vilkaUser");
}


/* ========================================
   API
======================================== */

async function apiRequest(
    url,
    options = {}
) {
    const token = getAuthToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }

    const response = await fetch(
        url,
        {
            ...options,
            headers
        }
    );

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {

        const error = new Error(
            data?.detail ||
            "Сталася помилка."
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}


/* ========================================
   ERROR MESSAGE
======================================== */

function getApiErrorMessage(error) {

    if (!error) {
        return "Сталася невідома помилка.";
    }

    const data = error.data;

    if (typeof data === "string") {
        return data;
    }

    if (data && typeof data === "object") {

        const messages = [];

        Object.entries(data).forEach(
            ([field, value]) => {

                if (Array.isArray(value)) {

                    value.forEach(message => {
                        messages.push(
                            `${getFieldName(field)}: ${message}`
                        );
                    });

                } else {

                    messages.push(
                        `${getFieldName(field)}: ${value}`
                    );

                }

            }
        );

        if (messages.length) {
            return messages.join("<br>");
        }
    }

    return error.message ||
        "Сталася помилка.";
}


function getFieldName(field) {

    const names = {
        username: "Логін",
        email: "Email",
        first_name: "Ім'я",
        last_name: "Прізвище",
        password: "Пароль",
        password_confirm: "Підтвердження пароля",
        phone: "Телефон",
        city: "Місто"
    };

    return names[field] || field;
}


/* ========================================
   LOGIN
======================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

            const errorElement =
                document.getElementById(
                    "loginError"
                );

            const button =
                document.getElementById(
                    "loginButton"
                );

            const buttonText =
                document.getElementById(
                    "loginButtonText"
                );

            const spinner =
                document.getElementById(
                    "loginSpinner"
                );


            errorElement.classList.add(
                "d-none"
            );

            errorElement.innerHTML = "";


            button.disabled = true;

            buttonText.textContent =
                "Вхід...";

            spinner.classList.remove(
                "d-none"
            );


            try {

                const data =
                    await apiRequest(
                        `${AUTH_BASE}/login/`,
                        {
                            method: "POST",

                            body: JSON.stringify({
                                username,
                                password
                            })
                        }
                    );


                saveAuthToken(
                    data.token
                );

                saveCurrentUser(
                    data.user
                );


                buttonText.textContent =
                    "Успішно!";


                /*
                 * Повертаємо користувача
                 * на попередню сторінку,
                 * якщо вона була перед входом.
                 */

                const redirect =
                    sessionStorage.getItem(
                        "vilkaLoginRedirect"
                    );


                sessionStorage.removeItem(
                    "vilkaLoginRedirect"
                );


                setTimeout(
                    function () {

                        if (redirect) {
                            window.location.href =
                                redirect;
                        } else {
                            window.location.href =
                                "index.html";
                        }

                    },
                    500
                );


            } catch (error) {

                console.error(
                    "Помилка входу:",
                    error
                );


                errorElement.innerHTML =
                    getApiErrorMessage(
                        error
                    );

                errorElement.classList.remove(
                    "d-none"
                );


                button.disabled = false;

                buttonText.textContent =
                    "Увійти";

                spinner.classList.add(
                    "d-none"
                );
            }

        }
    );

}


/* ========================================
   REGISTER
======================================== */

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const errorElement =
                document.getElementById(
                    "registerError"
                );

            const successElement =
                document.getElementById(
                    "registerSuccess"
                );


            errorElement.classList.add(
                "d-none"
            );

            successElement.classList.add(
                "d-none"
            );


            const formData =
                new FormData(
                    registerForm
                );


            const data = {

                username:
                    formData.get(
                        "username"
                    ).trim(),

                email:
                    formData.get(
                        "email"
                    ).trim(),

                first_name:
                    formData.get(
                        "first_name"
                    ).trim(),

                last_name:
                    formData.get(
                        "last_name"
                    ).trim(),

                password:
                    formData.get(
                        "password"
                    ),

                password_confirm:
                    formData.get(
                        "password_confirm"
                    ),

                phone:
                    formData.get(
                        "phone"
                    ).trim(),

                city:
                    formData.get(
                        "city"
                    ).trim()

            };


            if (
                data.password !==
                data.password_confirm
            ) {

                errorElement.innerHTML =
                    "Паролі не збігаються.";

                errorElement.classList.remove(
                    "d-none"
                );

                return;
            }


            const button =
                document.getElementById(
                    "registerButton"
                );

            const buttonText =
                document.getElementById(
                    "registerButtonText"
                );

            const spinner =
                document.getElementById(
                    "registerSpinner"
                );


            button.disabled = true;

            buttonText.textContent =
                "Реєстрація...";

            spinner.classList.remove(
                "d-none"
            );


            try {

                const response =
                    await apiRequest(
                        `${AUTH_BASE}/register/`,
                        {
                            method: "POST",

                            body: JSON.stringify(
                                data
                            )
                        }
                    );


                /*
                 * Django одразу повертає
                 * token після реєстрації.
                 */

                saveAuthToken(
                    response.token
                );

                saveCurrentUser(
                    response.user
                );


                successElement.innerHTML =
                    "Реєстрацію успішно завершено! Перенаправлення...";

                successElement.classList.remove(
                    "d-none"
                );


                registerForm.reset();


                setTimeout(
                    function () {
                        window.location.href =
                            "index.html";
                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Помилка реєстрації:",
                    error
                );


                errorElement.innerHTML =
                    getApiErrorMessage(
                        error
                    );

                errorElement.classList.remove(
                    "d-none"
                );


                button.disabled = false;

                buttonText.textContent =
                    "Зареєструватися";

                spinner.classList.add(
                    "d-none"
                );
            }

        }
    );

}


/* ========================================
   PASSWORD TOGGLE
======================================== */

document
    .querySelectorAll(
        ".password-toggle"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const targetId =
                        button.dataset.target ||
                        "password";

                    const input =
                        document.getElementById(
                            targetId
                        );

                    if (!input) {
                        return;
                    }


                    if (
                        input.type ===
                        "password"
                    ) {

                        input.type =
                            "text";

                        button.innerHTML =
                            '<i class="bi bi-eye-slash"></i>';

                    } else {

                        input.type =
                            "password";

                        button.innerHTML =
                            '<i class="bi bi-eye"></i>';
                    }

                }
            );

        }
    );


/* ========================================
   GLOBAL AUTH HELPERS
======================================== */

async function logoutUser() {

    const token =
        getAuthToken();


    try {

        if (token) {

            await apiRequest(
                `${AUTH_BASE}/logout/`,
                {
                    method: "POST"
                }
            );

        }

    } catch (error) {

        console.warn(
            "Не вдалося виконати logout на сервері:",
            error
        );

    } finally {

        removeAuthToken();

        removeCurrentUser();

        window.location.href =
            "index.html";
    }
}


async function loadCurrentUser() {

    if (!getAuthToken()) {
        return null;
    }


    try {

        const user =
            await apiRequest(
                `${AUTH_BASE}/me/`
            );


        saveCurrentUser(
            user
        );


        return user;

    } catch (error) {

        console.warn(
            "Токен недійсний:",
            error
        );


        removeAuthToken();

        removeCurrentUser();

        return null;
    }
}


/* ========================================
   HEADER AUTH STATE
======================================== */

async function updateAuthHeader() {

    const token =
        getAuthToken();


    const loginButtons =
        document.querySelectorAll(
            ".header-login-button"
        );


    if (!token) {

        loginButtons.forEach(
            button => {
                button.innerHTML =
                    '<i class="bi bi-person"></i> Увійти';

                button.href =
                    "login.html";
            }
        );

        return;
    }


    const user =
        getCurrentUser();


    if (!user) {

        await loadCurrentUser();
    }


    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    loginButtons.forEach(
        button => {

            button.innerHTML =
                `
                <i class="bi bi-person-circle"></i>
                ${currentUser.first_name || currentUser.username}
                `;

            button.href =
                "profile.html";
        }
    );
}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateAuthHeader();

    }
);


/* ========================================
   EXPORT GLOBAL FUNCTIONS
======================================== */

window.VilkaAuth = {

    getToken: getAuthToken,

    getUser: getCurrentUser,

    isLoggedIn: function () {
        return Boolean(
            getAuthToken()
        );
    },

    logout: logoutUser,

    loadUser: loadCurrentUser

};