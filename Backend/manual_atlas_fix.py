#!/usr/bin/env python3
"""
Manual MongoDB Atlas Time Slots Fix
Run this script to directly create time slots in your live MongoDB Atlas
"""

def create_atlas_timeslots():
    """Create time slots directly in MongoDB Atlas"""
    try:
        print("🔧 Manual MongoDB Atlas Time Slots Fix")
        print("=" * 50)
        
        # Try to import pymongo
        try:
            from pymongo import MongoClient
            from datetime import datetime, date, timedelta
            print("✅ pymongo available")
        except ImportError:
            print("❌ pymongo not installed")
            print("💡 Install with: pip install pymongo")
            print("💡 Or use MongoDB Atlas web interface instead")
            return False
        
        # Your MongoDB Atlas connection
        mongo_uri = "mongodb+srv://clinic_admin:12345%40clinic@cluster0.1rbiryd.mongodb.net/?appName=Cluster0"
        db_name = "infinite_clinic_db"
        
        print(f"📡 Connecting to MongoDB Atlas...")
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=10000)
        
        # Test connection
        client.admin.command('ping')
        print("✅ Connected to MongoDB Atlas!")
        
        # Get database and collection
        db = client[db_name]
        timeslots_collection = db['timeslots']
        
        # Check existing data
        existing_count = timeslots_collection.count_documents({})
        print(f"📊 Existing time slots in Atlas: {existing_count}")
        
        # Check if patients exist (to verify we're in the right database)
        patients_collection = db['patients']
        patients_count = patients_collection.count_documents({})
        print(f"👥 Patients in Atlas: {patients_count}")
        
        if patients_count == 0:
            print("⚠️ No patients found - might be wrong database")
            return False
        
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
            existing_slots = timeslots_collection.count_documents({'date': current_date})
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
                
                # Create time slot document
                time_slot_doc = {
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
                result = timeslots_collection.insert_one(time_slot_doc)
                created_for_date += 1
                total_created += 1
                print(f"✅ Created: {current_date} {start_time_str}-{end_time_str} (ID: {result.inserted_id})")
            
            print(f"📅 {current_date}: Created {created_for_date} slots")
        
        # Verify creation
        final_count = timeslots_collection.count_documents({})
        print(f"\n🎉 SUCCESS! Time slots created in MongoDB Atlas!")
        print(f"📊 Total time slots: {final_count}")
        print(f"🆕 New time slots created: {total_created}")
        
        # Show sample slots
        sample_slots = list(timeslots_collection.find().limit(5))
        print("\n📋 Sample time slots in Atlas:")
        for slot in sample_slots:
            print(f"  - {slot['date']} {slot['start_time'].strftime('%H:%M')}-{slot['end_time'].strftime('%H:%M')}")
        
        client.close()
        print("\n✅ Your live website should now have time slots!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def show_manual_steps():
    """Show manual steps if script doesn't work"""
    print("\n📋 Manual Steps (if script doesn't work):")
    print("=" * 50)
    print()
    print("🌐 Option 1: MongoDB Atlas Web Interface")
    print("1. Go to https://cloud.mongodb.com")
    print("2. Sign in and click your cluster")
    print("3. Click 'Browse Collections'")
    print("4. Find 'infinite_clinic_db' database")
    print("5. Create 'timeslots' collection if it doesn't exist")
    print("6. Click 'Insert Document' and add:")
    print()
    print("📄 Sample Document to Insert:")
    print("""{
  "date": "2026-01-06",
  "start_time": "2026-01-06T08:00:00.000Z",
  "end_time": "2026-01-06T09:00:00.000Z",
  "max_patients": 10,
  "unlimited_patients": false,
  "available_slots": 10,
  "booked_slots": 0,
  "available": true,
  "created_at": "2026-01-02T12:00:00.000Z"
}""")
    print()
    print("7. Repeat for different times: 09:00-10:00, 10:00-11:00, etc.")
    print("8. Create for multiple dates")
    print()
    print("🖥️ Option 2: MongoDB Compass")
    print("1. Download MongoDB Compass")
    print("2. Connect with: mongodb+srv://clinic_admin:12345%40clinic@cluster0.1rbiryd.mongodb.net/")
    print("3. Navigate to infinite_clinic_db > timeslots")
    print("4. Insert documents using the JSON above")

def main():
    """Main function"""
    success = create_atlas_timeslots()
    
    if not success:
        show_manual_steps()
        print("\n💡 After adding time slots manually, your live website will work!")

if __name__ == "__main__":
    main()