# 🏠 HBnB - Part 2: RESTful API with Flask

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [📁 Project Structure](#-project-structure)
- [✨ Features](#-features)
- [🚀 How to Run](#-how-to-run)
- [🧪 Testing](#-testing)
- [📚 API Documentation](#-api-documentation)
- [🔧 Technologies](#-technologies)
- [👥 Authors](#-authors)

---

## 🎯 Overview

This is the second part of the **HBnB project**, where we implement a **RESTful API** using **Python**, **Flask**, and **Flask-RESTx**.  
The API allows management of the main entities of the HBnB system: `Users`, `Places`, `Amenities`, and `Reviews`.

The project follows a **layered architecture** with clear separation of concerns:
- **Models**: Data entities and business logic
- **Services**: Business logic layer (Facade pattern)
- **API**: RESTful endpoints
- **Persistence**: Data storage layer
- **Tests**: Comprehensive unit testing

---

## 📁 Project Structure

```
part 2/
├── config.py                 # Configuration settings
├── run.py                   # Application entry point
├── requirements.txt         # Python dependencies
├── README.md               # This file
│
├── app/                    # Main application package
│   ├── __init__.py
│   │
│   ├── api/               # API layer (RESTful endpoints)
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── users.py      # User endpoints
│   │       ├── places.py     # Place endpoints
│   │       ├── amenities.py  # Amenity endpoints
│   │       └── reviews.py    # Review endpoints
│   │
│   ├── models/            # Data models
│   │   ├── __init__.py
│   │   ├── user.py          # User model
│   │   ├── place.py         # Place model
│   │   ├── amenity.py       # Amenity model
│   │   └── review.py        # Review model
│   │
│   ├── services/          # Business logic layer
│   │   ├── __init__.py
│   │   └── facade.py        # Facade pattern implementation
│   │
│   ├── persistence/       # Data persistence layer
│   │   ├── __init__.py
│   │   └── repository.py    # Repository pattern implementation
│   │
│   └── tests/            # Unit tests
│       ├── __init__.py
│       ├── test_user.py     # User model tests
│       ├── test_place.py    # Place model tests
│       ├── test_amenity.py  # Amenity model tests
│       └── test_review.py   # Review model tests
```

## ✨ Features

### 👤 User Management
- ✅ Create new users with email validation
- ✅ Retrieve user information by ID
- ✅ Update user details (first name, last name)
- ✅ List all users
- ✅ Email uniqueness validation

### 🏠 Place Management
- ✅ Create places with owner validation
- ✅ Add amenities to places
- ✅ Update place information
- ✅ Price and coordinate validation
- ✅ List all places
- ✅ Retrieve place details with amenities

### 🎯 Amenity Management
- ✅ Create amenities
- ✅ Update amenity information
- ✅ List all amenities
- ✅ Retrieve amenity details

### ⭐ Review Management
- ✅ Create reviews for places
- ✅ Update review content
- ✅ Delete reviews
- ✅ List reviews by place
- ✅ Rating validation (1-5 stars)

## 🚀 How to Run

### Prerequisites
- Python 3.8+ installed
- pip package manager

### Installation & Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd holbertonschool-hbnb-2/part\ 2/
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask server**:
   ```bash
   python run.py
   ```

4. **Access the API**:
   - Server runs at: `http://localhost:5000`
   - Interactive documentation: `http://localhost:5000/api/v1/`

## 🧪 Testing

### Test Structure
The project includes comprehensive unit tests for all models and facade operations:

```
app/tests/
├── test_user.py      # User model and facade tests
├── test_place.py     # Place model and facade tests  
├── test_amenity.py   # Amenity model and facade tests
└── test_review.py    # Review model and facade tests
```

### Running Tests

1. **Run all tests**:
   ```bash
   python -m unittest discover app/tests/
   ```

2. **Run specific test file**:
   ```bash
   python -m unittest app.tests.test_user
   python -m unittest app.tests.test_place
   python -m unittest app.tests.test_amenity
   python -m unittest app.tests.test_review
   ```

3. **Run with verbose output**:
   ```bash
   python -m unittest discover app/tests/ -v
   ```

### Test Coverage

Each test file covers:
- ✅ **Model Creation**: Testing object instantiation with valid data
- ✅ **Attribute Validation**: Ensuring all attributes are properly set
- ✅ **Update Operations**: Testing model update functionality
- ✅ **Facade Operations**: Testing business logic through the facade
- ✅ **Error Handling**: Testing invalid data and edge cases
- ✅ **Data Validation**: Testing input validation rules

### Example Test Scenarios

#### User Tests
- Email format validation
- Unique ID generation
- User update operations
- Facade CRUD operations

#### Place Tests  
- Price validation (must be positive)
- Coordinate validation (latitude: -90 to 90, longitude: -180 to 180)
- Owner validation
- Amenity association

#### Amenity Tests
- Name requirement validation
- Unique amenity creation
- Update operations

#### Review Tests
- Rating validation (1-5 scale)
- User and place association
- Review content validation

## 📚 API Documentation

### Available Endpoints

#### Users
- `GET /api/v1/users/` - List all users
- `POST /api/v1/users/` - Create a new user
- `GET /api/v1/users/{id}` - Get user by ID
- `PUT /api/v1/users/{id}` - Update user

#### Places
- `GET /api/v1/places/` - List all places
- `POST /api/v1/places/` - Create a new place
- `GET /api/v1/places/{id}` - Get place by ID
- `PUT /api/v1/places/{id}` - Update place

#### Amenities
- `GET /api/v1/amenities/` - List all amenities
- `POST /api/v1/amenities/` - Create a new amenity
- `GET /api/v1/amenities/{id}` - Get amenity by ID
- `PUT /api/v1/amenities/{id}` - Update amenity

#### Reviews
- `GET /api/v1/reviews/` - List all reviews
- `POST /api/v1/reviews/` - Create a new review
- `GET /api/v1/reviews/{id}` - Get review by ID
- `PUT /api/v1/reviews/{id}` - Update review
- `DELETE /api/v1/reviews/{id}` - Delete review
- `GET /api/v1/places/{id}/reviews` - Get reviews for a place

### Interactive Documentation
Visit `http://localhost:5000/api/v1/` to access the **Swagger UI** for interactive API testing.

## 🔧 Technologies

- **Python 3.8+** - Programming language
- **Flask** - Web framework
- **Flask-RESTx** - RESTful API extension with Swagger documentation
- **unittest** - Python testing framework
- **UUID** - Unique identifier generation

### Architecture Patterns
- **Facade Pattern** - Simplified interface to complex subsystems
- **Repository Pattern** - Data access abstraction layer
- **Layered Architecture** - Clear separation of concerns

## 👥 Authors

**Nawfel** | **Warren** | **Yassine**

---

## 📝 Development Notes

### Code Quality Guidelines
- Follow PEP 8 style guidelines
- Write comprehensive docstrings
- Maintain test coverage above 80%
- Use meaningful variable and function names

### Future Enhancements
- [ ] Database integration (SQLAlchemy)
- [ ] Authentication and authorization
- [ ] Advanced search and filtering
- [ ] File upload for place images
- [ ] Pagination for large datasets

---

