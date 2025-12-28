from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("tests", TestViewSet, basename="tests")
router.register("patients", PatientViewSet, basename="patients")
router.register("memberpatients", MemberPatientViewSet, basename="memberpatients")
router.register("timeslots", TimeSlotViewSet, basename="timeslot")
router.register("consultations", ConsultViewSet, basename="consultation")
router.register("ctimeslot", ConsultTimeSlotViewSet, basename="ctimeslot") 
router.register("cart", CartViewSet, basename="cart")
router.register("cartitems", CartItemViewSet, basename="cartitems") 

urlpatterns = [
    path('', home, name='home'),
    path('create-order/', CreateOrderView.as_view(), name='create-order'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
]

urlpatterns += router.urls
