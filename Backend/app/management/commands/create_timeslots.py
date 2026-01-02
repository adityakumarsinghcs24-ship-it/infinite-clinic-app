from django.core.management.base import BaseCommand
from datetime import datetime, date, timedelta
from app.mongo_models import TimeSlot, Patient

class Command(BaseCommand):
    help = 'Create time slots in MongoDB Atlas'

    def handle(self, *args, **options):
        self.stdout.write("🚀 Creating Time Slots in MongoDB Atlas")
        
        # Verify MongoDB connection
        try:
            patient_count = Patient.objects.count()
            self.stdout.write(f"✅ MongoDB connected! Found {patient_count} patients")
        except Exception as e:
            self.stdout.write(f"❌ MongoDB connection failed: {e}")
            return
        
        # Create time slots
        start_date = date.today()
        total_created = 0
        
        for i in range(30):
            current_date = start_date + timedelta(days=i)
            
            # Skip Sundays
            if current_date.weekday() == 6:
                continue
            
            # Check existing slots
            existing = TimeSlot.objects.filter(date=current_date).count()
            if existing > 0:
                self.stdout.write(f"📅 {current_date}: Already has {existing} slots")
                continue
            
            # Time slots
            time_slots = [
                ('08:00', '09:00'), ('09:00', '10:00'), ('10:00', '11:00'), ('11:00', '12:00'),
                ('14:00', '15:00'), ('15:00', '16:00'), ('16:00', '17:00'), ('17:00', '18:00')
            ]
            
            created_for_date = 0
            for start_str, end_str in time_slots:
                start_dt = datetime.combine(current_date, datetime.strptime(start_str, '%H:%M').time())
                end_dt = datetime.combine(current_date, datetime.strptime(end_str, '%H:%M').time())
                
                slot = TimeSlot(
                    date=current_date,
                    start_time=start_dt,
                    end_time=end_dt,
                    max_patients=10,
                    unlimited_patients=False,
                    available_slots=10,
                    booked_slots=0,
                    available=True
                )
                slot.save()
                created_for_date += 1
                total_created += 1
            
            self.stdout.write(f"📅 {current_date}: Created {created_for_date} slots")
        
        final_count = TimeSlot.objects.count()
        self.stdout.write(f"✅ SUCCESS! Total slots: {final_count}, Created: {total_created}")