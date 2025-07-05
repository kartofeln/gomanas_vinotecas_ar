#!/usr/bin/env node

/**
 * 🍷 Generador de URLs Personalizadas para Clientes
 * VinotecaFinder Argentina
 */

const BASE_URL = 'https://tu-app.railway.app'; // Cambiar por la URL real de Railway

const clients = [
    {
        name: 'Cliente 1 - Vinotecas Mendoza',
        description: 'Búsqueda específica de vinotecas en Mendoza',
        url: `${BASE_URL}?location=Mendoza&utm_source=cliente1&utm_medium=web&utm_campaign=vinotecas2024`,
        results: '9 vinotecas reales incluyendo La Enoteca, Tradición Vinos, Sol y Vino'
    },
    {
        name: 'Cliente 2 - Vinotecas Palermo',
        description: 'Búsqueda específica de vinotecas en Palermo, Buenos Aires',
        url: `${BASE_URL}?location=Palermo&utm_source=cliente2&utm_medium=web&utm_campaign=vinotecas2024`,
        results: 'Vinotecas del barrio más elegante de Buenos Aires'
    },
    {
        name: 'Cliente 3 - Vinotecas Córdoba',
        description: 'Búsqueda específica de vinotecas en Córdoba',
        url: `${BASE_URL}?location=Córdoba&utm_source=cliente3&utm_medium=web&utm_campaign=vinotecas2024`,
        results: 'Vinotecas de la provincia de Córdoba'
    },
    {
        name: 'Cliente 4 - Vinotecas San Telmo',
        description: 'Búsqueda específica de vinotecas en San Telmo',
        url: `${BASE_URL}?location=San%20Telmo&utm_source=cliente4&utm_medium=web&utm_campaign=vinotecas2024`,
        results: 'Vinotecas del barrio histórico de Buenos Aires'
    },
    {
        name: 'Cliente 5 - Vinotecas Recoleta',
        description: 'Búsqueda específica de vinotecas en Recoleta',
        url: `${BASE_URL}?location=Recoleta&utm_source=cliente5&utm_medium=web&utm_campaign=vinotecas2024`,
        results: 'Vinotecas del barrio más exclusivo de Buenos Aires'
    },
    {
        name: 'Cliente 6 - Vinotecas Rosario',
        description: 'Búsqueda específica de vinotecas en Rosario',
        url: `${BASE_URL}?location=Rosario&utm_source=cliente6&utm_medium=web&utm_campaign=vinotecas2024`,
        results: 'Vinotecas de la ciudad de Rosario'
    }
];

const specializedUrls = [
    {
        name: 'Bodegas en Mendoza',
        description: 'Especializado en bodegas',
        url: `${BASE_URL}?location=Mendoza&type=bodegas&utm_source=bodegas&utm_medium=web&utm_campaign=bodegas2024`,
        results: 'Bodegas de Mendoza con información detallada'
    },
    {
        name: 'Tiendas de Vino en Palermo',
        description: 'Especializado en tiendas de vino',
        url: `${BASE_URL}?location=Palermo&type=tiendas&utm_source=tiendas&utm_medium=web&utm_campaign=tiendas2024`,
        results: 'Tiendas de vino en Palermo'
    },
    {
        name: 'Enotecas en Recoleta',
        description: 'Especializado en enotecas',
        url: `${BASE_URL}?location=Recoleta&type=enotecas&utm_source=enotecas&utm_medium=web&utm_campaign=enotecas2024`,
        results: 'Enotecas en Recoleta'
    }
];

const filteredUrls = [
    {
        name: 'Vinotecas con Calificación Alta en Mendoza',
        description: 'Solo vinotecas con calificación 4.5+',
        url: `${BASE_URL}?location=Mendoza&rating=4.5&utm_source=calificacion&utm_medium=web&utm_campaign=calificacion2024`,
        results: 'Vinotecas con calificación alta en Mendoza'
    },
    {
        name: 'Vinotecas con Envío en Palermo',
        description: 'Solo vinotecas con envío a domicilio',
        url: `${BASE_URL}?location=Palermo&delivery=true&utm_source=envio&utm_medium=web&utm_campaign=envio2024`,
        results: 'Vinotecas con envío a domicilio en Palermo'
    },
    {
        name: 'Vinotecas con Tienda Online en Córdoba',
        description: 'Solo vinotecas con tienda online',
        url: `${BASE_URL}?location=Córdoba&online=true&utm_source=online&utm_medium=web&utm_campaign=online2024`,
        results: 'Vinotecas con tienda online en Córdoba'
    }
];

const mobileUrls = [
    {
        name: 'Versión Móvil - Mendoza',
        description: 'Optimizado para móviles',
        url: `${BASE_URL}?location=Mendoza&mobile=true&utm_source=mobile&utm_medium=web&utm_campaign=mobile2024`,
        results: 'Versión móvil optimizada'
    },
    {
        name: 'PWA - Palermo',
        description: 'Aplicación Web Progresiva',
        url: `${BASE_URL}?location=Palermo&pwa=true&utm_source=pwa&utm_medium=web&utm_campaign=pwa2024`,
        results: 'PWA para Palermo'
    }
];

const themedUrls = [
    {
        name: 'Tema Oscuro - Mendoza',
        description: 'Interfaz con tema oscuro',
        url: `${BASE_URL}?location=Mendoza&theme=dark&utm_source=dark&utm_medium=web&utm_campaign=dark2024`,
        results: 'Tema oscuro para Mendoza'
    },
    {
        name: 'Tema Claro - Palermo',
        description: 'Interfaz con tema claro',
        url: `${BASE_URL}?location=Palermo&theme=light&utm_source=light&utm_medium=web&utm_campaign=light2024`,
        results: 'Tema claro para Palermo'
    }
];

const abTestingUrls = [
    {
        name: 'A/B Testing - Variante A',
        description: 'URL para testing de variante A',
        url: `${BASE_URL}?location=Mendoza&variant=a&test=layout&utm_source=abtest&utm_medium=web&utm_campaign=abtest2024`,
        results: 'Variante A para testing'
    },
    {
        name: 'A/B Testing - Variante B',
        description: 'URL para testing de variante B',
        url: `${BASE_URL}?location=Mendoza&variant=b&test=layout&utm_source=abtest&utm_medium=web&utm_campaign=abtest2024`,
        results: 'Variante B para testing'
    }
];

function generateUrlList() {
    console.log('🍷 URLs Personalizadas para Clientes - VinotecaFinder Argentina\n');

    console.log('📱 URLs por Cliente:');
    console.log('='.repeat(80));
    clients.forEach((client, index) => {
        console.log(`${index + 1}. ${client.name}`);
        console.log(`   Descripción: ${client.description}`);
        console.log(`   URL: ${client.url}`);
        console.log(`   Resultados: ${client.results}`);
        console.log('');
    });

    console.log('🎯 URLs Especializadas:');
    console.log('='.repeat(80));
    specializedUrls.forEach((url, index) => {
        console.log(`${index + 1}. ${url.name}`);
        console.log(`   Descripción: ${url.description}`);
        console.log(`   URL: ${url.url}`);
        console.log(`   Resultados: ${url.results}`);
        console.log('');
    });

    console.log('📊 URLs con Filtros:');
    console.log('='.repeat(80));
    filteredUrls.forEach((url, index) => {
        console.log(`${index + 1}. ${url.name}`);
        console.log(`   Descripción: ${url.description}`);
        console.log(`   URL: ${url.url}`);
        console.log(`   Resultados: ${url.results}`);
        console.log('');
    });

    console.log('📱 URLs para Móviles:');
    console.log('='.repeat(80));
    mobileUrls.forEach((url, index) => {
        console.log(`${index + 1}. ${url.name}`);
        console.log(`   Descripción: ${url.description}`);
        console.log(`   URL: ${url.url}`);
        console.log(`   Resultados: ${url.results}`);
        console.log('');
    });

    console.log('🎨 URLs con Temas:');
    console.log('='.repeat(80));
    themedUrls.forEach((url, index) => {
        console.log(`${index + 1}. ${url.name}`);
        console.log(`   Descripción: ${url.description}`);
        console.log(`   URL: ${url.url}`);
        console.log(`   Resultados: ${url.results}`);
        console.log('');
    });

    console.log('📈 URLs para A/B Testing:');
    console.log('='.repeat(80));
    abTestingUrls.forEach((url, index) => {
        console.log(`${index + 1}. ${url.name}`);
        console.log(`   Descripción: ${url.description}`);
        console.log(`   URL: ${url.url}`);
        console.log(`   Resultados: ${url.results}`);
        console.log('');
    });
}

function generateCSV() {
    const allUrls = [
        ...clients,
        ...specializedUrls,
        ...filteredUrls,
        ...mobileUrls,
        ...themedUrls,
        ...abTestingUrls
    ];

    let csv = 'Nombre,Descripción,URL,Resultados\n';

    allUrls.forEach(url => {
        csv += `"${url.name}","${url.description}","${url.url}","${url.results}"\n`;
    });

    return csv;
}

function generateHTML() {
    const allUrls = [
        ...clients,
        ...specializedUrls,
        ...filteredUrls,
        ...mobileUrls,
        ...themedUrls,
        ...abTestingUrls
    ];

    let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🍷 URLs Personalizadas - VinotecaFinder Argentina</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .url-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .url-card h3 { color: #DC143C; margin-bottom: 10px; }
        .url { background: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all; }
        .description { color: #666; margin: 10px 0; }
        .results { color: #333; font-weight: bold; }
    </style>
</head>
<body>
    <h1>🍷 URLs Personalizadas para Clientes</h1>
    <h2>VinotecaFinder Argentina</h2>
    `;

    allUrls.forEach(url => {
        html += `
    <div class="url-card">
        <h3>${url.name}</h3>
        <div class="description">${url.description}</div>
        <div class="url">${url.url}</div>
        <div class="results">Resultados: ${url.results}</div>
    </div>
        `;
    });

    html += `
</body>
</html>
    `;

    return html;
}

// Ejecutar el generador
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.includes('--csv')) {
        console.log(generateCSV());
    } else if (args.includes('--html')) {
        console.log(generateHTML());
    } else {
        generateUrlList();

        console.log('💡 Opciones adicionales:');
        console.log('   node generate_client_urls.js --csv    # Generar CSV');
        console.log('   node generate_client_urls.js --html   # Generar HTML');
        console.log('');
        console.log('🚀 Para usar estas URLs:');
        console.log('   1. Despliega la aplicación en Railway');
        console.log('   2. Reemplaza "tu-app.railway.app" con tu URL real');
        console.log('   3. Comparte las URLs con tus clientes');
    }
}

module.exports = {
    clients,
    specializedUrls,
    filteredUrls,
    mobileUrls,
    themedUrls,
    abTestingUrls,
    generateUrlList,
    generateCSV,
    generateHTML
}; 