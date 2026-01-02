#!/usr/bin/env python3
"""
Test MongoDB connection and initialize time slots
"""

import os
import sys
import django
from datetime import datetime, date, timedelta

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

def test_mongodb_connection():
    """Test MongoDB connection and basic operations"""
    try:
        print("🔍 Testing MongoDB connection...")
        
        # Import after Django setup
        from app.mongo_models import TimeSlot
        from mongoengine.connection import get_db
        
        # Test basic connection
        db = get_db()
        collections = db.list_collection_names()
        print(f"✅ MongoDB connected successfully!")
        print(f"📊 Database: {db.name}")
        print(f"📁 Collections: {len(collections)} found")
        
        # Test TimeSlot model
        time_slots_count = TimeSlot.objects.count()
        print(f"⏰ Time slots in database: {time_slots_count}")
        
        return True, None
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        return False, str(e)

def create_sample_time_slots():
    """Create sample time slots for testing"""
    try:
        print("\n🏗️ Creating sample time slots...")
        
        from app.mongo_models import TimeSlot
        
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
                existing_slot = TimeSlot.objects.filter(
                    date=current_date,
                    start_time=start_datetime,
                    end_time=end_datetime
                ).first()
                
                if not existing_slot:
                    # Create new time slot
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
                    time_slot.save()
                    created_for_date += 1
                    total_created += 1
            
            if created_for_date > 0:
                print(f"📅 {current_date}: Created {created_for_date} time slots")
            else:
                print(f"📅 {current_date}: All slots already exist")
        
        print(f"✅ Total time slots created: {total_created}")
        return True, total_created
        
    except Exception as e:
        print(f"❌ Error creating time slots: {str(e)}")
        import traceback
        traceback.print_exc()
        return False, str(e)

def test_api_endpoints():
    """Test the API endpoints"""
    try:
        print("\n🌐 Testing API endpoints...")
        
        import requests
        
        # Test endpoints
        base_url = "http://localhost:8000/api/mongo"
        endpoints = [
            "/test/",
            "/simple-time-slots/",
            "/time-slots/"
        ]
        
        for endpoint in endpoints:
            try:
                url = f"{base_url}{endpoint}"
                response = requests.get(url, timeout=5)
                if response.status_code == 200:
                    print(f"✅ {endpoint}: Working (200)")
                else:
                    print(f"⚠️ {endpoint}: Status {response.status_code}")
            except requests.exceptions.ConnectionError:
                print(f"❌ {endpoint}: Server not running")
            except Exception as e:
                print(f"❌ {endpoint}: Error - {str(e)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing endpoints: {str(e)}")
        return False

def main():
    """Main function"""
    print("🚀 MongoDB Test & Initialization Script")
    print("=" * 50)
    
    # Test MongoDB connection
    mongodb_ok, error = test_mongodb_connection()
    
    if mongodb_ok:
        # Create sample time slots
        slots_ok, result = create_sample_time_slots()
        
        if slots_ok:
            print(f"\n✅ MongoDB setup completed successfully!")
            print(f"📊 Time slots created: {result}")
        else:
            print(f"\n⚠️ MongoDB connected but time slot creation failed: {result}")
    else:
        print(f"\n❌ MongoDB connection failed: {error}")
        print("\n💡 Possible solutions:")
        print("1. Check if MongoDB is running")
        print("2. Verify MONGO_URI in .env file")
        print("3. Check network connectivity")
        print("4. Verify MongoDB credentials")
    
    # Test API endpoints (optional)
    print("\n" + "=" * 50)
    test_api_endpoints()
    
    print("\n🏁 Test completed!")

if __name__ == "__main__":
    main()