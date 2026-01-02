#!/usr/bin/env python3
"""
Simple Time Slots API using JSON file (MongoDB simulation)
This works without MongoDB/Django dependencies
"""

import json
import os
from datetime import datetime, date, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:5174', 'http://127.0.0.1:5174'])

# JSON file path
TIMESLOTS_DB_FILE = 'timeslots_db.json'

def load_timeslots_db():
    """Load time slots from JSON file (like MongoDB collection)"""
    try:
        if os.path.exists(TIMESLOTS_DB_FILE):
            with open(TIMESLOTS_DB_FILE, 'r') as f:
                return json.load(f)
        else:
            return {
                "timeslots": [],
                "metadata": {
                    "created_at": datetime.utcnow().isoformat(),
                    "last_updated": datetime.utcnow().isoformat(),
                    "version": "1.0"
                }
            }
    except Exception as e:
        print(f"Error loading timeslots DB: {e}")
        return {"timeslots": [], "metadata": {}}

def save_timeslots_db(db_data):
    """Save time slots to JSON file (like MongoDB save)"""
    try:
        db_data['metadata']['last_updated'] = datetime.utcnow().isoformat()
        with open(TIMESLOTS_DB_FILE, 'w') as f:
            json.dump(db_data, f, indent=2, default=str)
        return True
    except Exception as e:
        print(f"Error saving timeslots DB: {e}")
        return False

def create_default_timeslots_for_date(target_date_str):
    """Create default time slots for a date (like MongoDB document creation)"""
    try:
        target_date = datetime.strptime(target_date_str, '%Y-%m-%d').date()
        
        # Skip Sundays
        if target_date.weekday() == 6:
            return []
        
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
        
        created_slots = []
        for i, (start_time_str, end_time_str) in enumerate(time_slots):
            slot = {
                'id': f'slot_{target_date_str}_{i}',
                'date': target_date_str,
                'start_time': start_time_str,
                'end_time': end_time_str,
                'display_time': f"{start_time_str} - {end_time_str}",
                'available_slots': 10,
                'booked_slots': 0,
                'unlimited_patients': False,
                'available': True,
                'created_at': datetime.utcnow().isoformat()
            }
            created_slots.append(slot)
        
        return created_slots
        
    except Exception as e:
        print(f"Error creating default timeslots: {e}")
        return []

# API Routes

@app.route('/api/mongo/test/', methods=['GET'])
def test_api():
    """Test API endpoint (like MongoDB test)"""
    try:
        db_data = load_timeslots_db()
        timeslots_count = len(db_data.get('timeslots', []))
        
        return jsonify({
            'success': True,
            'message': 'Simple Time Slots API is working',
            'timestamp': datetime.utcnow().isoformat(),
            'timeslots_storage': {
                'type': 'JSON file (MongoDB simulation)',
                'file': TIMESLOTS_DB_FILE,
                'timeslots_count': timeslots_count
            },
            'endpoints': {
                'time_slots': '/api/mongo/time-slots/',
                'simple_time_slots': '/api/mongo/simple-time-slots/',
                'create_time_slots': '/api/mongo/create-time-slots/',
                'test': '/api/mongo/test/'
            },
            'note': 'Time slots stored in JSON file (like MongoDB collection)'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/mongo/time-slots/', methods=['GET', 'POST'])
def time_slots():
    """Time slots API (like MongoDB collection operations)"""
    if request.method == 'GET':
        try:
            date_param = request.args.get('date', date.today().isoformat())
            print(f"Fetching time slots for date: {date_param}")
            
            # Load from JSON file (like MongoDB query)
            db_data = load_timeslots_db()
            all_slots = db_data.get('timeslots', [])
            
            # Filter by date (like MongoDB filter)
            date_slots = [slot for slot in all_slots if slot.get('date') == date_param and slot.get('available', True)]
            
            # If no slots exist, create default ones (like MongoDB auto-creation)
            if not date_slots:
                print(f"No slots found, creating default slots for {date_param}")
                new_slots = create_default_timeslots_for_date(date_param)
                
                # Add to database (like MongoDB insert)
                db_data['timeslots'].extend(new_slots)
                save_timeslots_db(db_data)
                
                date_slots = new_slots
            
            print(f"Returning {len(date_slots)} time slots")
            
            return jsonify({
                'success': True,
                'date': date_param,
                'slots': date_slots,
                'source': 'json_file_mongodb_simulation',
                'total_slots': len(date_slots)
            })
            
        except Exception as e:
            print(f"Error in time slots GET: {e}")
            return jsonify({
                'success': False,
                'error': str(e),
                'date': date_param if 'date_param' in locals() else date.today().isoformat(),
                'slots': []
            }), 500
    
    elif request.method == 'POST':
        try:
            # Create new time slot (like MongoDB insert)
            data = request.get_json()
            
            new_slot = {
                'id': f"custom_{data.get('date')}_{datetime.utcnow().timestamp()}",
                'date': data.get('date'),
                'start_time': data.get('start_time'),
                'end_time': data.get('end_time'),
                'display_time': f"{data.get('start_time')} - {data.get('end_time')}",
                'available_slots': data.get('max_patients', 10),
                'booked_slots': 0,
                'unlimited_patients': data.get('unlimited_patients', False),
                'available': True,
                'created_at': datetime.utcnow().isoformat()
            }
            
            # Save to JSON file (like MongoDB save)
            db_data = load_timeslots_db()
            db_data['timeslots'].append(new_slot)
            save_timeslots_db(db_data)
            
            return jsonify({
                'success': True,
                'time_slot': new_slot,
                'message': 'Time slot created successfully'
            }), 201
            
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 400

@app.route('/api/mongo/simple-time-slots/', methods=['GET'])
def simple_time_slots():
    """Simple time slots endpoint (like MongoDB simple query)"""
    try:
        date_param = request.args.get('date', date.today().isoformat())
        print(f"Simple time slots for date: {date_param}")
        
        # Load from JSON file (like MongoDB query)
        db_data = load_timeslots_db()
        all_slots = db_data.get('timeslots', [])
        
        # Filter by date
        date_slots = [slot for slot in all_slots if slot.get('date') == date_param and slot.get('available', True)]
        
        # If no slots exist, create default ones
        if not date_slots:
            print(f"Creating default slots for {date_param}")
            new_slots = create_default_timeslots_for_date(date_param)
            
            # Add to database
            db_data['timeslots'].extend(new_slots)
            save_timeslots_db(db_data)
            
            date_slots = new_slots
        
        return jsonify({
            'success': True,
            'date': date_param,
            'slots': date_slots,
            'source': 'json_file_simple',
            'total_slots': len(date_slots)
        })
        
    except Exception as e:
        print(f"Error in simple time slots: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'date': date_param if 'date_param' in locals() else date.today().isoformat(),
            'slots': []
        }), 500

@app.route('/api/mongo/create-time-slots/', methods=['POST'])
def create_time_slots_bulk():
    """Create time slots for multiple days (like MongoDB bulk insert)"""
    try:
        data = request.get_json() or {}
        days = data.get('days', 30)
        start_date = date.today()
        
        db_data = load_timeslots_db()
        total_created = 0
        days_created = 0
        
        for i in range(days):
            current_date = start_date + timedelta(days=i)
            date_str = current_date.isoformat()
            
            # Check if slots already exist for this date
            existing_slots = [slot for slot in db_data['timeslots'] if slot.get('date') == date_str]
            
            if not existing_slots:
                new_slots = create_default_timeslots_for_date(date_str)
                if new_slots:
                    db_data['timeslots'].extend(new_slots)
                    total_created += len(new_slots)
                    days_created += 1
        
        # Save to file (like MongoDB bulk save)
        save_timeslots_db(db_data)
        
        return jsonify({
            'success': True,
            'message': f'Time slots created for {days_created} days',
            'start_date': start_date.isoformat(),
            'days_processed': days,
            'days_with_slots_created': days_created,
            'total_slots_created': total_created,
            'source': 'json_file_bulk'
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/mongo/book-test/', methods=['POST'])
def book_test():
    """Simple booking endpoint"""
    try:
        data = request.get_json()
        booking_id = f"BK{int(datetime.utcnow().timestamp())}"
        
        return jsonify({
            'success': True,
            'message': 'Test booking successful!',
            'booking_id': booking_id,
            'total_amount': data.get('total_price', 0),
            'booking_date': data.get('booking_date', date.today().isoformat()),
            'time_slot_info': {
                'id': data.get('time_slot_id'),
                'time': data.get('preferred_time', 'Custom time')
            },
            'note': 'Demo booking with JSON file storage'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        'message': 'Simple Time Slots API (MongoDB Simulation)',
        'status': 'running',
        'storage': 'JSON file (like MongoDB collection)',
        'endpoints': {
            'test': '/api/mongo/test/',
            'time_slots': '/api/mongo/time-slots/',
            'simple_time_slots': '/api/mongo/simple-time-slots/',
            'create_time_slots': '/api/mongo/create-time-slots/',
            'book_test': '/api/mongo/book-test/'
        }
    })

if __name__ == '__main__':
    print("🚀 Starting Simple Time Slots API (MongoDB Simulation)")
    print("📁 Storage: JSON file (like MongoDB collection)")
    print("🌐 Server: http://localhost:8000")
    print("📋 Endpoints:")
    print("   - GET  /api/mongo/test/")
    print("   - GET  /api/mongo/time-slots/")
    print("   - GET  /api/mongo/simple-time-slots/")
    print("   - POST /api/mongo/create-time-slots/")
    print("   - POST /api/mongo/book-test/")
    
    app.run(host='0.0.0.0', port=8000, debug=True)