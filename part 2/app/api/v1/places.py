from flask_restx import Namespace, Resource

ns = Namespace('places', description='Place operations')

@ns.route('/')
class PlaceList(Resource):
    def get(self):
        return {'message': 'List of places - placeholder'}

    def post(self):
        return {'message': 'Create place - placeholder'}
