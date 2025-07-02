const axios = require('axios');
require('dotenv').config();

class DataForSEOClient {
    constructor() {
        this.login = process.env.DATAFORSEO_LOGIN;
        this.password = process.env.DATAFORSEO_PASSWORD;
        this.baseUrl = process.env.DATAFORSEO_BASE_URL || 'https://api.dataforseo.com';

        if (!this.login || !this.password) {
            console.warn('⚠️ DataForSEO credentials not found in .env file');
        }
    }

    // Verificar si el cliente está configurado
    isConfigured() {
        return this.login && this.password;
    }

    // Autenticación básica
    getAuthHeaders() {
        const credentials = Buffer.from(`${this.login}:${this.password}`).toString('base64');
        return {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
        };
    }

    // Buscar vinotecas usando Google Local Finder
    async searchVinotecas(location) {
        try {
            if (!this.isConfigured()) {
                console.log('❌ DataForSEO credentials not configured');
                return [];
            }

            console.log(`🔍 DataForSEO: Buscando vinotecas en ${location}`);

            const searchQuery = `vinotecas ${location} argentina`;

            const payload = {
                "location_code": 2840, // Argentina
                "language_code": "es",
                "keyword": searchQuery,
                "location_name": location,
                "depth": 10
            };

            const response = await axios.post(
                `${this.baseUrl}/v3/business_data/google/my_business_info/task_post`,
                [payload],
                {
                    headers: this.getAuthHeaders(),
                    timeout: 30000
                }
            );

            if (response.data && response.data.tasks && response.data.tasks[0]) {
                const taskId = response.data.tasks[0].id;
                console.log(`✅ DataForSEO: Task creado con ID: ${taskId}`);

                // Esperar y obtener resultados
                return await this.getTaskResults(taskId);
            }

            return [];
        } catch (error) {
            console.error('❌ Error en DataForSEO:', error.message);
            return [];
        }
    }

    // Obtener resultados de una tarea
    async getTaskResults(taskId, maxRetries = 5) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔄 DataForSEO: Obteniendo resultados (intento ${attempt}/${maxRetries})`);

                const response = await axios.get(
                    `${this.baseUrl}/v3/business_data/google/my_business_info/task_get/${taskId}`,
                    {
                        headers: this.getAuthHeaders(),
                        timeout: 15000
                    }
                );

                if (response.data && response.data.tasks && response.data.tasks[0]) {
                    const task = response.data.tasks[0];

                    if (task.status_message === 'Ok.' && task.result) {
                        return this.parseVinotecasResults(task.result);
                    } else if (task.status_message === 'In progress.') {
                        console.log(`⏳ DataForSEO: Task en progreso, esperando...`);
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        continue;
                    }
                }

                return [];
            } catch (error) {
                console.error(`❌ Error obteniendo resultados (intento ${attempt}):`, error.message);
                if (attempt === maxRetries) return [];
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        return [];
    }

    // Parsear resultados de vinotecas
    parseVinotecasResults(results) {
        const vinotecas = [];

        if (!results || !Array.isArray(results)) {
            return vinotecas;
        }

        results.forEach(result => {
            if (result.items && Array.isArray(result.items)) {
                result.items.forEach(item => {
                    if (item.title && item.address) {
                        vinotecas.push({
                            name: item.title,
                            address: item.address,
                            rating: item.rating || 'No disponible',
                            source: 'DataForSEO',
                            phone: item.phone || null,
                            website: item.website || null,
                            category: item.category || null
                        });
                    }
                });
            }
        });

        console.log(`✅ DataForSEO: Encontradas ${vinotecas.length} vinotecas`);
        return vinotecas;
    }

    // Búsqueda alternativa usando Google Search
    async searchGoogleVinotecas(location) {
        try {
            if (!this.isConfigured()) {
                return [];
            }

            console.log(`🔍 DataForSEO: Búsqueda alternativa en Google para ${location}`);

            const searchQuery = `vinotecas ${location} argentina`;

            const payload = {
                "location_code": 2840,
                "language_code": "es",
                "keyword": searchQuery,
                "depth": 20
            };

            const response = await axios.post(
                `${this.baseUrl}/v3/serp/google/organic/task_post`,
                [payload],
                {
                    headers: this.getAuthHeaders(),
                    timeout: 30000
                }
            );

            if (response.data && response.data.tasks && response.data.tasks[0]) {
                const taskId = response.data.tasks[0].id;
                return await this.getGoogleSearchResults(taskId);
            }

            return [];
        } catch (error) {
            console.error('❌ Error en búsqueda Google DataForSEO:', error.message);
            return [];
        }
    }

    // Obtener resultados de búsqueda Google
    async getGoogleSearchResults(taskId, maxRetries = 5) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await axios.get(
                    `${this.baseUrl}/v3/serp/google/organic/task_get/${taskId}`,
                    {
                        headers: this.getAuthHeaders(),
                        timeout: 15000
                    }
                );

                if (response.data && response.data.tasks && response.data.tasks[0]) {
                    const task = response.data.tasks[0];

                    if (task.status_message === 'Ok.' && task.result) {
                        return this.parseGoogleSearchResults(task.result);
                    } else if (task.status_message === 'In progress.') {
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        continue;
                    }
                }

                return [];
            } catch (error) {
                console.error(`❌ Error obteniendo resultados Google (intento ${attempt}):`, error.message);
                if (attempt === maxRetries) return [];
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        return [];
    }

    // Parsear resultados de búsqueda Google
    parseGoogleSearchResults(results) {
        const vinotecas = [];

        if (!results || !Array.isArray(results)) {
            return vinotecas;
        }

        results.forEach(result => {
            if (result.items && Array.isArray(result.items)) {
                result.items.forEach(item => {
                    if (item.title &&
                        (item.title.toLowerCase().includes('vinoteca') ||
                            item.title.toLowerCase().includes('bodega') ||
                            item.snippet.toLowerCase().includes('vinoteca') ||
                            item.snippet.toLowerCase().includes('bodega'))) {

                        vinotecas.push({
                            name: item.title,
                            address: item.snippet || `${location}, Argentina`,
                            rating: 'No disponible',
                            source: 'DataForSEO Google',
                            website: item.link || null
                        });
                    }
                });
            }
        });

        console.log(`✅ DataForSEO Google: Encontradas ${vinotecas.length} vinotecas`);
        return vinotecas;
    }
}

module.exports = DataForSEOClient; 