console.log('Scripts simple chargé');

let currentUser = null;

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    try {
        console.log('Tentative de connexion avec:', email);
        
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        console.log('Réponse serveur:', data);
        
        if (data.success) {

            alert('Connexion réussie ! Bienvenue ' + data.user_name);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_name', data.user_name);
            
            window.location.href = 'index.html';
        } else {
            alert('Erreur: ' + (data.error || 'Identifiants incorrects'));
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    currentUser = null;
    updateUI();
    window.location.href = 'index.html';
}

function updateUI() {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const username = document.getElementById('username');
    
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('user_name');
    
    if (token && userName) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) userInfo.style.display = 'inline';
        if (username) username.textContent = userName;
        currentUser = userName;
    } else {
        if (loginBtn) loginBtn.style.display = 'inline';
        if (userInfo) userInfo.style.display = 'none';
        currentUser = null;
    }
}

function filterByPrice() {
    const priceFilter = document.getElementById('price-filter');
    const selectedPrice = priceFilter.value;
    const placeCards = document.querySelectorAll('.place-card');
    
    placeCards.forEach(card => {
        const priceText = card.querySelector('.price').textContent;
        const price = priceText.match(/\$(\d+)/);
        
        if (!selectedPrice || (price && price[1] === selectedPrice)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

const placesData = {
    'logement-occasion': {
        name: 'Logement d\'Occasion',
        host: 'juna Lartego',
        price: '$50 / nuit',
        mainImage: 'https://cdn.generationvoyage.fr/2022/02/logement-2-1.png',
        galleryImages: [
            'https://cdn.generationvoyage.fr/2022/02/logement-2-1.png',
            'https://cdn.generationvoyage.fr/2022/02/logement-1-1.png'
        ],
        description: 'Logement confortable et abordable, parfait pour un séjour économique sans compromis sur le confort.',
        amenities: ['WiFi gratuit', 'Cuisine équipée', 'Parking gratuit', 'Lave-linge', 'Balcon'],
        reviews: [
            { comment: 'Très bon rapport qualité-prix !', user: 'Harry Kane', rating: '★★★★☆ 4/5' },
            { comment: 'Parfait pour un budget serré !', user: 'Sané Leroy', rating: '★★★★☆ 4/5' }
        ]
    },
    'appartement-ville': {
        name: 'Appartement en Ville',
        host: 'Laurent Leblanc',
        price: '$50 / nuit',
        mainImage: 'https://cdn.generationvoyage.fr/2022/02/logement-7-1.png',
        galleryImages: [
            'https://cdn.generationvoyage.fr/2022/02/logement-7-1.png',
            'https://cdn.generationvoyage.fr/2022/02/logement-1-1.png'
        ],
        description: 'Logement moderne au cœur de la ville, proche de tous les commerces.',
        amenities: ['WiFi haut débit', 'Cuisine moderne', 'Balcon', 'Climatisation'],
        reviews: [
            { comment: 'Emplacement parfait en centre-ville !', user: 'William Rousseau', rating: '★★★★★ 5/5' }
        ]
    },
    'studio-building': {
        name: 'Studio dans un Building',
        host: 'Anna Kowalski',
        price: '$100 / nuit',
        mainImage: 'https://th.bing.com/th/id/R.8bdb31a1d24ce6b8916e49f2292de543?rik=y6HoIDR9%2fA95iw&pid=ImgRaw&r=0',
        galleryImages: [
            'https://th.bing.com/th/id/R.8bdb31a1d24ce6b8916e49f2292de543?rik=y6HoIDR9%2fA95iw&pid=ImgRaw&r=0',
            'https://cdn.generationvoyage.fr/2022/02/logement-1-1.png'
        ],
        description: 'Studio élégant dans un immeuble moderne avec toutes les commodités.',
        amenities: ['WiFi fibre', 'Salle de sport', 'Concierge', 'Terrasse commune'],
        reviews: [
            { comment: 'Studio moderne et bien équipé !', user: 'James Lebrun', rating: '★★★★☆ 4/5' }
        ]
    },
    'logement-naturel': {
        name: 'Logement Naturel',
        host: 'Notthigham Forest',
        price: '$100 / nuit',
        mainImage: 'https://offloadmedia.feverup.com/lyonsecret.com/wp-content/uploads/2021/06/29070343/shutterstock_1531738394-1-1024x683.jpg',
        galleryImages: [
            'https://offloadmedia.feverup.com/lyonsecret.com/wp-content/uploads/2021/06/29070343/shutterstock_1531738394-1-1024x683.jpg',
            'https://cdn.generationvoyage.fr/2022/02/logement-1-1.png'
        ],
        description: 'Échappez-vous dans ce logement en pleine nature, calme et ressourçant.',
        amenities: ['Vue panoramique', 'Cheminée', 'Jardin privé', 'Barbecue'],
        reviews: [
            { comment: 'Cadre magnifique, très reposant !', user: 'Gérard Moreau', rating: '★★★★★ 5/5' }
        ]
    },
    'logement-luxe': {
        name: 'Logement de Luxe',
        host: 'Raheem Sterling',
        price: '$200 / nuit',
        mainImage: 'https://th.bing.com/th/id/R.71168989b965ab7a44303873f6d662e1?rik=Qan76jaH30nDSw&pid=ImgRaw&r=0',
        galleryImages: [
            'https://th.bing.com/th/id/R.71168989b965ab7a44303873f6d662e1?rik=Qan76jaH30nDSw&pid=ImgRaw&r=0',
            'https://cdn.generationvoyage.fr/2022/02/logement-1-1.png'
        ],
        description: 'Expérience haut de gamme dans ce logement luxueux avec services premium.',
        amenities: ['Conciergerie', 'Spa privé', 'Chef à domicile', 'Chauffeur'],
        reviews: [
            { comment: 'Service exceptionnel, luxe absolu !', user: 'Kevin Durand', rating: '★★★★★ 5/5' }
        ]
    },
    'logement-atypique': {
        name: 'Logement Atypique',
        host: 'Kylian Mbappé',
        price: '$200 / nuit',
        mainImage: 'https://th.bing.com/th/id/R.a9f34fe1621bc5b434560f2108eea67c?rik=35e6%2fBt8noSMEA&pid=ImgRaw&r=0',
        galleryImages: [
            'https://th.bing.com/th/id/R.a9f34fe1621bc5b434560f2108eea67c?rik=35e6%2fBt8noSMEA&pid=ImgRaw&r=0',
            'https://cdn.generationvoyage.fr/2022/02/logement-1-1.png'
        ],
        description: 'Logement unique et original pour une expérience inoubliable et authentique.',
        amenities: ['Design unique', 'Architecture originale', 'Expérience immersive'],
        reviews: [
            { comment: 'Expérience vraiment unique !', user: 'Nuno Mendes', rating: '★★★★★ 5/5' }
        ]
    }
};

function loadPlaceDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id') || 'logement-occasion';
    const placeData = placesData[placeId];
    
    if (!placeData) {
        window.location.href = 'index.html';
        return;
    }
    
    const placeDetailsSection = document.getElementById('place-details');
    if (placeDetailsSection) {
        placeDetailsSection.innerHTML = `
            <div class="place-info">
                <h2>${placeData.name}</h2>
                <p class="host">Hôte: ${placeData.host}</p>
                <p class="price">${placeData.price}</p>
                <div class="place-images">
                    <img src="${placeData.mainImage}" alt="Vue principale" class="main-detail-image">
                    <div class="detail-gallery">
                        ${placeData.galleryImages.map((img, index) => 
                            `<img src="${img}" alt="Vue ${index + 1}" class="detail-gallery-image">`
                        ).join('')}
                    </div>
                </div>
                <p class="description">${placeData.description}</p>
                <div class="amenities">
                    <h3>Équipements</h3>
                    <ul>
                        ${placeData.amenities.map(amenity => `<li>${amenity}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Charger TOUS les avis (par défaut + serveur)
    loadAllReviews(placeId);
    
    // Gérer le formulaire d'avis (uniquement si connecté)
    manageReviewForm(placeId);
}

// Charger tous les avis (par défaut + serveur)
async function loadAllReviews(placeId) {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;
    
    const placeData = placesData[placeId];
    let allReviews = [...(placeData.reviews || [])];
    
    try {
        // Récupérer les avis du serveur
        const response = await fetch(`http://localhost:8000/api/reviews?place_id=${placeId}`);
        if (response.ok) {
            const data = await response.json();
            if (data.reviews) {
                // Ajouter les avis du serveur
                const serverReviews = data.reviews.map(review => ({
                    comment: review.comment,
                    user: review.user,
                    rating: '★'.repeat(parseInt(review.rating)) + '☆'.repeat(5 - parseInt(review.rating)) + ` ${review.rating}/5`,
                    isFromServer: true
                }));
                allReviews = [...allReviews, ...serverReviews];
            }
        }
    } catch (error) {
        console.log('Utilisation des avis par défaut seulement');
    }
    
    // Afficher tous les avis
    reviewsList.innerHTML = allReviews.map(review => `
        <div class="review-card ${review.isFromServer ? 'server-review' : 'default-review'}">
            <p class="comment">${review.comment}</p>
            <p class="user-name">${review.user}</p>
            <p class="rating">${review.rating}</p>
            ${review.isFromServer ? '<small style="color: #2ecc71;">📝 Avis utilisateur</small>' : '<small style="color: #95a5a6;">💬 Avis par défaut</small>'}
        </div>
    `).join('');
}

function manageReviewForm(placeId) {
    const addReviewSection = document.getElementById('add-review');
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('user_name');
    
    if (!token || !userName) {
        if (addReviewSection) {
            addReviewSection.style.display = 'none';
        }
        return;
    }
    
    if (addReviewSection) {
        addReviewSection.style.display = 'block';
        
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', function(event) {
                event.preventDefault();
                submitReview(placeId, userName);
            });
        }
    }
}

async function submitReview(placeId, userName) {
    const reviewText = document.getElementById('review-text').value;
    const reviewRating = document.getElementById('review-rating').value;
    
    if (!reviewText || !reviewRating) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    try {
        console.log('Envoi de l\'avis...');
        
        const response = await fetch('http://localhost:8000/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                place_id: placeId,
                comment: reviewText,
                rating: reviewRating,
                user_name: userName
            })
        });
        
        const data = await response.json();
        console.log('Réponse serveur:', data);
        
        if (data.success) {
            alert('Avis ajouté avec succès ! Les commentaires restent en ligne.');
            
            document.getElementById('review-text').value = '';
            document.getElementById('review-rating').value = '';
            
            // Recharger TOUS les avis (par défaut + nouveaux du serveur)
            loadAllReviews(placeId);
            
        } else {
            alert('Erreur: ' + (data.error || 'Impossible d\'ajouter l\'avis'));
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    }
}

function addReviewToDisplay(review) {
    const reviewsList = document.getElementById('reviews-list');
    if (reviewsList) {
        const ratingStars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        const newReviewHTML = `
            <div class="review-card">
                <p class="comment">${review.comment}</p>
                <p class="user-name">${review.user}</p>
                <p class="rating">${ratingStars} ${review.rating}/5</p>
            </div>
        `;
        
        reviewsList.insertAdjacentHTML('afterbegin', newReviewHTML);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page chargée');

    updateUI();
    
    if (window.location.pathname.includes('place.html')) {
        loadPlaceDetails();
    }
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            login();
        });
    }
    
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', filterByPrice);
    }
});
