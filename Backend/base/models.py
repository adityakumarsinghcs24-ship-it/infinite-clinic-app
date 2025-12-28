from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom User model with role support
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')

    def __str__(self):
        return f"{self.username} ({self.role})"


class Todo(models.Model):
    name = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todo')

    def __str__(self):
        return f"{self.name} - {self.owner.username}"



class Test(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # JSONField allows storing multiple items without complex relationships, perfect for simple history
    # If using SQLite/Postgres, this works. If using old MySQL, might need alternatives.
    booking_details = models.TextField() # Storing the list of test names/details as a string for simplicity
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="Booked")

    def __str__(self):
        return f"Booking {self.id} by {self.user.username}"
    
