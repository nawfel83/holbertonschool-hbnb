from app import db, bcrypt
from app.models.base_model import BaseModel
from sqlalchemy.orm import validates, relationship
import re
import uuid

class User(BaseModel, db.Model):
    __tablename__ = 'users'

    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)

    # Relations
    places = relationship('Place', backref='owner', lazy=True, cascade='all, delete-orphan')
    reviews = relationship('Review', backref='user', lazy=True, cascade='all, delete-orphan')

    def __init__(self, email, password, first_name, last_name, id=None, is_admin=False):
        if id:
            self.id = id
        else:
            self.id = str(uuid.uuid4())
        self.email = email
        self.password = None
        self.hash_password(password)
        self.first_name = first_name
        self.last_name = last_name
        self.is_admin = is_admin

    def hash_password(self, password):
        """Hashes the password before storing it."""
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        """Verifies if the provided password matches the hashed password."""
        return bcrypt.check_password_hash(self.password, password)

    def update(self, data):
        for key, value in data.items():
            if key not in ['password']:
                setattr(self, key, value)
