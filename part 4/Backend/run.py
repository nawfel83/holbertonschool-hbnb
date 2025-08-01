from app import create_app, db
from app.models import User, Place, Review, Amenity

app = create_app()

# Create the tables at application startup
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
