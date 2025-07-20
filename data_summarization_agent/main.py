from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import google.cloud.logging
import logging
import json
from models import (
    A2ATaskRequest, 
    A2ATaskResponse, 
    SummarizeTextPayload, 
    SummarizeTextResult
)
from agent_logic import perform_summarization

# Initialize FastAPI app
app = FastAPI(
    title="DataSummarizationAgent",
    description="An A2A-compliant agent that summarizes input text",
    version="1.0.0"
)

# Set up Google Cloud Logging
try:
    client = google.cloud.logging.Client()
    client.setup_logging()
    logger = logging.getLogger("data-summarization-agent")
except Exception as e:
    # Fallback to standard logging if GCP logging setup fails
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("data-summarization-agent")
    logger.warning(f"Failed to set up GCP logging: {e}. Using standard logging instead.")

@app.post("/tasks/summarize_text")
async def summarize_text(request: A2ATaskRequest):
    """
    A2A-compliant endpoint for text summarization.
    
    Args:
        request: A2ATaskRequest containing task_id and payload with text_input
        
    Returns:
        A2ATaskResponse with the summarization result
    """
    logger.info(f"Received summarize_text task: {request.task_id}")
    
    # TODO: Implement OAuth 2.0 token validation
    # if not validate_oauth_token(request.headers.get("Authorization")):
    #     return JSONResponse(
    #         status_code=401,
    #         content={"error": "Unauthorized", "message": "Invalid or missing authentication token"}
    #     )
    
    try:
        # Parse the payload
        if not request.payload:
            raise ValueError("Missing payload in request")
        
        # Extract text_input from payload
        payload = SummarizeTextPayload(**request.payload)
        
        # Validate text_input
        if not payload.text_input or not payload.text_input.strip():
            raise ValueError("text_input cannot be empty")
        
        # Perform summarization
        summary = perform_summarization(payload.text_input)
        
        # Prepare response
        result = SummarizeTextResult(summary_output=summary)
        response = A2ATaskResponse(
            task_id=request.task_id,
            status="completed",
            result=result.dict()
        )
        
        logger.info(f"Successfully processed task {request.task_id}")
        return response
        
    except ValueError as e:
        logger.error(f"Validation error for task {request.task_id}: {str(e)}")
        return JSONResponse(
            status_code=400,
            content={
                "task_id": request.task_id,
                "status": "failed",
                "error": {
                    "code": "invalid_input",
                    "message": str(e)
                }
            }
        )
    except Exception as e:
        logger.error(f"Error processing task {request.task_id}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "task_id": request.task_id,
                "status": "failed",
                "error": {
                    "code": "internal_error",
                    "message": "An internal error occurred while processing the request"
                }
            }
        )

@app.get("/.well-known/agent.json")
async def get_agent_card():
    """
    Endpoint to serve the Agent Card (agent.json) as per A2A protocol.
    """
    try:
        with open(".well-known/agent.json", "r") as f:
            agent_card = json.load(f)
        return agent_card
    except Exception as e:
        logger.error(f"Error serving agent card: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not retrieve agent card")

@app.get("/health")
async def health_check():
    """
    Health check endpoint for Cloud Run.
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)