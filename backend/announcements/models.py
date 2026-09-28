from django.conf import settings
from django.db import models


class Announcement(models.Model):
    CONDITION_CHOICES = [("new", "Новий"), ("used", "Вживаний")]
    STATUS_CHOICES = [("active", "Активне"), ("sold", "Продано"), ("closed", "Закрито")]
    CATEGORY_CHOICES = [("computers", "Комп'ютери"), ("phones", "Телефони"), ("laptops", "Ноутбуки"), ("accessories", "Аксесуари"), ("gaming", "Ігрова техніка"), ("other", "Інше")]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name="announcements", verbose_name="Автор")
    title = models.CharField(max_length=200, verbose_name="Назва")
    description = models.TextField(verbose_name="Опис")
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Ціна")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="other", verbose_name="Категорія")
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default="used", verbose_name="Стан")
    city = models.CharField(max_length=100, verbose_name="Місто")
    phone = models.CharField(max_length=30, verbose_name="Телефон")
    image = models.ImageField(upload_to="announcements/", blank=True, null=True, verbose_name="Фото")
    seller_name = models.CharField(max_length=100, verbose_name="Продавець")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active", verbose_name="Статус")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата створення")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата оновлення")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Оголошення"
        verbose_name_plural = "Оголошення"

    def __str__(self):
        return f"{self.title} — {self.price} грн"
