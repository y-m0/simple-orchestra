from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class SummarizeTextPayload(BaseModel):
    """
    Payload model for the summarize_text task.
    """
    text_input: str = Field(..., description="The text to be summarized")

class SummarizeTextResult(BaseModel):
    """
    Result model for the summarize_text task.
    """
    summary_output: str = Field(..., description="The generated summary")

class A2ATaskRequest(BaseModel):
    """
    A2A-compliant task request model.
    """
    task_id: str = Field(..., description="Unique identifier for the task")
    payload: Dict[str, Any] = Field(..., description="Task-specific payload")
    context: Optional[Dict[str, Any]] = Field(None, description="Optional context information")

class A2ATaskResponse(BaseModel):
    """
    A2A-compliant task response model.
    """
    task_id: str = Field(..., description="Unique identifier for the task (same as in request)")
    status: str = Field(..., description="Status of the task (completed, failed)")
    result: Optional[Dict[str, Any]] = Field(None, description="Task result when status is completed")
    error: Optional[Dict[str, Any]] = Field(None, description="Error details when status is failed")