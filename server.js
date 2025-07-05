require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// DataForSEO API configuration
const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN;
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD;

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        dataforseo: !!(DATAFORSEO_LOGIN && DATAFORSEO_PASSWORD)
    });
});

// API endpoint for searching vinotecas
app.get('/api/search', async (req, res) => {
    try {
        const {
            location,
            type = 'vinotecas',
            rating,
            delivery,
            online,
            mobile,
            theme,
            utm_source,
            utm_medium,
            utm_campaign,
            variant,
            test
        } = req.query;

        if (!location) {
            return res.status(400).json({
                success: false,
                message: 'Location parameter is required'
            });
        }

        console.log(`Searching for ${type} in: ${location}`);
        if (rating) console.log(`Filtering by rating: ${rating}+`);
        if (delivery) console.log(`Filtering by delivery: ${delivery}`);
        if (online) console.log(`Filtering by online store: ${online}`);

        const results = [];
        const startTime = Date.now();

        // Search using DataForSEO if credentials are available
        if (DATAFORSEO_LOGIN && DATAFORSEO_PASSWORD) {
            try {
                const dataForSEOResults = await searchDataForSEO(location, type);
                results.push(...dataForSEOResults);
                console.log(`Found ${dataForSEOResults.length} results from DataForSEO`);
            } catch (error) {
                console.error('DataForSEO error:', error.message);
            }
        }

        // Fallback to simulated data if no DataForSEO results
        if (results.length === 0) {
            const simulatedResults = generateSimulatedData(location, type);
            results.push(...simulatedResults);
            console.log(`Using ${simulatedResults.length} simulated results`);
        }

        // Apply filters
        let filteredResults = results;

        // Filter by rating
        if (rating) {
            filteredResults = filteredResults.filter(vinoteca => {
                const vinotecaRating = parseFloat(vinoteca.rating);
                const minRating = parseFloat(rating);
                return vinotecaRating >= minRating;
            });
        }

        // Filter by delivery
        if (delivery === 'true') {
            filteredResults = filteredResults.filter(vinoteca =>
                vinoteca.snippet && vinoteca.snippet.toLowerCase().includes('envío')
            );
        }

        // Filter by online store
        if (online === 'true') {
            filteredResults = filteredResults.filter(vinoteca =>
                vinoteca.link && vinoteca.link.includes('http')
            );
        }

        const searchTime = Date.now() - startTime;

        // Add tracking information
        const tracking = {
            utm_source,
            utm_medium,
            utm_campaign,
            variant,
            test,
            mobile: mobile === 'true',
            theme: theme || 'light'
        };

        res.json({
            success: true,
            vinotecas: filteredResults,
            stats: {
                total: filteredResults.length,
                originalTotal: results.length,
                searchTime: searchTime,
                sources: filteredResults.map(r => r.source).filter((v, i, a) => a.indexOf(v) === i),
                filters: {
                    type,
                    rating,
                    delivery,
                    online
                },
                tracking
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching for vinotecas'
        });
    }
});

// DataForSEO search function using axios directly
async function searchDataForSEO(location, type = 'vinotecas') {
    const results = [];

    try {
        const keyword = `${type} ${location} Argentina`;
        console.log('Searching DataForSEO for:', keyword);

        const response = await axios.post('https://api.dataforseo.com/v3/serp/google/organic/live/regular', [{
            location_code: 2104, // Argentina
            language_code: "es",
            keyword: keyword,
            depth: 10
        }], {
            auth: {
                username: DATAFORSEO_LOGIN,
                password: DATAFORSEO_PASSWORD
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.tasks && response.data.tasks[0]) {
            const task = response.data.tasks[0];

            if (task.status_code === 20000 && task.result && task.result[0]) {
                const items = task.result[0].items || [];
                console.log(`Found ${items.length} items from DataForSEO`);

                items.forEach((item, index) => {
                    // Check if it's a relevant vinoteca result
                    if (item.title && item.url && isVinotecaRelevant(item.title, item.description)) {
                        const vinoteca = {
                            name: cleanVinotecaName(item.title),
                            address: extractAddress(item.description) || `${location}, Argentina`,
                            phone: extractPhone(item.description) || 'No disponible',
                            rating: extractRating(item.description) || 'Sin calificación',
                            source: 'DataForSEO',
                            link: item.url,
                            snippet: item.description || ''
                        };

                        // Avoid duplicates
                        if (!results.some(r => r.name === vinoteca.name)) {
                            results.push(vinoteca);
                            console.log(`Added vinoteca: ${vinoteca.name}`);
                        }
                    }
                });
            } else {
                console.log('Task status:', task.status_code, task.status_message);
            }
        }

    } catch (error) {
        console.error('DataForSEO API error:', error.message);
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
    }

    return results;
}

// Helper function to check if a result is relevant to vinotecas
function isVinotecaRelevant(title, description = '') {
    const vinotecaKeywords = [
        'vinoteca', 'vino', 'wine', 'bodega', 'bodegas', 'tienda de vino',
        'wine shop', 'wine store', 'casa de vinos', 'elixir', 'viognier',
        'sangre roja', 'barriga', 'toneles', 'mala boca', 'bodegón',
        'enoteca', 'tradición vinos', 'sol y vino', 'código vinario'
    ];

    const text = (title + ' ' + description).toLowerCase();
    return vinotecaKeywords.some(keyword => text.includes(keyword));
}

// Helper function to clean vinoteca names
function cleanVinotecaName(title) {
    return title
        .replace(/vinoteca|vino|wine|shop|store|tienda|bodega/gi, '')
        .replace(/[-–—]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Helper functions for data extraction
function extractAddress(text) {
    if (!text) return null;
    const addressMatch = text.match(/([A-Za-záéíóúñÁÉÍÓÚÑ\s]+,\s*[A-Za-záéíóúñÁÉÍÓÚÑ\s]+)/);
    return addressMatch ? addressMatch[1].trim() : null;
}

function extractPhone(text) {
    if (!text) return null;
    const phoneMatch = text.match(/(\+\d{1,3}\s?)?(\d{2,4}\s?)?(\d{3,4}\s?)?(\d{3,4})/);
    return phoneMatch ? phoneMatch[0].trim() : null;
}

function extractRating(text) {
    if (!text) return null;
    const ratingMatch = text.match(/(\d+(?:\.\d+)?)\s*\/\s*5/);
    return ratingMatch ? ratingMatch[1] : null;
}

// Generate simulated data for testing
function generateSimulatedData(location, type = 'vinotecas') {
    const typeNames = {
        'vinotecas': 'Vinoteca',
        'bodegas': 'Bodega',
        'tiendas': 'Tienda de Vinos',
        'enotecas': 'Enoteca'
    };

    const typeName = typeNames[type] || 'Vinoteca';

    const vinotecas = [
        {
            name: `${typeName} ${location}`,
            address: `Av. Principal 123, ${location}`,
            phone: '+54 11 1234-5678',
            rating: '4.5/5',
            source: 'Simulated Data',
            snippet: 'Gran selección de vinos argentinos y del mundo. Envíos a domicilio disponibles.'
        },
        {
            name: `${typeName} Premium ${location}`,
            address: `Calle del Vino 456, ${location}`,
            phone: '+54 11 9876-5432',
            rating: '4.2/5',
            source: 'Simulated Data',
            snippet: 'Vinos de alta gama y asesoramiento especializado. Tienda online disponible.'
        },
        {
            name: `Casa de Vinos ${location}`,
            address: `Plaza Central 789, ${location}`,
            phone: '+54 11 5555-1234',
            rating: '4.7/5',
            source: 'Simulated Data',
            snippet: 'Más de 20 años de experiencia en vinos. Envíos gratuitos en la zona.'
        },
        {
            name: `El Rincón del Vino`,
            address: `Esquina de la Paz 321, ${location}`,
            phone: '+54 11 4444-5678',
            rating: '4.0/5',
            source: 'Simulated Data',
            snippet: 'Ambiente acogedor para degustar vinos. Cata de vinos los fines de semana.'
        },
        {
            name: `Vinos y Más`,
            address: `Boulevard del Sabor 654, ${location}`,
            phone: '+54 11 3333-9999',
            rating: '4.3/5',
            source: 'Simulated Data',
            snippet: 'Amplia variedad de vinos nacionales e importados. Descuentos por mayor.'
        }
    ];

    return vinotecas;
}

// Serve the main application with URL parameter support
app.get('/', (req, res) => {
    // Check if there are URL parameters for client customization
    const { location, type, rating, delivery, online, mobile, theme, utm_source, utm_medium, utm_campaign } = req.query;

    if (location) {
        // If location parameter is provided, redirect to the search page with parameters
        const params = new URLSearchParams();
        if (location) params.append('location', location);
        if (type) params.append('type', type);
        if (rating) params.append('rating', rating);
        if (delivery) params.append('delivery', delivery);
        if (online) params.append('online', online);
        if (mobile) params.append('mobile', mobile);
        if (theme) params.append('theme', theme);
        if (utm_source) params.append('utm_source', utm_source);
        if (utm_medium) params.append('utm_medium', utm_medium);
        if (utm_campaign) params.append('utm_campaign', utm_campaign);

        const redirectUrl = `/search.html?${params.toString()}`;
        console.log(`Redirecting client to: ${redirectUrl}`);
        return res.redirect(redirectUrl);
    }

    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve search page for client URLs
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Web app available at: http://localhost:${PORT}`);
    console.log(`🔍 API endpoint: http://localhost:${PORT}/api/search`);

    if (DATAFORSEO_LOGIN && DATAFORSEO_PASSWORD) {
        console.log('✅ DataForSEO credentials configured');
    } else {
        console.log('⚠️  DataForSEO credentials not found, using simulated data');
        console.log('💡 To use real data, set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD environment variables');
    }
});

module.exports = app;