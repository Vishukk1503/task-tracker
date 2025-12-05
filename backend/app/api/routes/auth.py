"""
Authentication API routes
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import UserCreate, UserLogin, UserResponse
from app.services.service import AuthService
from app.api.dependencies import get_current_user_id
from app.repositories.repository import UserRepository

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user
    
    - **email**: Valid email address
    - **username**: Username (3-50 characters)
    - **password**: Password (minimum 6 characters)
    
    Returns access token and user info
    """
    return AuthService.register_user(db, user)


@router.post("/login")
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login with username and password
    
    - **username**: Username
    - **password**: Password
    
    Returns access token and user info
    """
    return AuthService.login_user(db, credentials)


@router.get("/me", response_model=UserResponse)
def get_current_user(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Get current authenticated user information
    """
    user = UserRepository.get_by_id(db, user_id)
    return UserResponse.model_validate(user)


@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db)
):
    """
    Get all registered users (for admin/analytics purposes)
    Returns list of all users with basic info
    """
    from app.models.models import User
    users = db.query(User).all()
    return {
        "total_users": len(users),
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at.isoformat(),
            }
            for user in users
        ]
    }
