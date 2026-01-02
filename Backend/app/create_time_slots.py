#!/usr/bin/env python3
"""
Script to create default time slots for the next 30 days
Run this script to populate time slots in the database
"""

import os
import sys
import django
from datetime import datetime, date, timedelta

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from app.mongo_models import TimeSlot

def create_time_slots():
    """Create default time slots for the next 30 days"""
    
    # Define time slots (24-hour format)
    time_slots = [
        ('08:00', '09:00'),
        ('09:00', '10:00'),
        ('10:00', '11:00'),
        ('11:00', '12:00'),
        ('14:00', '15:00'),  # 2 PM - 3 PM
        ('15:00', '16:00'),  # 3 PM - 4 PM
        ('16:00', '17:00'),  # 4 PM - 5 PM
        ('17:00', '18:00'),  # 5 PM - 6 PM
    ]
    
    # Create slots for next 30 days
    start_date = date.today()
    end_date = start_date + timedelta(days=30)
    
    created_count = 0
    
    current_date = start_date
    while current_date <= end_date:
        # Skip Sundays (weekday 6)
        if current_date.weekday() != 6:
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
                        max_patients=10,  # Allow up to 10 patients per slot
                        unlimited_patients=False,
                        available_slots=10,
                        booked_slots=0,
                        available=True
                    )
                    time_slot.save()
                    created_count += 1
                    print(f"Created slot: {current_date} {start_time_str}-{end_time_str}")
        
        current_date += timedelta(days=1)
    
    print(f"\nCreated {created_count} time slots for {(end_date - start_date).days + 1} days")
    print("Time slots created successfully!")

if __name__ == '__main__':
    create_time_slots()