const axios = require('axios');

const URL = 'http://13.233.104.37/allInterviews'; // Replace with your actual AWS endpoint
const REQUESTS = 10000; // Number of requests to send
const CONCURRENCY = 50; // Number of concurrent requests

async function sendRequest() {
    try {
        const response = await axios.get(URL);
        console.log(`Response: ${response.status}`);
    } catch (error) {
        console.error(`Error: ${error.response?.status || error.message}`);
    }
}

async function testLoad() {
    const promises = [];
    for (let i = 0; i < REQUESTS; i++) {
        if (i % CONCURRENCY === 0) {
            await Promise.all(promises);
            promises.length = 0;
        }
        promises.push(sendRequest());
    }
    await Promise.all(promises);
}

testLoad().then(() => console.log('Load testing completed.'));
