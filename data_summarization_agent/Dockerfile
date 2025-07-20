# Use official Python image as base
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY main.py agent_logic.py models.py ./

# Create .well-known directory and copy agent.json
RUN mkdir -p .well-known
COPY .well-known/agent.json .well-known/

# Expose port for the application
EXPOSE 8080

# Set environment variables
ENV PORT=8080

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]