// Test script to check if backend server is running and migration routes work
const http = require('http');

const testEndpoints = [
    'http://localhost:5000/api/resumes/debug/user',
    'http://localhost:5000/api/resumes/debug/user-new',
    'http://localhost:5000/api/health' // If health check exists
];

async function testServer() {
    console.log('Testing backend server connectivity...');

    for (const endpoint of testEndpoints) {
        try {
            const response = await fetch(endpoint);
            console.log(`${endpoint}: ${response.status} ${response.statusText}`);
        } catch (error) {
            console.log(`${endpoint}: ERROR - ${error.message}`);
        }
    }

    // Try to connect to port 5000 directly
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`Server is running on port 5000. Status: ${res.statusCode}`);
    });

    req.on('error', (e) => {
        console.log(`Server is NOT running on port 5000. Error: ${e.message}`);
    });

    req.end();
}

testServer();
