#!/usr/bin/env python3
"""
Simple Time Slots Server using Python built-in modules
No external dependencies required - works like MongoDB storage
"""

import json
import os
import urllib.parse
from datetime import datetime, date, timedelta
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading

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

class TimeSlotHandler(BaseHTTPRequestHandler):
    """HTTP request handler for time slots API"""
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def send_json_response(self, data, status_code=200):
        """Send JSON response with CORS headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        response_json = json.dumps(data, default=str, indent=2)
        self.wfile.write(response_json.encode('utf-8'))
    
    def do_GET(self):
        """Handle GET requests"""
        try:
            # Parse URL and query parameters
            url_parts = urllib.parse.urlparse(self.path)
            path = url_parts.path
            query_params = urllib.parse.parse_qs(url_parts.query)
            
            print(f"GET request: {path}")
            
            if path == '/api/mongo/test/':
                self.handle_test_api()
            elif path == '/api/mongo/time-slots/':
                self.handle_time_slots_get(query_params)
            elif path == '/api/mongo/simple-time-slots/':
                self.handle_simple_time_slots(query_params)
            elif path == '/':
                self.handle_home()
            else:
                self.send_json_response({
                    'success': False,
                    'error': 'Endpoint not found',
                    'available_endpoints': [
                        '/api/mongo/test/',
                        '/api/mongo/time-slots/',
                        '/api/mongo/simple-time-slots/',
                        '/api/mongo/create-time-slots/'
                    ]
                }, 404)
                
        except Exception as e:
            print(f"Error in GET request: {e}")
            self.send_json_response({
                'success': False,
                'error': str(e)
            }, 500)
    
    def do_POST(self):
        """Handle POST requests"""
        try:
            # Parse URL
            url_parts = urllib.parse.urlparse(self.path)
            path = url_parts.path
            
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                request_data = json.loads(post_data.decode('utf-8')) if post_data else {}
            except json.JSONDecodeError:
                request_data = {}
            
            print(f"POST request: {path}")
            
            if path == '/api/mongo/create-time-slots/':
                self.handle_create_time_slots(request_data)
            elif path == '/api/mongo/book-test/':
                self.handle_book_test(request_data)
            else:
                self.send_json_response({
                    'success': False,
                    'error': 'POST endpoint not found'
                }, 404)
                
        except Exception as e:
            print(f"Error in POST request: {e}")
            self.send_json_response({
                'success': False,
                'error': str(e)
            }, 500)
    
    def handle_test_api(self):
        """Handle test API endpoint"""
        try:
            db_data = load_timeslots_db()
            timeslots_count = len(db_data.get('timeslots', []))
            
            response = {
                'success': True,
                'message': 'Built-in Time Slots API is working',
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
            }
            
            self.send_json_response(response)
            
        except Exception as e:
            self.send_json_response({
                'success': False,
                'error': str(e)
            }, 500)
    
    def handle_time_slots_get(self, query_params):
        """Handle time slots GET request with MongoDB Atlas integration"""
        try:
            date_param = query_params.get('date', [date.today().isoformat()])[0]
            print(f"Fetching time slots for date: {date_param}")
            
            # First try MongoDB Atlas connection
            try:
                from pymongo import MongoClient
                
                # MongoDB Atlas connection
                mongo_uri = "mongodb+srv://clinic_admin:12345%40clinic@cluster0.1rbiryd.mongodb.net/?appName=Cluster0"
                db_name = "infinite_clinic_db"
                
                print(f"🔄 Trying MongoDB Atlas connection...")
                client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
                client.admin.command('ping')
                
                # Get time slots from MongoDB Atlas
                db = client[db_name]
                timeslots_collection = db['timeslots']
                
                # Parse date for MongoDB query
                target_date = datetime.strptime(date_param, '%Y-%m-%d').date()
                
                # Query MongoDB Atlas
                atlas_slots = list(timeslots_collection.find({
                    'date': target_date,
                    'available': True
                }).sort('start_time', 1))
                
                if atlas_slots:
                    # Convert MongoDB documents to API format
                    slot_data = []
                    for slot in atlas_slots:
                        slot_info = {
                            'id': str(slot['_id']),
                            'date': slot['date'].isoformat() if hasattr(slot['date'], 'isoformat') else str(slot['date']),
                            'start_time': slot['start_time'].strftime('%H:%M') if hasattr(slot['start_time'], 'strftime') else str(slot['start_time'])[:5],
                            'end_time': slot['end_time'].strftime('%H:%M') if hasattr(slot['end_time'], 'strftime') else str(slot['end_time'])[:5],
                            'display_time': f"{slot['start_time'].strftime('%H:%M') if hasattr(slot['start_time'], 'strftime') else str(slot['start_time'])[:5]} - {slot['end_time'].strftime('%H:%M') if hasattr(slot['end_time'], 'strftime') else str(slot['end_time'])[:5]}",
                            'available_slots': slot.get('available_slots', 10),
                            'booked_slots': slot.get('booked_slots', 0),
                            'unlimited_patients': slot.get('unlimited_patients', False),
                            'available': slot.get('available', True)
                        }
                        slot_data.append(slot_info)
                    
                    client.close()
                    print(f"✅ Found {len(slot_data)} slots in MongoDB Atlas")
                    
                    response = {
                        'success': True,
                        'date': date_param,
                        'slots': slot_data,
                        'source': 'mongodb_atlas',
                        'total_slots': len(slot_data)
                    }
                    
                    self.send_json_response(response)
                    return
                
                client.close()
                print("⚠️ No slots found in MongoDB Atlas, trying JSON fallback...")
                
            except ImportError:
                print("⚠️ pymongo not available, using JSON fallback...")
            except Exception as mongo_error:
                print(f"⚠️ MongoDB Atlas error: {mongo_error}, using JSON fallback...")
            
            # Fallback to JSON file (existing logic)
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
            
            print(f"Returning {len(date_slots)} time slots from JSON fallback")
            
            response = {
                'success': True,
                'date': date_param,
                'slots': date_slots,
                'source': 'json_file_fallback',
                'total_slots': len(date_slots)
            }
            
            self.send_json_response(response)
            
        except Exception as e:
            print(f"Error in time slots GET: {e}")
            self.send_json_response({
                'success': False,
                'error': str(e),
                'date': date_param if 'date_param' in locals() else date.today().isoformat(),
                'slots': []
            }, 500)
    
    def handle_simple_time_slots(self, query_params):
        """Handle simple time slots request"""
        try:
            date_param = query_params.get('date', [date.today().isoformat()])[0]
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
            
            response = {
                'success': True,
                'date': date_param,
                'slots': date_slots,
                'source': 'json_file_simple',
                'total_slots': len(date_slots)
            }
            
            self.send_json_response(response)
            
        except Exception as e:
            print(f"Error in simple time slots: {e}")
            self.send_json_response({
                'success': False,
                'error': str(e),
                'date': date_param if 'date_param' in locals() else date.today().isoformat(),
                'slots': []
            }, 500)
    
    def handle_create_time_slots(self, request_data):
        """Handle create time slots request"""
        try:
            days = request_data.get('days', 30)
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
            
            response = {
                'success': True,
                'message': f'Time slots created for {days_created} days',
                'start_date': start_date.isoformat(),
                'days_processed': days,
                'days_with_slots_created': days_created,
                'total_slots_created': total_created,
                'source': 'json_file_bulk'
            }
            
            self.send_json_response(response, 201)
            
        except Exception as e:
            self.send_json_response({
                'success': False,
                'error': str(e)
            }, 400)
    
    def handle_book_test(self, request_data):
        """Handle book test request"""
        try:
            booking_id = f"BK{int(datetime.utcnow().timestamp())}"
            
            response = {
                'success': True,
                'message': 'Test booking successful!',
                'booking_id': booking_id,
                'total_amount': request_data.get('total_price', 0),
                'booking_date': request_data.get('booking_date', date.today().isoformat()),
                'time_slot_info': {
                    'id': request_data.get('time_slot_id'),
                    'time': request_data.get('preferred_time', 'Custom time')
                },
                'note': 'Demo booking with JSON file storage'
            }
            
            self.send_json_response(response)
            
        except Exception as e:
            self.send_json_response({
                'success': False,
                'error': str(e)
            }, 400)
    
    def handle_home(self):
        """Handle home request"""
        response = {
            'message': 'Built-in Time Slots API (MongoDB Simulation)',
            'status': 'running',
            'storage': 'JSON file (like MongoDB collection)',
            'endpoints': {
                'test': '/api/mongo/test/',
                'time_slots': '/api/mongo/time-slots/',
                'simple_time_slots': '/api/mongo/simple-time-slots/',
                'create_time_slots': '/api/mongo/create-time-slots/',
                'book_test': '/api/mongo/book-test/'
            }
        }
        
        self.send_json_response(response)
    
    def log_message(self, format, *args):
        """Override to reduce log noise"""
        pass

def run_server():
    """Run the HTTP server"""
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, TimeSlotHandler)
    
    print("🚀 Built-in Time Slots API Server Started")
    print("📁 Storage: JSON file (MongoDB simulation)")
    print("🌐 Server: http://localhost:8000")
    print("📋 Endpoints:")
    print("   - GET  /api/mongo/test/")
    print("   - GET  /api/mongo/time-slots/")
    print("   - GET  /api/mongo/simple-time-slots/")
    print("   - POST /api/mongo/create-time-slots/")
    print("   - POST /api/mongo/book-test/")
    print("\n💡 This simulates MongoDB behavior using JSON file storage")
    print("🔄 Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Shutting down server...")
        httpd.shutdown()

if __name__ == '__main__':
    run_server()