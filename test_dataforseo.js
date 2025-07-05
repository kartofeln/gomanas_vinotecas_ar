require('dotenv').config();
const axios = require('axios');

const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN;
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD;

async function testDataForSEO() {
    console.log('🧪 Testing DataForSEO API...');
    console.log('Login:', DATAFORSEO_LOGIN);
    console.log('Password:', DATAFORSEO_PASSWORD ? '***' : 'NOT SET');

    try {
        const response = await axios.post('https://api.dataforseo.com/v3/serp/google/organic/live/regular', [{
            location_code: 2104, // Argentina
            language_code: "es",
            keyword: "vinotecas Mendoza Argentina",
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

        console.log('✅ API Response Status:', response.status);
        console.log('📊 Response Data:');
        console.log(JSON.stringify(response.data, null, 2));

        if (response.data && response.data.tasks && response.data.tasks[0]) {
            const task = response.data.tasks[0];
            console.log('🔍 Task Status:', task.status_code);
            console.log('📝 Task Message:', task.status_message);

            if (task.result && task.result[0]) {
                const items = task.result[0].items || [];
                console.log(`📦 Found ${items.length} items`);

                items.forEach((item, index) => {
                    console.log(`\n${index + 1}. ${item.title}`);
                    console.log(`   URL: ${item.link}`);
                    console.log(`   Snippet: ${item.snippet?.substring(0, 100)}...`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error testing DataForSEO:');
        console.error('Message:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testDataForSEO(); 