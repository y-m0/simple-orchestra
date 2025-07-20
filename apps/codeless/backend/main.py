from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Task(BaseModel):
    id: Optional[int] = None
    text: str
    completed: bool = False

# In-memory storage for tasks
tasks = []

@app.get("/api/tasks", response_model=List[Task])
async def get_tasks():
    return tasks

@app.post("/api/tasks", response_model=Task, status_code=201)
async def add_task(task: Task):
    task.id = len(tasks) + 1
    tasks.append(task)
    return task

@app.put("/api/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, task_update: Task):
    task = next((t for t in tasks if t.id == task_id), None)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.text = task_update.text
    task.completed = task_update.completed
    return task

@app.delete("/api/tasks/{task_id}", status_code=204)
async def delete_task(task_id: int):
    global tasks
    task = next((t for t in tasks if t.id == task_id), None)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    tasks = [t for t in tasks if t.id != task_id]
    return None

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True) 