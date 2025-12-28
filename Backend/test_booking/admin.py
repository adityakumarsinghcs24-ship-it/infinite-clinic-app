from django.contrib import admin
from .models import TestBooking, TestBookingPatient

# Simple registration for all models
admin.site.register(TestBooking)
admin.site.register(TestBookingPatient)

