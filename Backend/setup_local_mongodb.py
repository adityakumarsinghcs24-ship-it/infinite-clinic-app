#!/usr/bin/env python3
"""
Setup local MongoDB with time slots (similar to patient setup)
This script works without Django dependencies
"""

import os
import json
from datetime import datetime, date, timedelta

def setup_mongodb_with_pymongo():
    """Setup MongoDB using pymongo directly (like patient system)"""
    try:
        print("🔍 Setting up MongoDB with time slots...")
        
        # Try to import pymongo
        try:
            from pymongo import MongoClient
            from bson import ObjectId
            print("✅ pymongo available")
        except ImportError:
            print("❌ pymongo not installed. Install with: pip install pymongo")
            return False
        
        # Use local MongoDB (like patient system)
        mongo_uri = 'mongodb://localhost:27017'
        db_name = 'infinite_clinic_db'
        
        print(f"📡 Connecting to local MongoDB: {mongo_uri}")
        print(f"📊 Database: {db_name}")
        
        # Create MongoDB client
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # Test connection
        client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Get database
        db = client[db_name]
        
        # Setup time slots collection (similar to patients collection)
        timeslots_collection = db['timeslots']
        
        # Create time slots for next 30 days (like creating sample patients)
        start_date = date.today()
        total_created = 0
        
        print("🏗️ Creating time slots (similar to patient creation)...")
        
        for i in range(30):
            current_date = start_date + timedelta(days=i)
            
            # Skip Sundays (like business logic for patients)
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
                    # Create time slot document (similar to patient document)
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
        
        print(f"✅ Total time slots created: {total_created}")
        
        # Verify the data (like verifying patient data)
        total_slots = timeslots_collection.count_documents({})
        print(f"📊 Total time slots in database: {total_slots}")
        
        # Show sample slots (like showing sample patients)
        sample_slots = list(timeslots_collection.find().limit(5))
        print("📋 Sample time slots:")
        for slot in sample_slots:
            print(f"  - {slot['date']} {slot['start_time'].strftime('%H:%M')}-{slot['end_time'].strftime('%H:%M')}")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ MongoDB setup failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def create_mongodb_docker_setup():
    """Create docker-compose for local MongoDB (like patient system setup)"""
    docker_compose = """version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    container_name: infinite_clinic_mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: infinite_clinic_db
    volumes:
      - mongodb_data:/data/db
    command: mongod --quiet

volumes:
  mongodb_data:
"""
    
    with open('docker-compose.mongodb.yml', 'w') as f:
        f.write(docker_compose)
    
    print("📄 Created docker-compose.mongodb.yml")
    print("🐳 To start MongoDB with Docker:")
    print("   docker-compose -f docker-compose.mongodb.yml up -d")

def main():
    """Main setup function"""
    print("🚀 MongoDB Time Slots Setup (Similar to Patient System)")
    print("=" * 60)
    
    # Try to setup with local MongoDB first
    success = setup_mongodb_with_pymongo()
    
    if not success:
        print("\n💡 Alternative setup options:")
        print("1. Install MongoDB locally:")
        print("   - Windows: Download from https://www.mongodb.com/try/download/community")
        print("   - Mac: brew install mongodb-community")
        print("   - Linux: sudo apt-get install mongodb")
        print("\n2. Use Docker:")
        create_mongodb_docker_setup()
        print("\n3. Install Python dependencies:")
        print("   pip install pymongo mongoengine django djangorestframework")
        
    print("\n🏁 Setup completed!")

if __name__ == "__main__":
    main()