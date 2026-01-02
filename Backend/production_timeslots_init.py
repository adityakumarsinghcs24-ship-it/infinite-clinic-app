#!/usr/bin/env python3
"""
Production Time Slots Initialization
This script initializes time slots in production MongoDB
"""

import os
import sys
import django
from datetime import datetime, date, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings_prod')
django.setup()

def init_production_timeslots():
    """Initialize time slots in production MongoDB"""
    try:
        print("🚀 Initializing Production Time Slots...")
        
        from app.mongo_models import TimeSlot
        
        # Check existing time slots
        existing_count = TimeSlot.objects.count()
        print(f"📊 Existing time slots: {existing_count}")
        
        if existing_count > 0:
            print("✅ Time slots already exist in production")
            return True
        
        # Create time slots for next 30 days
        start_date = date.today()
        total_created = 0
        
        print("🏗️ Creating time slots for next 30 days...")
        
        for i in range(30):
            current_date = start_date + timedelta(days=i)
            
            # Skip Sundays
            if current_date.weekday() == 6:
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
                
                # Create time slot
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
        
        print(f"✅ Production time slots initialized: {total_created} slots created")
        return True
        
    except Exception as e:
        print(f"❌ Error initializing production time slots: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = init_production_timeslots()
    if success:
        print("🎉 Production time slots ready!")
    else:
        print("❌ Failed to initialize production time slots")