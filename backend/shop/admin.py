from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "price",
        "brand",
        "category",
        "rating",
        "stock",
        "created_at",
    )

    list_filter = (
        "category",
        "brand",
    )

    search_fields = (
        "name",
        "brand",
        "category",
    )

    list_editable = (
        "price",
        "rating",
        "stock",
    )