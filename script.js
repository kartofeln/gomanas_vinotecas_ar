// DOM Elements
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const loadingState = document.getElementById('loadingState');
const resultsSection = document.getElementById('resultsSection');
const errorState = document.getElementById('errorState');
const emptyState = document.getElementById('emptyState');
const resultsContainer = document.getElementById('resultsContainer');
const resultsTitle = document.getElementById('resultsTitle');
const resultsCount = document.getElementById('resultsCount');
const errorMessage = document.getElementById('errorMessage');
const retryBtn = document.getElementById('retryBtn');
const locationTags = document.querySelectorAll('.location-tag');

// State
let currentSearch = '';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Search button click
    searchBtn.addEventListener('click', performSearch);

    // Enter key in input
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Location tags click
    locationTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const location = tag.dataset.location;
            locationInput.value = location;
            performSearch();
        });
    });

    // Retry button
    retryBtn.addEventListener('click', () => {
        if (currentSearch) {
            performSearch();
        }
    });

    // Focus input on load
    locationInput.focus();
});

// Main search function
async function performSearch() {
    const location = locationInput.value.trim();

    if (!location) {
        showError('Por favor ingresa una ubicación');
        return;
    }

    if (location.length < 2) {
        showError('La ubicación debe tener al menos 2 caracteres');
        return;
    }

    currentSearch = location;
    showLoading();

    try {
        const response = await fetch(`/api/search?location=${encodeURIComponent(location)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error en la búsqueda');
        }

        if (data.success) {
            displayResults(data);
        } else {
            throw new Error('No se pudieron obtener los resultados');
        }

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Error al conectar con el servidor');
    }
}

// Display search results
function displayResults(data) {
    hideAllStates();

    resultsTitle.textContent = `Vinotecas en ${data.location}`;
    resultsCount.textContent = data.count;

    if (data.vinotecas.length === 0) {
        showEmpty();
        return;
    }

    resultsContainer.innerHTML = '';

    data.vinotecas.forEach((vinoteca, index) => {
        const card = createVinotecaCard(vinoteca, index);
        resultsContainer.appendChild(card);
    });

    resultsSection.classList.remove('hidden');

    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}

// Create vinoteca card element
function createVinotecaCard(vinoteca, index) {
    const card = document.createElement('div');
    card.className = 'vinoteca-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const ratingIcon = vinoteca.rating !== 'No disponible' ? 'fas fa-star' : 'fas fa-question-circle';
    const sourceIcon = vinoteca.source === 'Google Maps' ? 'fab fa-google' : 'fas fa-globe';

    card.innerHTML = `
        <div class="vinoteca-name">
            <i class="fas fa-wine-bottle"></i>
            ${escapeHtml(vinoteca.name)}
        </div>
        <div class="vinoteca-address">
            <i class="fas fa-map-marker-alt"></i>
            ${escapeHtml(vinoteca.address)}
        </div>
        <div class="vinoteca-meta">
            <div class="vinoteca-rating">
                <i class="${ratingIcon}"></i>
                ${escapeHtml(vinoteca.rating)}
            </div>
            <div class="vinoteca-source">
                <i class="${sourceIcon}"></i>
                ${escapeHtml(vinoteca.source)}
            </div>
        </div>
    `;

    // Add click event to open in maps
    card.addEventListener('click', () => {
        const searchQuery = `${vinoteca.name} ${vinoteca.address}`;
        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
        window.open(mapsUrl, '_blank');
    });

    return card;
}

// Show loading state
function showLoading() {
    hideAllStates();
    loadingState.classList.remove('hidden');
}

// Show error state
function showError(message) {
    hideAllStates();
    errorMessage.textContent = message;
    errorState.classList.remove('hidden');
}

// Show empty state
function showEmpty() {
    hideAllStates();
    emptyState.classList.remove('hidden');
}

// Hide all states
function hideAllStates() {
    loadingState.classList.add('hidden');
    resultsSection.classList.add('hidden');
    errorState.classList.add('hidden');
    emptyState.classList.add('hidden');
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add some nice animations and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add typing animation to input
    locationInput.addEventListener('input', () => {
        if (locationInput.value.length > 0) {
            searchBtn.style.opacity = '1';
            searchBtn.style.transform = 'scale(1)';
        } else {
            searchBtn.style.opacity = '0.8';
            searchBtn.style.transform = 'scale(0.95)';
        }
    });

    // Add hover effects to cards
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.vinoteca-card')) {
            e.target.closest('.vinoteca-card').style.transform = 'translateY(-3px) scale(1.02)';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.vinoteca-card')) {
            e.target.closest('.vinoteca-card').style.transform = 'translateY(0) scale(1)';
        }
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            locationInput.blur();
        }
    });
});

// Add some visual feedback for successful searches
function addSuccessAnimation() {
    const successIndicator = document.createElement('div');
    successIndicator.className = 'success-indicator';
    successIndicator.innerHTML = '<i class="fas fa-check"></i>';
    successIndicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem;
        border-radius: 50%;
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
    `;

    document.body.appendChild(successIndicator);

    setTimeout(() => {
        successIndicator.style.animation = 'slideOutRight 0.5s ease-in';
        setTimeout(() => {
            document.body.removeChild(successIndicator);
        }, 500);
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .search-button {
        transition: all 0.3s ease;
    }
    
    .vinoteca-card {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style); 