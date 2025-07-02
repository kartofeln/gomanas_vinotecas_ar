// Datos de ejemplo de vinotecas para testing y fallback
const vinotecasSample = {
    "Buenos Aires": [
        {
            name: "Vinoteca La Cava",
            address: "Av. Santa Fe 1234, Palermo, Buenos Aires",
            rating: "4.8",
            source: "Google Maps"
        },
        {
            name: "Bodega y Vinoteca Don Julio",
            address: "Guatemala 4699, Palermo, Buenos Aires",
            rating: "4.9",
            source: "Google Maps"
        },
        {
            name: "Vinoteca El Gato Negro",
            address: "Av. Corrientes 1669, San Nicolás, Buenos Aires",
            rating: "4.6",
            source: "Google Maps"
        },
        {
            name: "La Vinoteca",
            address: "Av. Callao 201, Recoleta, Buenos Aires",
            rating: "4.7",
            source: "Google Maps"
        },
        {
            name: "Vinoteca Urbana",
            address: "Honduras 4969, Palermo, Buenos Aires",
            rating: "4.5",
            source: "Google Maps"
        }
    ],
    "Palermo": [
        {
            name: "Vinoteca Palermo",
            address: "Av. Santa Fe 1234, Palermo, Buenos Aires",
            rating: "4.8",
            source: "Google Maps"
        },
        {
            name: "Bodega y Vinoteca Don Julio",
            address: "Guatemala 4699, Palermo, Buenos Aires",
            rating: "4.9",
            source: "Google Maps"
        },
        {
            name: "Vinoteca Urbana",
            address: "Honduras 4969, Palermo, Buenos Aires",
            rating: "4.5",
            source: "Google Maps"
        },
        {
            name: "La Vinoteca de Palermo",
            address: "Nicaragua 4800, Palermo, Buenos Aires",
            rating: "4.4",
            source: "Google Maps"
        }
    ],
    "Recoleta": [
        {
            name: "La Vinoteca",
            address: "Av. Callao 201, Recoleta, Buenos Aires",
            rating: "4.7",
            source: "Google Maps"
        },
        {
            name: "Vinoteca Recoleta",
            address: "Av. Quintana 456, Recoleta, Buenos Aires",
            rating: "4.6",
            source: "Google Maps"
        },
        {
            name: "Bodega Recoleta",
            address: "Av. Alvear 789, Recoleta, Buenos Aires",
            rating: "4.8",
            source: "Google Maps"
        }
    ],
    "San Telmo": [
        {
            name: "Vinoteca San Telmo",
            address: "Defensa 1234, San Telmo, Buenos Aires",
            rating: "4.5",
            source: "Google Maps"
        },
        {
            name: "La Bodega de San Telmo",
            address: "Bolívar 567, San Telmo, Buenos Aires",
            rating: "4.4",
            source: "Google Maps"
        }
    ],
    "Córdoba": [
        {
            name: "Vinoteca Córdoba",
            address: "Av. Hipólito Yrigoyen 123, Centro, Córdoba",
            rating: "4.6",
            source: "Google Maps"
        },
        {
            name: "Bodega La Cava",
            address: "San Martín 456, Nueva Córdoba, Córdoba",
            rating: "4.7",
            source: "Google Maps"
        },
        {
            name: "Vinoteca del Centro",
            address: "Independencia 789, Centro, Córdoba",
            rating: "4.5",
            source: "Google Maps"
        }
    ],
    "Rosario": [
        {
            name: "Vinoteca Rosario",
            address: "San Martín 1234, Centro, Rosario",
            rating: "4.6",
            source: "Google Maps"
        },
        {
            name: "Bodega del Puerto",
            address: "Av. Belgrano 567, Puerto Norte, Rosario",
            rating: "4.7",
            source: "Google Maps"
        }
    ],
    "Mendoza": [
        {
            name: "Vinoteca Mendoza",
            address: "Av. San Martín 123, Centro, Mendoza",
            rating: "4.8",
            source: "Google Maps"
        },
        {
            name: "Bodega La Rural",
            address: "Montevideo 456, Centro, Mendoza",
            rating: "4.9",
            source: "Google Maps"
        },
        {
            name: "Vinoteca del Valle",
            address: "Belgrano 789, Centro, Mendoza",
            rating: "4.7",
            source: "Google Maps"
        }
    ]
};

// Función para obtener datos de ejemplo
function getSampleVinotecas(location) {
    const normalizedLocation = location.toLowerCase().trim();

    // Buscar coincidencias exactas
    for (const [key, vinotecas] of Object.entries(vinotecasSample)) {
        if (key.toLowerCase() === normalizedLocation) {
            return vinotecas;
        }
    }

    // Buscar coincidencias parciales
    for (const [key, vinotecas] of Object.entries(vinotecasSample)) {
        if (key.toLowerCase().includes(normalizedLocation) ||
            normalizedLocation.includes(key.toLowerCase())) {
            return vinotecas;
        }
    }

    // Si no encuentra nada, devolver datos de Buenos Aires
    return vinotecasSample["Buenos Aires"] || [];
}

// Función para obtener ubicaciones disponibles
function getAvailableLocations() {
    return Object.keys(vinotecasSample);
}

module.exports = {
    vinotecasSample,
    getSampleVinotecas,
    getAvailableLocations
}; 