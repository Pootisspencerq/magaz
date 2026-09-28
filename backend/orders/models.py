from django.conf import settings
from django.db import models


class Order(models.Model):
    STATUS_CHOICES = [("new", "Нове"), ("confirmed", "Підтверджено"), ("shipped", "Відправлено"), ("completed", "Виконано"), ("cancelled", "Скасовано")]
    PAYMENT_CHOICES = [("cash", "Готівка при отриманні"), ("card", "Оплата карткою"), ("online", "Онлайн-оплата")]
    DELIVERY_CHOICES = [("nova_poshta", "Нова пошта"), ("ukr_poshta", "Укрпошта"), ("pickup", "Самовивіз")]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders", verbose_name="Користувач")
    order_number = models.CharField(max_length=20, unique=True, verbose_name="Номер замовлення")
    first_name = models.CharField(max_length=100, verbose_name="Ім'я")
    last_name = models.CharField(max_length=100, verbose_name="Прізвище")
    phone = models.CharField(max_length=30, verbose_name="Телефон")
    email = models.EmailField(blank=True, verbose_name="Email")
    city = models.CharField(max_length=100, verbose_name="Місто")
    delivery_method = models.CharField(max_length=30, choices=DELIVERY_CHOICES, verbose_name="Доставка")
    delivery_address = models.CharField(max_length=255, blank=True, verbose_name="Відділення / адреса")
    payment_method = models.CharField(max_length=30, choices=PAYMENT_CHOICES, verbose_name="Оплата")
    comment = models.TextField(blank=True, verbose_name="Коментар")
    total_price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Сума")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new", verbose_name="Статус")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата створення")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Остання зміна")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Замовлення"
        verbose_name_plural = "Замовлення"

    def __str__(self):
        return f"{self.order_number} — {self.last_name} {self.first_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items", verbose_name="Замовлення")
    product = models.ForeignKey("shop.Product", on_delete=models.PROTECT, verbose_name="Товар")
    product_name = models.CharField(max_length=200, verbose_name="Назва товару")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Ціна на момент покупки")
    quantity = models.PositiveIntegerField(verbose_name="Кількість")
    total_price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Сума")

    def __str__(self):
        return f"{self.product_name} × {self.quantity}"
