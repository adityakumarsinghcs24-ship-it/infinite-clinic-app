#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

import pymongo
from pymongo import MongoClient

def fix_indexes():
    print("🔧 Fixing MongoDB indexes...")
    
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017')
        db = client['infinite_clinic_db']
        
        # Drop the unique indexes that are causing issues
        patients_collection = db['patients']
        
        print("📋 Current indexes:")
        for index in patients_collection.list_indexes():
            print(f"   - {index}")
        
        # Drop problematic unique indexes
        try:
            patients_collection.drop_index("phone_number_1")
            print("✅ Dropped phone_number unique index")
        except Exception as e:
            print(f"ℹ️  phone_number index: {e}")
        
        try:
            patients_collection.drop_index("email_1")
            print("✅ Dropped email unique index")
        except Exception as e:
            print(f"ℹ️  email index: {e}")
        
        print("\n📋 Indexes after cleanup:")
        for index in patients_collection.list_indexes():
            print(f"   - {index}")
        
        print("\n🎉 MongoDB indexes fixed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    fix_indexes()