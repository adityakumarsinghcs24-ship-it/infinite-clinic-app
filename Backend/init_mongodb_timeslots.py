#!/usr/bin/env python3
"""
Initialize MongoDB with time slots (Pure MongoDB - No Django)
This script creates time slots directly in MongoDB like the patient system
"""

import os
from datetime import datetime, date, timedelta

def init_mongodb_timeslots():
    """Initialize MongoDB with time slots (like initializing patients)"""
    try:
        print("🚀 Initializing MongoDB with Time Slots")
        print("=" * 50)
        
        # Import pymongo
        try:
            from pymongo import MongoClient
            from bson import ObjectId
            print("✅ pymongo available")
        except ImportError:
            print("❌ pymongo not installed")
            print("💡 Install with: pip install pymongo")
            return False
        
        # Load .env file
        if os.path.exists('.env'):
            print("📄 Loading .env file...")
            with open('.env', 'r') as f:
                for line in f:
                    if '=' in line and not line.strip().startswith('#'):
                        key, value = line.strip().split('=', 1)
                        os.environ[key] = value
        
        # Get MongoDB connection details
        mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
        db_name = os.getenv('MONGO_DB_NAME', 'infinite_clinic_db')
        
        print(f"📡 Connecting to: {mongo_uri}")
        print(f"📊 Database: {db_name}")
        
        # Connect to MongoDB
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # Test connection
        client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Get database and collection
        db = client[db_name]
        timeslots_collection = db['timeslots']
        
        # Check existing time slots
        existing_count = timeslots_collection.count_documents({})
        print(f"📊 Existing time slots in MongoDB: {existing_count}")
        
        # Create time slots for next 30 days (like creating sample patients)
        start_date = date.today()
        total_created = 0
        
        print("🏗️ Creating time slots in MongoDB...")
        
        for i in range(30):
            current_date = start_date + timedelta(days=i)
            
            # Skip Sundays
            if current_date.weekday() == 6:
                continue
            
            # Define time slots (like patient data structure)
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
                
                # Check if slot already exists (like checking existing patients)
                existing_slot = timeslots_collection.find_one({
                    'date': current_date,
                    'start_time': start_datetime,
                    'end_time': end_datetime
                })
                
                if not existing_slot:
                    # Create time slot document (like patient document)
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
                    
                    # Insert into MongoDB (like saving patient)
                    timeslots_collection.insert_one(time_slot_doc)
                    created_for_date += 1
                    total_created += 1
            
            if created_for_date > 0:
                print(f"📅 {current_date}: Created {created_for_date} time slots")
        
        # Final count
        final_count = timeslots_collection.count_documents({})
        print(f"\n✅ MongoDB Time Slots Initialization Complete!")
        print(f"📊 Total time slots in MongoDB: {final_count}")
        print(f"🆕 New time slots created: {total_created}")
        
        # Show sample slots
        sample_slots = list(timeslots_collection.find().limit(5))
        print("\n📋 Sample time slots in MongoDB:")
        for slot in sample_slots:
            print(f"  - {slot['date']} {slot['start_time'].strftime('%H:%M')}-{slot['end_time'].strftime('%H:%M')} (Available: {slot['available']})")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ MongoDB initialization failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main function"""
    success = init_mongodb_timeslots()
    
    if success:
        print("\n🎉 SUCCESS: Time slots are now stored in MongoDB!")
        print("📋 Next steps:")
        print("1. Start your Django server: python manage.py runserver")
        print("2. Test the API: http://localhost:8000/api/mongo/test/")
        print("3. Get time slots: http://localhost:8000/api/mongo/time-slots/")
    else:
        print("\n❌ FAILED: Could not initialize MongoDB time slots")
        print("💡 Make sure:")
        print("1. MongoDB is running locally")
        print("2. pymongo is installed: pip install pymongo")
        print("3. Check your .env file for correct MONGO_URI")

if __name__ == "__main__":
    main()