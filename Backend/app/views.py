from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import razorpay

from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Patient, MemberPatient,
    Consultation, ConsultTimeSlot,
    Test, TimeSlot,
    Cart, CartItem
)
from .serializers import (
    PatientSerializer, MemberPatientSerializer,
    ConsultationSerializer, ConsultTimeSlotSerializer,
    TestSerializer, TimeSlotSerializer,
    CartSerializer, CartItemSerializer
)

from .models import *
from .serializers import *


# ------------------------------
# 🔑 Razorpay Initialization
# ------------------------------
razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


# ------------------------------
# 🌐 Simple Home Endpoint
# ------------------------------
def home(request):
    return HttpResponse("Hello!")


# ------------------------------
# 📦 PACKAGE CRUD
# ------------------------------
# ------------------------------
# 🧍 PATIENT CRUD
# ------------------------------
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]


class MemberPatientViewSet(viewsets.ModelViewSet):
    queryset = MemberPatient.objects.all()
    serializer_class = MemberPatientSerializer
    permission_classes = [permissions.IsAuthenticated]


# ------------------------------
# 🧪 TEST CRUD + Filter
# ------------------------------
class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [permissions.AllowAny]


# ------------------------------
# ⏰ TIMESLOT CRUD + Filters
# ------------------------------
from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
# from .models import TimeSlot # Make sure your model is imported
# from .serializers import TimeSlotSerializer # Make sure your serializer is imported

class TimeSlotViewSet(viewsets.ModelViewSet):
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    # 'test' has been removed from filterset_fields
    filterset_fields = ['date', 'available']

    def get_queryset(self):
        queryset = TimeSlot.objects.all()
        # 'test_id' parameter and filtering logic have been removed
        date = self.request.query_params.get("date")
        available = self.request.query_params.get("available")

        if date:
            queryset = queryset.filter(date=date)
        if available in ['true', 'false']:
            queryset = queryset.filter(available=(available == 'true'))

        return queryset




# ------------------------------
# 🛒 CART
# ------------------------------
class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # return only cart of current user
        patient = getattr(self.request.user, "patient_profile", None)
        if patient:
            return Cart.objects.filter(patient=patient)
        return Cart.objects.none()


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        patient = getattr(self.request.user, "patient_profile", None)
        if patient and hasattr(patient, "cart"):
            return CartItem.objects.filter(cart=patient.cart)
        return CartItem.objects.none()


# ------------------------------
# 🩺 CONSULTATION CRUD
# ------------------------------
class ConsultViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]


# ------------------------------
# 👨‍⚕️ CONSULTATION TIMESLOT CRUD
# ------------------------------
class ConsultTimeSlotViewSet(viewsets.ModelViewSet):
    serializer_class = ConsultTimeSlotSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['doctor', 'date', 'available']

    def get_queryset(self):
        queryset = ConsultTimeSlot.objects.all()
        doctor_id = self.request.query_params.get("doctor_id")
        date = self.request.query_params.get("date")

        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if date:
            queryset = queryset.filter(date=date)

        return queryset


# ------------------------------    
# 💳 RAZORPAY ORDER CREATION
# ------------------------------
class CreateOrderView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        amount = 34900  # amount in paise (Rs. 349.00)
        currency = 'INR'

        try:
            razorpay_order = razorpay_client.order.create(dict(
                amount=amount,
                currency=currency,
                payment_capture='1'
            ))
            return Response(
                {
                    'order_id': razorpay_order['id'],
                    'amount': razorpay_order['amount'],
                    'currency': razorpay_order['currency']
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ------------------------------
# 💰 PAYMENT VERIFICATION
# ------------------------------
class VerifyPaymentView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        payment_id = request.data.get('razorpay_payment_id', '')
        order_id = request.data.get('razorpay_order_id', '')
        signature = request.data.get('razorpay_signature', '')

        params_dict = {
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }

        try:
            razorpay_client.utility.verify_payment_signature(params_dict)
            return Response({'status': 'Payment Successful'}, status=status.HTTP_200_OK)
        except razorpay.errors.SignatureVerificationError:
            return Response(
                {'status': 'Payment Failed', 'error': 'Signature verification failed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
