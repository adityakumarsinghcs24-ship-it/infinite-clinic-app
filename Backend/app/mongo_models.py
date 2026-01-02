from mongoengine import Document, EmbeddedDocument, fields
from datetime import datetime
import hashlib
import secrets

class User(Document):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    )
    
    username = fields.StringField(max_length=150, required=True, unique=True)
    email = fields.EmailField(required=True, unique=True)
    password_hash = fields.StringField(required=True)
    role = fields.StringField(max_length=20, choices=ROLE_CHOICES, default='patient')
    is_active = fields.BooleanField(default=True)
    is_staff = fields.BooleanField(default=False)
    is_superuser = fields.BooleanField(default=False)
    date_joined = fields.DateTimeField(default=datetime.utcnow)
    last_login = fields.DateTimeField(null=True)
    
    meta = {
        'collection': 'users',
        'ordering': ['-date_joined']
    }
    
    def set_password(self, raw_password):
        """Hash and set password"""
        salt = secrets.token_hex(16)
        self.password_hash = hashlib.pbkdf2_hmac('sha256', 
                                                raw_password.encode('utf-8'), 
                                                salt.encode('utf-8'), 
                                                100000).hex() + ':' + salt
    
    def check_password(self, raw_password):
        """Check if provided password matches stored hash"""
        try:
            password_hash, salt = self.password_hash.split(':')
            return hashlib.pbkdf2_hmac('sha256', 
                                     raw_password.encode('utf-8'), 
                                     salt.encode('utf-8'), 
                                     100000).hex() == password_hash
        except:
            return False
    
    def __str__(self):
        return f"{self.username} ({self.role})"

# JWT Token Storage (MongoDB)
class JWTToken(Document):
    user = fields.ReferenceField(User, required=True)
    token = fields.StringField(required=True)
    token_type = fields.StringField(max_length=10, choices=[('access', 'Access'), ('refresh', 'Refresh')])
    expires_at = fields.DateTimeField(required=True)
    is_blacklisted = fields.BooleanField(default=False)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'jwt_tokens',
        'indexes': ['token', 'user', 'expires_at']
    }


class Patient(Document):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    )
    
    user_id = fields.StringField(max_length=100, null=True, blank=True)  # Reference to Django User
    first_name = fields.StringField(max_length=100, required=True)
    age = fields.IntField(min_value=0, required=True)
    gender = fields.StringField(max_length=1, choices=GENDER_CHOICES, required=True)
    phone_number = fields.StringField(max_length=15, null=True)  # Removed unique constraint
    email = fields.EmailField(null=True)  # Removed unique constraint
    prescription_file = fields.StringField(null=True)  # Store file path/URL
    prescription_filename = fields.StringField(null=True)  # Original filename
    created_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'patients',
        'ordering': ['first_name']
    }
    
    def __str__(self):
        return f"{self.first_name}"


class MemberPatient(Document):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    )
    
    owner = fields.ReferenceField(Patient, required=True)
    first_name = fields.StringField(max_length=100, required=True)
    age = fields.IntField(min_value=0, required=True)
    gender = fields.StringField(max_length=1, choices=GENDER_CHOICES, required=True)
    phone_number = fields.StringField(max_length=15, unique=True, null=True)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'member_patients',
        'ordering': ['first_name']
    }
    
    def __str__(self):
        return f"{self.first_name} (Member of {self.owner.first_name})"



class Consultation(Document):
    docname = fields.StringField(max_length=255, required=True)
    specialization = fields.StringField(max_length=255, null=True)
    price = fields.DecimalField(min_value=0, precision=2, required=True)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'consultations',
        'ordering': ['docname']
    }
    
    def __str__(self):
        return f"{self.docname} - ₹{self.price}"


class ConsultTimeSlot(Document):
    doctor = fields.ReferenceField(Consultation, required=True)
    date = fields.DateField(required=True)
    start_time = fields.DateTimeField(required=True)
    end_time = fields.DateTimeField(required=True)
    max_patients = fields.IntField(min_value=1, null=True)
    unlimited_patients = fields.BooleanField(default=True)
    available_slots = fields.IntField(min_value=0, null=True)
    booked_slots = fields.IntField(min_value=0, default=0)
    available = fields.BooleanField(default=True)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'consult_timeslots',
        'ordering': ['date', 'start_time'],
        'indexes': [
            ('doctor', 'date', 'start_time', 'end_time')  # Compound index for uniqueness
        ]
    }
    
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
        return f"{self.doctor.docname} — {self.date} {self.start_time.time()}-{self.end_time.time()} ({status})"



class Test(Document):
    name = fields.StringField(max_length=255, required=True)
    description = fields.StringField(null=True)
    price = fields.DecimalField(min_value=0, precision=2, required=True)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'tests',
        'ordering': ['name']
    }
    
    def __str__(self):
        return f"{self.name} - ₹{self.price}"


class TimeSlot(Document):
    date = fields.DateField(required=True)
    start_time = fields.DateTimeField(required=True)
    end_time = fields.DateTimeField(required=True)
    max_patients = fields.IntField(min_value=1, null=True)
    unlimited_patients = fields.BooleanField(default=True)
    available_slots = fields.IntField(min_value=0, null=True)
    booked_slots = fields.IntField(min_value=0, default=0)
    available = fields.BooleanField(default=True)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'timeslots',
        'ordering': ['date', 'start_time'],
        'indexes': [
            ('date', 'start_time', 'end_time')  # Compound index for uniqueness
        ]
    }
    
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
        return f"{self.date} {self.start_time.time()}-{self.end_time.time()} ({status})"


class Cart(Document):
    patient = fields.ReferenceField(Patient, required=True, unique=True)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    updated_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'carts'
    }
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Cart of {self.patient.first_name}"


class CartItem(Document):
    ITEM_TYPE_CHOICES = (
        ('consult', 'Consultation'),
        ('test', 'Test')
    )
    
    cart = fields.ReferenceField(Cart, required=True)
    item_type = fields.StringField(max_length=10, choices=ITEM_TYPE_CHOICES, required=True)
    consult = fields.ReferenceField(Consultation, null=True)
    test = fields.ReferenceField(Test, null=True)
    quantity = fields.IntField(min_value=1, default=1)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'cart_items',
        'indexes': [
            ('cart', 'consult', 'test')  # Compound index for uniqueness
        ]
    }
    
    def __str__(self):
        item_name = self.consult.docname if self.item_type == "consult" else self.test.name
        return f"{item_name} x {self.quantity}"


class Booking(Document):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    )
    
    booking_id = fields.StringField(max_length=50, required=True, unique=True)
    patients = fields.ListField(fields.ReferenceField(Patient))
    tests = fields.ListField(fields.StringField())  # Test names
    total_amount = fields.DecimalField(min_value=0, precision=2, required=True)
    booking_date = fields.DateField(required=True)
    time_slot = fields.ReferenceField(TimeSlot, null=True)
    preferred_time = fields.StringField(null=True)  # Fallback if no time slot selected
    status = fields.StringField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = fields.StringField(null=True)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    updated_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'bookings',
        'ordering': ['-created_at']
    }
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Booking {self.booking_id} - {self.status}"