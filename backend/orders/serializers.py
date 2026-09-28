from django.db import transaction
from rest_framework import serializers
from .models import Order, OrderItem
from shop.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["product", "product_name", "price", "quantity", "total_price"]
        read_only_fields = ["product_name", "price", "total_price"]

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Кількість повинна бути більше 0.")
        if value > 1000:
            raise serializers.ValidationError("Занадто велика кількість товару.")
        return value


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ["id", "order_number", "first_name", "last_name", "phone", "email", "city", "delivery_method", "delivery_address", "payment_method", "comment", "total_price", "status", "created_at", "items"]
        read_only_fields = ["id", "order_number", "total_price", "status", "created_at"]

    def validate(self, attrs):
        delivery_method = attrs.get("delivery_method")
        address = attrs.get("delivery_address", "").strip()
        if delivery_method in ["nova_poshta", "ukr_poshta"] and not address:
            raise serializers.ValidationError({"delivery_address": "Вкажіть номер або адресу відділення."})
        if delivery_method == "pickup":
            attrs["delivery_address"] = "Самовивіз"
        return attrs

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        if not items_data:
            raise serializers.ValidationError({"items": "Замовлення не може бути порожнім."})

        with transaction.atomic():
            product_ids = [item["product"].pk for item in items_data]
            locked = {p.pk: p for p in Product.objects.select_for_update().filter(pk__in=product_ids)}
            quantities = {}
            for item in items_data:
                quantities[item["product"].pk] = quantities.get(item["product"].pk, 0) + item["quantity"]
            for pid, qty in quantities.items():
                product = locked.get(pid)
                if product is None:
                    raise serializers.ValidationError({"items": "Один із товарів більше не існує."})
                if product.stock < qty:
                    raise serializers.ValidationError({"items": f"Недостатньо товару «{product.name}». Доступно: {product.stock} шт."})

            total = 0
            prepared = []
            for item in items_data:
                product = locked[item["product"].pk]
                price = product.price
                item_total = price * item["quantity"]
                total += item_total
                prepared.append({"product": product, "product_name": product.name, "price": price, "quantity": item["quantity"], "total_price": item_total})

            import uuid
            order = Order.objects.create(user=self.context["request"].user, order_number="MY-" + uuid.uuid4().hex[:8].upper(), total_price=total, **validated_data)
            for item in prepared:
                OrderItem.objects.create(order=order, **item)
                product = item["product"]
                product.stock -= item["quantity"]
                product.save(update_fields=["stock"])
        return order
