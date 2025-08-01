from app import db, bcrypt
from app.models.base_model import BaseModel


class User(BaseModel):
    __tablename__ = 'users'

    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    # Relationships
    places = db.relationship('Place', backref='owner', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='user', lazy=True, cascade='all, delete-orphan')

    def hash_password(self, password):
        """Hashes the password before storing it."""
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        """Verifies if the provided password matches the hashed password."""
        return bcrypt.check_password_hash(self.password, password)

    def update(self, data):
        """Update user data, handling password specially."""
        for key, value in data.items():
            if key == 'password':
                self.hash_password(value)
            elif hasattr(self, key):
                setattr(self, key, value)
        super().update({})

    def to_dict(self):
        """Convert to dictionary, excluding password."""
        result = super().to_dict()
        if 'password' in result:
            del result['password']
        return result
