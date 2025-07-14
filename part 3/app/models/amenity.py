from app import db
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.models.base_model import BaseModel
import uuid

class Amenity(BaseModel, db.Model):
    __tablename__ = 'amenities'
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(50), unique=True, nullable=False)
    
    # Relation many-to-many avec Place
    places = relationship('Place', secondary='place_amenity', back_populates='amenities')
    
    def __init__(self, name, id=None):
        if id:
            self.id = id
        else:
            self.id = str(uuid.uuid4())
        self.name = name

    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
