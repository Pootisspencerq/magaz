from rest_framework import serializers

from .models import Announcement


class AnnouncementSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = [
            "id",
            "title",
            "description",
            "price",
            "category",
            "condition",
            "city",
            "phone",
            "image",
            "seller_name",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "image",
            "created_at",
            "updated_at",
        ]

    def get_image(self, obj):
        if obj.image:
            request = self.context.get("request")

            if request:
                return request.build_absolute_uri(obj.image.url)

            return obj.image.url

        return None