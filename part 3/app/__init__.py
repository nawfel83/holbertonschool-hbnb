from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
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
    
    # Enregistrer les blueprints (si ils existent)
    try:
        from app.api.v1.users import bp as users_bp
        from app.api.v1.places import bp as places_bp
        from app.api.v1.reviews import bp as reviews_bp
        from app.api.v1.amenities import bp as amenities_bp
        
        app.register_blueprint(users_bp)
        app.register_blueprint(places_bp)
        app.register_blueprint(reviews_bp)
        app.register_blueprint(amenities_bp)
    except ImportError:
        # Les blueprints peuvent ne pas exister encore
        pass
    
    return app
