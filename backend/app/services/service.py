"""
Service layer for business logic
"""
from sqlalchemy.orm import Session
from typing import Optional, List
from fastapi import HTTPException, status
from app.repositories.repository import TaskRepository, UserRepository
from app.schemas.schemas import TaskCreate, TaskUpdate, TaskResponse, UserCreate, UserLogin
from app.models.models import TaskStatus, TaskPriority, User
from app.core.security import verify_password, create_access_token
from datetime import timedelta
from app.core.config import settings
from app.core.email import EmailService
import secrets
import math


class TaskService:
    """Service for task business logic"""
    
    @staticmethod
    def create_task(db: Session, task: TaskCreate, user_id: int) -> TaskResponse:
        """Create a new task"""
        db_task = TaskRepository.create(db, task, user_id)
        return TaskResponse.model_validate(db_task)
    
    @staticmethod
    def get_task(db: Session, task_id: int, user_id: int) -> TaskResponse:
        """Get task by ID"""
        db_task = TaskRepository.get_by_id(db, task_id, user_id)
        if not db_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        return TaskResponse.model_validate(db_task)
    
    @staticmethod
    def get_tasks(
        db: Session,
        user_id: int,
        page: int = 1,
        page_size: int = 10,
        search: Optional[str] = None,
        status_filter: Optional[TaskStatus] = None,
        priority_filter: Optional[TaskPriority] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> dict:
        """Get all tasks with pagination and filters"""
        # Calculate skip
        skip = (page - 1) * page_size
        
        # Get tasks and total count
        tasks, total = TaskRepository.get_all(
            db=db,
            user_id=user_id,
            skip=skip,
            limit=page_size,
            search=search,
            status=status_filter,
            priority=priority_filter,
            sort_by=sort_by,
            sort_order=sort_order
        )
        
        # Calculate total pages
        total_pages = math.ceil(total / page_size) if total > 0 else 1
        
        return {
            "tasks": [TaskResponse.model_validate(task) for task in tasks],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }
    
    @staticmethod
    def update_task(db: Session, task_id: int, user_id: int, task_update: TaskUpdate) -> TaskResponse:
        """Update task"""
        db_task = TaskRepository.update(db, task_id, user_id, task_update)
        if not db_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        return TaskResponse.model_validate(db_task)
    
    @staticmethod
    def delete_task(db: Session, task_id: int, user_id: int) -> dict:
        """Delete task"""
        success = TaskRepository.delete(db, task_id, user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        return {"message": "Task deleted successfully"}


class AuthService:
    """Service for authentication business logic"""
    
    @staticmethod
    def register_user(db: Session, user: UserCreate) -> dict:
        """Register a new user"""
        # Check if user already exists
        if UserRepository.get_by_username(db, user.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        
        if UserRepository.get_by_email(db, user.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user with verification token
        db_user = UserRepository.create(db, user)
        
        # Generate verification token
        verification_token = secrets.token_urlsafe(32)
        db_user.verification_token = verification_token
        db.commit()
        
        # Send verification email
        EmailService.initialize()
        verification_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
        EmailService.send_verification_email(
            to_email=db_user.email,
            username=db_user.username,
            verification_link=verification_link
        )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": str(db_user.id)},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user.id,
                "username": db_user.username,
                "email": db_user.email,
                "is_verified": bool(db_user.is_verified)
            }
        }
    
    @staticmethod
    def login_user(db: Session, credentials: UserLogin) -> dict:
        """Authenticate user and return token"""
        # Get user by username
        user = UserRepository.get_by_username(db, credentials.username)
        
        if not user or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_verified": bool(user.is_verified)
            }
        }
    
    @staticmethod
    def get_current_user(db: Session, user_id: int) -> User:
        """Get current authenticated user"""
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        return user
