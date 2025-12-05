"""
Background task scheduler for notifications
"""
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.models import Task, User, Notification, TaskStatus
from app.core.email import EmailService


def check_due_dates():
    """
    Check for tasks with upcoming due dates and send notifications
    Runs daily at 9 AM
    """
    print(f"🔔 Checking due dates at {datetime.now()}")
    
    db: Session = SessionLocal()
    try:
        EmailService.initialize()
        
        today = datetime.utcnow().date()
        tomorrow = (datetime.utcnow() + timedelta(days=1)).date()
        
        # Get all incomplete tasks with due dates
        tasks = db.query(Task).filter(
            Task.status != TaskStatus.COMPLETED,
            Task.due_date.isnot(None)
        ).all()
        
        for task in tasks:
            if not task.due_date:
                continue
                
            due_date = task.due_date.date()
            days_until_due = (due_date - today).days
            
            # Skip if due date is in the past or more than 1 day away
            if days_until_due < 0 or days_until_due > 1:
                continue
            
            # Determine notification type
            if days_until_due == 0:
                notification_type = "due_today"
            else:  # days_until_due == 1
                notification_type = "due_1_day"
            
            # Check if we already sent this notification
            existing = db.query(Notification).filter(
                Notification.task_id == task.id,
                Notification.notification_type == notification_type
            ).first()
            
            if existing:
                continue  # Already notified
            
            # Get user email
            user = db.query(User).filter(User.id == task.user_id).first()
            if not user:
                continue
            
            # Send notification
            success = EmailService.send_due_date_reminder(
                to_email=user.email,
                username=user.username,
                task_title=task.title,
                due_date=task.due_date.strftime("%B %d, %Y"),
                days_until_due=days_until_due
            )
            
            if success:
                # Record notification
                notification = Notification(
                    task_id=task.id,
                    user_id=task.user_id,
                    notification_type=notification_type
                )
                db.add(notification)
                db.commit()
        
        print(f"✅ Due date check completed")
        
    except Exception as e:
        print(f"❌ Error checking due dates: {str(e)}")
        db.rollback()
    finally:
        db.close()


def check_hourly_reminders():
    """
    Check for tasks due in the next hour
    Runs every hour
    """
    print(f"⏰ Checking hourly reminders at {datetime.now()}")
    
    db: Session = SessionLocal()
    try:
        EmailService.initialize()
        
        now = datetime.utcnow()
        one_hour_later = now + timedelta(hours=1)
        
        # Get all incomplete tasks with due dates in the next hour
        tasks = db.query(Task).filter(
            Task.status != TaskStatus.COMPLETED,
            Task.due_date.isnot(None),
            Task.due_date >= now,
            Task.due_date <= one_hour_later
        ).all()
        
        for task in tasks:
            # Check if we already sent 1-hour notification
            existing = db.query(Notification).filter(
                Notification.task_id == task.id,
                Notification.notification_type == "due_1_hour"
            ).first()
            
            if existing:
                continue
            
            # Get user
            user = db.query(User).filter(User.id == task.user_id).first()
            if not user:
                continue
            
            # Send notification
            time_until = (task.due_date - now).total_seconds() / 60  # minutes
            
            success = EmailService.send_hourly_reminder(
                to_email=user.email,
                username=user.username,
                task_title=task.title,
                due_datetime=task.due_date.strftime("%I:%M %p"),
                minutes_until_due=int(time_until)
            )
            
            if success:
                notification = Notification(
                    task_id=task.id,
                    user_id=task.user_id,
                    notification_type="due_1_hour"
                )
                db.add(notification)
                db.commit()
        
        print(f"✅ Hourly reminder check completed")
        
    except Exception as e:
        print(f"❌ Error checking hourly reminders: {str(e)}")
        db.rollback()
    finally:
        db.close()


def start_scheduler():
    """Start the background scheduler"""
    scheduler = BackgroundScheduler()
    
    # Run daily at 9 AM for day-based notifications
    scheduler.add_job(
        check_due_dates,
        'cron',
        hour=9,
        minute=0,
        id='due_date_notifications'
    )
    
    # Run every hour for 1-hour reminders
    scheduler.add_job(
        check_hourly_reminders,
        'interval',
        hours=1,
        id='hourly_reminders'
    )
    
    scheduler.start()
    print("📅 Notification scheduler started (daily at 9 AM + hourly checks)")
    
    return scheduler
