from app.models.user import User
from app.persistence.repository import InMemoryRepository
import uuid

class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()

    def create_user(self, data):
        """Crée un nouvel utilisateur avec un ID unique"""
        user_id = str(uuid.uuid4())
        user = User(
            id=user_id,
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', '')
        )
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        """Récupère un utilisateur par son ID"""
        return self.user_repo.get(user_id)

    def get_all_users(self):
        """Renvoie tous les utilisateurs"""
        return self.user_repo.get_all()

    def update_user(self, user_id, data):
        """Met à jour les informations d’un utilisateur (sauf le mot de passe)"""
        if 'password' in data:
            del data['password']
        self.user_repo.update(user_id, data)
        return self.get_user(user_id)

    def get_place(self, place_id):
        """(Placeholder) Récupère un lieu par son ID"""
        return self.place_repo.get(place_id)
