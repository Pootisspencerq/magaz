from rest_framework import generics, permissions
from .models import Announcement
from .serializers import AnnouncementSerializer


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return bool(request.user.is_staff or request.user.is_superuser or obj.owner_id == request.user.id)


class AnnouncementListView(generics.ListAPIView):
    queryset = Announcement.objects.filter(status="active")
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.AllowAny]


class AnnouncementCreateView(generics.CreateAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class AnnouncementDetailView(generics.RetrieveUpdateAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]


class AnnouncementDeleteView(generics.DestroyAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
