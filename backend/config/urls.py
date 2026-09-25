from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView


urlpatterns = [

    # Головна сторінка Django
    # Перекидаємо на frontend
    path(
        "",
        RedirectView.as_view(
            url="http://127.0.0.1:5500/index.html",
            permanent=False
        ),
    ),

    # Адмінка
    path("admin/", admin.site.urls),

    # API товарів
    path("api/", include("shop.urls")),

    # API замовлень
    path("api/orders/", include("orders.urls")),

    # API оголошень
    path("api/announcements/", include("announcements.urls")),

    path(
    "api/accounts/",
    include("accounts.urls"),
),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )