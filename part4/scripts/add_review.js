// add_review.js - Gestion de l'ajout d'avis

// Configuration de l'API
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Variables globales
let currentPlaceId = null;

// Fonction pour vérifier l'authentification
function checkAuthentication() {
    const token = localStorage.getItem('jwt');
    
    if (!token) {
        // Rediriger vers la page des lieux si non connecté
        window.location.href = 'places.html';
        return null;
    }
    
    return token;
}

// Fonction de déconnexion
function logout() {
    localStorage.removeItem('jwt');
    window.location.href = 'login.html';
}

// Fonction pour récupérer l'ID du lieu depuis l'URL
function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Fonction pour récupérer le nom du lieu
async function fetchPlaceName(placeId) {
    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const place = await response.json();
            const placeNameDiv = document.getElementById('place-name');
            placeNameDiv.innerHTML = `<h3>Avis pour: ${place.name}</h3><p>Partagez votre expérience avec les autres voyageurs.</p>`;
            
            // Configurer le lien de retour
            const backLink = document.getElementById('back-to-place');
            backLink.href = `place_details.html?id=${placeId}`;
        }
    } catch (error) {
        console.error('Erreur lors du chargement du nom du lieu:', error);
    }
}

// Fonction pour soumettre un avis
async function submitReview(placeId, rating, comment) {
    try {
        const token = localStorage.getItem('jwt');
        
        const response = await fetch(`${API_BASE_URL}/places/${placeId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                text: comment,
                rating: parseInt(rating)
            })
        });

        if (response.ok) {
            showSuccess('Votre avis a été publié avec succès !');
            
            // Effacer le formulaire
            document.getElementById('review-form').reset();
            
            // Rediriger vers les détails du lieu après 2 secondes
            setTimeout(() => {
                window.location.href = `place_details.html?id=${placeId}`;
            }, 2000);
            
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la publication de l\'avis');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError(error.message || 'Impossible de publier l\'avis. Vérifiez votre connexion.');
    }
}

// Fonction pour afficher les messages d'erreur
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    
    successDiv.style.display = 'none';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Faire défiler vers le message
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Fonction pour afficher les messages de succès
function showSuccess(message) {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    
    errorDiv.style.display = 'none';
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Faire défiler vers le message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Fonction pour cacher les messages
function hideMessages() {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
}

// Initialisation quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification (redirige si non connecté)
    const token = checkAuthentication();
    
    if (!token) {
        return; // L'utilisateur sera redirigé
    }
    
    // Récupérer l'ID du lieu depuis l'URL
    currentPlaceId = getPlaceIdFromURL();
    
    if (!currentPlaceId) {
        showError('ID du lieu manquant dans l\'URL.');
        return;
    }
    
    // Configurer le bouton de déconnexion
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
    
    // Charger le nom du lieu
    fetchPlaceName(currentPlaceId);
    
    // Configurer le formulaire d'avis
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        hideMessages();
        
        const rating = document.getElementById('rating').value;
        const comment = document.getElementById('comment').value.trim();
        
        // Validation
        if (!rating) {
            showError('Veuillez sélectionner une note.');
            return;
        }
        
        if (!comment) {
            showError('Veuillez écrire un commentaire.');
            return;
        }
        
        if (comment.length < 10) {
            showError('Le commentaire doit contenir au moins 10 caractères.');
            return;
        }
        
        if (comment.length > 1000) {
            showError('Le commentaire ne peut pas dépasser 1000 caractères.');
            return;
        }
        
        // Soumettre l'avis
        submitReview(currentPlaceId, rating, comment);
    });
    
    // Compteur de caractères pour le commentaire
    const commentTextarea = document.getElementById('comment');
    const charCountDiv = document.createElement('div');
    charCountDiv.style.textAlign = 'right';
    charCountDiv.style.fontSize = '0.9em';
    charCountDiv.style.color = '#666';
    charCountDiv.style.marginTop = '0.5rem';
    commentTextarea.parentNode.appendChild(charCountDiv);
    
    function updateCharCount() {
        const length = commentTextarea.value.length;
        charCountDiv.textContent = `${length}/1000 caractères`;
        charCountDiv.style.color = length > 1000 ? '#e74c3c' : '#666';
    }
    
    commentTextarea.addEventListener('input', updateCharCount);
    updateCharCount(); // Initialiser le compteur
});
