// Configuración de la API
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : window.location.origin;

// DOM Elements
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');
const resultsContainer = document.getElementById('resultsContainer');
const countText = document.getElementById('countText');
const timeText = document.getElementById('timeText');
const errorText = document.getElementById('errorText');
const retryBtn = document.getElementById('retryBtn');
const locationTags = document.querySelectorAll('.location-tag');

// State
let currentSearch = '';
let searchStartTime = 0;

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
        showError('Por favor, ingresa una ubicación para buscar.');
        return;
    }

    if (location.length < 2) {
        showError('La ubicación debe tener al menos 2 caracteres');
        return;
    }

    currentSearch = location;
    searchStartTime = Date.now();
    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/api/search?location=${encodeURIComponent(location)}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            // La API devuelve 'vinotecas' en lugar de 'results'
            const results = data.vinotecas || data.results || [];
            const stats = data.stats || { total: results.length };
            displayResults(results, stats);
        } else {
            throw new Error(data.message || 'Error en la búsqueda');
        }

    } catch (error) {
        console.error('Error en la búsqueda:', error);
        showError(`Error al buscar vinotecas: ${error.message}`);
    }
}

// Display search results
function displayResults(results, stats) {
    hideAllSections();

    const searchTime = Math.round((Date.now() - searchStartTime) / 1000);

    // Actualizar estadísticas
    countText.textContent = results.length;
    timeText.textContent = searchTime;

    // Limpiar contenedor
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No se encontraron vinotecas</h3>
                <p>Intenta con otra ubicación o verifica el nombre</p>
            </div>
        `;
    } else {
        // Crear tarjetas para cada vinoteca
        results.forEach((vinoteca, index) => {
            const card = createVinotecaCard(vinoteca, index);
            resultsContainer.appendChild(card);
        });
    }

    resultsSection.classList.remove('hidden');
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
    hideAllSections();
    loadingSection.classList.remove('hidden');
}

// Show error state
function showError(message) {
    hideAllSections();
    errorText.textContent = message;
    errorSection.classList.remove('hidden');
}

// Hide all sections
function hideAllSections() {
    loadingSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    errorSection.classList.add('hidden');
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

// Mostrar información detallada
function showMoreInfo(name, address, phone, rating, source) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-wine-bottle"></i> ${name}</h3>
                <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="info-grid">
                    <div class="info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>Dirección</strong>
                            <p>${address}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <strong>Teléfono</strong>
                            <p>${phone}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-star"></i>
                        <div>
                            <strong>Calificación</strong>
                            <p>${rating}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <strong>Fuente</strong>
                            <p>${source}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <a href="https://maps.google.com/?q=${encodeURIComponent(name + ' ' + address)}" 
                       target="_blank" class="action-btn">
                        <i class="fas fa-map"></i> Ver en Google Maps
                    </a>
                    <a href="https://www.google.com/search?q=${encodeURIComponent(name + ' ' + address)}" 
                       target="_blank" class="action-btn">
                        <i class="fas fa-search"></i> Buscar en Google
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Add CSS animations
const modalStyles = `
<style>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 15px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 2px solid #f0f0f0;
}

.modal-header h3 {
    color: #333;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #666;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 5px;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: #f0f0f0;
    color: #333;
}

.modal-body {
    padding: 1.5rem;
}

.info-grid {
    display: grid;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.info-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.info-item i {
    color: #DC143C;
    font-size: 1.2rem;
    margin-top: 0.2rem;
}

.info-item strong {
    color: #333;
    display: block;
    margin-bottom: 0.3rem;
}

.info-item p {
    color: #666;
    margin: 0;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.empty-state {
    text-align: center;
    padding: 3rem;
    color: #666;
}

.empty-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.empty-state h3 {
    color: #333;
    margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        margin: 1rem;
    }
    
    .modal-actions {
        flex-direction: column;
    }
}
</style>
`;

// Insertar estilos del modal
document.head.insertAdjacentHTML('beforeend', modalStyles); 