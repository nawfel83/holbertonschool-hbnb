// places.js - Gestion de la liste des lieux

// Configuration de l'API
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Variables globales
let allPlaces = [];
let countries = [];

// Fonction utilitaire pour vérifier l'authentification
function checkAuthentication() {
    const token = localStorage.getItem('jwt');
    const loginLink = document.getElementById('login-link');
    const logoutButton = document.getElementById('logout-button');
    
    if (!token) {
        // Utilisateur non connecté
        if (loginLink) loginLink.style.display = 'inline-block';
        if (logoutButton) logoutButton.style.display = 'none';
        return null;
    } else {
        // Utilisateur connecté
        if (loginLink) loginLink.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'inline-block';
        return token;
    }
}

// Fonction de déconnexion
function logout() {
    localStorage.removeItem('jwt');
    window.location.href = 'login.html';
}

// Fonction pour récupérer tous les lieux
async function fetchPlaces() {
    try {
        const token = localStorage.getItem('jwt');
        const headers = {
            'Content-Type': 'application/json',
        };
        
        // Ajouter le token si disponible
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/places`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const places = await response.json();
            allPlaces = places;
            displayPlaces(places);
            populateCountryFilter(places);
            hideLoading();
        } else {
            throw new Error('Erreur lors du chargement des lieux');
        }
    } catch (error) {
        console.error('Erreur:', error);
        hideLoading();
        showError('Impossible de charger les lieux. Vérifiez que l\'API est en marche.');
    }
}

// Fonction pour afficher les lieux
function displayPlaces(places) {
    const placesContainer = document.getElementById('places-list');
    placesContainer.innerHTML = '';

    if (places.length === 0) {
        placesContainer.innerHTML = '<p>Aucun lieu trouvé.</p>';
        return;
    }

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        
        placeCard.innerHTML = `
            <img src="${place.image || 'assets/placeholder.jpg'}" alt="${place.name}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
            <h3>${place.name}</h3>
            <p><strong>Pays:</strong> ${place.country || 'Non spécifié'}</p>
            <p><strong>Prix par nuit:</strong> ${place.price_per_night || 'N/A'}€</p>
            <p class="description">${place.description ? place.description.substring(0, 100) + '...' : 'Aucune description disponible'}</p>
            <a href="place_details.html?id=${place.id}" class="details-button">Voir les détails</a>
        `;
        
        placesContainer.appendChild(placeCard);
    });
}

// Fonction pour peupler le filtre des pays
function populateCountryFilter(places) {
    const countryFilter = document.getElementById('country-filter');
    const uniqueCountries = [...new Set(places.map(place => place.country).filter(country => country))];
    
    // Effacer les options existantes (sauf "Tous les pays")
    countryFilter.innerHTML = '<option value="">Tous les pays</option>';
    
    uniqueCountries.sort().forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
}

// Fonction pour filtrer les lieux par pays
function filterPlacesByCountry() {
    const selectedCountry = document.getElementById('country-filter').value;
    
    if (!selectedCountry) {
        displayPlaces(allPlaces);
    } else {
        const filteredPlaces = allPlaces.filter(place => place.country === selectedCountry);
        displayPlaces(filteredPlaces);
    }
}

// Fonction pour cacher le loading
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

// Fonction pour afficher les erreurs
function showError(message) {
    const placesContainer = document.getElementById('places-list');
    placesContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

// Initialisation quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    checkAuthentication();
    
    // Configurer le bouton de déconnexion
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
    
    // Configurer le filtre par pays
    const countryFilter = document.getElementById('country-filter');
    if (countryFilter) {
        countryFilter.addEventListener('change', filterPlacesByCountry);
    }
    
    // Charger les lieux
    fetchPlaces();
});
