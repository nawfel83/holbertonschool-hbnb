from app.models.user import User
from app.models.amenity import Amenity
from app.models.place import Place
from app.models.review import Review
from app.persistence.repository import UserRepository
from app.persistence.repository import PlaceRepository
from app.persistence.repository import ReviewRepository
from app.persistence.repository import AmenityRepository
import uuid

class HBnBFacade:
    def __init__(self):
        self.user_repo = UserRepository()
        self.place_repo = PlaceRepository()
        self.review_repo = ReviewRepository()
        self.amenity_repo = AmenityRepository()

    # USER
    def create_user(self, data):
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
        return self.user_repo.get(user_id)

    def get_all_users(self):
        return self.user_repo.get_all()

    def update_user(self, user_id, data):
        if 'password' in data:
            del data['password']
        self.user_repo.update(user_id, data)
        return self.get_user(user_id)

    # AMENITY
    def create_amenity(self, amenity_data):
        if 'id' not in amenity_data:
            amenity_data['id'] = str(uuid.uuid4())
        amenity = Amenity(**amenity_data)
        self.amenity_repo.add(amenity)
        return amenity

    def get_amenity(self, amenity_id):
        return self.amenity_repo.get(amenity_id)

    def get_all_amenities(self):
        return self.amenity_repo.get_all()

    def update_amenity(self, amenity_id, data):
        self.amenity_repo.update(amenity_id, data)
        return self.get_amenity(amenity_id)

    # PLACE
    def create_place(self, data):
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
        return place

    def get_place(self, place_id):
        return self.place_repo.get(place_id)

    def get_all_places(self):
        return self.place_repo.get_all()

    def update_place(self, place_id, data):
        place = self.place_repo.get(place_id)
        if not place:
            return None
        if 'amenities' in data:
            for amenity_id in data['amenities']:
                amenity = self.get_amenity(amenity_id)
                if not amenity:
                    raise ValueError(f"Amenity {amenity_id} not found")
        self.place_repo.update(place_id, data)
        return self.get_place(place_id)

    # REVIEW
    def create_review(self, data):
        review_id = str(uuid.uuid4())
        review = Review(
            id=review_id,
            text=data['text'],
            rating=data['rating'],
            user_id=data['user_id'],
            place_id=data['place_id']
        )
        self.review_repo.add(review)
        return review

    def get_review(self, review_id):
        return self.review_repo.get(review_id)

    def get_all_reviews(self):
        return self.review_repo.get_all()

    def get_reviews_by_place(self, place_id):
        all_reviews = self.review_repo.get_all()
        return [review for review in all_reviews if review.place_id == place_id]

    def update_review(self, review_id, data):
        review = self.review_repo.get(review_id)
        if not review:
            return None
        self.review_repo.update(review_id, data)
        return self.get_review(review_id)

    def delete_review(self, review_id):
        review = self.review_repo.get(review_id)
        if not review:
            return False
        self.review_repo.delete(review_id)
        return True

    def get_user_by_email(self, email):
        return self.user_repo.get_by_attribute('email', email)
