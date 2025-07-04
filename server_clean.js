const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración de axios
const axiosInstance = axios.create({
    timeout: parseInt(process.env.REQUEST_TIMEOUT) || 15000,
    headers: {
        'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
    }
});

// Función para hacer scraping con retry
async function scrapeWithRetry(url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🔄 Intento ${attempt} de ${maxRetries} para: ${url}`);
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.log(`❌ Intento ${attempt} falló: ${error.message}`);
            if (attempt === maxRetries) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        }
    }
}

// Función para buscar vinotecas en Google Maps
async function searchVinotecasGoogleMaps(location) {
    try {
        const searchQuery = `vinotecas ${location} argentina`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=lcl`;

        console.log(`🔍 Buscando en Google Maps: ${url}`);
        const htmlData = await scrapeWithRetry(url);
        const $ = cheerio.load(htmlData);

        const vinotecas = [];

        // Buscar en resultados locales de Google
        const localSelectors = [
            '.rllt__details',
            '.VkpGBb',
            '.rlfl__tlct',
            '[data-attrid="local_result"]',
            '.rllt__details-link',
            '.rllt__details-title',
            '.dbg0pd'
        ];

        for (const selector of localSelectors) {
            $(selector).each((index, element) => {
                if (index < 20) {
                    let name = '';
                    let address = '';
                    let rating = '';

                    // Extraer nombre
                    name = $(element).find('.rllt__details-link, .dbg0pd, .rllt__details-title').text().trim();
                    if (!name) {
                        name = $(element).find('a[data-attrid="local_result"]').text().trim();
                    }
                    if (!name) {
                        name = $(element).text().trim();
                    }

                    // Extraer dirección
                    address = $(element).find('.rllt__details-secondary, .rllt__details-address').text().trim();
                    if (!address) {
                        address = $(element).closest('.rllt__details').find('.rllt__details-secondary').text().trim();
                    }

                    // Extraer calificación
                    rating = $(element).find('.rllt__details-rating, .rllt__details-stars').text().trim();

                    if (name && name.length > 3 && !vinotecas.some(v => v.name.toLowerCase() === name.toLowerCase())) {
                        vinotecas.push({
                            name: name.replace(/\s+/g, ' ').trim(),
                            address: address || `${location}, Argentina`,
                            rating: rating || 'No disponible',
                            source: 'Google Maps'
                        });
                    }
                }
            });
        }

        console.log(`✅ Encontradas ${vinotecas.length} vinotecas en Google Maps`);
        return vinotecas;

    } catch (error) {
        console.error('❌ Error buscando en Google Maps:', error.message);
        return [];
    }
}

// Función para generar datos simulados
function getSampleVinotecas(location) {
    const cityData = {
        "mendoza": [
            { "name": "Bodega La Rural", "address": "Av. San Martín 2724, Mendoza", "rating": "4.5", "source": "Datos Simulados" },
            { "name": "Vinoteca Mendoza", "address": "Belgrano 1194, Mendoza", "rating": "4.3", "source": "Datos Simulados" },
            { "name": "Wine Store Mendoza", "address": "Sarmiento 123, Mendoza", "rating": "4.7", "source": "Datos Simulados" }
        ],
        "palermo": [
            { "name": "Vinoteca Palermo", "address": "Av. Santa Fe 1234, Palermo", "rating": "4.4", "source": "Datos Simulados" },
            { "name": "Wine Bar Palermo", "address": "Gorriti 567, Palermo", "rating": "4.6", "source": "Datos Simulados" },
            { "name": "Bodega Palermo", "address": "Honduras 890, Palermo", "rating": "4.3", "source": "Datos Simulados" }
        ],
        "córdoba": [
            { "name": "Vinoteca Córdoba", "address": "Av. Hipólito Yrigoyen 123, Córdoba", "rating": "4.3", "source": "Datos Simulados" },
            { "name": "Wine Bar Córdoba", "address": "San Martín 456, Córdoba", "rating": "4.5", "source": "Datos Simulados" },
            { "name": "Bodega Córdoba", "address": "Belgrano 789, Córdoba", "rating": "4.2", "source": "Datos Simulados" }
        ]
    };

    const locationLower = location.toLowerCase();
    return cityData[locationLower] || [
        { "name": f"Vinoteca {location}", "address": f"Av. Principal 123, {location}", "rating": "4.3", "source": "Datos Simulados" },
        { "name": f"Wine Bar {location}", "address": f"San Martín 456, {location}", "rating": "4.5", "source": "Datos Simulados" },
        { "name": f"Bodega {location}", "address": f"Belgrano 789, {location}", "rating": "4.2", "source": "Datos Simulados" }
    ];
}

// API Routes
app.get('/api/search', async (req, res) => {
    try {
        const { location = 'Buenos Aires' } = req.query;

        if (!location || location.trim().length < 2) {
            return res.status(400).json({
                error: 'La ubicación debe tener al menos 2 caracteres'
            });
        }

        console.log(`Buscando vinotecas en: ${location}`);

        // Intentar búsqueda en Google Maps
        let vinotecas = await searchVinotecasGoogleMaps(location);

        // Si no hay resultados, usar datos simulados
        if (vinotecas.length === 0) {
            console.log(`⚠️ No se encontraron resultados reales, usando datos simulados para: ${location}`);
            vinotecas = getSampleVinotecas(location);
        }

        res.json({
            success: true,
            location,
            count: vinotecas.length,
            vinotecas: vinotecas,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error en la búsqueda:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// Health check para Railway
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Vinoteca Search API',
        version: '1.0.0'
    });
});

// Health check alternativo
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: 'VinotecaFinder API',
        version: '1.0.0',
        endpoints: {
            search: '/api/search?location=ciudad',
            health: '/api/health'
        }
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📊 API disponible en /api/search`);
    console.log(`🔍 Ejemplo: /api/search?location=Palermo`);
    console.log(`💚 Health check: /api/health`);
}); 