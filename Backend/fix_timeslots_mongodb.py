#!/usr/bin/env python3
"""
Fix Time Slots in MongoDB using the same connection as Patient system
Since patients work perfectly, this uses the exact same approach
"""

import os
import sys
import django
from datetime import datetime, date, timedelta

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django (same as patient system)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

def test_patient_connection():
    """Test if patient system works (to verify MongoDB connection)"""
    try:
        print("🔍 Testing Patient system (should work)...")
        from app.mongo_models import Patient
        
        patient_count = Patient.objects.count()
        print(f"✅ Patient system works! Found {patient_count} patients in MongoDB")
        
        # Show sample patient to verify connection
        if patient_count > 0:
            sample_patient = Patient.objects.first()
            print(f"📋 Sample patient: {sample_patient.first_name} (ID: {sample_patient.id})")
        
        return True
        
    except Exception as e:
        print(f"❌ Patient system failed: {e}")
        return False

def test_timeslot_connection():
    """Test TimeSlot model using same connection as Patient"""
    try:
        print("\n🔍 Testing TimeSlot system...")
        from app.mongo_models import TimeSlot
        
        timeslot_count = TimeSlot.objects.count()
        print(f"📊 Found {timeslot_count} time slots in MongoDB")
        
        if timeslot_count > 0:
            sample_slot = TimeSlot.objects.first()
            print(f"📋 Sample time slot: {sample_slot.date} {sample_slot.start_time.strftime('%H:%M')}")
        
        return True
        
    except Exception as e:
        print(f"❌ TimeSlot system failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def create_timeslots_like_patients():
    """Create time slots using the exact same approach as patients"""
    try:
        print("\n🏗️ Creating time slots using Patient system approach...")
        from app.mongo_models import TimeSlot
        
        # Create time slots for today and next 7 days (like creating patients)
        start_date = date.today()
        total_created = 0
        
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            
            # Skip Sundays
            if current_date.weekday() == 6:
                print(f"⏭️ Skipping Sunday: {current_date}")
                continue
            
            # Check if slots already exist (like checking existing patients)
            existing_slots = TimeSlot.objects.filter(date=current_date).count()
            if existing_slots > 0:
                print(f"📅 {current_date}: Already has {existing_slots} slots")
                continue
            
            # Define time slots
            time_slots = [
                ('08:00', '09:00'),
                ('09:00', '10:00'),
                ('10:00', '11:00'),
                ('11:00', '12:00'),
                ('14:00', '15:00'),
                ('15:00', '16:00'),
                ('16:00', '17:00'),
                ('17:00', '18:00'),
            ]
            
            created_for_date = 0
            for start_time_str, end_time_str in time_slots:
                # Create datetime objects
                start_datetime = datetime.combine(current_date, datetime.strptime(start_time_str, '%H:%M').time())
                end_datetime = datetime.combine(current_date, datetime.strptime(end_time_str, '%H:%M').time())
                
                # Create time slot (exactly like creating a patient)
                time_slot = TimeSlot(
                    date=current_date,
                    start_time=start_datetime,
                    end_time=end_datetime,
                    max_patients=10,
                    unlimited_patients=False,
                    available_slots=10,
                    booked_slots=0,
                    available=True
                )
                
                # Save to MongoDB (exactly like saving a patient)
                time_slot.save()
                created_for_date += 1
                total_created += 1
                print(f"✅ Created: {current_date} {start_time_str}-{end_time_str}")
            
            print(f"📅 {current_date}: Created {created_for_date} time slots")
        
        print(f"\n🎉 Successfully created {total_created} time slots in MongoDB!")
        return True
        
    except Exception as e:
        print(f"❌ Error creating time slots: {e}")
        import traceback
        traceback.print_exc()
        return False

def verify_timeslots_created():
    """Verify time slots were created successfully"""
    try:
        print("\n🔍 Verifying time slots creation...")
        from app.mongo_models import TimeSlot
        
        total_slots = TimeSlot.objects.count()
        print(f"📊 Total time slots in MongoDB: {total_slots}")
        
        if total_slots > 0:
            # Show sample slots
            sample_slots = TimeSlot.objects.order_by('date', 'start_time')[:5]
            print("📋 Sample time slots:")
            for slot in sample_slots:
                print(f"  - {slot.date} {slot.start_time.strftime('%H:%M')}-{slot.end_time.strftime('%H:%M')} (Available: {slot.available})")
        
        return total_slots > 0
        
    except Exception as e:
        print(f"❌ Error verifying time slots: {e}")
        return False

def main():
    """Main function"""
    print("🚀 Fix Time Slots in MongoDB (Using Patient System Approach)")
    print("=" * 60)
    
    # Step 1: Test patient connection (should work)
    patient_works = test_patient_connection()
    
    if not patient_works:
        print("\n❌ Patient system is not working. MongoDB connection issue.")
        print("💡 Please check:")
        print("1. MongoDB is running")
        print("2. MONGO_URI in .env file is correct")
        print("3. Django dependencies are installed")
        return
    
    # Step 2: Test time slot connection
    timeslot_works = test_timeslot_connection()
    
    # Step 3: Create time slots using patient approach
    if patient_works:
        success = create_timeslots_like_patients()
        
        if success:
            # Step 4: Verify creation
            verify_timeslots_created()
            print("\n✅ Time slots are now in MongoDB!")
            print("🎯 You can now test the time slots API")
        else:
            print("\n❌ Failed to create time slots")
            print("💡 The issue might be:")
            print("1. TimeSlot model definition")
            print("2. MongoDB permissions")
            print("3. Django model registration")

if __name__ == "__main__":
    main()