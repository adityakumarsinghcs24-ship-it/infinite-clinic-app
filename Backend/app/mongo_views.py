from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .mongo_models import Patient, Consultation, Test, Cart, CartItem, TimeSlot, Booking
import json
import base64
from bson import ObjectId
from datetime import datetime, date, timedelta
import os

# Custom JSON encoder for MongoDB ObjectId
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

def serialize_patient(patient):
    """Convert Patient document to dict"""
    return {
        'id': str(patient.id),
        'first_name': patient.first_name,
        'age': patient.age,
        'gender': patient.gender,
        'phone_number': patient.phone_number,
        'email': patient.email,
        'prescription_file': patient.prescription_file,
        'prescription_filename': patient.prescription_filename,
        'created_at': patient.created_at.isoformat() if patient.created_at else None
    }

def serialize_consultation(consultation):
    """Convert Consultation document to dict"""
    return {
        'id': str(consultation.id),
        'docname': consultation.docname,
        'specialization': consultation.specialization,
        'price': float(consultation.price),
        'created_at': consultation.created_at.isoformat() if consultation.created_at else None
    }

def serialize_test(test):
    """Convert Test document to dict"""
    return {
        'id': str(test.id),
        'name': test.name,
        'description': test.description,
        'price': float(test.price),
        'created_at': test.created_at.isoformat() if test.created_at else None
    }

# Patient API Views
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def patient_list_create(request):
    if request.method == 'GET':
        try:
            patients = Patient.objects.all()
            patient_data = [serialize_patient(p) for p in patients]
            return Response(patient_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        try:
            data = request.data
            patient = Patient(
                first_name=data.get('first_name'),
                age=data.get('age'),
                gender=data.get('gender'),
                phone_number=data.get('phone_number'),
                email=data.get('email')
            )
            patient.save()
            return Response(serialize_patient(patient), status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def patient_detail(request, patient_id):
    try:
        patient = Patient.objects.get(id=patient_id)
    except Patient.DoesNotExist:
        return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        return Response(serialize_patient(patient), status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        try:
            data = request.data
            patient.first_name = data.get('first_name', patient.first_name)
            patient.age = data.get('age', patient.age)
            patient.gender = data.get('gender', patient.gender)
            patient.phone_number = data.get('phone_number', patient.phone_number)
            patient.email = data.get('email', patient.email)
            patient.save()
            return Response(serialize_patient(patient), status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        try:
            patient.delete()
            return Response({'message': 'Patient deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Consultation API Views
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def consultation_list_create(request):
    if request.method == 'GET':
        try:
            consultations = Consultation.objects.all()
            consultation_data = [serialize_consultation(c) for c in consultations]
            return Response(consultation_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        try:
            data = request.data
            consultation = Consultation(
                docname=data.get('docname'),
                specialization=data.get('specialization'),
                price=data.get('price')
            )
            consultation.save()
            return Response(serialize_consultation(consultation), status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Test API Views
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def test_list_create(request):
    if request.method == 'GET':
        try:
            tests = Test.objects.all()
            test_data = [serialize_test(t) for t in tests]
            return Response(test_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        try:
            data = request.data
            test = Test(
                name=data.get('name'),
                description=data.get('description'),
                price=data.get('price')
            )
            test.save()
            return Response(serialize_test(test), status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Dashboard Stats
@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    try:
        stats = {
            'total_patients': Patient.objects.count(),
            'total_consultations': Consultation.objects.count(),
            'total_tests': Test.objects.count(),
            'recent_patients': [serialize_patient(p) for p in Patient.objects.order_by('-created_at')[:5]]
        }
        return Response(stats, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Test Booking with Patient Data
@api_view(['POST'])
@permission_classes([AllowAny])
def book_test_with_patients(request):
    try:
        print(f"Received booking data: {request.data}")  # Debug log
        
        data = request.data
        cart_items = data.get('cart_items', [])
        total_price = data.get('total_price', 0)
        booking_date = data.get('booking_date')  # Expected format: YYYY-MM-DD
        time_slot_id = data.get('time_slot_id')
        preferred_time = data.get('preferred_time')
        
        print(f"Cart items: {cart_items}")  # Debug log
        print(f"Total price: {total_price}")  # Debug log
        print(f"Booking date: {booking_date}, Time slot: {time_slot_id}")  # Debug log
        
        # Parse booking date
        if booking_date:
            try:
                booking_date_obj = datetime.strptime(booking_date, '%Y-%m-%d').date()
            except ValueError:
                booking_date_obj = date.today()
        else:
            booking_date_obj = date.today()
        
        # Get time slot if provided
        time_slot = None
        if time_slot_id:
            try:
                time_slot = TimeSlot.objects.get(id=time_slot_id)
                # Update booked slots
                time_slot.booked_slots += 1
                time_slot.save()
            except TimeSlot.DoesNotExist:
                pass
        
        # Store all patients from the booking
        booking_patients = []
        booking_info = {
            'booking_id': f"BK{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            'total_amount': total_price,
            'booking_date': booking_date_obj.isoformat(),
            'time_slot': str(time_slot.id) if time_slot else None,
            'preferred_time': preferred_time,
            'tests_booked': []
        }
        
        for cart_item in cart_items:
            test_name = cart_item.get('name', '')
            patients = cart_item.get('patients', [])
            
            print(f"Processing test: {test_name}, patients: {patients}")  # Debug log
            
            test_info = {
                'test_name': test_name,
                'price': cart_item.get('price', 0),
                'patients_count': len(patients),
                'patient_details': []
            }
            
            # If no patients provided, this might be a "Self" booking
            if not patients:
                print(f"No patients provided for {test_name} - treating as self booking")  # Debug log
                test_info['patients_count'] = 1
                test_info['patient_details'].append({'type': 'self', 'note': 'Booked for self'})
            else:
                for patient_data in patients:
                    # Handle "Self" patients
                    if patient_data.get('name', '').startswith('Self'):
                        print(f"Self booking for: {patient_data}")  # Debug log
                        test_info['patient_details'].append({'type': 'self', 'note': 'Booked for self'})
                        continue
                    
                    # Skip empty patient data
                    if not patient_data.get('name') or not patient_data.get('age'):
                        print(f"Skipping incomplete patient: {patient_data}")  # Debug log
                        continue
                    
                    # Handle prescription file if provided
                    prescription_file_path = None
                    prescription_filename = None
                    
                    if patient_data.get('prescription_file'):
                        try:
                            # Decode base64 file
                            file_data = patient_data['prescription_file']
                            if ',' in file_data:
                                header, file_data = file_data.split(',', 1)
                            
                            file_content = base64.b64decode(file_data)
                            filename = patient_data.get('prescription_filename', f'prescription_{datetime.utcnow().strftime("%Y%m%d_%H%M%S")}.pdf')
                            
                            # Save file
                            file_path = f'prescriptions/{filename}'
                            saved_path = default_storage.save(file_path, ContentFile(file_content))
                            prescription_file_path = saved_path
                            prescription_filename = filename
                            
                            print(f"Saved prescription file: {saved_path}")  # Debug log
                        except Exception as e:
                            print(f"Error saving prescription file: {e}")  # Debug log
                        
                    # Create patient in MongoDB
                    patient = Patient(
                        first_name=patient_data.get('name', ''),
                        age=int(patient_data.get('age', 0)) if patient_data.get('age') else 0,
                        gender=patient_data.get('gender', '').upper()[:1] if patient_data.get('gender') else 'O',
                        phone_number=patient_data.get('phone'),
                        email=patient_data.get('email'),
                        prescription_file=prescription_file_path,
                        prescription_filename=prescription_filename
                    )
                    patient.save()
                    print(f"Saved patient: {patient.first_name} with ID: {patient.id}")  # Debug log
                    
                    patient_info = {
                        'type': 'other',
                        'patient_id': str(patient.id),
                        'patient_name': patient.first_name,
                        'age': patient.age,
                        'gender': patient.gender,
                        'has_prescription': bool(prescription_file_path)
                    }
                    
                    booking_patients.append(patient_info)
                    test_info['patient_details'].append(patient_info)
            
            booking_info['tests_booked'].append(test_info)
        
        # Create booking record
        booking = Booking(
            booking_id=booking_info['booking_id'],
            patients=[Patient.objects.get(id=p['patient_id']) for p in booking_patients if p['type'] == 'other'],
            tests=[item['test_name'] for item in booking_info['tests_booked']],
            total_amount=total_price,
            booking_date=booking_date_obj,
            time_slot=time_slot,
            preferred_time=preferred_time,
            status='confirmed'
        )
        booking.save()
        
        print(f"Total patients saved to MongoDB: {len(booking_patients)}")  # Debug log
        print(f"Booking summary: {booking_info}")  # Debug log
        
        print(f"Total patients saved: {len(booking_patients)}")  # Debug log
        
        # Return booking confirmation
        return Response({
            'success': True,
            'message': 'Test booking successful!',
            'booking_id': booking_info['booking_id'],
            'total_patients_saved': len(booking_patients),
            'total_amount': total_price,
            'booking_date': booking_date_obj.isoformat(),
            'time_slot_info': {
                'id': str(time_slot.id) if time_slot else None,
                'time': f"{time_slot.start_time.strftime('%H:%M')} - {time_slot.end_time.strftime('%H:%M')}" if time_slot else preferred_time
            },
            'booking_details': booking_info,
            'patients_saved': booking_patients
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"Booking error: {str(e)}")  # Debug log
        import traceback
        traceback.print_exc()  # Print full error trace
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Time Slots API
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def time_slots(request):
    if request.method == 'GET':
        try:
            # Get date parameter (default to today)
            date_str = request.GET.get('date')
            if date_str:
                try:
                    target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                except ValueError:
                    target_date = date.today()
            else:
                target_date = date.today()
            
            # Check if we have any time slots for this date
            slots = TimeSlot.objects.filter(date=target_date).order_by('start_time')
            
            # If no slots exist, create default ones
            if not slots.exists():
                create_default_time_slots(target_date)
                slots = TimeSlot.objects.filter(date=target_date, available=True).order_by('start_time')
            else:
                slots = slots.filter(available=True)
            
            slot_data = []
            for slot in slots:
                slot_info = {
                    'id': str(slot.id),
                    'date': slot.date.isoformat(),
                    'start_time': slot.start_time.strftime('%H:%M'),
                    'end_time': slot.end_time.strftime('%H:%M'),
                    'display_time': f"{slot.start_time.strftime('%H:%M')} - {slot.end_time.strftime('%H:%M')}",
                    'available_slots': slot.available_slots,
                    'booked_slots': slot.booked_slots,
                    'unlimited_patients': slot.unlimited_patients,
                    'available': slot.available
                }
                slot_data.append(slot_info)
            
            return Response({
                'date': target_date.isoformat(),
                'slots': slot_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Time slots error: {str(e)}")  # Debug log
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        try:
            # Create new time slot (admin functionality)
            data = request.data
            
            slot_date = datetime.strptime(data.get('date'), '%Y-%m-%d').date()
            start_time = datetime.strptime(f"{data.get('date')} {data.get('start_time')}", '%Y-%m-%d %H:%M')
            end_time = datetime.strptime(f"{data.get('date')} {data.get('end_time')}", '%Y-%m-%d %H:%M')
            
            time_slot = TimeSlot(
                date=slot_date,
                start_time=start_time,
                end_time=end_time,
                max_patients=data.get('max_patients'),
                unlimited_patients=data.get('unlimited_patients', True)
            )
            time_slot.save()
            
            return Response({
                'id': str(time_slot.id),
                'message': 'Time slot created successfully'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


def create_default_time_slots(target_date):
    """Create default time slots for a specific date"""
    try:
        # Skip Sundays
        if target_date.weekday() == 6:
            return
        
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
        
        for start_time_str, end_time_str in time_slots:
            # Create datetime objects
            start_datetime = datetime.combine(target_date, datetime.strptime(start_time_str, '%H:%M').time())
            end_datetime = datetime.combine(target_date, datetime.strptime(end_time_str, '%H:%M').time())
            
            # Check if slot already exists
            existing_slot = TimeSlot.objects.filter(
                date=target_date,
                start_time=start_datetime,
                end_time=end_datetime
            ).first()
            
            if not existing_slot:
                # Create new time slot
                time_slot = TimeSlot(
                    date=target_date,
                    start_time=start_datetime,
                    end_time=end_datetime,
                    max_patients=10,  # Allow up to 10 patients per slot
                    unlimited_patients=False,
                    available_slots=10,
                    booked_slots=0,
                    available=True
                )
                time_slot.save()
                print(f"Created slot: {target_date} {start_time_str}-{end_time_str}")
    
    except Exception as e:
        print(f"Error creating default time slots: {e}")
        import traceback
        traceback.print_exc()


# Utility endpoint to create time slots for multiple days
@api_view(['POST'])
@permission_classes([AllowAny])
def create_time_slots_for_days(request):
    """Create time slots for the next N days"""
    try:
        days = request.data.get('days', 30)  # Default 30 days
        start_date = date.today()
        created_count = 0
        
        for i in range(days):
            current_date = start_date + timedelta(days=i)
            # Skip past dates
            if current_date < start_date:
                continue
                
            create_default_time_slots(current_date)
            created_count += 1
        
        return Response({
            'success': True,
            'message': f'Time slots created for {created_count} days',
            'start_date': start_date.isoformat(),
            'days_created': created_count
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)