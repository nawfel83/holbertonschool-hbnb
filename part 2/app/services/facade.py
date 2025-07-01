# services/facade.py - Facade updated with all methods
from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.amenity import Amenity
from app.persistence.repository import InMemoryRepository
import uuid

class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()



<<<<<<< HEAD
<<<<<<< HEAD
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
=======
    # =============== USER METHODS ===============
=======
>>>>>>> 17967596b14c8e26b568af7537ed4cdb0e1b8214
    def create_user(self, data):
        """Create a new user with a unique ID"""
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
        """Get a user by ID"""
        return self.user_repo.get(user_id)

    def get_all_users(self):
        """Return all users"""
        return self.user_repo.get_all()

    def update_user(self, user_id, data):
        """Update user information"""
        if 'password' in data:
            del data['password']
        self.user_repo.update(user_id, data)
        return self.get_user(user_id)


    def create_amenity(self, data):
        """Create a new amenity"""
        amenity_id = str(uuid.uuid4())
        amenity = Amenity(
            id=amenity_id,
            name=data['name']
        )
        self.amenity_repo.add(amenity)
        return amenity

    def get_amenity(self, amenity_id):
        """Get an amenity by ID"""
        return self.amenity_repo.get(amenity_id)

    def get_all_amenities(self):
        """Return all amenities"""
        return self.amenity_repo.get_all()

    def update_amenity(self, amenity_id, data):
        """Update an amenity"""
        self.amenity_repo.update(amenity_id, data)
        return self.get_amenity(amenity_id)


    def create_place(self, data):
        """Create a new place with validation"""
        place_id = str(uuid.uuid4())
        

        owner = self.get_user(data['owner_id'])
        if not owner:
            raise ValueError("Owner not found")
        

        amenity_objects = []
        if 'amenities' in data:
            for amenity_id in data['amenities']:
                amenity = self.get_amenity(amenity_id)
                if not amenity:
                    raise ValueError(f"Amenity {amenity_id} not found")
                amenity_objects.append(amenity)
        
        place = Place(
            id=place_id,
            title=data['title'],
            description=data.get('description', ''),
            price=data['price'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            owner_id=data['owner_id'],
            amenities=data.get('amenities', [])
        )
        self.place_repo.add(place)
        

        return self._get_place_with_details(place_id)

    def get_place(self, place_id):
        """Get a place with all its details"""
        return self._get_place_with_details(place_id)

    def get_all_places(self):
        """Return all places with their details"""
        places = self.place_repo.get_all()
        return [self._get_place_with_details(place.id) for place in places]

    def update_place(self, place_id, data):
        """Update a place"""
        place = self.place_repo.get(place_id)
        if not place:
            return None
        

        if 'amenities' in data:
            for amenity_id in data['amenities']:
                amenity = self.get_amenity(amenity_id)
                if not amenity:
                    raise ValueError(f"Amenity {amenity_id} not found")
        
        self.place_repo.update(place_id, data)
        return self._get_place_with_details(place_id)

    def _get_place_with_details(self, place_id):
        """Get a place with full details (owner and amenities)"""
        place = self.place_repo.get(place_id)
        if not place:
            return None
        

        owner = self.get_user(place.owner_id)
        

        amenity_details = []
        for amenity_id in place.amenities:
            amenity = self.get_amenity(amenity_id)
            if amenity:
                amenity_details.append({
                    'id': amenity.id,
                    'name': amenity.name
                })
        
        return {
            'id': place.id,
            'title': place.title,
            'description': place.description,
            'price': place.price,
            'latitude': place.latitude,
            'longitude': place.longitude,
            'owner': {
                'id': owner.id,
                'first_name': owner.first_name,
                'last_name': owner.last_name,
                'email': owner.email
            } if owner else None,
            'amenities': amenity_details
        }


    def create_review(self, data):
        """Create a new review with validation"""
        review_id = str(uuid.uuid4())
        
        # Check that the user exists
        user = self.get_user(data['user_id'])
        if not user:
            raise ValueError("User not found")
        
        # Check that the place exists
        place = self.place_repo.get(data['place_id'])
        if not place:
            raise ValueError("Place not found")
        
        review = Review(
            id=review_id,
            text=data['text'],
            rating=data['rating'],
            user_id=data['user_id'],
            place_id=data['place_id']
        )
        self.review_repo.add(review)
        
        # Add the review to the place
        place.add_review(review)
        
        return review

    def get_review(self, review_id):
        """Get a review by ID"""
        return self.review_repo.get(review_id)

    def get_all_reviews(self):
        """Return all reviews"""
        return self.review_repo.get_all()

    def get_reviews_by_place(self, place_id):
        """Get all reviews for a place"""
        place = self.place_repo.get(place_id)
        if not place:
            return None
        
        # Get all reviews for this place
        all_reviews = self.review_repo.get_all()
        return [review for review in all_reviews if review.place_id == place_id]

    def update_review(self, review_id, data):
        """Update a review"""
        review = self.review_repo.get(review_id)
        if not review:
            return None
        
        self.review_repo.update(review_id, data)
        return self.get_review(review_id)

    def delete_review(self, review_id):
        """Delete a review"""
        review = self.review_repo.get(review_id)
        if not review:
            return False
        
        # Remove the review from the place
        place = self.place_repo.get(review.place_id)
        if place:
            place.remove_review(review_id)
        
        # Remove the review from the repository
        self.review_repo.delete(review_id)
        return True
<<<<<<< HEAD
>>>>>>> origin/main
=======

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

>>>>>>> 17967596b14c8e26b568af7537ed4cdb0e1b8214
