#!/usr/bin/env python3
"""
Production Startup Script
Ensures time slots are available when the server starts
"""

import os
import django
from datetime import datetime, date, timedelta

def ensure_timeslots_exist():
    """Ensure time slots exist in production"""
    try:
        # Setup Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings_prod')
        django.setup()
        
        from app.mongo_models import TimeSlot
        
        print("🔍 Checking time slots availability...")
        
        # Check if we have time slots for today and next few days
        today = date.today()
        slots_needed = False
        
        for i in range(7):  # Check next 7 days
            check_date = today + timedelta(days=i)
            if check_date.weekday() == 6:  # Skip Sundays
                continue
                
            existing_slots = TimeSlot.objects.filter(date=check_date).count()
            if existing_slots == 0:
                slots_needed = True
                break
        
        if not slots_needed:
            print("✅ Time slots already available")
            return True
        
        print("🏗️ Creating missing time slots...")
        
        # Create time slots for next 30 days
        total_created = 0
        
        for i in range(30):
            current_date = today + timedelta(days=i)
            
            # Skip Sundays
            if current_date.weekday() == 6:
                continue
            
            # Check if slots already exist for this date
            existing_slots = TimeSlot.objects.filter(date=current_date).count()
            if existing_slots > 0:
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
                total_created += 1
        
        print(f"✅ Created {total_created} time slots for production")
        return True
        
    except Exception as e:
        print(f"⚠️ Could not ensure time slots (will create on-demand): {e}")
        return False

if __name__ == "__main__":
    ensure_timeslots_exist()