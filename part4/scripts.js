// API Base URL - Update this with your actual API URL
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Utility function to get cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Check if user is authenticated
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    const addReviewSection = document.getElementById('add-review');

    if (!token) {
        if (loginLink) loginLink.style.display = 'block';
        if (addReviewSection) addReviewSection.style.display = 'none';
        return null;
    } else {
        if (loginLink) loginLink.style.display = 'none';
        if (addReviewSection) addReviewSection.style.display = 'block';
        return token;
    }
}

// Login functionality - Suivant exactement les consignes
async function loginUser(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
        const data = await response.json();
        document.cookie = `token=${data.access_token}; path=/`;
        window.location.href = 'index.html';
    } else {
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = 'Login failed: ' + response.statusText;
            errorMessage.style.display = 'block';
        }
    }
}

// Fetch places from API
async function fetchPlaces(token) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
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
        return places;
    } else {
        console.error('Failed to fetch places');
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
        placeCard.setAttribute('data-price', place.price_per_night);

        placeCard.innerHTML = `
            <img src="assets/place-placeholder.jpg" alt="${place.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
            <h3>${place.name}</h3>
            <p class="price">$${place.price_per_night} per night</p>
            <p>${place.description ? place.description.substring(0, 100) + '...' : ''}</p>
            <a href="place.html?id=${place.id}" class="details-button">View Details</a>
        `;

        placesList.appendChild(placeCard);
    });
}

// Get place ID from URL parameters
function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Fetch place details from API
async function fetchPlaceDetails(token, placeId) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
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
        return place;
    } else {
        console.error('Failed to fetch place details');
    }
}

// Display place details on the page
function displayPlaceDetails(place) {
    const placeDetails = document.getElementById('place-details');
    if (!placeDetails) return;

    // Clear the current content of the place details section
    placeDetails.innerHTML = '';

    // Create elements to display the place details (name, description, price, amenities and reviews)
    const placeInfo = document.createElement('div');
    placeInfo.className = 'place-info';
    
    placeInfo.innerHTML = `
        <h1>${place.name}</h1>
        <p><strong>Host:</strong> ${place.owner ? place.owner.first_name + ' ' + place.owner.last_name : 'Unknown'}</p>
        <p class="price"><strong>Price:</strong> $${place.price_per_night} per night</p>
        <p><strong>Description:</strong> ${place.description || 'No description available'}</p>
    `;

    // Create amenities list
    if (place.amenities && place.amenities.length > 0) {
        const amenitiesDiv = document.createElement('div');
        amenitiesDiv.className = 'amenities';
        amenitiesDiv.innerHTML = `
            <h3>Amenities</h3>
            <ul>
                ${place.amenities.map(amenity => `<li>${amenity.name}</li>`).join('')}
            </ul>
        `;
        placeInfo.appendChild(amenitiesDiv);
    }

    // Append the created elements to the place details section
    placeDetails.appendChild(placeInfo);

    // Display reviews if they exist
    const reviewsSection = document.getElementById('reviews-section');
    const reviewsList = document.getElementById('reviews-list');
    if (reviewsList && place.reviews && place.reviews.length > 0) {
        reviewsList.innerHTML = '';
        place.reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <div class="review-header">
                    <span class="reviewer-name">${review.user ? review.user.first_name + ' ' + review.user.last_name : 'Anonymous'}</span>
                    <span class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                </div>
                <p class="review-text">${review.text}</p>
            `;
            reviewsList.appendChild(reviewCard);
        });
    } else if (reviewsList) {
        reviewsList.innerHTML = '<p>No reviews yet.</p>';
    }
}

// Submit review
async function submitReview(token, placeId, reviewText, rating) {
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
        // Clear the form
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.reset();
        }
    } else {
        alert('Failed to submit review');
    }
}

// Display error message
function displayError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(errorDiv, main.firstChild);
    }

    // Remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Display success message
function displaySuccess(message) {
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;

    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(successDiv, main.firstChild);
    }

    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Initialize page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status
    const token = checkAuthentication();

    // Page-specific functionality
    const currentPage = window.location.pathname.split('/').pop();

    switch (currentPage) {
        case 'login.html':
            initializeLoginPage();
            break;
        case 'index.html':
        case '':
            // Check authentication and fetch places if authenticated
            if (token) {
                fetchPlaces(token);  
            } else {
                // Still fetch places even if not authenticated
                fetchPlaces(null);
            }
            initializeIndexPage(token);
            break;
        case 'place.html':
            initializePlaceDetailsPage(token);
            break;
        case 'add_review.html':
            // For add_review page, check authentication first and redirect if needed
            const reviewToken = getCookie('token');
            if (!reviewToken) {
                window.location.href = 'index.html';
                return;
            }
            const placeId = getPlaceIdFromURL();
            
            const reviewForm = document.getElementById('review-form');
            if (reviewForm) {
                reviewForm.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    
                    // Get review text from form
                    const reviewText = document.getElementById('comment').value;
                    const rating = document.getElementById('rating').value;
                    
                    if (reviewText && rating) {
                        // Make AJAX request to submit review
                        await submitReview(reviewToken, placeId, reviewText, rating);
                    } else {
                        alert('Please fill in all fields');
                    }
                });
            }
            break;
    }
});

// Initialize login page
function initializeLoginPage() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
                await loginUser(email, password);
            } else {
                displayError('Please fill in all fields');
            }
        });
    }
}

// Initialize index page
function initializeIndexPage(token) {
    // Setup price filter event listener according to guidelines
    document.getElementById('price-filter').addEventListener('change', (event) => {
        const selectedPrice = event.target.value;
        const placeCards = document.querySelectorAll('.place-card');
        
        placeCards.forEach(card => {
            const price = parseFloat(card.getAttribute('data-price'));
            
            if (selectedPrice === 'all' || price <= parseFloat(selectedPrice)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Initialize place details page
function initializePlaceDetailsPage(token) {
    const placeId = getPlaceIdFromURL();
    
    if (!placeId) {
        console.error('Place ID not found');
        return;
    }

    // Check authentication and show/hide add review form
    const addReviewSection = document.getElementById('add-review');
    if (!token) {
        if (addReviewSection) addReviewSection.style.display = 'none';
    } else {
        if (addReviewSection) addReviewSection.style.display = 'block';
        // Store the token for later use
        fetchPlaceDetails(token, placeId);
    }

    // Fetch place details even if not authenticated
    if (!token) {
        fetchPlaceDetails(null, placeId);
    }
}
