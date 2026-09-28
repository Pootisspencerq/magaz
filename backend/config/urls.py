from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

from . import views


urlpatterns = [
    # Сторінки frontend
    path("", views.home, name="home"),
    path("index.html", views.home, name="index"),
    path("product.html", views.product_page, name="product"),
    path("announcements.html", views.announcements_page, name="announcements"),
    path("cart.html", views.cart_page, name="cart"),
    path("checkout.html", views.checkout_page, name="checkout"),
    path("login.html", views.login_page, name="login"),
    path("register.html", views.register_page, name="register"),
    path("profile.html", views.profile_page, name="profile"),

    # Django Admin
    path("admin/", admin.site.urls),

    # API товарів
    path("api/", include("shop.urls")),

    # API замовлень
    path("api/orders/", include("orders.urls")),

    # API оголошень
    path("api/announcements/", include("announcements.urls")),

    # API акаунтів
    path("api/accounts/", include("accounts.urls")),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )