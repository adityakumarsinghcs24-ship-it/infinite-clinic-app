from django.contrib import admin
from .models import (
    Patient, 
    MemberPatient, 
    Consultation, 
    ConsultTimeSlot, 
    Test, 
    TimeSlot, 
    Cart, 
    CartItem
)

# Simple registration for all models
admin.site.register(Patient)
admin.site.register(MemberPatient)
admin.site.register(Consultation)
admin.site.register(ConsultTimeSlot)
admin.site.register(Test)
admin.site.register(TimeSlot)
admin.site.register(Cart)
admin.site.register(CartItem)

