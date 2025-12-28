# app/models.py

from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

# ------------------------------
# 👩‍⚕️ PATIENTS
# ------------------------------
class Patient(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="patient_profile",
        blank=True,
        null=True
    )
    first_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(
        max_length=1,
        choices=(("M", "Male"), ("F", "Female"), ("O", "Other"))
    )
    phone_number = models.CharField(max_length=15, unique=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)

    def clean(self):
        if self.user and getattr(self.user, 'role', None) != "patient":
            raise ValidationError("Linked user must have role 'patient'.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name}"


class MemberPatient(models.Model):
    owner = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="members")
    first_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(
        max_length=1,
        choices=(("M", "Male"), ("F", "Female"), ("O", "Other"))
    )
    phone_number = models.CharField(max_length=15, unique=True, null=True)

    def __str__(self):
        return f"{self.first_name} (Member of {self.owner.first_name})"


# ------------------------------
# 👨‍⚕️ CONSULTATIONS & TIMESLOTS
# ------------------------------
class Consultation(models.Model):
    docname = models.CharField(max_length=255)
    specialization = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ["docname"]

    def __str__(self):
        return f"{self.docname} - ₹{self.price}"


class ConsultTimeSlot(models.Model):
    doctor = models.ForeignKey(
        Consultation,
        on_delete=models.CASCADE,
        related_name="consultations"
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_patients = models.PositiveIntegerField(blank=True, null=True)
    unlimited_patients = models.BooleanField(default=True)
    available_slots = models.PositiveIntegerField(blank=True, null=True)
    booked_slots = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=True)

    class Meta:
        ordering = ["date", "start_time"]
        unique_together = ("doctor", "date", "start_time", "end_time")

    def clean(self):
        if not self.unlimited_patients and (self.max_patients is None or self.max_patients <= 0):
            raise ValidationError("max_patients must be set when unlimited_patients is False.")

    def save(self, *args, **kwargs):
        if not self.unlimited_patients:
            if self.available_slots is None:
                self.available_slots = self.max_patients - self.booked_slots
            self.available = self.available_slots > 0
        else:
            self.available_slots = None
            self.available = True
        super().save(*args, **kwargs)

    def __str__(self):
        status = "Unlimited" if self.unlimited_patients else f"{self.available_slots} available"
        return f"{self.doctor.docname} — {self.date} {self.start_time}-{self.end_time} ({status})"


# ------------------------------
# 🧪 TESTS & TIMESLOTS
# ------------------------------
class Test(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} - ₹{self.price}"


class TimeSlot(models.Model):
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_patients = models.PositiveIntegerField(blank=True, null=True)
    unlimited_patients = models.BooleanField(default=True)
    available_slots = models.PositiveIntegerField(blank=True, null=True)
    booked_slots = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=True)

    class Meta:
        ordering = ["date", "start_time"]
        unique_together = ("date", "start_time", "end_time")

    def clean(self):
        if not self.unlimited_patients and (self.max_patients is None or self.max_patients <= 0):
            raise ValidationError("max_patients must be set when unlimited_patients is False.")

    def save(self, *args, **kwargs):
        if not self.unlimited_patients:
            if self.available_slots is None:
                self.available_slots = self.max_patients - self.booked_slots
            self.available = self.available_slots > 0
        else:
            self.available_slots = None
            self.available = True
        super().save(*args, **kwargs)

    def __str__(self):
        status = "Unlimited" if self.unlimited_patients else f"{self.available_slots} available"
        return f"{self.date} {self.start_time}-{self.end_time} ({status})"


# ------------------------------
# 🛒 CART SYSTEM (Unified for Consult & Test)
# ------------------------------
class Cart(models.Model):
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart of {self.patient.first_name}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    item_type = models.CharField(max_length=10, choices=(("consult", "Consultation"), ("test", "Test")))
    consult = models.ForeignKey(Consultation, on_delete=models.CASCADE, null=True, blank=True)
    test = models.ForeignKey(Test, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("cart", "consult", "test")

    def __str__(self):
        item_name = self.consult.docname if self.item_type == "consult" else self.test.name
        return f"{item_name} x {self.quantity}"
