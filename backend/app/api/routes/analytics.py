"""
Analytics API routes for KPIs and statistics
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.db.database import get_db
from app.models.models import Task, TaskStatus, TaskPriority
from app.api.dependencies import get_current_user_id
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/kpis")
def get_kpis(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Get key performance indicators for tasks
    
    Returns:
    - Total tasks
    - Completed tasks
    - In progress tasks
    - Completion rate
    - Average completion time
    - Overdue tasks
    - Tasks by priority
    - Tasks by status
    - This week's completed tasks
    """
    # Get all tasks for user
    all_tasks = db.query(Task).filter(Task.user_id == user_id).all()
    total_tasks = len(all_tasks)
    
    if total_tasks == 0:
        return {
            "total_tasks": 0,
            "completed_tasks": 0,
            "in_progress_tasks": 0,
            "not_started_tasks": 0,
            "completion_rate": 0,
            "average_completion_days": 0,
            "overdue_tasks": 0,
            "tasks_by_priority": {"High": 0, "Medium": 0, "Low": 0},
            "tasks_by_status": {"Not Started": 0, "In Progress": 0, "Completed": 0},
            "this_week_completed": 0,
            "on_time_completion_rate": 0
        }
    
    # Count by status
    completed_tasks = sum(1 for t in all_tasks if t.status == TaskStatus.COMPLETED)
    in_progress_tasks = sum(1 for t in all_tasks if t.status == TaskStatus.IN_PROGRESS)
    not_started_tasks = sum(1 for t in all_tasks if t.status == TaskStatus.NOT_STARTED)
    
    # Completion rate
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    # Average completion time (for completed tasks with start_date)
    completed_with_dates = [
        t for t in all_tasks 
        if t.status == TaskStatus.COMPLETED and t.start_date and t.updated_at
    ]
    
    if completed_with_dates:
        total_days = sum(
            (t.updated_at - t.start_date).days 
            for t in completed_with_dates
        )
        average_completion_days = total_days / len(completed_with_dates)
    else:
        average_completion_days = 0
    
    # Overdue tasks (not completed and past due date)
    now = datetime.utcnow()
    overdue_tasks = sum(
        1 for t in all_tasks 
        if t.status != TaskStatus.COMPLETED and t.due_date and t.due_date < now
    )
    
    # Tasks by priority
    tasks_by_priority = {
        "High": sum(1 for t in all_tasks if t.priority == TaskPriority.HIGH),
        "Medium": sum(1 for t in all_tasks if t.priority == TaskPriority.MEDIUM),
        "Low": sum(1 for t in all_tasks if t.priority == TaskPriority.LOW)
    }
    
    # Tasks by status
    tasks_by_status = {
        "Not Started": not_started_tasks,
        "In Progress": in_progress_tasks,
        "Completed": completed_tasks
    }
    
    # This week's completed tasks
    week_ago = now - timedelta(days=7)
    this_week_completed = sum(
        1 for t in all_tasks 
        if t.status == TaskStatus.COMPLETED and t.updated_at >= week_ago
    )
    
    # On-time completion rate (completed before due date)
    completed_with_due_date = [
        t for t in all_tasks 
        if t.status == TaskStatus.COMPLETED and t.due_date
    ]
    
    if completed_with_due_date:
        on_time = sum(1 for t in completed_with_due_date if t.updated_at <= t.due_date)
        on_time_completion_rate = (on_time / len(completed_with_due_date) * 100)
    else:
        on_time_completion_rate = 0
    
    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "in_progress_tasks": in_progress_tasks,
        "not_started_tasks": not_started_tasks,
        "completion_rate": round(completion_rate, 1),
        "average_completion_days": round(average_completion_days, 1),
        "overdue_tasks": overdue_tasks,
        "tasks_by_priority": tasks_by_priority,
        "tasks_by_status": tasks_by_status,
        "this_week_completed": this_week_completed,
        "on_time_completion_rate": round(on_time_completion_rate, 1)
    }
