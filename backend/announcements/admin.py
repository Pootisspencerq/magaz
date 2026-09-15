from django.contrib import admin

from .models import Announcement


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "price",
        "category",
        "condition",
        "city",
        "seller_name",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "category",
        "condition",
        "created_at",
    )

    search_fields = (
        "title",
        "description",
        "city",
        "phone",
        "seller_name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )