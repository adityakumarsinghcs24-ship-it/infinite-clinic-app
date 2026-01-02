#!/usr/bin/env python3
"""
Simple test script to create time slots and test the API
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

from app.mongo_models import TimeSlot

def test_time_slots():
    """Test time slot creation and retrieval"""
    
    print("Testing time slot functionality...")
    
    # Test 1: Create a simple time slot for today
    today = date.today()
    start_time = datetime.combine(today, datetime.strptime('09:00', '%H:%M').time())
    end_time = datetime.combine(today, datetime.strptime('10:00', '%H:%M').time())
    
    # Check if slot already exists
    existing_slot = TimeSlot.objects.filter(
        date=today,
        start_time=start_time,
        end_time=end_time
    ).first()
    
    if existing_slot:
        print(f"✓ Time slot already exists: {existing_slot}")
    else:
        # Create new time slot
        time_slot = TimeSlot(
            date=today,
            start_time=start_time,
            end_time=end_time,
            max_patients=10,
            unlimited_patients=False,
            available_slots=10,
            booked_slots=0,
            available=True
        )
        time_slot.save()
        print(f"✓ Created new time slot: {time_slot}")
    
    # Test 2: Query all time slots for today
    today_slots = TimeSlot.objects.filter(date=today)
    print(f"✓ Found {today_slots.count()} time slots for today")
    
    for slot in today_slots:
        print(f"  - {slot.start_time.strftime('%H:%M')} - {slot.end_time.strftime('%H:%M')} (Available: {slot.available})")
    
    # Test 3: Create multiple slots for today if none exist
    if today_slots.count() == 0:
        print("Creating default time slots for today...")
        create_default_slots_for_date(today)
        
        # Query again
        today_slots = TimeSlot.objects.filter(date=today)
        print(f"✓ Now have {today_slots.count()} time slots for today")

def create_default_slots_for_date(target_date):
    """Create default time slots for a specific date"""
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
    
    for start_time_str, end_time_str in time_slots:
        start_datetime = datetime.combine(target_date, datetime.strptime(start_time_str, '%H:%M').time())
        end_datetime = datetime.combine(target_date, datetime.strptime(end_time_str, '%H:%M').time())
        
        existing_slot = TimeSlot.objects.filter(
            date=target_date,
            start_time=start_datetime,
            end_time=end_datetime
        ).first()
        
        if not existing_slot:
            time_slot = TimeSlot(
                date=target_date,
                start_time=start_datetime,
                end_time=end_datetime,
                max_patients=10,
                unlimited_patients=False,
                available_slots=10,
                booked_slots=0,
                available=True
            )
            time_slot.save()
            print(f"  Created: {start_time_str}-{end_time_str}")

if __name__ == '__main__':
    test_time_slots()
    print("\nTime slot test completed!")