// Test script to verify backend server and migration routes
const http = require('http');

const BASE_URL = 'http://localhost:5050';
const API_URL = `${BASE_URL}/api`;

// Helper function to replace fetch
function simpleFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const req = http.request({
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: options.method || 'GET',
            headers: options.headers || {}
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                res.text = () => Promise.resolve(data);
                res.json = () => Promise.resolve(JSON.parse(data));
                res.ok = res.statusCode >= 200 && res.statusCode < 300;
                res.status = res.statusCode;
                res.statusText = res.statusMessage;
                resolve(res);
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (options.body) {
            req.write(options.body);
        }

        req.end();
    });
}

async function testBackendServer() {
    console.log('🔍 Verifying backend server on port 5050...');

    try {
        // Test 1: Check if server is running
        console.log('\n[TEST 1] Basic server connectivity:');
        const rootResponse = await simpleFetch(BASE_URL, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        console.log(`✅ Server responded with status: ${rootResponse.status} ${rootResponse.statusText}`);
        // Test 2: Check resume endpoints
        console.log('\n[TEST 2] Resume API endpoints:');
        try {
            const resumeResponse = await simpleFetch(`${API_URL}/resumes`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (resumeResponse.status === 401) {
                console.log('⚠️ Authentication required (expected 401 response)');
            } else {
                console.log(`✅ Resume API responded with status: ${resumeResponse.status}`);

                if (resumeResponse.ok) {
                    const data = await resumeResponse.json();
                    console.log(`📄 Found ${data.length} resumes`);
                }
            }
        } catch (error) {
            console.error(`❌ Resume API error: ${error.message}`);
        }
        // Test 3: Check debug endpoints
        console.log('\n[TEST 3] Debug endpoints:');
        try {
            const debugResponse = await simpleFetch(`${API_URL}/resumes/debug/user`);
            console.log(`Debug endpoint status: ${debugResponse.status} ${debugResponse.statusText}`);

            if (debugResponse.status === 401) {
                console.log('⚠️ Authentication required for debug endpoints (expected)');
            }
        } catch (error) {
            console.error(`❌ Debug endpoint error: ${error.message}`);
        }

        // Test 4: Check migration endpoint exists
        console.log('\n[TEST 4] Migration endpoint:');
        try {
            const migrateResponse = await fetch(`${API_URL}/resumes/fix-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (migrateResponse.status === 401) {
                console.log('⚠️ Authentication required for migration endpoint (expected)');
                console.log('✅ Migration endpoint exists and returns proper auth error');
            } else {
                console.log(`❓ Unexpected response: ${migrateResponse.status}`);
            }
        } catch (error) {
            console.error(`❌ Migration endpoint error: ${error.message}`);
        }

        console.log('\n✅ Server verification complete!');
        console.log('📝 Next steps:');
        console.log('1. Open migration-tool-v2.html in a browser');
        console.log('2. Ensure you are logged into the app in the same browser');
        console.log('3. Use the tool to inspect and fix corrupted data');

    } catch (error) {
        console.error(`\n❌ ERROR: Server verification failed: ${error.message}`);
        console.error('Please make sure the server is running on port 5050');
    }
}

testBackendServer();
