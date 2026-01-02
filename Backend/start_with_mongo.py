#!/usr/bin/env python3
"""
Start simple API with MongoDB support
Ensures pymongo is available before starting
"""

import subprocess
import sys
import os

def install_pymongo():
    """Install pymongo if not available"""
    try:
        import pymongo
        print("✅ pymongo already available")
        return True
    except ImportError:
        print("📦 Installing pymongo...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pymongo', 'dnspython'])
            print("✅ pymongo installed successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install pymongo: {e}")
            return False

def start_api():
    """Start the simple API"""
    try:
        print("🚀 Starting Simple Time Slots API with MongoDB")
        port = os.environ.get('PORT', '8000')
        print(f"📡 Port: {port}")
        
        # Import and run the API
        from simple_working_api import run_simple_server
        run_simple_server()
        
    except Exception as e:
        print(f"❌ Error starting API: {e}")
        # Fallback: run directly
        subprocess.run([sys.executable, 'simple_working_api.py'])

def main():
    """Main function"""
    print("🔧 Setting up Simple API with MongoDB support")
    
    # Try to install pymongo
    pymongo_ok = install_pymongo()
    
    if pymongo_ok:
        print("✅ MongoDB support ready")
    else:
        print("⚠️ MongoDB support not available - will run without it")
    
    # Start the API
    start_api()

if __name__ == "__main__":
    main()