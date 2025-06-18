# Définition des routes pour l'entité User

from flask_restx import Namespace, Resource, fields, reqparse
from app.services.facade import HBnBFacade

facade = HBnBFacade()
ns = Namespace('users', description='Gestion des utilisateurs')

# Modèle pour l'entrée/sortie des données (masque le mot de passe en sortie)
user_model = ns.model('User', {
    'id': fields.String(readOnly=True),        # ID auto-généré
    'email': fields.String(required=True),     # Email obligatoire
    'first_name': fields.String,               # Prénom (optionnel)
    'last_name': fields.String,                # Nom (optionnel)
})

# Modèle utilisé uniquement pour la création d'utilisateur
user_creation_model = ns.inherit('UserCreate', user_model, {
    'password': fields.String(required=True),  # Mot de passe obligatoire à la création
})

# Parser pour mise à jour
update_parser = reqparse.RequestParser()
update_parser.add_argument('email', type=str)
update_parser.add_argument('first_name', type=str)
update_parser.add_argument('last_name', type=str)
update_parser.add_argument('password', type=str)

@ns.route('/')
class UserList(Resource):
    @ns.marshal_list_with(user_model)
    def get(self):
        """Récupérer la liste de tous les utilisateurs (sans mot de passe)"""
        users = facade.get_all_users()
        return users

    @ns.expect(user_creation_model, validate=True)
    @ns.marshal_with(user_model, code=201)
    def post(self):
        """Créer un nouvel utilisateur"""
        data = ns.payload
        return facade.create_user(data), 201

@ns.route('/<string:user_id>')
@ns.param('user_id', 'ID de l\'utilisateur')
class UserResource(Resource):
    @ns.marshal_with(user_model)
    def get(self, user_id):
        """Récupérer un utilisateur par son ID (sans mot de passe)"""
        user = facade.get_user(user_id)
        if not user:
            ns.abort(404, "Utilisateur non trouvé")
        return user

    @ns.expect(update_parser)
    @ns.marshal_with(user_model)
    def put(self, user_id):
        """Mettre à jour un utilisateur existant"""
        data = update_parser.parse_args()
        clean_data = {k: v for k, v in data.items() if v is not None}
        user = facade.update_user(user_id, clean_data)
        if not user:
            ns.abort(404, "Utilisateur non trouvé")
        return user
