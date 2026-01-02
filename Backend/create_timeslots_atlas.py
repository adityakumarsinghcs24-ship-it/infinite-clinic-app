#!/usr/bin/env python3
"""
Create Time Slots in MongoDB Atlas
Run this in the same environment where your Django/Patient system works
"""

import os
import sys

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def create_timeslots_with_django():
    """Create time slots using Django (same as patient system)"""
    try:
        print("🚀 Creating Time Slots in MongoDB Atlas")
        print("=" * 50)
        
        # Setup Django environment
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
        
        import django
        django.setup()
        
        from datetime import datetime, date, timedelta
        from app.mongo_models import TimeSlot, Patient
        
        # First, verify patient system works (to confirm MongoDB connection)
        print("🔍 Verifying MongoDB Atlas connection...")
        patient_count = Patient.objects.count()
        print(f"✅ MongoDB Atlas connected! Found {patient_count} patients")
        
        if patient_count > 0:
            sample_patient = Patient.objects.first()
            print(f"📋 Sample patient: {sample_patient.first_name}")
        
        # Check existing time slots
        existing_timeslots = TimeSlot.objects.count()
        print(f"📊 Existing time slots: {existing_timeslots}")
        
        # Create time slots for next 30 days
        start_date = date.today()
        total_created = 0
        
        print("\n🏗️ Creating time slots in MongoDB Atlas...")
        
        for i in range(30):
            current_date = start_date + timedelta(days=i)
            
            # Skip Sundays
            if current_date.weekday() == 6:
                print(f"⏭️ Skipping Sunday: {current_date}")
                continue
            
            # Check if slots already exist for this date
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
                
                # Save to MongoDB Atlas (exactly like saving a patient)
                time_slot.save()
                created_for_date += 1
                total_created += 1
            
            print(f"📅 {current_date}: Created {created_for_date} time slots")
        
        # Verify creation
        final_count = TimeSlot.objects.count()
        print(f"\n✅ Time slots created successfully!")
        print(f"📊 Total time slots in MongoDB Atlas: {final_count}")
        print(f"🆕 New time slots created: {total_created}")
        
        # Show sample time slots
        if final_count > 0:
            sample_slots = TimeSlot.objects.order_by('date', 'start_time')[:5]
            print("\n📋 Sample time slots:")
            for slot in sample_slots:
                print(f"  - {slot.date} {slot.start_time.strftime('%H:%M')}-{slot.end_time.strftime('%H:%M')} (Available: {slot.available})")
        
        print("\n🎉 SUCCESS! Time slots are now in MongoDB Atlas!")
        print("🎯 Your time slots API should now work!")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("💡 Make sure you're running this in the same environment where Django works")
        print("💡 Try: python manage.py shell < create_timeslots_atlas.py")
        return False
        
    except Exception as e:
        print(f"❌ Error creating time slots: {e}")
        import traceback
        traceback.print_exc()
        return False

def create_timeslots_with_pymongo():
    """Create time slots using pymongo directly"""
    try:
        print("🔍 Trying direct MongoDB Atlas connection...")
        
        from pymongo import MongoClient
        from bson import ObjectId
        from datetime import datetime, date, timedelta
        
        # MongoDB Atlas connection
        mongo_uri = "mongodb+srv://clinic_admin:12345%40clinic@cluster0.1rbiryd.mongodb.net/?appName=Cluster0"
        db_name = "infinite_clinic_db"
        
        print(f"📡 Connecting to MongoDB Atlas...")
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=10000)
        
        # Test connection
        client.admin.command('ping')
        print("✅ MongoDB Atlas connection successful!")
        
        # Get database and collections
        db = client[db_name]
        timeslots_collection = db['timeslots']
        patients_collection = db['patients']
        
        # Verify patients exist (to confirm we're in the right database)
        patients_count = patients_collection.count_documents({})
        print(f"👥 Found {patients_count} patients in MongoDB Atlas")
        
        # Check existing time slots
        existing_timeslots = timeslots_collection.count_documents({})
        print(f"📊 Existing time slots: {existing_timeslots}")
        
        # Create time slots for next 30 days
        start_date = date.today()
        total_created = 0
        
        print("\n🏗️ Creating time slots in MongoDB Atlas...")
        
        for i in range(30):
            current_date = start_date + timedelta(days=i)
            
            # Skip Sundays
            if current_date.weekday() == 6:
                continue
            
            # Check if slots already exist for this date
            existing_count = timeslots_collection.count_documents({'date': current_date})
            if existing_count > 0:
                print(f"📅 {current_date}: Already has {existing_count} slots")
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
                
                # Create time slot document
                time_slot_doc = {
                    '_id': ObjectId(),
                    'date': current_date,
                    'start_time': start_datetime,
                    'end_time': end_datetime,
                    'max_patients': 10,
                    'unlimited_patients': False,
                    'available_slots': 10,
                    'booked_slots': 0,
                    'available': True,
                    'created_at': datetime.utcnow()
                }
                
                # Insert into MongoDB Atlas
                timeslots_collection.insert_one(time_slot_doc)
                created_for_date += 1
                total_created += 1
            
            print(f"📅 {current_date}: Created {created_for_date} time slots")
        
        # Verify creation
        final_count = timeslots_collection.count_documents({})
        print(f"\n✅ Time slots created successfully!")
        print(f"📊 Total time slots in MongoDB Atlas: {final_count}")
        print(f"🆕 New time slots created: {total_created}")
        
        # Show sample time slots
        if final_count > 0:
            sample_slots = list(timeslots_collection.find().limit(5))
            print("\n📋 Sample time slots:")
            for slot in sample_slots:
                print(f"  - {slot['date']} {slot['start_time'].strftime('%H:%M')}-{slot['end_time'].strftime('%H:%M')}")
        
        client.close()
        print("\n🎉 SUCCESS! Time slots are now in MongoDB Atlas!")
        return True
        
    except ImportError:
        print("❌ pymongo not available")
        return False
    except Exception as e:
        print(f"❌ Error with direct connection: {e}")
        return False

def main():
    """Main function - try both approaches"""
    print("🚀 Creating Time Slots in MongoDB Atlas")
    print("=" * 50)
    
    # Try Django approach first (preferred)
    print("🔄 Attempting Django approach...")
    django_success = create_timeslots_with_django()
    
    if django_success:
        return
    
    # Try direct pymongo approach
    print("\n🔄 Attempting direct pymongo approach...")
    pymongo_success = create_timeslots_with_pymongo()
    
    if not pymongo_success:
        print("\n❌ Both approaches failed")
        print("💡 Please run this script in your Django environment:")
        print("   1. Activate your virtual environment (if you use one)")
        print("   2. Navigate to Backend folder")
        print("   3. Run: python create_timeslots_atlas.py")
        print("   4. Or run: python manage.py shell < create_timeslots_atlas.py")

if __name__ == "__main__":
    main()