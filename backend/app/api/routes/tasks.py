"""
Task API routes
"""
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import get_db
from app.schemas.schemas import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
from app.services.service import TaskService
from app.api.dependencies import get_current_user_id
from app.models.models import TaskStatus, TaskPriority

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Create a new task
    
    - **title**: Task title (required)
    - **description**: Task description (optional)
    - **status**: Task status (default: Not Started)
    - **priority**: Task priority (default: Medium)
    - **due_date**: Due date (optional)
    """
    return TaskService.create_task(db, task, user_id)


@router.get("/", response_model=TaskListResponse)
def get_tasks(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    status: Optional[TaskStatus] = Query(None, description="Filter by status"),
    priority: Optional[TaskPriority] = Query(None, description="Filter by priority"),
    sort_by: str = Query("created_at", description="Sort by field (created_at, due_date, priority, status)"),
    sort_order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Get all tasks with pagination, filtering, and sorting
    
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 10, max: 100)
    - **search**: Search query for title/description
    - **status**: Filter by status
    - **priority**: Filter by priority
    - **sort_by**: Sort field (created_at, due_date, priority, status)
    - **sort_order**: Sort order (asc or desc)
    """
    return TaskService.get_tasks(
        db=db,
        user_id=user_id,
        page=page,
        page_size=page_size,
        search=search,
        status_filter=status,
        priority_filter=priority,
        sort_by=sort_by,
        sort_order=sort_order
    )


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Get a specific task by ID
    """
    return TaskService.get_task(db, task_id, user_id)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Update a task
    
    All fields are optional - only provided fields will be updated
    """
    return TaskService.update_task(db, task_id, user_id, task_update)


@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Delete a task
    """
    return TaskService.delete_task(db, task_id, user_id)
