FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput --settings=project.settings_prod

# Expose port
EXPOSE 8000

# Start the application
CMD ["gunicorn", "project.wsgi:application", "--bind", "0.0.0.0:8000"]