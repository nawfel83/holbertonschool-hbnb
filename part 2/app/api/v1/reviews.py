from flask_restx import Namespace, Resource

api = Namespace('reviews', description='Review operations')

@api.route('/')
class ReviewList(Resource):
    def get(self):
        return {'message': 'List of reviews - placeholder'}

    def post(self):
        return {'message': 'Create review - placeholder'}
