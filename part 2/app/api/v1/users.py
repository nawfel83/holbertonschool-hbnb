from flask_restx import Namespace, Resource

ns = Namespace('users', description='User operations')

@ns.route('/')
class UserList(Resource):
    
    
    def get(self):
        return {'message': 'List of users - placeholder'}

    
    def post(self):
        return {'message': 'Create user - placeholder'}
