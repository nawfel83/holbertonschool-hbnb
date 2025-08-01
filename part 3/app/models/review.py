from app import db
from app.models.base_model import BaseModel


class Review(BaseModel):
    __tablename__ = 'reviews'

    text = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    place_id = db.Column(db.String(36), db.ForeignKey('places.id'), nullable=False)

    def _validate_rating(self, rating):
        """Validate that the rating is between 1 and 5"""
        if not 1 <= int(rating) <= 5:
            raise ValueError("Rating must be between 1 and 5")
        return rating

    def update(self, data):
        """Update review data with validation."""
        for key, value in data.items():
            if key == 'rating':
                value = self._validate_rating(value)
            if hasattr(self, key):
                setattr(self, key, value)
        
        super().update({})
