from datetime import datetime
import uuid
from app import db


class BaseModel(db.Model):
    __abstract__ = True

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def save(self):
        """Save the current instance to the database"""
        self.updated_at = datetime.utcnow()
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Delete the current instance from the database"""
        db.session.delete(self)
        db.session.commit()

    def update(self, data):
        """Update the current instance with new data"""
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.updated_at = datetime.utcnow()
        db.session.commit()

    def to_dict(self):
        """Convert the instance to a dictionary"""
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if isinstance(value, datetime):
                result[column.name] = value.isoformat()
            else:
                result[column.name] = value
        return result
