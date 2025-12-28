# consult_booking/views.py

from rest_framework import viewsets, permissions
from .models import ConsultBooking, ConsultBookingPatient, ConsultBookingSlot
from .serializers import ConsultBookingSerializer, ConsultBookingPatientSerializer, ConsultBookingSlotSerializer

class ConsultBookingViewSet(viewsets.ModelViewSet):
    queryset = ConsultBooking.objects.all()
    serializer_class = ConsultBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        patient = getattr(self.request.user, "patient_profile", None)
        if patient:
            return ConsultBooking.objects.filter(patient=patient)
        return ConsultBooking.objects.none()


class ConsultBookingPatientViewSet(viewsets.ModelViewSet):
    queryset = ConsultBookingPatient.objects.all()
    serializer_class = ConsultBookingPatientSerializer
    permission_classes = [permissions.IsAuthenticated]


class ConsultBookingSlotViewSet(viewsets.ModelViewSet):
    queryset = ConsultBookingSlot.objects.all()
    serializer_class = ConsultBookingSlotSerializer
    permission_classes = [permissions.IsAuthenticated]
