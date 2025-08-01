#!/usr/bin/env python3
from app import create_app, db
from app.models.user import User

app = create_app()
with app.app_context():
    # Vérifier si l'utilisateur existe déjà
    existing_user = User.query.filter_by(email="jane@example.com").first()
    if existing_user:
        print(f"Utilisateur {existing_user.email} existe déjà")
    else:
        u = User("Jane", "Doe", "jane@example.com", "password123", False)
        db.session.add(u)
        db.session.commit()
        print(f"Utilisateur créé: {u.email}")
