# Définition des endpoints pour l'entité Review
from flask_restx import Namespace, Resource, fields, reqparse
from app.services.facade import HBnBFacade

facade = HBnBFacade()
ns = Namespace('reviews', description='Gestion des reviews')

# Modèle pour créer/mettre à jour les reviews
review_model = ns.model('Review', {
    'id': fields.String(readOnly=True),
    'text': fields.String(required=True, description='Texte de la review'),
    'rating': fields.Integer(required=True, description='Note de la place (1-5)'),
    'user_id': fields.String(required=True, description='ID de l\'utilisateur'),
    'place_id': fields.String(required=True, description='ID de la place')
})

# Parser pour les mises à jour
update_parser = reqparse.RequestParser()
update_parser.add_argument('text', type=str)
update_parser.add_argument('rating', type=int)

@ns.route('/')
class ReviewList(Resource):
    @ns.marshal_list_with(review_model)
    def get(self):
        """Récupère la liste de toutes les reviews"""
        return facade.get_all_reviews()

    @ns.expect(review_model, validate=True)
    @ns.marshal_with(review_model, code=201)
    def post(self):
        """Crée une nouvelle review"""
        data = ns.payload
        return facade.create_review(data), 201

@ns.route('/<string:review_id>')
@ns.param('review_id', 'Identifiant de la review')
class ReviewResource(Resource):
    @ns.marshal_with(review_model)
    def get(self, review_id):
        """Récupère les détails d'une review spécifique"""
        review = facade.get_review(review_id)
        if not review:
            ns.abort(404, "Review non trouvée")
        return review

    @ns.expect(update_parser)
    @ns.marshal_with(review_model)
    def put(self, review_id):
        """Met à jour une review existante"""
        data = update_parser.parse_args()
        clean_data = {k: v for k, v in data.items() if v is not None}
        review = facade.update_review(review_id, clean_data)
        if not review:
            ns.abort(404, "Review non trouvée")
        return review

    def delete(self, review_id):
        """Supprime une review"""
        result = facade.delete_review(review_id)
        if not result:
            ns.abort(404, "Review non trouvée")
        return {'message': 'Review supprimée avec succès'}, 200

@ns.route('/places/<string:place_id>/reviews')
@ns.param('place_id', 'Identifiant de la place')
class PlaceReviewList(Resource):
    @ns.marshal_list_with(review_model)
    def get(self, place_id):
        """Récupère toutes les reviews d'une place spécifique"""
        reviews = facade.get_reviews_by_place(place_id)
        if reviews is None:
            ns.abort(404, "Place non trouvée")
        return reviews