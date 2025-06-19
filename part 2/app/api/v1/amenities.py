from flask_restx import Namespace, Resource

ns = Namespace('amenities', description='Amenity operations')

@ns.route('/')
class AmenityList(Resource):
    def get(self):
        return {'message': 'List of amenities - placeholder'}

    def post(self):
        return {'message': 'Create amenity - placeholder'}
