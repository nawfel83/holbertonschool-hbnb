from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_restx import Api
from config import config_by_name

# Initialiser les extensions
db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app(config_name='development'):
    """Factory pour créer l'application Flask"""
    app = Flask(__name__)
    
    # Charger la configuration
    if config_name in config_by_name:
        app.config.from_object(config_by_name[config_name])
    else:
        app.config.from_object(config_by_name['default'])
    
    # Initialiser les extensions avec l'app
    db.init_app(app)
    bcrypt.init_app(app)
    
    # Initialiser Flask-RESTX
    api = Api(app, doc='/docs/', title='HBnB API', version='1.0', description='HBnB API Documentation')
    
    
    # Enregistrer les namespaces RESTX
    try:
        from app.api.v1.users import api as users_ns
        from app.api.v1.places import api as places_ns
        from app.api.v1.reviews import api as reviews_ns
        from app.api.v1.amenities import api as amenities_ns
        
        api.add_namespace(users_ns, path='/api/v1/users')
        api.add_namespace(places_ns, path='/api/v1/places')
        api.add_namespace(reviews_ns, path='/api/v1/reviews')
        api.add_namespace(amenities_ns, path='/api/v1/amenities')
    except ImportError as e:
        print(f"Warning: Could not import API namespaces: {e}")
    
    return app
