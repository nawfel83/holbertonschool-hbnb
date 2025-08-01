from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token
from flask import request
from app.services.facade import HBnBFacade

api = Namespace('auth', description='Authentication operations')
facade = HBnBFacade()

login_model = api.model('Login', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password')
})

@api.route('/login')
class Login(Resource):
    @api.expect(login_model)
    def post(self):
        """Authenticate user and return a JWT token"""
        credentials = request.json
        
        if not credentials or not credentials.get('email') or not credentials.get('password'):
            return {'message': 'Email and password are required'}, 400
            
        user = facade.get_user_by_email(credentials['email'])
        if not user or not user.verify_password(credentials['password']):
            return {'message': 'Invalid credentials'}, 401
            
        access_token = create_access_token(identity=user.id)
        return {
            'access_token': access_token,
            'user_id': user.id,
            'is_admin': user.is_admin
        }, 200
