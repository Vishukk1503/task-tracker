"""
Notification API routes
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user_id
from app.core.scheduler import check_due_dates

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.post("/check-due-dates")
def trigger_due_date_check(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Manually trigger due date notification check
    Useful for testing
    Requires authentication
    """
    check_due_dates()
    return {"message": "Due date check triggered"}
