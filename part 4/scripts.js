let authToken = null;

// Setup page when loaded
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    
    // Price filter event listener (only on index page)
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', function(event) {
            filterPlacesByPrice(event.target.value);
        });
    }
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            loginUser(email, password);
        });
    }
});

// Login function
async function loginUser(email, password) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            document.cookie = `token=${data.access_token}; path=/`;
            authToken = data.access_token;
            window.location.href = 'index.html';
        } else {
            alert('Login failed');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Check if user is logged in
function checkAuthentication() {
    const token = getCookie('token');
    authToken = token;
    
    const loginLink = document.getElementById('login-link');
    const addReviewSection = document.getElementById('add-review');

    if (!token) {
        if (loginLink) {
            loginLink.style.display = 'block';
        }
        if (addReviewSection) {
            addReviewSection.style.display = 'none';
        }
        // Load places without authentication (only on index page)
        const placesList = document.getElementById('places-list');
        if (placesList) {
            fetchPlaces();
        }
    } else {
        if (loginLink) {
            loginLink.style.display = 'none';
            
            let logoutLink = document.getElementById('logout-link');
            if (!logoutLink) {
                logoutLink = document.createElement('a');
                logoutLink.id = 'logout-link';
                logoutLink.href = '#';
                logoutLink.className = 'login-button';
                logoutLink.textContent = 'Logout';
                logoutLink.onclick = function() {
                    logout();
                };
                loginLink.parentNode.appendChild(logoutLink);
            }
            logoutLink.style.display = 'block';
        }
        if (addReviewSection) {
            addReviewSection.style.display = 'block';
        }
        // Load places with authentication (only on index page)
        const placesList = document.getElementById('places-list');
        if (placesList) {
            fetchPlaces(token);
        }
    }
    
    console.log('User authenticated:', !!token);
    return token;
}

// Get cookie value
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

// Logout user
function logout() {
    document.cookie = 'token=; path=/; max-age=0';
    authToken = null;
    window.location.href = 'login.html';
}

// Fetch places from API
async function fetchPlaces(token) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('http://127.0.0.1:5000/api/v1/places/', {
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

// Display places in the list
function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    
    // Check if places-list exists (only on index page)
    if (!placesList) {
        return;
    }
    
    // Clear existing content except the title
    const title = placesList.querySelector('h2');
    placesList.innerHTML = '';
    if (title) {
        placesList.appendChild(title);
    }
    
    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.setAttribute('data-price', place.price);
        
        placeCard.innerHTML = `
            <h3>${place.title}</h3>
            <p>Price: $${place.price}/night</p>
            <button class="details-button" onclick="viewPlaceDetails('${place.id}')">View Details</button>
        `;
        
        placesList.appendChild(placeCard);
    });
}

// Filter places by price
function filterPlacesByPrice(selectedPrice) {
    const placeCards = document.querySelectorAll('.place-card');
    
    placeCards.forEach(card => {
        const price = parseFloat(card.getAttribute('data-price'));
        
        if (selectedPrice === 'All' || price <= parseFloat(selectedPrice)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// View place details (placeholder)
function viewPlaceDetails(placeId) {
    window.location.href = `place.html?id=${placeId}`;
}
