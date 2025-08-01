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
 * Check user authentication for general pages
 * Shows or hides the login/logout buttons and fetches places if authenticated
 */
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    const logoutButton = document.getElementById('logout-button');
    
    if (loginLink && logoutButton) {
        if (token) {
            loginLink.style.display = 'none';
            logoutButton.style.display = 'block';
        } else {
            loginLink.style.display = 'block';
            logoutButton.style.display = 'none';
        }
    }
    
    if (token) {
        fetchPlaces(token);
    }
    return token;
}

/**
 * Check authentication and show/hide review form accordingly
 */
function checkAuthenticationForReviewForm() {
    const token = getCookie('token');
    const reviewSection = document.querySelector('.add-review');
    const loginMessage = document.getElementById('login-message');
    
    if (reviewSection) {
        if (token) {
            // User is authenticated - show the review form
            reviewSection.style.display = 'block';
            if (loginMessage) {
                loginMessage.style.display = 'none';
            }
        } else {
            // User is not authenticated - hide the review form and show login message
            reviewSection.style.display = 'none';
            if (!loginMessage) {
                // Create login message if it doesn't exist
                const messageDiv = document.createElement('div');
                messageDiv.id = 'login-message';
                messageDiv.className = 'add-review';
                messageDiv.innerHTML = `
                    <h2>Add a Review</h2>
                    <p>You must be logged in to submit a review.</p>
                    <a href="login.html" class="details-button">Login</a>
                `;
                reviewSection.parentNode.insertBefore(messageDiv, reviewSection.nextSibling);
            } else {
                loginMessage.style.display = 'block';
            }
        }
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
    <img src="/images/appart.jpg" alt="${place.title}" class="place-image">
    <h3>${place.title}</h3>
    <p>${place.description}</p>
    <p>Location: ${place.latitude}, ${place.longitude}</p>
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
        ['All', 10, 50, 100].forEach(val => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = val;
            // Set "All" as selected by default
            if (val === 'All') {
                opt.selected = true;
            }
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
        // Parse the error response to get the actual error message
        try {
            const errorData = await response.json();
            alert('Login failed: ' + (errorData.error || 'Unknown error'));
        } catch (parseError) {
            // Fallback to statusText if JSON parsing fails
            alert('Login failed: ' + response.statusText);
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
 * Fetch owner details by ID
 */
async function fetchOwnerDetails(token, ownerId) {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/users/${ownerId}`, {
            method: 'GET',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (response.ok) {
            const owner = await response.json();
            return `${owner.first_name} ${owner.last_name}`;
        }
    } catch (error) {
        console.error('Error fetching owner details:', error);
    }
    return 'Unknown';
}

/**
 * Fetch reviews for a specific place
 */
async function fetchPlaceReviews(token, placeId) {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/reviews`, {
            method: 'GET',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (response.ok) {
            const allReviews = await response.json();
            // Filter reviews for this specific place
            return allReviews.filter(review => review.place_id === placeId);
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
    return [];
}

/**
 * Fetch user details by ID to get user name for reviews
 */
async function fetchUserDetails(token, userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
            method: 'GET',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (response.ok) {
            const user = await response.json();
            return `${user.first_name} ${user.last_name}`;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
    return 'Unknown User';
}

/**
 * Display reviews for a place
 */
async function displayReviews(token, placeId) {
    const reviewsSection = document.querySelector('.reviews');
    if (reviewsSection) {
        reviewsSection.innerHTML = '<p>Loading reviews...</p>';
        
        const reviews = await fetchPlaceReviews(token, placeId);
        reviewsSection.innerHTML = '';
        
        if (reviews && reviews.length > 0) {
            for (const review of reviews) {
                const userName = await fetchUserDetails(token, review.user_id);
                const reviewDiv = document.createElement('div');
                reviewDiv.className = 'review-card';
                reviewDiv.innerHTML = `
                    <p>"${review.text}"</p>
                    <p>User: ${userName}</p>
                    <p>Rating: ${review.rating}/5</p>
                `;
                reviewsSection.appendChild(reviewDiv);
            }
        } else {
            reviewsSection.innerHTML = '<p>No reviews yet.</p>';
        }
    }
}

/**
 * Dynamically display place details, amenities, and reviews
 */
async function displayPlaceDetails(place) {
    const detailsSection = document.querySelector('.place-details');
    if (detailsSection) {
        // Get owner name if possible
        const token = getCookie('token');
        const ownerName = place.owner_id ? await fetchOwnerDetails(token, place.owner_id) : 'Unknown';
        
        detailsSection.innerHTML = `
            <h2>${place.title}</h2>
            <div class="place-info">
                <p>Host: ${ownerName}</p>
                <p>Price per night: ${place.price} €</p>
                <p>Description: ${place.description}</p>
                <p>Location: ${place.latitude}, ${place.longitude}</p>
                <p>Amenities: ${place.amenities ? place.amenities.join(', ') : 'None'}</p>
            </div>
        `;
    }

    // Fetch and display reviews separately
    const token = getCookie('token');
    const placeId = getPlaceIdFromURL();
    await displayReviews(token, placeId);
}

/**
 * Display place info for add review page
 */
async function displayPlaceInfoForReview(place) {
    const placeInfoSection = document.getElementById('place-info');
    if (placeInfoSection) {
        placeInfoSection.innerHTML = `
            <h2>Reviewing: ${place.title}</h2>
            <div class="place-info">
                <p>Price per night: ${place.price} €</p>
                <p>Description: ${place.description}</p>
            </div>
        `;
    }
}

/**
 * Submit a review for a place
 */
async function submitReview(token, placeId, reviewText, rating) {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                text: reviewText,
                rating: parseInt(rating),
                place_id: placeId
                // Remove user_id - it's extracted from token on backend
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
        // Redirect back to place details page
        const placeId = getPlaceIdFromURL();
        if (placeId) {
            window.location.href = `place.html?id=${placeId}`;
        }
    } else {
        const errorData = await response.json();
        alert('Failed to submit review: ' + (errorData.error || 'Unknown error'));
    }
}

/**
 * Logout function to clear token and refresh page
 */
function logout() {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    window.location.reload();
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
        fetchPlaces(getCookie('token'));
    }

    // Place details page
    if (document.querySelector('.place-details')) {
        const placeId = getPlaceIdFromURL();
        const token = getCookie('token');
        fetchPlaceDetails(token, placeId);
        
        // Check authentication for review form visibility
        checkAuthenticationForReviewForm();
    }

    // Add review page - NEW FUNCTIONALITY
    if (window.location.pathname.includes('add_review.html')) {
        // Check authentication and redirect if not logged in
        const token = checkAuthenticationForReview();
        const placeId = getPlaceIdFromURL();
        
        if (!placeId) {
            alert('No place ID provided. Redirecting to home page.');
            window.location.href = 'index.html';
            return;
        }
        
        // Fetch and display place info
        fetchPlaceDetails(token, placeId).then(() => {
            const placeDetailsSection = document.querySelector('.place-details');
            if (placeDetailsSection) {
                // Move the content to place-info section
                const placeInfoSection = document.getElementById('place-info');
                if (placeInfoSection) {
                    placeInfoSection.innerHTML = placeDetailsSection.innerHTML;
                }
            }
        });
        
        // Setup authentication display
        checkAuthentication();
    }

    // Add review functionality (works on both place.html and add_review.html)
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        const placeId = getPlaceIdFromURL();
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // Double-check authentication when submitting (security measure)
            const token = getCookie('token');
            if (!token) {
                alert('You must be logged in to submit a review. Redirecting to login page...');
                window.location.href = 'login.html';
                return;
            }
            
            if (!placeId) {
                alert('No place ID provided.');
                return;
            }
            
            const reviewText = document.getElementById('review-text').value;
            const rating = document.getElementById('rating').value;
            
            if (!reviewText || !rating) {
                alert('Please fill in all fields.');
                return;
            }
            
            await submitReview(token, placeId, reviewText, rating);
        });
    }

    // Logout functionality
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});