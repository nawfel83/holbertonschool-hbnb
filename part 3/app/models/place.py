from app import db
from app.models.base_model import BaseModel
from app.models.associations import place_amenity


class Place(BaseModel):
    __tablename__ = 'places'

    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    owner_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)

    # Relationships
    reviews = db.relationship('Review', backref='place', lazy=True, cascade='all, delete-orphan')
    amenities = db.relationship('Amenity', secondary=place_amenity, lazy='subquery',
                              backref=db.backref('places', lazy=True))

    def _validate_price(self, price):
        """Validate that the price is positive"""
        if float(price) < 0:
            raise ValueError("Price must be positive")
        return price

    def _validate_latitude(self, latitude):
        """Validate that the latitude is within valid range"""
        if not (-90.0 <= float(latitude) <= 90.0):
            raise ValueError("Latitude must be between -90 and 90")
        return latitude

    def _validate_longitude(self, longitude):
        """Validate that the longitude is within valid range"""
        if not (-180.0 <= float(longitude) <= 180.0):
            raise ValueError("Longitude must be between -180 and 180")
        return longitude

    def update(self, data):
        """Update place data with validation."""
        for key, value in data.items():
            if key == 'price':
                value = self._validate_price(value)
            elif key == 'latitude':
                value = self._validate_latitude(value)
            elif key == 'longitude':
                value = self._validate_longitude(value)
            elif key == 'amenities':
                continue  # Handle amenities separately
            
            if hasattr(self, key):
                setattr(self, key, value)
        
        super().update({})

    def add_amenity(self, amenity):
        """Add an amenity to this place."""
        if amenity not in self.amenities:
            self.amenities.append(amenity)

    def remove_amenity(self, amenity):
        """Remove an amenity from this place."""
        if amenity in self.amenities:
            self.amenities.remove(amenity)

    def to_dict(self):
        """Convert to dictionary including relationships."""
        result = super().to_dict()
        result['amenities'] = [amenity.to_dict() for amenity in self.amenities]
        result['reviews'] = [review.to_dict() for review in self.reviews]
        result['price'] = float(result['price']) if result.get('price') else 0.0
        return result

    def _validate_latitude(self, latitude):
        """Validate that latitude is between -90 and 90"""
        if not -90 <= latitude <= 90:
            raise ValueError("Latitude must be between -90 and 90")
        return latitude

    def _validate_longitude(self, longitude):
        """Validate that longitude is between -180 and 180"""
        if not -180 <= longitude <= 180:
            raise ValueError("Longitude must be between -180 and 180")
        return longitude

    def update(self, data):
        """Update the attributes of the place"""
        for key, value in data.items():
            if key == 'price':
                value = self._validate_price(value)
            elif key == 'latitude':
                value = self._validate_latitude(value)
            elif key == 'longitude':
                value = self._validate_longitude(value)
            setattr(self, key, value)

    def add_review(self, review):
        """Add a review to this place"""
        self.reviews.append(review)

    def remove_review(self, review_id):
        """Remove a review from this place"""
        self.reviews = [r for r in self.reviews if r.id != review_id]
