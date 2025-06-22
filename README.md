```md
# HBnB - Part 2: RESTful API with Flask 🚀

## Overview

This part of the HBnB project implements a RESTful API in Python using Flask and Flask-RESTx. It allows you to manage the main entities of the HBnB system: users, places, amenities, and reviews. 🏠✨

## Project Structure

```
part 2/
│
├── run.py
└── app/
    ├── __init__.py
    ├── api/
    │   └── v1/
    │       ├── users.py
    │       ├── places.py
    │       ├── amenities.py
    │       └── reviews.py
    ├── models/
    │   ├── user.py
    │   ├── place.py
    │   ├── amenity.py
    │   └── review.py
    ├── persistence/
    │   └── repository.py
    ├── services/
    │   └── facade.py
    └── tests/
```

## Features

- **User management**: create, retrieve, update users 👤
- **Place management**: create, retrieve, update places, link amenities 🏡
- **Amenity management**: create, retrieve, update amenities 🛏️
- **Review management**: create, retrieve, update, delete reviews, filter by place ⭐

## How to Run

1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

2. Start the Flask server:
   ```sh
   python run.py
   ```

3. Access the interactive documentation:
   - Go to [http://localhost:5000/api/v1/](http://localhost:5000/api/v1/) to explore the API via Swagger UI 📚

## Testing

Unit tests should be written in the `app/tests/` folder 🧪

## Technologies

- Python 3 🐍
- Flask 🌶️
- Flask-RESTx

## Authors

Nawfel | Warren | Yassine ✨
```
