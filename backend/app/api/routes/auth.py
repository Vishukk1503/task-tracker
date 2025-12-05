"""
Authentication API routes
"""
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import UserCreate, UserLogin, UserResponse, PasswordChange, EmailUpdate
from app.services.service import AuthService
from app.api.dependencies import get_current_user_id
from app.repositories.repository import UserRepository
from app.core.security import verify_password, get_password_hash
from app.core.email import EmailService
import secrets

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
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)  # Require authentication
):
    """
    Get all registered users (for admin/analytics purposes)
    Returns list of all users with basic info
    Requires authentication.
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


@router.put("/change-password")
def change_password(
    password_data: PasswordChange,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Change user password
    Requires current password verification
    """
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not verify_password(password_data.current_password[:72], user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Update password
    user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}


@router.post("/verify-email")
def verify_email(
    token: str,
    db: Session = Depends(get_db)
):
    """
    Verify email address with token
    """
    from app.models.models import User
    user = db.query(User).filter(User.verification_token == token).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    
    if user.is_verified:
        return {"message": "Email already verified"}
    
    # Mark as verified
    user.is_verified = 1
    user.verification_token = None
    db.commit()
    
    return {"message": "Email verified successfully"}


@router.put("/update-email")
def update_email(
    email_data: EmailUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Update user email and send verification
    """
    from app.models.models import User
    from app.core.config import settings
    
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if email already exists
    existing = UserRepository.get_by_email(db, email_data.email)
    if existing and existing.id != user_id:
        raise HTTPException(status_code=400, detail="Email already in use")
    
    # Update email and set as unverified
    user.email = email_data.email
    user.is_verified = 0
    verification_token = secrets.token_urlsafe(32)
    user.verification_token = verification_token
    db.commit()
    
    # Send verification email
    EmailService.initialize()
    verification_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
    EmailService.send_verification_email(
        to_email=user.email,
        username=user.username,
        verification_link=verification_link
    )
    
    return {"message": "Email updated. Please check your new email for verification link."}


@router.delete("/delete-account")
def delete_account(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Delete user account and all associated data
    """
    from app.models.models import User
    
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete user (cascade will delete all tasks)
    db.delete(user)
    db.commit()
    
    return {"message": "Account deleted successfully"}
