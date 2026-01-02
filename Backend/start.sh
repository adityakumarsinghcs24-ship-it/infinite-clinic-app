#!/bin/bash
echo "🚀 Starting Simple Time Slots API with MongoDB"
echo "Installing minimal requirements..."
pip install pymongo dnspython
echo "Port: $PORT"
python simple_working_api.py