from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers

from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "phone",
            "city",
            "avatar",
        ]
        read_only_fields = []


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "profile",
        ]
        read_only_fields = [
            "id",
            "username",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
    )

    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
    )

    phone = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )

    city = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "password_confirm",
            "phone",
            "city",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({
                "password_confirm": "Паролі не збігаються."
            })

        if User.objects.filter(
            email__iexact=attrs["email"]
        ).exists():
            raise serializers.ValidationError({
                "email": "Користувач з таким email вже існує."
            })

        return attrs

    def create(self, validated_data):
        phone = validated_data.pop("phone", "")
        city = validated_data.pop("city", "")
        validated_data.pop("password_confirm")

        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data,
        )

        Profile.objects.create(
            user=user,
            phone=phone,
            city=city,
        )

        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "profile",
        ]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if profile_data:
            profile, created = Profile.objects.get_or_create(
                user=instance
            )

            for attr, value in profile_data.items():
                setattr(profile, attr, value)

            profile.save()

        return instance