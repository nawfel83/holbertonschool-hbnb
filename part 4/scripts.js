/* 
  Enhanced HBnB JavaScript - Dynamic Functionality
*/

// Base de données des logements
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
        description: 'Logement confortable et abordable, parfait pour un séjour économique sans compromis sur le confort. Excellent rapport qualité-prix dans un cadre agréable avec tous les équipements nécessaires.',
        amenities: ['WiFi gratuit', 'Cuisine équipée', 'Parking gratuit', 'Lave-linge', 'Balcon', 'Proximité commerces'],
        reviews: [
            { comment: 'Très bon rapport qualité-prix ! Logement propre et bien situé.', user: 'Harry Kane', rating: '★★★★☆ 4/5' },
            { comment: 'Parfait pour un budget serré, je recommande vivement !', user: 'Sané Leroy', rating: '★★★★☆ 4/5' }
        ]
    },
    'appartement-ville': {
        name: 'Appartement en Ville',
        host: 'Laurent Leblanc',
        price: '$50 / nuit',
        mainImage: 'https://cdn.generationvoyage.fr/2022/02/logement-7-1.png',
        galleryImages: [
            'https://a0.muscache.com/4ea/air/v2/pictures/monet/Select-2449004/original/45ac447f-202e-4058-92b3-f6819d1bd900?t=r:w1200-h720-sfit,e:fjpg-c90',
            'https://tse1.mm.bing.net/th/id/OIP.hs55fgPdSHDOFC3F-NcCLgHaD5?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
        ],
        description: 'Logement moderne au cœur de la ville, proche de tous les commerces. Parfait pour explorer la ville à pied et profiter de tous les services urbains.',
        amenities: ['WiFi haut débit', 'Cuisine moderne', 'Balcon', 'Climatisation', 'Parking', 'Transports en commun'],
        reviews: [
            { comment: 'Emplacement parfait en centre-ville ! Tout à portée de main.', user: 'William Rousseau', rating: '★★★★★ 5/5' },
            { comment: 'Appartement moderne et bien situé, parfait pour un séjour urbain.', user: 'Tapis Bernard', rating: '★★★★☆ 4/5' }
        ]
    },
    'studio-building': {
        name: 'Studio dans un Building',
        host: 'Anna Kowalski',
        price: '$100 / nuit',
        mainImage: 'https://th.bing.com/th/id/R.8bdb31a1d24ce6b8916e49f2292de543?rik=y6HoIDR9%2fA95iw&pid=ImgRaw&r=0',
        galleryImages: [
            'https://imgs.6sqft.com/wp-content/uploads/2022/08/17095646/Yellow-House-model-One-Wall-Street-7.jpg',
            'https://th.bing.com/th/id/R.fd0f43acd04f703c8e9767c8dfb761b4?rik=MYdCtaQg17wfEw&pid=ImgRaw&r=0&sres=1&sresct=1'
        ],
        description: 'Studio élégant dans un immeuble moderne avec toutes les commodités. Design contemporain et équipements haut de gamme pour un séjour confortable.',
        amenities: ['WiFi fibre', 'Salle de sport', 'Concierge', 'Terrasse commune', 'Sécurité 24h/24', 'Ascenseur'],
        reviews: [
            { comment: 'Studio moderne et bien équipé ! Le building est magnifique.', user: 'James Lebrun', rating: '★★★★☆ 4/5' },
            { comment: 'Parfait pour un séjour d\'affaires, très professionnel.', user: 'Jackson Michel', rating: '★★★★★ 5/5' }
        ]
    },
    'logement-naturel': {
        name: 'Logement Naturel',
        host: 'Notthigham Forest',
        price: '$100 / nuit',
        mainImage: 'https://offloadmedia.feverup.com/lyonsecret.com/wp-content/uploads/2021/06/29070343/shutterstock_1531738394-1-1024x683.jpg',
        galleryImages: [
            'https://i.pinimg.com/originals/f6/81/ea/f681ea00b7f17a913a83f93cad0eba3c.jpg',
            'https://tse1.mm.bing.net/th/id/OIP.JLhVclmcyb55G20UTNpZsgHaFi?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
        ],
        description: 'Échappez-vous dans ce logement en pleine nature, calme et ressourçant. Parfait pour se déconnecter du stress urbain et retrouver la sérénité.',
        amenities: ['Vue panoramique', 'Cheminée', 'Jardin privé', 'Barbecue', 'Randonnées à proximité', 'Air pur'],
        reviews: [
            { comment: 'Cadre magnifique, très reposant ! La nature à perte de vue.', user: 'Gérard Moreau', rating: '★★★★★ 5/5' },
            { comment: 'Parfait pour une déconnexion totale, je recommande vivement.', user: 'Thomas Verdier', rating: '★★★★★ 5/5' }
        ]
    },
    'villa-piscine': {
        name: 'Villa avec Piscine',
        host: 'Roberto Carlos',
        price: '$200 / nuit',
        mainImage: 'https://th.bing.com/th/id/R.870bb196d67e6dd3f9c7b091a4477db6?rik=RFL%2bguP6w8DTWA&riu=http%3a%2f%2fwww.gordes-luberon.com%2fztock%2fgordes-luberon-location-piscine.jpg&ehk=TZWkEZmYLY1jQoqKJSoGoTjr9jMSewjgpTLOJ4RWgBo%3d&risl=1&pid=ImgRaw&r=0',
        galleryImages: [
            'https://assets-global.website-files.com/633c38a2818ee9364b4d1859/654e5f909663630c57e3277c_chalet-montagne-avec-piscine.png',
            'https://tse1.mm.bing.net/th/id/OIP.Bc_o72y69rqq5x0AKn8FjgAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
        ],
        description: 'Magnifique villa avec piscine privée, idéale pour des vacances de rêve. Luxe et détente garantis dans un cadre exceptionnel.',
        amenities: ['Piscine privée', 'Jacuzzi', 'Cuisine chef', 'Service ménage', 'Jardins paysagers', 'Terrasse panoramique'],
        reviews: [
            { comment: 'Villa de rêve ! Piscine magnifique et vue imprenable !', user: 'Emmanuel Petit', rating: '★★★★★ 5/5' },
            { comment: 'Vacances parfaites, la villa dépasse toutes les attentes.', user: 'Chloé Garnier', rating: '★★★★★ 5/5' }
        ]
    },
    'logement-luxe': {
        name: 'Logement de Luxe',
        host: 'Raheem Sterling',
        price: '$200 / nuit',
        mainImage: 'https://th.bing.com/th/id/R.71168989b965ab7a44303873f6d662e1?rik=Qan76jaH30nDSw&pid=ImgRaw&r=0',
        galleryImages: [
            'https://tse3.mm.bing.net/th/id/OIP.14N7xmly-ZsQQ7Lr47MdiAHaEo?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
            'https://www.papercitymag.com/wp-content/uploads/2022/08/Brava-10th-level-social-lounge-4-Image-courtesy-of-Hines-1200x800.jpg'
        ],
        description: 'Expérience haut de gamme dans ce logement luxueux avec services premium. Le summum du raffinement et de l\'élégance pour un séjour d\'exception.',
        amenities: ['Conciergerie', 'Spa privé', 'Chef à domicile', 'Chauffeur', 'Service premium 24h/24', 'Vue panoramique'],
        reviews: [
            { comment: 'Service exceptionnel, luxe absolu ! Une expérience inoubliable.', user: 'Kevin Durand', rating: '★★★★★ 5/5' },
            { comment: 'Le summum du raffinement, tout était parfait.', user: 'Ousmane Dembélé', rating: '★★★★★ 5/5' }
        ]
    },
    'logement-atypique': {
        name: 'Logement Atypique',
        host: 'Kylian Mbappé',
        price: '$200 / nuit',
        mainImage: 'https://th.bing.com/th/id/R.a9f34fe1621bc5b434560f2108eea67c?rik=35e6%2fBt8noSMEA&pid=ImgRaw&r=0',
        galleryImages: [
            'https://th.bing.com/th/id/R.1df0bd87d92a33beec9347fdffbdbc8e?rik=74DGY6yVyjl5vQ&pid=ImgRaw&r=0',
            'https://th.bing.com/th/id/R.1e0c3373930e3cf3db88a599d930aa3d?rik=MwKhVmQ9yWEoHw&riu=http%3a%2f%2fwww.casatypik.com%2fwp-content%2fuploads%2f2012%2f07%2fmaison-nuage-7.jpg&ehk=e0A3IaTw2IpFB%2f7pw2AYgHpbTSqcE71POzU0H9tBPCc%3d&risl=&pid=ImgRaw&r=0'
        ],
        description: 'Logement unique et original pour une expérience inoubliable et authentique. Architecture surprenante et caractère unique pour les voyageurs en quête d\'originalité.',
        amenities: ['Design unique', 'Architecture originale', 'Expérience immersive', 'Photo-friendly', 'Histoire fascinante', 'Concept novateur'],
        reviews: [
            { comment: 'Expérience vraiment unique ! Jamais vu quelque chose d\'aussi original.', user: 'Nuno Mendes', rating: '★★★★★ 5/5' },
            { comment: 'Architecture fascinante, un séjour mémorable garanti !', user: 'Cheyma Gomes', rating: '★★★★★ 5/5' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Détection de la page actuelle
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'place.html') {
        // Page de détail - charger les informations du logement
        loadPlaceDetails();
    } else {
        // Page d'accueil - animations et filtrage
        animatePageLoad();
        setupPriceFilter();
        setupNavigation();
        setupCardAnimations();
    }
});

// Chargement des détails du logement
function loadPlaceDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id') || 'logement-occasion';
    const placeData = placesData[placeId];
    
    if (!placeData) {
        console.error('Logement non trouvé:', placeId);
        // Redirection vers la page d'accueil si le logement n'existe pas
        window.location.href = 'index.html';
        return;
    }
    
    // Remplir les détails du logement
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
                            `<img src="${img}" alt="Vue intérieure ${index + 1}" class="detail-gallery-image">`
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
    
    // Remplir les avis
    const reviewsList = document.getElementById('reviews-list');
    if (reviewsList && placeData.reviews) {
        reviewsList.innerHTML = placeData.reviews.map(review => `
            <div class="review-card">
                <p class="comment">${review.comment}</p>
                <p class="user-name">${review.user}</p>
                <p class="rating">${review.rating}</p>
            </div>
        `).join('');
    }
    
    // Mise à jour du titre de la page
    document.title = `HBnB - ${placeData.name}`;
    
    // Animations pour la page de détail
    setTimeout(() => {
        const placeInfo = document.querySelector('.place-info');
        const reviewCards = document.querySelectorAll('.review-card');
        
        if (placeInfo) {
            placeInfo.style.opacity = '0';
            placeInfo.style.transform = 'translateY(30px)';
            setTimeout(() => {
                placeInfo.style.transition = 'all 0.6s ease';
                placeInfo.style.opacity = '1';
                placeInfo.style.transform = 'translateY(0)';
            }, 200);
        }
        
        reviewCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 400 + (index * 200));
        });
    }, 100);
}

// Animation au chargement de la page
function animatePageLoad() {
    const cards = document.querySelectorAll('.place-card');
    const filter = document.querySelector('#filter');
    
    // Animation du filtre
    if (filter) {
        filter.style.opacity = '0';
        filter.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            filter.style.transition = 'all 0.6s ease';
            filter.style.opacity = '1';
            filter.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // Animation des cartes avec délai progressif
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 400 + (index * 150));
    });
}

// Configuration du filtrage par prix avec effets commerciaux
function setupPriceFilter() {
    const priceFilter = document.getElementById('price-filter');
    const placeCards = document.querySelectorAll('.place-card');
    const filterContainer = document.querySelector('.filter-container');
    
    if (!priceFilter) return;
    
    // Effet de focus commercial sur le select
    priceFilter.addEventListener('focus', function() {
        filterContainer.style.transform = 'scale(1.08)';
        filterContainer.style.background = 'rgba(52, 152, 219, 0.1)';
        filterContainer.style.borderColor = '#3498db';
    });
    
    priceFilter.addEventListener('blur', function() {
        filterContainer.style.transform = 'scale(1.05)';
        filterContainer.style.background = 'rgba(224, 229, 235, 1)';
        filterContainer.style.borderColor = 'rgba(245, 251, 255, 1)';
    });
    
    priceFilter.addEventListener('change', function() {
        const selectedPrice = this.value;
        
        // Effet de feedback visuel sur le filtre
        filterContainer.style.background = 'rgba(46, 204, 113, 0.2)';
        filterContainer.style.borderColor = '#2ecc71';
        filterContainer.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            filterContainer.style.background = 'rgba(240, 243, 247, 1)';
            filterContainer.style.borderColor = 'rgba(219, 232, 240, 1)';
            filterContainer.style.transform = 'scale(1.05)';
        }, 500);
        
        placeCards.forEach((card, index) => {
            const priceText = card.querySelector('.price').textContent;
            const cardPrice = priceText.match(/\$(\d+)/)[1];
            
            if (selectedPrice === '' || cardPrice === selectedPrice) {
                // Afficher la carte avec animation premium
                setTimeout(() => {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8) translateY(30px) rotateX(15deg)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0) rotateX(0deg)';
                    }, 50);
                }, index * 150);
            } else {
                // Masquer la carte avec animation
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8) translateY(-30px) rotateX(-15deg)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 400);
            }
        });
    });
}

// Navigation dynamique
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Animation du clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Effet de transition pour la navigation
            if (this.href !== window.location.href) {
                document.body.style.opacity = '0.7';
                document.body.style.transform = 'scale(0.98)';
            }
        });
        
        // Effet hover amélioré
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Animations des cartes
function setupCardAnimations() {
    const cards = document.querySelectorAll('.place-card');
    
    cards.forEach(card => {
        // Animation d'entrée au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(card);
        
        // Effet parallaxe léger au survol
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (x - centerX) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(0deg) translateY(0px)';
        });
    });
}

/* 
  FONCTIONNALITÉ DE CONNEXION - Gestion JWT et API
*/

// Fonction pour définir un cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Fonction pour obtenir un cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Fonction pour afficher un message d'erreur
function showErrorMessage(message) {
    // Créer ou mettre à jour le message d'erreur
    let errorDiv = document.getElementById('login-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'login-error';
        errorDiv.style.cssText = `
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
            animation: fadeIn 0.3s ease;
        `;
        
        // Insérer le message d'erreur avant le formulaire
        const form = document.getElementById('login-form');
        if (form) {
            form.parentNode.insertBefore(errorDiv, form);
        }
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }, 5000);
}

// Fonction pour masquer le message d'erreur
function hideErrorMessage() {
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Fonction principale de connexion
async function handleLogin(email, password) {
    try {
        // Requête AJAX vers l'API de connexion backend (part 3)
        const response = await fetch('http://localhost:5000/api/v1/auth/login', {
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

        if (response.ok && data.access_token) {
            // Connexion réussie - Stocker le token JWT dans un cookie
            setCookie('access_token', data.access_token, 7); // Cookie valide 7 jours
            
            // Masquer le message d'erreur s'il existe
            hideErrorMessage();
            
            // Rediriger vers la page principale
            window.location.href = 'index.html';
            
        } else {
            // Connexion échouée - Afficher le message d'erreur
            const errorMessage = data.error || data.message || 'Erreur de connexion. Vérifiez vos identifiants.';
            showErrorMessage(errorMessage);
        }
        
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        showErrorMessage('Erreur de connexion au serveur. Assurez-vous que le serveur backend est démarré.');
    }
}

// Écouteur d'événement pour le formulaire de connexion
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            // Empêcher le comportement par défaut de soumission de formulaire
            event.preventDefault();
            
            // Récupérer les valeurs des champs
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Validation basique
            if (!email || !password) {
                showErrorMessage('Veuillez remplir tous les champs.');
                return;
            }
            
            // Validation format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showErrorMessage('Veuillez entrer une adresse email valide.');
                return;
            }
            
            // Masquer le message d'erreur précédent
            hideErrorMessage();
            
            // Désactiver le bouton de soumission pendant la requête
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Connexion...';
            
            // Appeler la fonction de connexion
            handleLogin(email, password).finally(() => {
                // Réactiver le bouton
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
        });
    }
});
