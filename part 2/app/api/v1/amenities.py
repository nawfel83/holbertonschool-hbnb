# Définition des endpoints pour l'entité Amenity

from flask_restx import Namespace, Resource, fields, reqparse
from app.services.facade import HBnBFacade

facade = HBnBFacade()
ns = Namespace('amenities', description='Gestion des amenities')

# Modèle de sortie JSON
amenity_model = ns.model('Amenity', {
    'id': fields.String(readOnly=True),  # ID généré automatiquement
    'name': fields.String(required=True) # Nom de l'amenity requis
})

# Parser pour les mises à jour
update_parser = reqparse.RequestParser()
update_parser.add_argument('name', type=str)

@ns.route('/')
class AmenityList(Resource):
    @ns.marshal_list_with(amenity_model)
    def get(self):
        """Retourne toutes les amenities"""
        return facade.get_all_amenities()

    @ns.expect(amenity_model, validate=True)
    @ns.marshal_with(amenity_model, code=201)
    def post(self):
        """Crée une nouvelle amenity"""
        data = ns.payload
        return facade.create_amenity(data), 201

@ns.route('/<string:amenity_id>')
@ns.param('amenity_id', 'Identifiant de l\'amenity')
class AmenityResource(Resource):
    @ns.marshal_with(amenity_model)
    def get(self, amenity_id):
        """Retourne une amenity spécifique"""
        amenity = facade.get_amenity(amenity_id)
        if not amenity:
            ns.abort(404, "Amenity non trouvée")
        return amenity

    @ns.expect(update_parser)
    @ns.marshal_with(amenity_model)
    def put(self, amenity_id):
        """Met à jour une amenity existante"""
        data = update_parser.parse_args()
        clean_data = {k: v for k, v in data.items() if v is not None}
        amenity = facade.update_amenity(amenity_id, clean_data)
        if not amenity:
            ns.abort(404, "Amenity non trouvée")
        return amenity
