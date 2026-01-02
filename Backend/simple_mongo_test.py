#!/usr/bin/env python3
"""
Simple MongoDB connection test without Django
"""

import os
from datetime import datetime, date, timedelta

def test_mongodb_connection():
    """Test MongoDB connection using pymongo directly"""
    try:
        print("🔍 Testing MongoDB connection...")
        
        # Try to import pymongo
        try:
            from pymongo import MongoClient
            print("✅ pymongo module available")
        except ImportError:
            print("❌ pymongo not installed")
            return False
        
        # Get MongoDB URI from environment or use default
        mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
        db_name = os.getenv('MONGO_DB_NAME', 'infinite_clinic_db')
        
        print(f"📡 Connecting to: {mongo_uri}")
        print(f"📊 Database: {db_name}")
        
        # Create MongoDB client with timeout
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
        
        # Test time slots collection
        timeslots_collection = db['timeslots']
        timeslots_count = timeslots_collection.count_documents({})
        print(f"⏰ Time slots in database: {timeslots_count}")
        
        # Show sample time slots if any exist
        if timeslots_count > 0:
            sample_slots = list(timeslots_collection.find().limit(3))
            print("📋 Sample time slots:")
            for slot in sample_slots:
                print(f"  - {slot.get('date')} {slot.get('start_time')} - {slot.get('end_time')}")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        return False

def create_sample_timeslots():
    """Create sample time slots directly in MongoDB"""
    try:
        print("\n🏗️ Creating sample time slots...")
        
        from pymongo import MongoClient
        from bson import ObjectId
        
        # Get MongoDB connection
        mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
        db_name = os.getenv('MONGO_DB_NAME', 'infinite_clinic_db')
        
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        db = client[db_name]
        timeslots_collection = db['timeslots']
        
        # Create slots for today and next 7 days
        start_date = date.today()
        total_created = 0
        
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            
            # Skip Sundays
            if current_date.weekday() == 6:
                print(f"⏭️ Skipping Sunday: {current_date}")
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
                
                # Check if slot already exists
                existing_slot = timeslots_collection.find_one({
                    'date': current_date,
                    'start_time': start_datetime,
                    'end_time': end_datetime
                })
                
                if not existing_slot:
                    # Create new time slot document
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
                    
                    timeslots_collection.insert_one(time_slot_doc)
                    created_for_date += 1
                    total_created += 1
            
            if created_for_date > 0:
                print(f"📅 {current_date}: Created {created_for_date} time slots")
            else:
                print(f"📅 {current_date}: All slots already exist")
        
        print(f"✅ Total time slots created: {total_created}")
        client.close()
        return True, total_created
        
    except Exception as e:
        print(f"❌ Error creating time slots: {str(e)}")
        return False, str(e)

def main():
    """Main function"""
    print("🚀 Simple MongoDB Test Script")
    print("=" * 50)
    
    # Load environment variables from .env file if it exists
    if os.path.exists('.env'):
        print("📄 Loading .env file...")
        with open('.env', 'r') as f:
            for line in f:
                if '=' in line and not line.strip().startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value
    
    # Test MongoDB connection
    mongodb_ok = test_mongodb_connection()
    
    if mongodb_ok:
        # Create sample time slots
        slots_ok, result = create_sample_timeslots()
        
        if slots_ok:
            print(f"\n✅ MongoDB setup completed successfully!")
            print(f"📊 Time slots created: {result}")
        else:
            print(f"\n⚠️ MongoDB connected but time slot creation failed: {result}")
    else:
        print(f"\n❌ MongoDB connection failed")
        print("\n💡 Possible solutions:")
        print("1. Install MongoDB locally: https://www.mongodb.com/try/download/community")
        print("2. Start MongoDB service: 'mongod' or 'brew services start mongodb-community'")
        print("3. Check MONGO_URI in .env file")
        print("4. Use MongoDB Atlas (cloud) with proper connection string")
    
    print("\n🏁 Test completed!")

if __name__ == "__main__":
    main()