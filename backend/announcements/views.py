from rest_framework import generics

from .models import Announcement
from .serializers import AnnouncementSerializer


class AnnouncementListView(generics.ListAPIView):
    queryset = Announcement.objects.filter(status="active")
    serializer_class = AnnouncementSerializer


class AnnouncementCreateView(generics.CreateAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer


class AnnouncementDetailView(generics.RetrieveAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer


class AnnouncementDeleteView(generics.DestroyAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer