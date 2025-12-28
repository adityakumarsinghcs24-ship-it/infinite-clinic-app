# test_booking/serializers.py

from rest_framework import serializers
from app.models import Patient, MemberPatient, Test, TimeSlot
from .models import TestBooking, TestBookingPatient
from app.serializers import PatientSerializer, MemberPatientSerializer, TestSerializer, TimeSlotSerializer

class TestBookingPatientSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source="patient", read_only=True)
    member_patient_detail = MemberPatientSerializer(source="member_patient", read_only=True)

    class Meta:
        model = TestBookingPatient
        fields = "__all__"


class TestBookingSerializer(serializers.ModelSerializer):
    patients = TestBookingPatientSerializer(many=True, read_only=True)
    tests_detail = TestSerializer(source="tests", many=True, read_only=True)
    slot_detail = TimeSlotSerializer(source="slot", read_only=True)

    class Meta:
        model = TestBooking
        fields = "__all__"
