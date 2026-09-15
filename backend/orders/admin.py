from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = (
        "product",
        "product_name",
        "price",
        "quantity",
        "total_price",
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "order_number",
        "last_name",
        "first_name",
        "phone",
        "total_price",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "delivery_method",
        "payment_method",
        "created_at",
    )

    search_fields = (
        "order_number",
        "first_name",
        "last_name",
        "phone",
        "email",
        "city",
    )

    readonly_fields = (
        "order_number",
        "total_price",
        "created_at",
        "updated_at",
    )

    inlines = [OrderItemInline]

    ordering = ("-created_at",)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "product_name",
        "order",
        "price",
        "quantity",
        "total_price",
    )

    search_fields = (
        "product_name",
        "order__order_number",
    )

    readonly_fields = (
        "order",
        "product",
        "product_name",
        "price",
        "quantity",
        "total_price",
    )