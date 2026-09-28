from rest_framework import serializers
from .models import Announcement


class AnnouncementSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    owner_id = serializers.IntegerField(source="owner.id", read_only=True)
    is_owner = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = ["id", "title", "description", "price", "category", "condition", "city", "phone", "image", "seller_name", "status", "created_at", "updated_at", "owner_id", "is_owner", "is_admin"]
        read_only_fields = ["id", "created_at", "updated_at", "owner_id", "is_owner", "is_admin"]

    def get_is_owner(self, obj):
        request = self.context.get("request")
        return bool(request and request.user.is_authenticated and obj.owner_id == request.user.id)

    def get_is_admin(self, obj):
        request = self.context.get("request")
        return bool(request and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))

    def validate_title(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("Назва повинна містити щонайменше 3 символи.")
        return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Ціна повинна бути більше 0.")
        return value

    def validate_phone(self, value):
        value = value.strip()
        if len(value) < 7:
            raise serializers.ValidationError("Вкажіть коректний номер телефону.")
        return value
