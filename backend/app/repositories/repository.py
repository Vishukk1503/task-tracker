"""
Repository layer for database operations
"""
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional, List
from datetime import datetime
from app.models.models import Task, User, TaskStatus, TaskPriority
from app.schemas.schemas import TaskCreate, TaskUpdate, UserCreate
from app.core.security import get_password_hash


class TaskRepository:
    """Repository for Task CRUD operations"""
    
    @staticmethod
    def create(db: Session, task: TaskCreate, user_id: int) -> Task:
        """Create a new task"""
        db_task = Task(
            **task.model_dump(),
            user_id=user_id
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def get_by_id(db: Session, task_id: int, user_id: int) -> Optional[Task]:
        """Get task by ID for specific user"""
        return db.query(Task).filter(
            and_(Task.id == task_id, Task.user_id == user_id)
        ).first()
    
    @staticmethod
    def get_all(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        status: Optional[TaskStatus] = None,
        priority: Optional[TaskPriority] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> tuple[List[Task], int]:
        """
        Get all tasks for user with filters, search, and pagination
        Returns tuple of (tasks, total_count)
        """
        query = db.query(Task).filter(Task.user_id == user_id)
        
        # Apply filters
        if search:
            query = query.filter(
                or_(
                    Task.title.ilike(f"%{search}%"),
                    Task.description.ilike(f"%{search}%")
                )
            )
        
        if status:
            query = query.filter(Task.status == status)
        
        if priority:
            query = query.filter(Task.priority == priority)
        
        # Get total count before pagination
        total = query.count()
        
        # Apply sorting
        sort_column = getattr(Task, sort_by, Task.created_at)
        if sort_order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
        
        # Apply pagination
        tasks = query.offset(skip).limit(limit).all()
        
        return tasks, total
    
    @staticmethod
    def update(db: Session, task_id: int, user_id: int, task_update: TaskUpdate) -> Optional[Task]:
        """Update task"""
        db_task = TaskRepository.get_by_id(db, task_id, user_id)
        if not db_task:
            return None
        
        update_data = task_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)
        
        db_task.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def delete(db: Session, task_id: int, user_id: int) -> bool:
        """Delete task"""
        db_task = TaskRepository.get_by_id(db, task_id, user_id)
        if not db_task:
            return False
        
        db.delete(db_task)
        db.commit()
        return True


class UserRepository:
    """Repository for User CRUD operations"""
    
    @staticmethod
    def create(db: Session, user: UserCreate) -> User:
        """Create a new user"""
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            username=user.username,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def get_by_username(db: Session, username: str) -> Optional[User]:
        """Get user by username"""
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return db.query(User).filter(User.id == user_id).first()
