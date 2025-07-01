# Definition of endpoints for the Review entity
from flask_restx import Namespace, Resource, fields, reqparse
from app.services.facade import HBnBFacade

facade = HBnBFacade()
ns = Namespace('reviews', description='Reviews management')

# Model for creating/updating reviews
review_model = ns.model('Review', {
    'id': fields.String(readOnly=True),
    'text': fields.String(required=True, description='Review text'),
    'rating': fields.Integer(required=True, description='Place rating (1-5)'),
    'user_id': fields.String(required=True, description='User ID'),
    'place_id': fields.String(required=True, description='Place ID')
})

# Parser for updates
update_parser = reqparse.RequestParser()
update_parser.add_argument('text', type=str)
update_parser.add_argument('rating', type=int)

@ns.route('/')
class ReviewList(Resource):
    @ns.marshal_list_with(review_model)
    def get(self):
        """Retrieve the list of all reviews"""
        return facade.get_all_reviews()

    @ns.expect(review_model, validate=True)
    @ns.marshal_with(review_model, code=201)
    def post(self):
        """Create a new review"""
        data = ns.payload
        return facade.create_review(data), 201

@ns.route('/<string:review_id>')
@ns.param('review_id', 'Review identifier')
class ReviewResource(Resource):
    @ns.marshal_with(review_model)
    def get(self, review_id):
        """Retrieve the details of a specific review"""
        review = facade.get_review(review_id)
        if not review:
            ns.abort(404, "Review not found")
        return review

    @ns.expect(update_parser)
    @ns.marshal_with(review_model)
    def put(self, review_id):
        """Update an existing review"""
        data = update_parser.parse_args()
        clean_data = {k: v for k, v in data.items() if v is not None}
        review = facade.update_review(review_id, clean_data)
        if not review:
            ns.abort(404, "Review not found")
        return review

    def delete(self, review_id):
        """Delete a review"""
        result = facade.delete_review(review_id)
        if not result:
            ns.abort(404, "Review not found")
        return {'message': 'Review successfully deleted'}, 200

@ns.route('/places/<string:place_id>/reviews')
@ns.param('place_id', 'Place identifier')
class PlaceReviewList(Resource):
    @ns.marshal_list_with(review_model)
    def get(self, place_id):
        """Retrieve all reviews for a specific place"""
        reviews = facade.get_reviews_by_place(place_id)
        if reviews is None:
            ns.abort(404, "Place not found")
        return reviews
