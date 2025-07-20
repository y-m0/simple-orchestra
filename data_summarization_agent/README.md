# DataSummarizationAgent

An A2A-compliant agent that summarizes input text, built with FastAPI for deployment on Google Cloud Run.

## Overview

The DataSummarizationAgent is a simple yet powerful service that accepts text input via an A2A task and returns a summarized version. The current implementation uses a basic heuristic (first two sentences), but it's designed to be easily extended with more sophisticated summarization models.

## Project Structure

```
data_summarization_agent/
├── .well-known/
│   └── agent.json         # A2A Agent Card
├── main.py                # FastAPI application
├── agent_logic.py         # Core summarization logic
├── models.py              # Pydantic data models
├── requirements.txt       # Python dependencies
├── Dockerfile             # Container configuration
├── service.yaml           # Cloud Run service definition
└── tests/                 # Unit tests
    ├── test_main.py
    └── test_agent_logic.py
```

## Features

- A2A-compliant API endpoint for text summarization
- Simple but effective summarization logic
- Comprehensive error handling
- Structured logging with Google Cloud Logging
- Health check endpoint for monitoring
- Complete test suite

## API Usage

### Summarize Text

```
POST /tasks/summarize_text

{
  "task_id": "unique-task-id",
  "payload": {
    "text_input": "Text to be summarized. This can be multiple sentences. The agent will extract the key information."
  }
}
```

Response:

```
{
  "task_id": "unique-task-id",
  "status": "completed",
  "result": {
    "summary_output": "Text to be summarized. This can be multiple sentences."
  }
}
```

## Deployment

### Local Development

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the application:
   ```
   uvicorn main:app --reload
   ```

### Cloud Run Deployment

1. Build the container:
   ```
   gcloud builds submit --tag gcr.io/PROJECT_ID/data-summarization-agent
   ```

2. Deploy to Cloud Run:
   ```
   gcloud run deploy --image gcr.io/PROJECT_ID/data-summarization-agent
   ```

Alternatively, use the provided `service.yaml`:
   ```
   gcloud run services replace service.yaml
   ```

## Testing

Run the test suite:
```
pytest
```

## Future Enhancements

- Integration with advanced NLP models for better summarization
- Support for different summarization strategies (extractive vs. abstractive)
- Multi-language support
- Caching of results for improved performance