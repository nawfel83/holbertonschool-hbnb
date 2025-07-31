// API Base URL
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Utility function to get cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Utility function to set cookie
function setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Check if user is authenticated
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    const addReviewSection = document.getElementById('add-review');

    if (!token) {
        if (loginLink) loginLink.style.display = 'block';
        if (addReviewSection) addReviewSection.style.display = 'none';
        return false;
    } else {
        if (loginLink) loginLink.style.display = 'none';
        if (addReviewSection) addReviewSection.style.display = 'block';
        return true;
    }
}

// Login functionality
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            setCookie('token', data.access_token);
            window.location.href = 'index.html';
        } else {
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.');
    }
}

// Fetch places from API
async function fetchPlaces() {
    try {
        const token = getCookie('token');
        const headers = { 'Content-Type': 'application/json' };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_BASE_URL}/places`, {
            method: 'GET',
            headers: headers
        });
        
        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
        } else {
            console.error('Failed to fetch places');
        }
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}

// Display places on the page
function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    if (!placesList) return;

    placesList.innerHTML = '';

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';

        placeCard.innerHTML = `
            <h3>${place.name}</h3>
            <p class="price">$${place.price_per_night} per night</p>
            <a href="place.html?id=${place.id}" class="details-button">Voir les détails</a>
        `;

        placesList.appendChild(placeCard);
    });
}

// Filter places by price
function filterPlaces() {
    const priceFilter = document.getElementById('price-filter').value;
    const placeCards = document.querySelectorAll('.place-card');

    placeCards.forEach(card => {
        const priceText = card.querySelector('.price').textContent;
        const price = parseFloat(priceText.match(/\$(\d+)/)[1]);
        
        if (!priceFilter || price <= parseFloat(priceFilter)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Get place ID from URL
function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Fetch place details
async function fetchPlaceDetails(placeId) {
    try {
        const token = getCookie('token');
        const headers = { 'Content-Type': 'application/json' };
        
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
            fetchReviews(placeId);
        } else {
            console.error('Failed to fetch place details');
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
    }
}

// Display place details
function displayPlaceDetails(place) {
    const placeDetails = document.getElementById('place-details');
    if (!placeDetails) return;

    placeDetails.innerHTML = `
        <div class="place-info">
            <h1>${place.name}</h1>
            <p><strong>Hôte:</strong> ${place.host || 'Non spécifié'}</p>
            <p><strong>Prix:</strong> $${place.price_per_night} par nuit</p>
            <p><strong>Description:</strong> ${place.description || 'Aucune description disponible'}</p>
            <div class="amenities">
                <strong>Équipements:</strong>
                <ul>
                    ${place.amenities && place.amenities.length > 0 
                        ? place.amenities.map(amenity => typeof amenity === 'object' ? `<li>${amenity.name}</li>` : `<li>${amenity}</li>`).join('')
                        : '<li>Aucun équipement spécifié</li>'
                    }
                </ul>
            </div>
        </div>
    `;
}

// Fetch reviews for a place
async function fetchReviews(placeId) {
    try {
        const token = getCookie('token');
        const headers = { 'Content-Type': 'application/json' };
        
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
            console.error('Failed to fetch reviews');
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

// Display reviews
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;

    reviewsList.innerHTML = '';

    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p>No reviews yet.</p>';
        return;
    }

    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';

        reviewCard.innerHTML = `
            <h4>${review.user_name || 'Anonymous'}</h4>
            <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)} (${review.rating}/5)</div>
            <p>${review.text}</p>
            <small>Posted on ${new Date(review.created_at).toLocaleDateString()}</small>
        `;

        reviewsList.appendChild(reviewCard);
    });
}

// Submit review
async function submitReview(placeId, reviewText, rating) {
    const token = getCookie('token');
    
    if (!token) {
        alert('Please login to submit a review.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/places/${placeId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                text: reviewText,
                rating: parseInt(rating)
            })
        });

        if (response.ok) {
            alert('Review submitted successfully!');
            fetchReviews(placeId);
            document.getElementById('review-form').reset();
        } else {
            alert('Failed to submit review.');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('An error occurred while submitting the review.');
    }
}

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();

    // Handle login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            loginUser(email, password);
        });
    }

    // Handle review form
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const placeId = getPlaceIdFromURL();
            const reviewText = document.getElementById('review-text').value;
            const rating = document.getElementById('review-rating').value;
            
            if (placeId && reviewText && rating) {
                submitReview(placeId, reviewText, rating);
            }
        });
    }

    // Handle price filter
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', filterPlaces);
    }

    // Load places on index page
    if (document.getElementById('places-list')) {
        fetchPlaces();
    }

    // Load place details on place page
    if (document.getElementById('place-details')) {
        const placeId = getPlaceIdFromURL();
        if (placeId) {
            fetchPlaceDetails(placeId);
        }
    }
});
