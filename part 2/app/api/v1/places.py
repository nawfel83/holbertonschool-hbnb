from flask_restx import Namespace, Resource, fields, reqparse
from app.services.facade import HBnBFacade

# Initialisation du facade et du namespace
facade = HBnBFacade()
ns = Namespace('places', description='Gestion des places')

# Modèles de données
owner_model = ns.model('Owner', {
    'id': fields.String,
    'first_name': fields.String,
    'last_name': fields.String,
    'email': fields.String
})

amenity_detail_model = ns.model('AmenityDetail', {
    'id': fields.String,
    'name': fields.String
})

place_model = ns.model('Place', {
    'id': fields.String(readOnly=True),
    'title': fields.String(required=True),
    'description': fields.String(required=True),
    'price': fields.Float(required=True),
    'latitude': fields.Float(required=True),
    'longitude': fields.Float(required=True),
    'owner_id': fields.String(required=True),
    'amenities': fields.List(fields.String),
    'owner': fields.Nested(owner_model, readOnly=True),
    'amenity_details': fields.List(fields.Nested(amenity_detail_model), readOnly=True)
})

place_creation_model = ns.model('PlaceCreate', {
    'title': fields.String(required=True),
    'description': fields.String(required=True),
    'price': fields.Float(required=True),
    'latitude': fields.Float(required=True),
    'longitude': fields.Float(required=True),
    'owner_id': fields.String(required=True),
    'amenities': fields.List(fields.String, required=False)
})

# Parser pour les mises à jour
update_parser = reqparse.RequestParser()
update_parser.add_argument('title', type=str)
update_parser.add_argument('description', type=str)
update_parser.add_argument('price', type=float)
update_parser.add_argument('latitude', type=float)
update_parser.add_argument('longitude', type=float)
update_parser.add_argument('amenities', type=str, action='append')

# Ressources
@ns.route('/')
class PlaceList(Resource):
    @ns.marshal_list_with(place_model)
    def get(self):
        """Retourne toutes les places"""
        return facade.get_all_places()

    @ns.expect(place_creation_model, validate=True)
    @ns.marshal_with(place_model, code=201)
    def post(self):
        """Crée une nouvelle place"""
        data = ns.payload

        # Validation du prix
        if data.get('price', 0) <= 0:
            ns.abort(400, "Le prix doit être positif")
        # Validation de la latitude
        if not (-90 <= data.get('latitude', 0) <= 90):
            ns.abort(400, "La latitude doit être entre -90 et 90")
        # Validation de la longitude
        if not (-180 <= data.get('longitude', 0) <= 180):
            ns.abort(400, "La longitude doit être entre -180 et 180")
        # Vérification que le propriétaire existe
        owner = facade.get_user(data['owner_id'])
        if not owner:
            ns.abort(400, "Le propriétaire spécifié n'existe pas")

        return facade.create_place(data), 201

@ns.route('/<string:place_id>')
@ns.param('place_id', 'Identifiant de la place')
class PlaceResource(Resource):
    @ns.marshal_with(place_model)
    def get(self, place_id):
        """Retourne une place spécifique"""
        place = facade.get_place(place_id)
        if not place:
            ns.abort(404, "Place non trouvée")
        return place

    @ns.expect(update_parser)
    @ns.marshal_with(place_model)
    def put(self, place_id):
        """Met à jour une place existante"""
        data = update_parser.parse_args()
        clean_data = {k: v for k, v in data.items() if v is not None}

        # Validation du prix si fourni
        if 'price' in clean_data and clean_data['price'] <= 0:
            ns.abort(400, "Le prix doit être positif")
        # Validation de la latitude si fournie
        if 'latitude' in clean_data and not (-90 <= clean_data['latitude'] <= 90):
            ns.abort(400, "La latitude doit être entre -90 et 90")
        # Validation de la longitude si fournie
        if 'longitude' in clean_data and not (-180 <= clean_data['longitude'] <= 180):
            ns.abort(400, "La longitude doit être entre -180 et 180")

        place = facade.update_place(place_id, clean_data)
        if not place:
            ns.abort(404, "Place non trouvée")
        return place
