from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestBookingViewSet, TestBookingPatientViewSet

router = DefaultRouter()
router.register("testbookings", TestBookingViewSet)
router.register("testbookingpatients", TestBookingPatientViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
