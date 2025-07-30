// login.js - Gestion de la connexion utilisateur

// Configuration de l'API
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Fonction utilitaire pour afficher les messages d'erreur
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Fonction utilitaire pour cacher les messages d'erreur
function hideError() {
    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'none';
}

// Fonction de connexion
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
        const errorData = await response.json();
        showError(errorData.message || 'Login failed: ' + response.statusText);
    }
}

// Initialisation quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            hideError();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                await loginUser(email, password);
            } catch (error) {
                showError('Erreur de connexion au serveur.');
            }
        });
    }
});
