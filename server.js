const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const { getSampleVinotecas } = require('./data/vinotecas_sample');
const DataForSEOClient = require('./dataforseo_client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar cliente DataForSEO
const dataForSEOClient = new DataForSEOClient();

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

// Función para hacer scraping con retry y diferentes estrategias
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

            // Esperar antes del siguiente intento
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

        // Estrategia 1: Buscar en resultados locales de Google
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

        // Estrategia 2: Buscar en enlaces de Google Maps
        $('a[href*="maps.google.com"], a[href*="google.com/maps"]').each((index, element) => {
            if (index < 10) {
                const text = $(element).text().trim();
                if (text && text.length > 5 &&
                    (text.toLowerCase().includes('vinoteca') ||
                        text.toLowerCase().includes('bodega') ||
                        text.toLowerCase().includes('wine'))) {

                    if (!vinotecas.some(v => v.name.toLowerCase() === text.toLowerCase())) {
                        vinotecas.push({
                            name: text.replace(/\s+/g, ' ').trim(),
                            address: `${location}, Argentina`,
                            rating: 'No disponible',
                            source: 'Google Maps'
                        });
                    }
                }
            }
        });

        console.log(`✅ Encontradas ${vinotecas.length} vinotecas en Google Maps`);
        return vinotecas;

    } catch (error) {
        console.error('❌ Error buscando en Google Maps:', error.message);
        return [];
    }
}

// Función para buscar vinotecas usando DataForSEO
async function searchVinotecasDataForSEO(location) {
    try {
        console.log(`🔍 DataForSEO: Iniciando búsqueda para ${location}`);

        // Intentar búsqueda local primero
        const localResults = await dataForSEOClient.searchVinotecas(location);

        if (localResults.length > 0) {
            return localResults;
        }

        // Si no hay resultados locales, intentar búsqueda Google
        console.log(`🔍 DataForSEO: Intentando búsqueda Google para ${location}`);
        const googleResults = await dataForSEOClient.searchGoogleVinotecas(location);

        return googleResults;

    } catch (error) {
        console.error('❌ Error en DataForSEO:', error.message);
        return [];
    }
}

// Función para buscar vinotecas en páginas locales argentinas
async function searchVinotecasLocales(location) {
    try {
        console.log(`🔍 Buscando en páginas locales argentinas para: ${location}`);

        const vinotecas = [];

        // Buscar en Guía Oleo
        try {
            const guiaOleoUrl = `https://www.guiaoleo.com.ar/buscar?q=${encodeURIComponent(`vinotecas ${location}`)}`;
            console.log(`🔍 Buscando en Guía Oleo: ${guiaOleoUrl}`);

            const response = await axiosInstance.get(guiaOleoUrl);
            const $ = cheerio.load(response.data);

            $('.result-item, .business-item, .listing-item').each((index, element) => {
                if (index < 10) {
                    const name = $(element).find('.business-name, .result-title, h3, h4').text().trim();
                    const address = $(element).find('.business-address, .result-address, .address').text().trim();

                    if (name && name.length > 3) {
                        vinotecas.push({
                            name: name.replace(/\s+/g, ' ').trim(),
                            address: address || 'Ver en Guía Oleo',
                            rating: 'No disponible',
                            source: 'Guía Oleo'
                        });
                    }
                }
            });

            console.log(`✅ Encontradas ${vinotecas.length} vinotecas en Guía Oleo`);
        } catch (error) {
            console.log(`⚠️ Error en Guía Oleo: ${error.message}`);
        }

        // Buscar en sitios específicos de Argentina
        try {
            // Buscar en páginas de bodegas argentinas
            const argentinaWineUrl = `https://www.google.com/search?q=${encodeURIComponent(`bodegas ${location} mendoza argentina`)}`;
            console.log(`🔍 Buscando bodegas argentinas: ${argentinaWineUrl}`);

            const response = await axiosInstance.get(argentinaWineUrl);
            const $ = cheerio.load(response.data);

            $('a').each((index, element) => {
                if (index < 30) {
                    const text = $(element).text().trim();
                    const href = $(element).attr('href') || '';

                    if (text && text.length > 5 &&
                        (text.toLowerCase().includes('bodega') ||
                            text.toLowerCase().includes('vinoteca') ||
                            text.toLowerCase().includes('wine') ||
                            href.includes('bodega') ||
                            href.includes('vinoteca'))) {

                        if (!vinotecas.some(v => v.name.toLowerCase() === text.toLowerCase())) {
                            vinotecas.push({
                                name: text.replace(/\s+/g, ' ').trim(),
                                address: `${location}, Argentina`,
                                rating: 'No disponible',
                                source: 'Búsqueda Argentina'
                            });
                        }
                    }
                }
            });

            console.log(`✅ Encontradas ${vinotecas.length} vinotecas en búsqueda argentina`);
        } catch (error) {
            console.log(`⚠️ Error en búsqueda argentina: ${error.message}`);
        }

        // Buscar en TripAdvisor
        try {
            const tripAdvisorUrl = `https://www.tripadvisor.com/Search?q=${encodeURIComponent(`vinotecas ${location} argentina`)}`;
            console.log(`🔍 Buscando en TripAdvisor: ${tripAdvisorUrl}`);

            const response = await axiosInstance.get(tripAdvisorUrl);
            const $ = cheerio.load(response.data);

            $('.result-title, .business-name, .listing-title').each((index, element) => {
                if (index < 5) {
                    const name = $(element).text().trim();
                    const address = $(element).closest('.result, .business-listing').find('.address, .location').text().trim();

                    if (name && name.length > 3) {
                        vinotecas.push({
                            name: name.replace(/\s+/g, ' ').trim(),
                            address: address || 'Ver en TripAdvisor',
                            rating: 'No disponible',
                            source: 'TripAdvisor'
                        });
                    }
                }
            });

            console.log(`✅ Encontradas ${vinotecas.length} vinotecas en TripAdvisor`);
        } catch (error) {
            console.log(`⚠️ Error en TripAdvisor: ${error.message}`);
        }

        return vinotecas;

    } catch (error) {
        console.error('❌ Error buscando en páginas locales:', error.message);
        return [];
    }
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

        // Buscar en múltiples fuentes incluyendo DataForSEO
        const [googleResults, localResults, dataForSEOResults] = await Promise.all([
            searchVinotecasGoogleMaps(location),
            searchVinotecasLocales(location),
            searchVinotecasDataForSEO(location)
        ]);

        // Combinar y filtrar resultados duplicados
        const allResults = [...googleResults, ...localResults, ...dataForSEOResults];
        const uniqueResults = allResults.filter((vinoteca, index, self) =>
            index === self.findIndex(v => v.name.toLowerCase() === vinoteca.name.toLowerCase())
        );

        // Si no se encontraron resultados reales, intentar búsqueda alternativa
        if (uniqueResults.length === 0) {
            console.log(`⚠️ No se encontraron resultados reales, intentando búsqueda alternativa para: ${location}`);

            // Intentar búsqueda alternativa en Google
            try {
                const alternativeUrl = `https://www.google.com/search?q=${encodeURIComponent(`bodegas ${location} argentina`)}`;
                const response = await axiosInstance.get(alternativeUrl);
                const $ = cheerio.load(response.data);

                const alternativeResults = [];

                // Buscar enlaces que contengan palabras relacionadas con vinos
                $('a').each((index, element) => {
                    if (index < 20) {
                        const text = $(element).text().trim();
                        const href = $(element).attr('href') || '';

                        if (text && text.length > 5 &&
                            (text.toLowerCase().includes('vinoteca') ||
                                text.toLowerCase().includes('bodega') ||
                                text.toLowerCase().includes('wine') ||
                                href.includes('maps.google.com'))) {

                            alternativeResults.push({
                                name: text.replace(/\s+/g, ' ').trim(),
                                address: 'Ver en Google',
                                rating: 'No disponible',
                                source: 'Google Search'
                            });
                        }
                    }
                });

                if (alternativeResults.length > 0) {
                    const uniqueAlternative = alternativeResults.filter((vinoteca, index, self) =>
                        index === self.findIndex(v => v.name.toLowerCase() === vinoteca.name.toLowerCase())
                    );

                    return res.json({
                        success: true,
                        location,
                        count: uniqueAlternative.length,
                        vinotecas: uniqueAlternative.slice(0, 10),
                        timestamp: new Date().toISOString(),
                        note: "Resultados alternativos encontrados"
                    });
                }
            } catch (error) {
                console.log(`⚠️ Error en búsqueda alternativa: ${error.message}`);
            }

            // Si todo falla, usar datos de ejemplo
            console.log(`⚠️ Usando datos de ejemplo para: ${location}`);
            const sampleResults = getSampleVinotecas(location);
            return res.json({
                success: true,
                location,
                count: sampleResults.length,
                vinotecas: sampleResults,
                timestamp: new Date().toISOString(),
                note: "Datos de ejemplo - scraping no disponible"
            });
        }

        res.json({
            success: true,
            location,
            count: uniqueResults.length,
            vinotecas: uniqueResults,
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

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 API disponible en http://localhost:${PORT}/api/search`);
    console.log(`🔍 Ejemplo: http://localhost:${PORT}/api/search?location=Palermo`);
}); 