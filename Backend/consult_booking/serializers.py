# consult_booking/serializers.py

from rest_framework import serializers
from app.models import Patient, MemberPatient
from .models import ConsultBooking, ConsultBookingPatient, ConsultBookingSlot
from app.serializers import PatientSerializer, MemberPatientSerializer
from app.models import ConsultTimeSlot, Consultation
from app.serializers import ConsultTimeSlotSerializer, ConsultationSerializer


class ConsultBookingSlotSerializer(serializers.ModelSerializer):
    timeslot_detail = ConsultTimeSlotSerializer(source="timeslot", read_only=True)

    class Meta:
        model = ConsultBookingSlot
        fields = "__all__"


class ConsultBookingPatientSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source="patient", read_only=True)
    member_patient_detail = MemberPatientSerializer(source="member_patient", read_only=True)

    class Meta:
        model = ConsultBookingPatient
        fields = "__all__"


class ConsultBookingSerializer(serializers.ModelSerializer):
    consultation_detail = ConsultationSerializer(source="consultation", read_only=True)
    patients = ConsultBookingPatientSerializer(many=True, read_only=True)
    slots = ConsultBookingSlotSerializer(many=True, read_only=True)

    class Meta:
        model = ConsultBooking
        fields = "__all__"
