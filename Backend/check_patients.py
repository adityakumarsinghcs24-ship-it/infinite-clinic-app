#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from app.mongo_models import Patient

def check_patients():
    print("🔍 Checking MongoDB patients...")
    
    try:
        # Get all patients
        patients = Patient.objects.all()
        print(f"📊 Total patients in MongoDB: {len(patients)}")
        
        # Show recent patients
        recent_patients = Patient.objects.order_by('-created_at')[:5]
        print("\n📋 Recent patients:")
        for i, patient in enumerate(recent_patients, 1):
            print(f"   {i}. {patient.first_name} (Age: {patient.age}, Gender: {patient.gender}) - ID: {patient.id}")
            print(f"      Created: {patient.created_at}")
        
        # Check for specific patient
        rajiv = Patient.objects(first_name="rajiv").first()
        if rajiv:
            print(f"\n✅ Found patient 'rajiv': ID {rajiv.id}, Age {rajiv.age}, Gender {rajiv.gender}")
        else:
            print("\n❌ Patient 'rajiv' not found")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_patients()