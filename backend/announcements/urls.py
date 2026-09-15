from django.urls import path

from .views import (
    AnnouncementListView,
    AnnouncementCreateView,
    AnnouncementDetailView,
    AnnouncementDeleteView,
)


urlpatterns = [
    path(
        "",
        AnnouncementListView.as_view(),
        name="announcement-list"
    ),

    path(
        "create/",
        AnnouncementCreateView.as_view(),
        name="announcement-create"
    ),

    path(
        "<int:pk>/",
        AnnouncementDetailView.as_view(),
        name="announcement-detail"
    ),

    path(
        "<int:pk>/delete/",
        AnnouncementDeleteView.as_view(),
        name="announcement-delete"
    ),
]