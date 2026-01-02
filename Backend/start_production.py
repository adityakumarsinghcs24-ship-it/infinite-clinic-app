#!/usr/bin/env python3
"""
Production startup script for Render.com
This ensures the correct Django server starts with MongoDB Atlas connection
"""

import os
import sys
import subprocess

def setup_production_environment():
    """Setup production environment"""
    print("🚀 Starting Production Server with MongoDB Atlas")
    print("=" * 50)
    
    # Set production environment variables
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings_prod')
    
    # Get port from environment (Render.com sets this)
    port = os.environ.get('PORT', '8000')
    
    print(f"📡 Port: {port}")
    print(f"🔧 Django Settings: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
    print(f"🗄️ MongoDB URI: {os.environ.get('MONGO_URI', 'Not set')}")
    
    return port

def start_django_server(port):
    """Start Django server for production"""
    try:
        print("🔄 Starting Django server with MongoDB Atlas...")
        
        # Django server command
        cmd = [
            sys.executable, 
            'manage.py', 
            'runserver', 
            f'0.0.0.0:{port}',
            '--settings=project.settings_prod'
        ]
        
        print(f"📋 Command: {' '.join(cmd)}")
        
        # Start Django server
        subprocess.run(cmd, check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Django server failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Error starting Django: {e}")
        return False

def start_simple_server(port):
    """Fallback to simple server if Django fails"""
    try:
        print("🔄 Starting simple server as fallback...")
        
        # Simple server command
        cmd = [sys.executable, 'builtin_timeslots_server.py']
        
        # Set port for simple server
        os.environ['PORT'] = port
        
        print(f"📋 Fallback command: {' '.join(cmd)}")
        
        # Start simple server
        subprocess.run(cmd, check=True)
        
    except Exception as e:
        print(f"❌ Simple server also failed: {e}")
        return False

def main():
    """Main production startup"""
    port = setup_production_environment()
    
    # Try Django first (preferred for MongoDB Atlas)
    print("🎯 Attempting Django server with MongoDB Atlas...")
    django_success = start_django_server(port)
    
    if not django_success:
        print("⚠️ Django failed, trying simple server...")
        start_simple_server(port)

if __name__ == "__main__":
    main()