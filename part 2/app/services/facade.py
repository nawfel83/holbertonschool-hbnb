from app.persistence.repository import InMemoryRepository

class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()

    def create_user(self, user_data):
        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        return self.user_repo.get(user_id)

    def get_user_by_email(self, email):
        return self.user_repo.get_by_attribute('email', email)

    def get_all_users(self):
        """Retourne tous les utilisateurs sans le mot de passe"""
        users = self.user_repo.all()
        return [
            {
                'id': u.id,
                'first_name': u.first_name,
                'last_name': u.last_name,
                'email': u.email
            }
            for u in users
        ]

    def update_user(self, user_id, data):
        """Met à jour un utilisateur"""
        user = self.user_repo.get(user_id)
        if not user:
            return None


        for field in ['first_name', 'last_name', 'email', 'password']:
            if field in data:
                setattr(user, field, data[field])

        self.user_repo.update(user_id, user)

        return {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email
        }
    
    def create_amenity(self, amenity_data):
        amenity = Amenity(**amenity_data)
        self.amenity_repo.add(amenity)
        return amenity

    def get_amenity(self, amenity_id):
        return self.amenity_repo.get(amenity_id)

    def get_all_amenities(self):
        return [vars(a) for a in self.amenity_repo.all()]

    def update_amenity(self, amenity_id, data):
        amenity = self.amenity_repo.get(amenity_id)
        if not amenity:
            return None
        if 'name' in data:
            amenity.name = data['name']
        self.amenity_repo.update(amenity_id, amenity)
        return vars(amenity)
