# Partie 4 - Client Web Simple (Front-end)

## 🎯 Objectif général
Interface utilisateur interactive développée en HTML5, CSS3 et JavaScript ES6 qui communique avec l'API back-end des parties précédentes.

## 📁 Structure du projet

```
part4/
├── login.html              # Page de connexion
├── places.html             # Liste des lieux
├── place_details.html      # Détails d'un lieu
├── add_review.html         # Formulaire d'ajout d'avis
├── style.css               # Styles CSS globaux
├── scripts/
│   ├── login.js            # Script de connexion
│   ├── places.js           # Script liste des lieux
│   ├── place_details.js    # Script détails d'un lieu
│   └── add_review.js       # Script ajout d'avis
├── assets/
│   ├── logo.svg            # Logo de l'application
│   └── icon.svg            # Favicon
└── README.md               # Ce fichier
```

## 🚀 Fonctionnalités implémentées

### ✅ Task 1 – Design
- **Pages créées** : login.html, places.html, place_details.html, add_review.html
- **CSS global** : style.css avec design responsive
- **Structure sémantique** : HTML5 avec header, main, footer, nav
- **Classes CSS** : Styles pour cartes, formulaires, boutons, messages

### ✅ Task 2 – Login
- **Authentification** : Connexion via API POST `/api/v1/auth/login`
- **Stockage JWT** : Token sauvé dans `localStorage`
- **Redirection** : Vers `places.html` si connexion réussie
- **Validation** : Email et mot de passe requis
- **Gestion d'erreurs** : Messages d'erreur clairs

### ✅ Task 3 – Liste des Lieux
- **Récupération des données** : GET `/api/v1/places`
- **Affichage dynamique** : Cartes des lieux générées en JS
- **Filtre par pays** : Dropdown avec filtrage côté client
- **Vérification auth** : Boutons login/logout selon le statut
- **Navigation** : Liens vers les détails de chaque lieu

### ✅ Task 4 – Détails d'un Lieu
- **URL avec paramètre** : `place_details.html?id=123`
- **Détails complets** : Nom, propriétaire, prix, description, équipements
- **Avis clients** : Liste des reviews avec notes étoilées
- **Ajout d'avis** : Bouton visible si utilisateur connecté
- **Images** : Placeholder automatique si image manquante

### ✅ Task 5 – Ajouter un Avis
- **Authentification requise** : Redirection si non connecté
- **Formulaire complet** : Note (1-5) + commentaire
- **Validation côté client** : Champs requis, longueur commentaire
- **Soumission API** : POST `/api/v1/places/:id/reviews` avec JWT
- **Feedback utilisateur** : Messages de succès/erreur
- **Compteur de caractères** : Limite 1000 caractères

## ⚙️ Configuration et Installation

### 1. Prérequis
- API backend fonctionnelle (parties 2 ou 3)
- Serveur web pour servir les fichiers HTML

### 2. Configuration de l'API
Dans chaque fichier JavaScript, vérifiez l'URL de l'API :
```javascript
const API_BASE_URL = 'http://localhost:5000/api/v1';
```

### 3. Résolution des problèmes CORS
Si vous obtenez des erreurs CORS, ajoutez dans votre API Flask :

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Autorise toutes les origines

# Ou plus sécurisé :
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8000", "http://127.0.0.1:8000"]
    }
})
```

### 4. Lancement du frontend
```bash
# Démarrer un serveur HTTP simple
python -m http.server 8000

# Ou avec Node.js
npx serve .

# Accéder à l'application
# http://localhost:8000
```

## 🔧 Utilisation

### Étapes de test
1. **Démarrer votre API backend** (port 5000)
2. **Lancer le serveur frontend** (port 8000)
3. **Ouvrir** `http://localhost:8000/places.html`
4. **Se connecter** via `login.html`
5. **Navigator** dans l'application

### Comptes de test
Utilisez les comptes créés dans les parties précédentes ou créez-en via votre API.

## 🎨 Design et UX

### Responsive Design
- **Mobile-first** : Interface adaptative
- **Grid CSS** : Disposition flexible des cartes
- **Media queries** : Optimisation mobile/desktop

### Palette de couleurs
- **Primaire** : #3498db (bleu)
- **Secondaire** : #2c3e50 (bleu foncé)
- **Succès** : #27ae60 (vert)
- **Erreur** : #e74c3c (rouge)
- **Fond** : #f8f9fa (gris clair)

### Spécifications des cartes
- **Margin** : 20px
- **Padding** : 10px  
- **Border** : 1px solid #ddd
- **Border-radius** : 10px

## 🔒 Sécurité

### Gestion des tokens JWT
- **Stockage** : localStorage (côté client)
- **Transmission** : Header `Authorization: Bearer <token>`
- **Expiration** : Gestion automatique par l'API
- **Déconnexion** : Suppression du token

### Validation côté client
- **Email** : Format valide requis
- **Mot de passe** : Non vide
- **Commentaires** : 10-1000 caractères
- **Notes** : 1-5 obligatoire

## 🐛 Dépannage

### Problèmes courants

**CORS Error**
```
Solution : Configurer CORS dans l'API Flask
```

**Token expired**
```
Solution : Se reconnecter via login.html
```

**API non disponible**
```
Solution : Vérifier que l'API backend fonctionne sur le bon port
```

**Images manquantes**
```
Solution : Les placeholders SVG s'affichent automatiquement
```

## 📱 Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge (versions récentes)
- **JavaScript** : ES6+ requis
- **CSS** : Grid et Flexbox supportés
- **API** : Fetch API native

## 🎯 Objectifs pédagogiques atteints

✅ **HTML5 sémantique** : Structure claire et accessible  
✅ **CSS3 moderne** : Grid, Flexbox, animations  
✅ **JavaScript ES6** : Async/await, modules, classes  
✅ **API REST** : Fetch, authentification JWT  
✅ **UX/UI** : Interface intuitive et responsive  
✅ **Sécurité** : Validation et gestion des sessions  

---

**Note** : Cette application frontend communique avec l'API développée dans les parties précédentes du projet HBnB. Assurez-vous que votre backend est fonctionnel avant de tester le frontend.
