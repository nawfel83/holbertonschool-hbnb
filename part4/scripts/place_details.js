// place_details.js - Gestion des détails d'un lieu

// Configuration de l'API
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Variables globales
let currentPlaceId = null;

// Fonction utilitaire pour vérifier l'authentification
function checkAuthentication() {
    const token = localStorage.getItem('jwt');
    const loginLink = document.getElementById('login-link');
    const logoutButton = document.getElementById('logout-button');
    const addReviewSection = document.getElementById('add-review-section');
    
    if (!token) {
        // Utilisateur non connecté
        if (loginLink) loginLink.style.display = 'inline-block';
        if (logoutButton) logoutButton.style.display = 'none';
        if (addReviewSection) addReviewSection.style.display = 'none';
        return null;
    } else {
        // Utilisateur connecté
        if (loginLink) loginLink.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'inline-block';
        if (addReviewSection) addReviewSection.style.display = 'block';
        return token;
    }
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

// Fonction pour récupérer les détails d'un lieu
async function fetchPlaceDetails(placeId) {
    try {
        const token = localStorage.getItem('jwt');
        const headers = {
            'Content-Type': 'application/json',
        };
        
        // Ajouter le token si disponible
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
            fetchPlaceReviews(placeId);
            hideLoading();
        } else if (response.status === 404) {
            showError('Lieu non trouvé.');
            hideLoading();
        } else {
            throw new Error('Erreur lors du chargement des détails du lieu');
        }
    } catch (error) {
        console.error('Erreur:', error);
        hideLoading();
        showError('Impossible de charger les détails du lieu. Vérifiez que l\'API est en marche.');
    }
}

// Fonction pour afficher les détails du lieu
function displayPlaceDetails(place) {
    const placeDetailsContainer = document.getElementById('place-details');
    
    placeDetailsContainer.innerHTML = `
        <div class="place-info">
            <h1>${place.name}</h1>
            <img src="${place.image || 'assets/placeholder.jpg'}" alt="${place.name}" 
                 style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 10px; margin: 1rem 0;"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 1rem 0;">
                <div>
                    <p><strong>Propriétaire:</strong> ${place.owner ? `${place.owner.first_name} ${place.owner.last_name}` : 'Non spécifié'}</p>
                    <p><strong>Pays:</strong> ${place.country || 'Non spécifié'}</p>
                    <p><strong>Ville:</strong> ${place.city || 'Non spécifiée'}</p>
                </div>
                <div>
                    <p><strong>Prix par nuit:</strong> <span style="color: #27ae60; font-size: 1.2rem; font-weight: bold;">${place.price_per_night || 'N/A'}€</span></p>
                    <p><strong>Latitude:</strong> ${place.latitude || 'N/A'}</p>
                    <p><strong>Longitude:</strong> ${place.longitude || 'N/A'}</p>
                </div>
            </div>
            
            <div style="margin: 1.5rem 0;">
                <h3>Description</h3>
                <p style="line-height: 1.6; margin-top: 0.5rem;">${place.description || 'Aucune description disponible.'}</p>
            </div>
            
            ${place.amenities && place.amenities.length > 0 ? `
                <div style="margin: 1.5rem 0;">
                    <h3>Équipements</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                        ${place.amenities.map(amenity => `
                            <span style="background-color: #ecf0f1; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">
                                ${amenity.name}
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Fonction pour récupérer les avis d'un lieu
async function fetchPlaceReviews(placeId) {
    try {
        const token = localStorage.getItem('jwt');
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/places/${placeId}/reviews`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const reviews = await response.json();
            displayReviews(reviews);
        } else {
            console.log('Impossible de charger les avis');
            displayReviews([]);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des avis:', error);
        displayReviews([]);
    }
}

// Fonction pour afficher les avis
function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-list');
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>Aucun avis pour ce lieu.</p>';
        return;
    }
    
    reviewsContainer.innerHTML = '';
    
    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        
        // Créer les étoiles pour la note
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        reviewCard.innerHTML = `
            <div class="review-header">
                <span class="reviewer-name">${review.user ? `${review.user.first_name} ${review.user.last_name}` : 'Utilisateur anonyme'}</span>
                <span class="rating">${stars} (${review.rating}/5)</span>
            </div>
            <p style="color: #666; line-height: 1.6; margin-top: 0.5rem;">${review.text}</p>
            <small style="color: #999;">${review.created_at ? new Date(review.created_at).toLocaleDateString('fr-FR') : ''}</small>
        `;
        
        reviewsContainer.appendChild(reviewCard);
    });
}

// Fonction pour cacher le loading
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

// Fonction pour afficher les erreurs
function showError(message) {
    const placeDetailsContainer = document.getElementById('place-details');
    placeDetailsContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

// Initialisation quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'ID du lieu depuis l'URL
    currentPlaceId = getPlaceIdFromURL();
    
    if (!currentPlaceId) {
        showError('ID du lieu manquant dans l\'URL.');
        hideLoading();
        return;
    }
    
    // Vérifier l'authentification
    checkAuthentication();
    
    // Configurer le bouton de déconnexion
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
    
    // Configurer le lien vers l'ajout d'avis
    const addReviewLink = document.getElementById('add-review-link');
    if (addReviewLink) {
        addReviewLink.href = `add_review.html?id=${currentPlaceId}`;
    }
    
    // Charger les détails du lieu
    fetchPlaceDetails(currentPlaceId);
});
