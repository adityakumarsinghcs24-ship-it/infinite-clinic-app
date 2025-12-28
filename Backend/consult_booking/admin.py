from django.contrib import admin
from .models import ConsultBooking, ConsultBookingPatient, ConsultBookingSlot

# Simple registration for all models
admin.site.register(ConsultBooking)
admin.site.register(ConsultBookingPatient)
admin.site.register(ConsultBookingSlot)

