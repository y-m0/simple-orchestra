import pytest
from fastapi.testclient import TestClient
from main import app
import json

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_get_agent_card():
    """Test retrieving the agent card."""
    # This test assumes the agent.json file exists in the correct location
    # In a real test environment, you might want to mock this
    response = client.get("/.well-known/agent.json")
    assert response.status_code == 200
    assert response.json()["name"] == "DataSummarizationAgent"

def test_summarize_text_success():
    """Test successful text summarization."""
    request_data = {
        "task_id": "test-task-123",
        "payload": {
            "text_input": "This is the first sentence. This is the second sentence. This is the third sentence."
        }
    }
    
    response = client.post("/tasks/summarize_text", json=request_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["task_id"] == "test-task-123"
    assert data["status"] == "completed"
    assert data["result"]["summary_output"] == "This is the first sentence. This is the second sentence."

def test_summarize_text_missing_payload():
    """Test error handling when payload is missing."""
    request_data = {
        "task_id": "test-task-123"
    }
    
    response = client.post("/tasks/summarize_text", json=request_data)
    assert response.status_code == 422  # FastAPI validation error

def test_summarize_text_empty_input():
    """Test error handling when text_input is empty."""
    request_data = {
        "task_id": "test-task-123",
        "payload": {
            "text_input": ""
        }
    }
    
    response = client.post("/tasks/summarize_text", json=request_data)
    assert response.status_code == 400
    
    data = response.json()
    assert data["task_id"] == "test-task-123"
    assert data["status"] == "failed"
    assert "error" in data
    assert "message" in data["error"]

def test_summarize_text_invalid_payload():
    """Test error handling when payload has wrong structure."""
    request_data = {
        "task_id": "test-task-123",
        "payload": {
            "wrong_field": "This will not work"
        }
    }
    
    response = client.post("/tasks/summarize_text", json=request_data)
    assert response.status_code == 422  # FastAPI validation error