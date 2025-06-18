from flask import Flask
from flask_restx import Api
from app.api.v1.users import ns as user_ns
from app.api.v1.places import ns as place_ns
from app.api.v1.reviews import ns as review_ns
from app.api.v1.amenities import ns as amenity_ns


def create_app():
    app = Flask(__name__)
    api = Api(
        app,
        version='1.0',
        title='HBnB API',
        description='HBnB Application API',
        doc='/api/v1/'  # Swagger documentation endpoint
    )
    
    api.add_namespace(user_ns, path='/api/v1/users')
    api.add_namespace(place_ns, path='/api/v1/places')
    api.add_namespace(review_ns, path='/api/v1/reviews')
    api.add_namespace(amenity_ns, path='/api/v1/amenities')
    # Les namespaces seront ajoutés ici plus tard

    return app
