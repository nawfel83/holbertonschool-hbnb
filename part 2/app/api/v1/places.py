from flask_restx import Namespace, Resource, fields, reqparse
from app.services.facade import HBnBFacade

# Facade and namespace initialization
facade = HBnBFacade()
api = Namespace('places', description='Places management')

# Data models
owner_model = api.model('Owner', {
    'id': fields.String,
    'first_name': fields.String,
    'last_name': fields.String,
    'email': fields.String
})

amenity_detail_model = api.model('AmenityDetail', {
    'id': fields.String,
    'name': fields.String
})

place_model = api.model('Place', {
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

place_creation_model = api.model('PlaceCreate', {
    'title': fields.String(required=True),
    'description': fields.String(required=True),
    'price': fields.Float(required=True),
    'latitude': fields.Float(required=True),
    'longitude': fields.Float(required=True),
    'owner_id': fields.String(required=True),
    'amenities': fields.List(fields.String, required=False)
})

# Parser for updates
update_parser = reqparse.RequestParser()
update_parser.add_argument('title', type=str)
update_parser.add_argument('description', type=str)
update_parser.add_argument('price', type=float)
update_parser.add_argument('latitude', type=float)
update_parser.add_argument('longitude', type=float)
update_parser.add_argument('amenities', type=str, action='append')

# Resources
@api.route('/')
class PlaceList(Resource):
    @api.marshal_list_with(place_model)
    def get(self):
        """Return all places"""
        return facade.get_all_places()

    @api.expect(place_creation_model, validate=True)
    @api.marshal_with(place_model, code=201)
    def post(self):
        """Create a new place"""
        data = api.payload

        # Price validation
        if data.get('price', 0) <= 0:
            api.abort(400, "Price must be positive")
        # Latitude validation
        if not (-90 <= data.get('latitude', 0) <= 90):
            api.abort(400, "Latitude must be between -90 and 90")
        # Longitude validation
        if not (-180 <= data.get('longitude', 0) <= 180):
            api.abort(400, "Longitude must be between -180 and 180")
        # Check if owner exists
        owner = facade.get_user(data['owner_id'])
        if not owner:
            api.abort(400, "The specified owner does not exist")

        return facade.create_place(data), 201

@api.route('/<string:place_id>')
@api.param('place_id', 'Place identifier')
class PlaceResource(Resource):
    @api.marshal_with(place_model)
    def get(self, place_id):
        """Return a specific place"""
        place = facade.get_place(place_id)
        if not place:
            api.abort(404, "Place not found")
        return place

    @api.expect(update_parser)
    @api.marshal_with(place_model)
    def put(self, place_id):
        """Update an existing place"""
        data = update_parser.parse_args()
        clean_data = {k: v for k, v in data.items() if v is not None}

        # Price validation if provided
        if 'price' in clean_data and clean_data['price'] <= 0:
            api.abort(400, "Price must be positive")
        # Latitude validation if provided
        if 'latitude' in clean_data and not (-90 <= clean_data['latitude'] <= 90):
            api.abort(400, "Latitude must be between -90 and 90")
        # Longitude validation if provided
        if 'longitude' in clean_data and not (-180 <= clean_data['longitude'] <= 180):
            api.abort(400, "Longitude must be between -180 and 180")

        place = facade.update_place(place_id, clean_data)
        if not place:
            api.abort(404, "Place not found")
        return place
