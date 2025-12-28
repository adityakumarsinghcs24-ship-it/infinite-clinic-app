# test_booking/views.py

from rest_framework import viewsets, permissions
from .models import TestBooking, TestBookingPatient
from .serializers import TestBookingSerializer, TestBookingPatientSerializer

class TestBookingViewSet(viewsets.ModelViewSet):
    queryset = TestBooking.objects.all()
    serializer_class = TestBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        patient = getattr(self.request.user, "patient_profile", None)
        if patient:
            return TestBooking.objects.filter(patient=patient)
        return TestBooking.objects.none()


class TestBookingPatientViewSet(viewsets.ModelViewSet):
    queryset = TestBookingPatient.objects.all()
    serializer_class = TestBookingPatientSerializer
    permission_classes = [permissions.IsAuthenticated]
