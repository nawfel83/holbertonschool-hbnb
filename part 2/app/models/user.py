# Modèle représentant un utilisateur

class User:
    def __init__(self, id, email, password, first_name='', last_name=''):
        self.id = id                    # Identifiant unique
        self.email = email              # Email de l'utilisateur
        self.password = password        # Mot de passe (non affiché en réponse)
        self.first_name = first_name    # Prénom
        self.last_name = last_name      # Nom
