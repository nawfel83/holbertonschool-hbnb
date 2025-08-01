from flask_jwt_extended import create_access_token, get_jwt_identity
from app.services.facade import HBnBFacade


class AuthService:
    """Service for handling authentication"""
    
    def __init__(self):
        self.facade = HBnBFacade()

    def login(self, email, password):
        """Authenticate a user and return access token"""
        user = self.facade.get_user_by_email(email)
        
        if user and user.verify_password(password):
            access_token = create_access_token(identity=user.id)
            return {
                'access_token': access_token,
                'user_id': user.id,
                'is_admin': user.is_admin
            }
        
        return None

    def get_current_user(self):
        """Get the current authenticated user"""
        user_id = get_jwt_identity()
        if user_id:
            return self.facade.get_user(user_id)
        return None
