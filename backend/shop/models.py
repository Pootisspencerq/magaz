from django.db import models


CATEGORY_CHOICES = [
    ("computers", "Комп'ютери"),
    ("phones", "Телефони"),
    ("laptops", "Ноутбуки"),
    ("accessories", "Аксесуари"),
]


class Product(models.Model):

    name = models.CharField(
        max_length=200,
        verbose_name="Назва"
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Ціна"
    )

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        default=0,
        verbose_name="Рейтинг"
    )

    brand = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Бренд"
    )

    category = models.CharField(
        max_length=100,
        choices=CATEGORY_CHOICES,
        blank=True,
        verbose_name="Категорія"
    )

    description = models.TextField(
        blank=True,
        verbose_name="Опис"
    )

    image = models.ImageField(
        upload_to="products/",
        blank=True,
        null=True,
        verbose_name="Зображення"
    )

    stock = models.PositiveIntegerField(
        default=0,
        verbose_name="Кількість на складі"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        verbose_name = "Товар"

        verbose_name_plural = "Товари"

        ordering = ["-created_at"]

    def __str__(self):

        return self.name