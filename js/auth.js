/* ========================================
   VILKA AUTH CONFIGURATION
======================================== */

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


/* ========================================
   CURRENT USER
======================================== */

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
   API REQUEST
======================================== */

async function apiRequest(url, options = {}) {

    const token = getAuthToken();

    const headers = {
        ...(options.headers || {})
    };

    // Не встановлюємо Content-Type для FormData.
    // Браузер сам додасть правильний multipart boundary.

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

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

function getFieldName(field) {

    const names = {
        username: "Логін",
        email: "Email",
        first_name: "Ім'я",
        last_name: "Прізвище",
        password: "Пароль",
        password_confirm: "Підтвердження пароля",
        phone: "Телефон",
        city: "Місто",
        non_field_errors: "Помилка",
        detail: "Помилка"
    };

    return names[field] || field;
}


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

        Object.entries(data).forEach(([field, value]) => {

            if (Array.isArray(value)) {

                value.forEach(message => {

                    messages.push(
                        `${getFieldName(field)}: ${message}`
                    );

                });

            } else if (typeof value === "object" && value !== null) {

                Object.entries(value).forEach(([nestedField, nestedValue]) => {

                    if (Array.isArray(nestedValue)) {

                        nestedValue.forEach(message => {

                            messages.push(
                                `${getFieldName(nestedField)}: ${message}`
                            );

                        });

                    } else {

                        messages.push(
                            `${getFieldName(nestedField)}: ${nestedValue}`
                        );

                    }

                });

            } else {

                messages.push(
                    `${getFieldName(field)}: ${value}`
                );

            }

        });

        if (messages.length) {
            return messages.join("\n");
        }
    }

    return error.message || "Сталася помилка.";
}


/* ========================================
   DISPLAY API ERROR
======================================== */

function showApiError(element, error) {

    if (!element) {
        console.error(error);
        return;
    }

    element.textContent = getApiErrorMessage(error);

    element.classList.remove("d-none");
}


/* ========================================
   LOGIN
======================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");

        const errorElement = document.getElementById("loginError");
        const button = document.getElementById("loginButton");
        const buttonText = document.getElementById("loginButtonText");
        const spinner = document.getElementById("loginSpinner");

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (errorElement) {
            errorElement.classList.add("d-none");
            errorElement.textContent = "";
        }

        if (button) {
            button.disabled = true;
        }

        if (buttonText) {
            buttonText.textContent = "Вхід...";
        }

        if (spinner) {
            spinner.classList.remove("d-none");
        }

        try {

            const data = await apiRequest(
                `${AUTH_BASE}/login/`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            // Зберігаємо токен та користувача.

            saveAuthToken(data.token);
            saveCurrentUser(data.user);

            if (buttonText) {
                buttonText.textContent = "Успішно!";
            }

            // Повертаємо користувача на сторінку,
            // з якої він перейшов до входу.

            const redirect = sessionStorage.getItem(
                "vilkaLoginRedirect"
            );

            sessionStorage.removeItem("vilkaLoginRedirect");

            setTimeout(function () {

                if (redirect) {
                    window.location.href = redirect;
                } else {
                    window.location.href = "index.html";
                }

            }, 500);

        } catch (error) {

            console.error("Помилка входу:", error);

            showApiError(errorElement, error);

            if (button) {
                button.disabled = false;
            }

            if (buttonText) {
                buttonText.textContent = "Увійти";
            }

            if (spinner) {
                spinner.classList.add("d-none");
            }

        }

    });

}


/* ========================================
   REGISTER
======================================== */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const errorElement = document.getElementById("registerError");
        const successElement = document.getElementById("registerSuccess");

        if (errorElement) {
            errorElement.classList.add("d-none");
            errorElement.textContent = "";
        }

        if (successElement) {
            successElement.classList.add("d-none");
            successElement.textContent = "";
        }

        const formData = new FormData(registerForm);

        const username = (formData.get("username") || "").trim();
        const email = (formData.get("email") || "").trim();
        const firstName = (formData.get("first_name") || "").trim();
        const lastName = (formData.get("last_name") || "").trim();
        const password = formData.get("password") || "";
        const passwordConfirm = formData.get("password_confirm") || "";
        const phone = (formData.get("phone") || "").trim();
        const city = (formData.get("city") || "").trim();

        const data = {
            username: username,
            email: email,
            first_name: firstName,
            last_name: lastName,
            password: password,
            password_confirm: passwordConfirm,
            phone: phone,
            city: city
        };

        // Перевірка паролів.

        if (data.password !== data.password_confirm) {

            if (errorElement) {
                errorElement.textContent = "Паролі не збігаються.";
                errorElement.classList.remove("d-none");
            }

            return;
        }

        const button = document.getElementById("registerButton");
        const buttonText = document.getElementById("registerButtonText");
        const spinner = document.getElementById("registerSpinner");

        if (button) {
            button.disabled = true;
        }

        if (buttonText) {
            buttonText.textContent = "Реєстрація...";
        }

        if (spinner) {
            spinner.classList.remove("d-none");
        }

        try {

            const response = await apiRequest(
                `${AUTH_BASE}/register/`,
                {
                    method: "POST",

                    body: JSON.stringify(data)
                }
            );

            // Django повертає токен і дані користувача
            // одразу після успішної реєстрації.

            saveAuthToken(response.token);
            saveCurrentUser(response.user);

            if (successElement) {
                successElement.textContent =
                    "Реєстрацію успішно завершено! Перенаправлення...";

                successElement.classList.remove("d-none");
            }

            registerForm.reset();

            setTimeout(function () {
                window.location.href = "index.html";
            }, 1000);

        } catch (error) {

            console.error("Помилка реєстрації:", error);

            showApiError(errorElement, error);

            if (button) {
                button.disabled = false;
            }

            if (buttonText) {
                buttonText.textContent = "Зареєструватися";
            }

            if (spinner) {
                spinner.classList.add("d-none");
            }

        }

    });

}


/* ========================================
   PASSWORD TOGGLE
======================================== */

document.querySelectorAll(".password-toggle").forEach(function (button) {

    button.addEventListener("click", function () {

        const targetId = button.dataset.target || "password";

        const input = document.getElementById(targetId);

        if (!input) {
            return;
        }

        if (input.type === "password") {

            input.type = "text";

            button.innerHTML =
                '<i class="bi bi-eye-slash"></i>';

            button.setAttribute("aria-label", "Приховати пароль");

        } else {

            input.type = "password";

            button.innerHTML =
                '<i class="bi bi-eye"></i>';

            button.setAttribute("aria-label", "Показати пароль");

        }

    });

});


/* ========================================
   LOGOUT
======================================== */

async function logoutUser() {

    const token = getAuthToken();

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

        window.location.href = "index.html";

    }

}


/* ========================================
   LOAD CURRENT USER
======================================== */

async function loadCurrentUser() {

    if (!getAuthToken()) {
        return null;
    }

    try {

        const user = await apiRequest(
            `${AUTH_BASE}/me/`
        );

        saveCurrentUser(user);

        return user;

    } catch (error) {

        console.warn(
            "Не вдалося завантажити користувача:",
            error
        );

        // Видаляємо локальну авторизацію
        // лише якщо сервер відхилив токен.

        if (
            error.status === 401 ||
            error.status === 403
        ) {
            removeAuthToken();
            removeCurrentUser();
        }

        return null;

    }

}


/* ========================================
   HEADER AUTH STATE
======================================== */

async function updateAuthHeader() {

    const loginButtons = document.querySelectorAll(
        ".header-login-button"
    );

    if (!loginButtons.length) {
        return;
    }

    // Кнопка для незареєстрованого користувача.

    function showLoginButton() {

        loginButtons.forEach(button => {

            button.href = "login.html";
            button.innerHTML = "";

            const icon = document.createElement("i");
            icon.className = "bi bi-person me-2";

            button.appendChild(icon);

            button.appendChild(
                document.createTextNode("Увійти")
            );

        });

    }

    // Якщо токена немає — показуємо «Увійти».

    if (!getAuthToken()) {
        showLoginButton();
        return;
    }

    // Беремо користувача з localStorage.

    let currentUser = getCurrentUser();

    // Якщо локальних даних немає,
    // завантажуємо їх із Django.

    if (!currentUser) {
        currentUser = await loadCurrentUser();
    }

    // Якщо користувач не завантажився,
    // повертаємо кнопку входу.

    if (!currentUser) {
        showLoginButton();
        return;
    }

    // Ім'я для кнопки.

    const displayName =
        currentUser.first_name ||
        currentUser.username ||
        "Мій профіль";

    loginButtons.forEach(button => {

        button.href = "profile.html";
        button.innerHTML = "";

        const icon = document.createElement("i");
        icon.className = "bi bi-person-circle me-2";

        button.appendChild(icon);

        button.appendChild(
            document.createTextNode(displayName)
        );

    });

}


/* ========================================
   INITIALIZE AUTH HEADER
======================================== */

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
        return Boolean(getAuthToken());
    },

    logout: logoutUser,

    loadUser: loadCurrentUser,

    updateHeader: updateAuthHeader

};