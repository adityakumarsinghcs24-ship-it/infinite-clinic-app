from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .mongo_models import Patient, Consultation, Test, Cart, CartItem
import json
from bson import ObjectId
from datetime import datetime

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
        
        print(f"Cart items: {cart_items}")  # Debug log
        print(f"Total price: {total_price}")  # Debug log
        
        # Store all patients from the booking
        booking_patients = []
        booking_info = {
            'booking_id': f"BK{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            'total_amount': total_price,
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
                        
                    # Create patient in MongoDB
                    patient = Patient(
                        first_name=patient_data.get('name', ''),
                        age=int(patient_data.get('age', 0)) if patient_data.get('age') else 0,
                        gender=patient_data.get('gender', '').upper()[:1] if patient_data.get('gender') else 'O',
                        phone_number=None,
                        email=None
                    )
                    patient.save()
                    print(f"Saved patient: {patient.first_name} with ID: {patient.id}")  # Debug log
                    
                    patient_info = {
                        'type': 'other',
                        'patient_id': str(patient.id),
                        'patient_name': patient.first_name,
                        'age': patient.age,
                        'gender': patient.gender
                    }
                    
                    booking_patients.append(patient_info)
                    test_info['patient_details'].append(patient_info)
            
            booking_info['tests_booked'].append(test_info)
        
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
            'booking_details': booking_info,
            'patients_saved': booking_patients
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"Booking error: {str(e)}")  # Debug log
        import traceback
        traceback.print_exc()  # Print full error trace
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)