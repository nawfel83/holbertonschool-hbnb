from app import db
from sqlalchemy import Table, Column, String, ForeignKey

# Table d'association pour la relation many-to-many Place-Amenity
place_amenity = Table
(
    'place_amenity',
    db.Model.metadata,
    Column('place_id', String(36), ForeignKey('places.id'), primary_key=True),
    Column('amenity_id', String(36), ForeignKey('amenities.id'), primary_key=True)
)
