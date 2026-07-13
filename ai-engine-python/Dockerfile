FROM python:3.10-slim

WORKDIR /app

# Copy requirements first to leverage Docker caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# CRITICAL: Download the spaCy language model during the build process
RUN python -m spacy download en_core_web_sm

# Copy the rest of your python engine files
COPY . .

# Expose Render's default web service port
EXPOSE 10000

# Start the application using uvicorn directly
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]