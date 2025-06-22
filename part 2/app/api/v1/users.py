from flask_restx import Namespace, Resource, fields
from flask import request
from app.services import facade

api = Namespace('users', description='Opérations sur les utilisateurs')

user_model = api.model('User', {
    'first_name': fields.String(required=True, description='Prénom de l\'utilisateur'),
    'last_name': fields.String(required=True, description='Nom de famille'),
    'email': fields.String(required=True, description='Adresse email'),
    'password': fields.String(required=True, description='Mot de passe')
})

user_output_model = api.model('UserOut', {
    'id': fields.String(description='ID de l\'utilisateur'),
    'first_name': fields.String,
    'last_name': fields.String,
    'email': fields.String,
})

@api.route('/<string:user_id>')
class UserResource(Resource):
    @api.response(200, 'User details retrieved successfully')
    @api.response(404, 'User not found')
    def get(self, user_id):
        """Get user details by ID"""
        user = facade.get_user(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        return {'id': user.id, 'first_name': user.first_name, 'last_name': user.last_name, 'email': user.email}, 200

    @api.expect(user_model, validate=True)
    @api.response(200, 'Utilisateur mis à jour avec succès')
    @api.response(404, 'Utilisateur non trouvé')
    @api.marshal_with(user_output_model)
    def put(self, user_id):
        """Mettre à jour les informations d'un utilisateur"""
        user_data = request.json
        updated_user = facade.update_user(user_id, user_data)
        if not updated_user:
            return {'error': 'Utilisateur non trouvé'}, 404
        return updated_user, 200

@api.route('/')
class UserList(Resource):
    @api.response(200, 'Liste des utilisateurs récupérée avec succès')
    @api.marshal_list_with(user_output_model)
    def get(self):
        """Obtenir la liste de tous les utilisateurs"""
        users = facade.get_all_users()
        return users, 200

    @api.expect(user_model, validate=True)
    @api.response(201, 'Utilisateur créé avec succès')
    @api.response(400, 'Données invalides')
    @api.marshal_with(user_output_model)
    def post(self):
        """Créer un nouvel utilisateur"""
        user_data = request.json
        try:
            new_user = facade.create_user(user_data)
            return new_user, 201
        except ValueError as e:
            return {'error': str(e)}, 400
