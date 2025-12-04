"""
Seed database with sample data
"""
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.models.models import User, Task, TaskStatus, TaskPriority
from app.core.security import get_password_hash
from datetime import datetime, timedelta


def seed_database():
    """Seed the database with sample users and tasks"""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_user = db.query(User).first()
        if existing_user:
            print("Database already seeded. Skipping...")
            return
        
        # Create sample users
        users = [
            User(
                email="demo@example.com",
                username="demo",
                hashed_password=get_password_hash("demo123")
            ),
            User(
                email="john@example.com",
                username="john_doe",
                hashed_password=get_password_hash("password123")
            )
        ]
        
        for user in users:
            db.add(user)
        
        db.commit()
        
        # Get the demo user
        demo_user = db.query(User).filter(User.username == "demo").first()
        
        # Create sample tasks for demo user
        sample_tasks = [
            Task(
                title="Complete project documentation",
                description="Write comprehensive documentation for the new feature",
                status=TaskStatus.IN_PROGRESS,
                priority=TaskPriority.HIGH,
                due_date=datetime.utcnow() + timedelta(days=3),
                user_id=demo_user.id
            ),
            Task(
                title="Review pull requests",
                description="Review and provide feedback on pending PRs",
                status=TaskStatus.NOT_STARTED,
                priority=TaskPriority.MEDIUM,
                due_date=datetime.utcnow() + timedelta(days=1),
                user_id=demo_user.id
            ),
            Task(
                title="Update dependencies",
                description="Update all npm packages to latest stable versions",
                status=TaskStatus.NOT_STARTED,
                priority=TaskPriority.LOW,
                due_date=datetime.utcnow() + timedelta(days=7),
                user_id=demo_user.id
            ),
            Task(
                title="Fix authentication bug",
                description="Users are unable to login with special characters in password",
                status=TaskStatus.IN_PROGRESS,
                priority=TaskPriority.HIGH,
                due_date=datetime.utcnow() + timedelta(hours=12),
                user_id=demo_user.id
            ),
            Task(
                title="Design new landing page",
                description="Create mockups for the updated landing page design",
                status=TaskStatus.COMPLETED,
                priority=TaskPriority.MEDIUM,
                due_date=datetime.utcnow() - timedelta(days=2),
                user_id=demo_user.id
            ),
            Task(
                title="Setup CI/CD pipeline",
                description="Configure GitHub Actions for automated testing and deployment",
                status=TaskStatus.NOT_STARTED,
                priority=TaskPriority.HIGH,
                due_date=datetime.utcnow() + timedelta(days=5),
                user_id=demo_user.id
            ),
            Task(
                title="Write unit tests",
                description="Add test coverage for authentication service",
                status=TaskStatus.IN_PROGRESS,
                priority=TaskPriority.MEDIUM,
                due_date=datetime.utcnow() + timedelta(days=4),
                user_id=demo_user.id
            ),
            Task(
                title="Client meeting preparation",
                description="Prepare presentation slides for quarterly review",
                status=TaskStatus.COMPLETED,
                priority=TaskPriority.HIGH,
                due_date=datetime.utcnow() - timedelta(days=1),
                user_id=demo_user.id
            ),
            Task(
                title="Database optimization",
                description="Analyze and optimize slow queries",
                status=TaskStatus.NOT_STARTED,
                priority=TaskPriority.LOW,
                due_date=datetime.utcnow() + timedelta(days=10),
                user_id=demo_user.id
            ),
            Task(
                title="Update user documentation",
                description="Revise user guide with new features",
                status=TaskStatus.NOT_STARTED,
                priority=TaskPriority.LOW,
                due_date=datetime.utcnow() + timedelta(days=14),
                user_id=demo_user.id
            )
        ]
        
        for task in sample_tasks:
            db.add(task)
        
        db.commit()
        
        print("✅ Database seeded successfully!")
        print(f"   Created {len(users)} users")
        print(f"   Created {len(sample_tasks)} tasks")
        print("\n📝 Demo credentials:")
        print("   Username: demo")
        print("   Password: demo123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
