#!/usr/bin/env python3
"""
Diagnose MongoDB Connection (No Django Required)
This will help identify the exact MongoDB connection issue
"""

import os
import json
from datetime import datetime, date, timedelta

def load_env_file():
    """Load .env file to get MongoDB settings"""
    env_vars = {}
    try:
        if os.path.exists('.env'):
            with open('.env', 'r') as f:
                for line in f:
                    if '=' in line and not line.strip().startswith('#'):
                        key, value = line.strip().split('=', 1)
                        env_vars[key] = value
        return env_vars
    except Exception as e:
        print(f"Error loading .env: {e}")
        return {}

def test_pymongo_connection():
    """Test MongoDB connection using pymongo directly"""
    try:
        print("🔍 Testing MongoDB connection with pymongo...")
        
        # Try to import pymongo
        try:
            from pymongo import MongoClient
            print("✅ pymongo is available")
        except ImportError:
            print("❌ pymongo not installed")
            print("💡 Install with: pip install pymongo")
            return False
        
        # Load environment variables
        env_vars = load_env_file()
        mongo_uri = env_vars.get('MONGO_URI', 'mongodb://localhost:27017')
        db_name = env_vars.get('MONGO_DB_NAME', 'infinite_clinic_db')
        
        print(f"📡 Connecting to: {mongo_uri}")
        print(f"📊 Database: {db_name}")
        
        # Create MongoDB client
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # Test connection
        client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Get database
        db = client[db_name]
        
        # List collections
        collections = db.list_collection_names()
        print(f"📁 Collections found: {len(collections)}")
        for collection in collections:
            count = db[collection].count_documents({})
            print(f"  - {collection}: {count} documents")
        
        # Check if patients collection exists and has data
        if 'patients' in collections:
            patients_count = db['patients'].count_documents({})
            print(f"👥 Patients in MongoDB: {patients_count}")
            
            if patients_count > 0:
                sample_patient = db['patients'].find_one()
                print(f"📋 Sample patient: {sample_patient.get('first_name', 'Unknown')}")
        
        # Check if timeslots collection exists
        if 'timeslots' in collections:
            timeslots_count = db['timeslots'].count_documents({})
            print(f"⏰ Time slots in MongoDB: {timeslots_count}")
        else:
            print("⚠️ No 'timeslots' collection found")
        
        client.close()
        return True, db_name, collections
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        return False, None, []

def create_timeslots_directly():
    """Create time slots directly in MongoDB (like patients)"""
    try:
        print("\n🏗️ Creating time slots directly in MongoDB...")
        
        from pymongo import MongoClient
        from bson import ObjectId
        
        # Load environment variables
        env_vars = load_env_file()
        mongo_uri = env_vars.get('MONGO_URI', 'mongodb://localhost:27017')
        db_name = env_vars.get('MONGO_DB_NAME', 'infinite_clinic_db')
        
        # Connect to MongoDB
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        db = client[db_name]
        timeslots_collection = db['timeslots']
        
        # Create time slots for next 7 days
        start_date = date.today()
        total_created = 0
        
        for i in range(7):
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
            
            print(f"📅 {current_date}: Created {created_for_date} time slots")
        
        # Verify creation
        final_count = timeslots_collection.count_documents({})
        print(f"\n✅ Time slots created successfully!")
        print(f"📊 Total time slots in MongoDB: {final_count}")
        
        # Show sample slots
        sample_slots = list(timeslots_collection.find().limit(3))
        print("📋 Sample time slots:")
        for slot in sample_slots:
            print(f"  - {slot['date']} {slot['start_time'].strftime('%H:%M')}-{slot['end_time'].strftime('%H:%M')}")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating time slots: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main diagnostic function"""
    print("🔍 MongoDB Diagnosis for Time Slots")
    print("=" * 50)
    
    # Test MongoDB connection
    success, db_name, collections = test_pymongo_connection()
    
    if success:
        print(f"\n✅ MongoDB is working!")
        print(f"📊 Database: {db_name}")
        print(f"📁 Collections: {collections}")
        
        # If patients exist, MongoDB is definitely working
        if 'patients' in collections:
            print("👥 Patient system is working - MongoDB connection is good!")
            
            # Try to create time slots
            if 'timeslots' not in collections or input("\n🤔 Create time slots now? (y/n): ").lower() == 'y':
                create_success = create_timeslots_directly()
                
                if create_success:
                    print("\n🎉 SUCCESS! Time slots are now in MongoDB!")
                    print("🎯 Your time slots API should now work!")
                else:
                    print("\n❌ Failed to create time slots")
        else:
            print("⚠️ No patients found - this might indicate a different issue")
    else:
        print("\n❌ MongoDB connection failed")
        print("💡 Possible solutions:")
        print("1. Install pymongo: pip install pymongo")
        print("2. Start MongoDB service")
        print("3. Check MONGO_URI in .env file")
        print("4. Verify MongoDB is running on the correct port")

if __name__ == "__main__":
    main()