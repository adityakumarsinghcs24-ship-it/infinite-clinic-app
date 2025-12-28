# test_booking/models.py

from django.db import models
from app.models import Patient, MemberPatient, Test, TimeSlot

# ------------------------------
# 🧪 TEST BOOKING
# ------------------------------
class TestBooking(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="test_bookings")
    tests = models.ManyToManyField(Test, related_name="bookings")
    slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=(("confirmed", "Confirmed"), ("cancelled", "Cancelled")),
        default="confirmed"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        tests_names = ", ".join([t.name for t in self.tests.all()])
        return f"TestBooking for {self.patient.first_name}: {tests_names}"


# ------------------------------
# 👤 PATIENTS IN TEST BOOKING
# ------------------------------
class TestBookingPatient(models.Model):
    booking = models.ForeignKey(TestBooking, on_delete=models.CASCADE, related_name="patients")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True)
    member_patient = models.ForeignKey(MemberPatient, on_delete=models.CASCADE, null=True, blank=True)
    is_self = models.BooleanField(default=False)
    attendance = models.BooleanField(default=False)
    report = models.FileField(upload_to="test_reports/", blank=True, null=True)
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
