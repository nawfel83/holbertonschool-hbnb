from abc import ABC, abstractmethod
from app.models.place import Place
from app.models.user import User
from app.models.amenity import Amenity
from app.models.review import Review
from app import db

class Repository(ABC):
    @abstractmethod
    def add(self, obj):
        pass

    @abstractmethod
    def get(self, obj_id):
        pass

    @abstractmethod
    def get_all(self):
        pass

    @abstractmethod
    def update(self, obj_id, data):
        pass

    @abstractmethod
    def delete(self, obj_id):
        pass

    @abstractmethod
    def get_by_attribute(self, attr_name, attr_value):
        pass


class InMemoryRepository(Repository):
    def __init__(self):
        self._storage = {}

    def add(self, obj):
        self._storage[obj.id] = obj

    def get(self, obj_id):
        return self._storage.get(obj_id)

    def get_all(self):
        return list(self._storage.values())

    def update(self, obj_id, data):
        obj = self.get(obj_id)
        if obj:
            obj.update(data)

    def delete(self, obj_id):
        if obj_id in self._storage:
            del self._storage[obj_id]

    def get_by_attribute(self, attr_name, attr_value):
        return next((obj for obj in self._storage.values()
                     if getattr(obj, attr_name, None) == attr_value), None)

class SQLAlchemyRepository(Repository):
    """
    SQLAlchemy implementation of the Repository.
    """

    def __init__(self, model):
        """
        Initialize the repository with the model to use.
        """
        self.model = model

    def add(self, obj):
        """
        Add an object to the database.
        """
        db.session.add(obj)
        db.session.commit()

    def get(self, obj_id):
        """
        Get an object from the database by its ID.
        """
        return self.model.query.get(obj_id)

    def get_all(self):
        """
        Get all objects from the database.
        """
        return self.model.query.all()

    def update(self, obj_id, **data):
        """
        Update an object in the database.
        """
        obj = self.get(obj_id)
        if obj:
            for key, value in data.items():
                setattr(obj, key, value)
            db.session.commit()

    def delete(self, obj_id):
        """
        Delete an object from the database by its ID.
        """
        obj = self.get(obj_id)
        if obj:
            db.session.delete(obj)
            db.session.commit()

    def get_by_attribute(self, attr_name, attr_value):
        """
        Get an object from the database by a specific attribute.
        """
        return self.model.query.filter_by(**{attr_name: attr_value}).first()

class PlaceRepository(SQLAlchemyRepository):
    """
    Repository for Place objects.
    """

    def __init__(self):
        """
        Initialize the repository with the Place model.
        """
        super().__init__(Place)

class UserRepository(SQLAlchemyRepository):
    """
    Repository for User objects.
    """

    def __init__(self):
        """
        Initialize the repository with the User model.
        """
        super().__init__(User)

    def get_by_email(self, email):
        """
        Get a user by email.
        """
        return self.model.query.filter_by(email=email).first()
    
class ReviewRepository(SQLAlchemyRepository):
    """
    Repository for Review objects.
    """

    def __init__(self):
        """
        Initialize the repository with the Review model.
        """
        super().__init__(Review)

    def get_reviews_by_place(self, place_id):
        """
        Get all reviews for a place
        """
        return self.model.query.filter_by(place_id=place_id).all()


class AmenityRepository(SQLAlchemyRepository):
    """
    Repository for Amenity objects.
    """

    def __init__(self):
        """
        Initialize the repository with the Amenity model.
        """
        super().__init__(Amenity)