FROM python:3.10-slim

WORKDIR /app

# Copy requirements first to leverage Docker caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your python engine files
COPY . .

# Expose Render's default web service port
EXPOSE 10000

# Start the application using uvicorn directly to bypass internal script errors
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]