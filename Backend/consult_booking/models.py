# consult_booking/models.py

from django.db import models
from django.conf import settings
from app.models import Patient, MemberPatient, Consultation, ConsultTimeSlot

# ------------------------------
# 👨‍⚕️ CONSULTATION BOOKING
# ------------------------------
class ConsultBooking(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="consult_bookings")
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name="bookings")
    status = models.CharField(
        max_length=20,
        choices=(("confirmed", "Confirmed"), ("cancelled", "Cancelled")),
        default="confirmed"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.consultation.docname} booking by {self.patient.first_name}"


# ------------------------------
# 👤 PATIENTS IN A BOOKING
# ------------------------------
class ConsultBookingPatient(models.Model):
    booking = models.ForeignKey(ConsultBooking, on_delete=models.CASCADE, related_name="patients")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True)
    member_patient = models.ForeignKey(MemberPatient, on_delete=models.CASCADE, null=True, blank=True)
    is_self = models.BooleanField(default=False)
    attendance = models.BooleanField(default=False)
    report = models.FileField(upload_to="consult_reports/", blank=True, null=True)
    report_status = models.CharField(
        max_length=20,
        choices=(("pending", "Pending"), ("ready", "Ready")),
        default="pending"
    )

    def __str__(self):
        if self.is_self:
            return f"Self ({self.booking})"
        elif self.patient:
            return f"{self.patient.first_name} ({self.booking})"
        else:
            return f"{self.member_patient.first_name} ({self.booking})"


# ------------------------------
# ⏰ TIMESLOT LINKAGE
# ------------------------------
class ConsultBookingSlot(models.Model):
    booking = models.ForeignKey(ConsultBooking, on_delete=models.CASCADE, related_name="slots")
    timeslot = models.ForeignKey(ConsultTimeSlot, on_delete=models.CASCADE)
    patients_count = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("booking", "timeslot")

    def __str__(self):
        return f"{self.timeslot} for {self.booking}"
