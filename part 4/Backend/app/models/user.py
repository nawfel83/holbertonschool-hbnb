from app import bcrypt, db
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
import uuid

class User(db.Model):
    __tablename__ = 'users'
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    
    # Relations
    places = relationship('Place', backref='owner', lazy=True)
    reviews = relationship('Review', backref='user', lazy=True)
    
    def __init__(self, email, password, first_name, last_name, id=None):
        if id:
            self.id = id
        else:
            self.id = str(uuid.uuid4())
        self.email = email
        self.password = None
        self.hash_password(password)
        self.first_name = first_name
        self.last_name = last_name

    def hash_password(self, password):
        """Hashes the password before storing it."""
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        """Verifies if the provided password matches the hashed password."""
        return bcrypt.check_password_hash(self.password, password)

    def update(self, data):
        for key, value in data.items():
            # Never allow direct password update here
            if key not in ['password']:
                setattr(self, key, value)
