from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "product",
            "product_name",
            "price",
            "quantity",
            "total_price",
        ]

        read_only_fields = [
            "product_name",
            "price",
            "total_price",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order

        fields = [
            "id",
            "order_number",
            "first_name",
            "last_name",
            "phone",
            "email",
            "city",
            "delivery_method",
            "delivery_address",
            "payment_method",
            "comment",
            "total_price",
            "status",
            "created_at",
            "items",
        ]

        read_only_fields = [
            "id",
            "order_number",
            "total_price",
            "status",
            "created_at",
        ]

    def validate(self, attrs):
        delivery_method = attrs.get("delivery_method")
        delivery_address = attrs.get("delivery_address", "").strip()

        if delivery_method in ["nova_poshta", "ukr_poshta"]:
            if not delivery_address:
                raise serializers.ValidationError({
                    "delivery_address": "Вкажіть номер або адресу відділення."
                })

        if delivery_method == "pickup":
            if not delivery_address:
                attrs["delivery_address"] = "Самовивіз"

        return attrs

    def create(self, validated_data):
        items_data = validated_data.pop("items")

        if not items_data:
            raise serializers.ValidationError({
                "items": "Замовлення не може бути порожнім."
            })

        total_price = 0
        prepared_items = []

        for item_data in items_data:
            product = item_data["product"]
            quantity = item_data["quantity"]

            if quantity <= 0:
                raise serializers.ValidationError({
                    "items": "Кількість товару повинна бути більше 0."
                })

            if product.stock < quantity:
                raise serializers.ValidationError({
                    "items": (
                        f"Недостатньо товару «{product.name}». "
                        f"Доступно: {product.stock} шт."
                    )
                })

            price = product.price
            item_total = price * quantity

            total_price += item_total

            prepared_items.append({
                "product": product,
                "product_name": product.name,
                "price": price,
                "quantity": quantity,
                "total_price": item_total,
            })

        import uuid

        order_number = "MY-" + uuid.uuid4().hex[:8].upper()

        order = Order.objects.create(
            order_number=order_number,
            total_price=total_price,
            **validated_data,
        )

        for item in prepared_items:

            OrderItem.objects.create(
                order=order,
                **item,
            )

            product = item["product"]

            product.stock -= item["quantity"]

            product.save(
                update_fields=["stock"]
            )

        return order