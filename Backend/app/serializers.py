# app/serializers.py

from rest_framework import serializers
from .models import (
    Patient, MemberPatient,
    Consultation, ConsultTimeSlot,
    Test, TimeSlot,
    Cart, CartItem
)

# ------------------------------
# 👩‍⚕️ PATIENT SERIALIZERS
# ------------------------------
class MemberPatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberPatient
        fields = "__all__"


class PatientSerializer(serializers.ModelSerializer):
    members = MemberPatientSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = "__all__"


# ------------------------------
# 👨‍⚕️ CONSULTATIONS
# ------------------------------
class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = "__all__"


class ConsultTimeSlotSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source="doctor.docname", read_only=True)

    class Meta:
        model = ConsultTimeSlot
        fields = (
            "id",
            "doctor",
            "doctor_name",
            "date",
            "start_time",
            "end_time",
            "max_patients",
            "unlimited_patients",
            "available_slots",
            "booked_slots",
            "available",
        )

    def validate(self, data):
        unlimited = data.get(
            "unlimited_patients",
            getattr(self.instance, "unlimited_patients", True)
        )
        max_patients = data.get(
            "max_patients",
            getattr(self.instance, "max_patients", None)
        )

        if not unlimited and not max_patients:
            raise serializers.ValidationError({
                "max_patients": "This field is required when unlimited_patients is False."
            })

        return data

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.unlimited_patients:
            rep["available_slots"] = None
        return rep


# ------------------------------
# 🧪 TESTS
# ------------------------------
class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = "__all__"


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = "__all__"


# ------------------------------
# 🛒 CART
# ------------------------------
class CartItemSerializer(serializers.ModelSerializer):
    item_name = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = "__all__"

    def get_item_name(self, obj):
        if obj.item_type == "consult":
            return obj.consult.docname
        elif obj.item_type == "test":
            return obj.test.name
        return "Unknown"


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = "__all__"
