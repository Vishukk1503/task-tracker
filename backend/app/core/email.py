"""
Email service using Resend
"""
import resend
from app.core.config import settings
from typing import Optional


class EmailService:
    """Email service for sending notifications"""
    
    @staticmethod
    def initialize():
        """Initialize Resend with API key"""
        if settings.RESEND_API_KEY:
            resend.api_key = settings.RESEND_API_KEY
    
    @staticmethod
    def send_verification_email(
        to_email: str,
        username: str,
        verification_link: str
    ) -> bool:
        """
        Send email verification link
        Returns True if sent successfully
        """
        if not settings.RESEND_API_KEY:
            print(f"⚠️  Verification email not sent (no API key): {to_email}")
            return False
        
        try:
            subject = "Verify your Task Tracker account"
            message = f"""
            <h2>Welcome to Task Tracker, {username}!</h2>
            <p>Thanks for signing up! Please verify your email address to activate your account.</p>
            <div style="margin: 30px 0;">
                <a href="{verification_link}" 
                   style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Verify Email Address
                </a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="color: #6b7280; word-break: break-all;">{verification_link}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create this account, you can safely ignore this email.</p>
            <p>Best regards,<br>Task Tracker Team</p>
            """
            
            resend.Emails.send({
                "from": settings.EMAIL_FROM,
                "to": to_email,
                "subject": subject,
                "html": message
            })
            
            print(f"✅ Verification email sent to {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send verification email to {to_email}: {str(e)}")
            return False
    
    @staticmethod
    def send_due_date_reminder(
        to_email: str,
        username: str,
        task_title: str,
        due_date: str,
        days_until_due: int
    ) -> bool:
        """
        Send due date reminder email
        Returns True if sent successfully
        """
        if not settings.RESEND_API_KEY:
            print(f"⚠️  Email not sent (no API key): {task_title} due reminder to {to_email}")
            return False
        
        try:
            if days_until_due == 0:
                subject = f"⏰ Task Due Today: {task_title}"
                message = f"""
                <h2>Hi {username},</h2>
                <p>This is a reminder that your task is due <strong>today</strong>!</p>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin: 0 0 10px 0;">{task_title}</h3>
                    <p style="margin: 0; color: #ef4444;"><strong>Due: {due_date}</strong></p>
                </div>
                <p>Don't forget to complete it!</p>
                <p>Best regards,<br>Task Tracker Team</p>
                """
            else:
                subject = f"📅 Upcoming Task: {task_title}"
                message = f"""
                <h2>Hi {username},</h2>
                <p>This is a reminder that your task is due in <strong>{days_until_due} day(s)</strong>.</p>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin: 0 0 10px 0;">{task_title}</h3>
                    <p style="margin: 0; color: #f59e0b;"><strong>Due: {due_date}</strong></p>
                </div>
                <p>Plan ahead to complete it on time!</p>
                <p>Best regards,<br>Task Tracker Team</p>
                """
            
            resend.Emails.send({
                "from": settings.EMAIL_FROM,
                "to": to_email,
                "subject": subject,
                "html": message
            })
            
            print(f"✅ Email sent: {subject} to {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send email to {to_email}: {str(e)}")
            return False
    
    @staticmethod
    def send_hourly_reminder(
        to_email: str,
        username: str,
        task_title: str,
        due_datetime: str,
        minutes_until_due: int
    ) -> bool:
        """
        Send 1-hour reminder email
        Returns True if sent successfully
        """
        if not settings.RESEND_API_KEY:
            print(f"⚠️  Email not sent (no API key): {task_title} hourly reminder to {to_email}")
            return False
        
        try:
            subject = f"⏰ Task Due Soon: {task_title}"
            message = f"""
            <h2>Hi {username},</h2>
            <p>⚡ <strong>Urgent:</strong> Your task is due in approximately <strong>{minutes_until_due} minutes</strong>!</p>
            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #dc2626;">{task_title}</h3>
                <p style="margin: 0; color: #991b1b;"><strong>Due at: {due_datetime}</strong></p>
            </div>
            <p>This is your final reminder - make sure to complete it on time!</p>
            <p>Best regards,<br>Task Tracker Team</p>
            """
            
            resend.Emails.send({
                "from": settings.EMAIL_FROM,
                "to": to_email,
                "subject": subject,
                "html": message
            })
            
            print(f"✅ Hourly reminder sent: {subject} to {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send hourly reminder to {to_email}: {str(e)}")
            return False
