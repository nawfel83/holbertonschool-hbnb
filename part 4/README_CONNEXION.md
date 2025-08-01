# Guide de Connexion - Frontend avec Backend API

## 🔧 Configuration Requise

### 1. Démarrer le Serveur Backend (Part 3)

```bash
# Aller dans le dossier part 3
cd "../part 3"

# Installer les dépendances Python
pip install -r requirements.txt

# Initialiser la base de données
python init_db.py

# Démarrer le serveur Flask
python run.py
```

Le serveur backend sera accessible sur : `http://localhost:5000`

### 2. API d'Authentification

**Endpoint :** `POST http://localhost:5000/api/v1/auth/login`

**Format de requête :**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Réponse en cas de succès :**
```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Réponse en cas d'erreur :**
```json
{
    "error": "Invalid credentials"
}
```

## 🎯 Fonctionnement de la Connexion

### 1. Processus de Connexion
1. **Utilisateur** saisit email/mot de passe dans `login.html`
2. **JavaScript** intercepte la soumission du formulaire
3. **Requête AJAX** envoyée vers `http://localhost:5000/api/v1/auth/login`
4. **Backend** vérifie les identifiants dans la base de données
5. **Token JWT** retourné si connexion réussie
6. **Cookie** créé avec le token pour la session
7. **Redirection** vers `index.html`

### 2. Gestion des Erreurs
- **Validation côté client** : email valide, champs remplis
- **Messages d'erreur** affichés en cas d'échec
- **Gestion des erreurs réseau** si backend non disponible

### 3. Stockage de Session
- **Token JWT** stocké dans un cookie `access_token`
- **Durée de vie** : 7 jours
- **Utilisation** pour les requêtes authentifiées futures

## 🧪 Test de Connexion

### Créer un Utilisateur de Test

```bash
# Dans part 3, ouvrir une console Python
python3
```

```python
from app import create_app, db
from app.models.user import User

app = create_app()
with app.app_context():
    # Créer un utilisateur de test
    user = User(
        first_name="Test",
        last_name="User", 
        email="test@example.com"
    )
    user.hash_password("password123")
    db.session.add(user)
    db.session.commit()
    print("Utilisateur de test créé !")
```

### Identifiants de Test
- **Email :** `test@example.com`
- **Mot de passe :** `password123`

## 🔍 Dépannage

### Problèmes Courants

1. **Erreur CORS** : Ajouter les headers CORS dans l'API Flask
2. **Serveur non démarré** : Vérifier que `python run.py` fonctionne
3. **Base de données vide** : Exécuter `python init_db.py`
4. **Port occupé** : Changer le port dans `run.py`

### Vérification du Backend

```bash
# Tester l'API avec curl
curl -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
```

## 📱 Utilisation Frontend

1. **Ouvrir** `login.html` dans le navigateur
2. **Saisir** les identifiants de test
3. **Cliquer** sur "Se connecter"
4. **Vérifier** la redirection vers `index.html`
5. **Observer** le cookie `access_token` dans les outils développeur

La connexion utilise maintenant la **vraie base de données** du backend API !
