/**
 * Utility function to get a cookie value by its name
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

/**
 * Utility function to get the place ID from the URL query parameters
 */
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Check user authentication for general pages
 * Shows or hides the login link and fetches places if authenticated
 */
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.style.display = token ? 'none' : 'block';
    }
    if (token) {
        fetchPlaces(token);
    }
    return token;
}

/**
 * Check user authentication for review submission
 * Redirects to index.html if not authenticated
 */
function checkAuthenticationForReview() {
    const token = getCookie('token');
    if (!token) {
        window.location.href = 'index.html';
    }
    return token;
}

/**
 * Fetch the list of places from the API and display them
 */
async function fetchPlaces(token) {
    try {
        const response = await fetch('http://localhost:5000/api/v1/places', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
        } else {
            document.getElementById('places-list').innerHTML = '<p>Error loading places.</p>';
        }
    } catch (error) {
        document.getElementById('places-list').innerHTML = '<p>API connection error.</p>';
    }
}

/**
 * Dynamically display the list of places in the #places-list section
 */
function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';
    places.forEach(place => {
        const placeDiv = document.createElement('div');
        placeDiv.className = 'place-card';
        placeDiv.setAttribute('data-price', place.price);
        placeDiv.innerHTML = `
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <p>Location: ${place.location}</p>
            <p>Price: ${place.price} €</p>
            <a href="place.html?id=${place.id}" class="details-button">View Details</a>
        `;
        placesList.appendChild(placeDiv);
    });
}

/**
 * Filter places by price using the dropdown
 */
function setupPriceFilter() {
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter && priceFilter.options.length === 0) {
        [10, 50, 100, 'All'].forEach(val => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = val;
            priceFilter.appendChild(opt);
        });
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', (event) => {
            const selected = event.target.value;
            document.querySelectorAll('.place-card').forEach(card => {
                const price = parseFloat(card.getAttribute('data-price'));
                if (selected === 'All' || price <= parseFloat(selected)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

/**
 * Handle login form submission
 */
async function loginUser(email, password) {
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
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
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.textContent = 'Login failed: Invalid credentials';
            errorDiv.style.color = 'red';
        }
    }
}

/**
 * Fetch and display details of a single place
 */
async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/places/${placeId}`, {
            method: 'GET',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
        } else {
            document.querySelector('.place-details').innerHTML = '<p>Error loading place details.</p>';
        }
    } catch (error) {
        document.querySelector('.place-details').innerHTML = '<p>API connection error.</p>';
    }
}

/**
 * Dynamically display place details, amenities, and reviews
 */
function displayPlaceDetails(place) {
    const detailsSection = document.querySelector('.place-details');
    if (detailsSection) {
        detailsSection.innerHTML = `
            <h2>${place.name}</h2>
            <div class="place-info">
                <p>Host: ${place.owner_name}</p>
                <p>Price per night: ${place.price} €</p>
                <p>Description: ${place.description}</p>
                <p>Amenities: ${place.amenities.join(', ')}</p>
            </div>
        `;
    }

    const reviewsSection = document.querySelector('.reviews');
    if (reviewsSection) {
        reviewsSection.innerHTML = '';
        if (place.reviews && place.reviews.length > 0) {
            place.reviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.className = 'review-card';
                reviewDiv.innerHTML = `
                    <p>"${review.text}"</p>
                    <p>User: ${review.user_name}</p>
                    <p>Rating: ${review.rating}/5</p>
                `;
                reviewsSection.appendChild(reviewDiv);
            });
        } else {
            reviewsSection.innerHTML = '<p>No reviews yet.</p>';
        }
    }
}

/**
 * Submit a review for a place
 */
async function submitReview(token, placeId, reviewText, rating) {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/places/${placeId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                text: reviewText,
                rating: rating,
                place_id: placeId
            })
        });
        await handleReviewResponse(response);
    } catch (error) {
        alert('API connection error');
    }
}

/**
 * Handle the response after submitting a review
 */
async function handleReviewResponse(response) {
    if (response.ok) {
        alert('Review submitted successfully!');
        document.getElementById('review-form').reset();
    } else {
        const errorData = await response.json();
        alert('Failed to submit review: ' + (errorData.error || 'Unknown error'));
    }
}

/**
 * DOMContentLoaded event handler for all pages
 */
document.addEventListener('DOMContentLoaded', () => {
    // Login page
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await loginUser(email, password);
        });
    }

    // Index page (places list and filter)
    if (document.getElementById('places-list')) {
        checkAuthentication();
        setupPriceFilter();
    }

    // Place details page
    if (document.querySelector('.place-details')) {
        const placeId = getPlaceIdFromURL();
        const token = getCookie('token');
        fetchPlaceDetails(token, placeId);
    }

    // Add review page
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        const token = checkAuthenticationForReview();
        const placeId = getPlaceIdFromURL();
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const reviewText = document.getElementById('review').value;
            const rating = document.getElementById('rating').value;
            await submitReview(token, placeId, reviewText, rating);
        });
    }
});