const http = require('http');

async function test() {
    const loginData = JSON.stringify({
        username: 'admin',
        password: 'admin123'
    });

    const loginOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(loginData)
        }
    };

    console.log("Sending login request...");
    const loginReq = http.request(loginOptions, (loginRes) => {
        console.log(`Login response status: ${loginRes.statusCode}`);
        let body = '';
        loginRes.on('data', chunk => body += chunk);
        loginRes.on('end', () => {
            console.log(`Login response body: ${body}`);
            try {
                const result = JSON.parse(body);
                if (!result.token) {
                    console.log("No token in response");
                    return;
                }
                
                const req = http.request({
                    hostname: 'localhost',
                    port: 5000,
                    path: '/api/patients',
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${result.token}` }
                }, res => {
                    console.log(`Patients response status: ${res.statusCode}`);
                    let pBody = '';
                    res.on('data', c => pBody += c);
                    res.on('end', () => console.log(`Patients: ${pBody}`));
                });
                req.end();
            } catch (e) {
                console.error("Failed to parse response:", e);
            }
        });
    });

    loginReq.on('error', (err) => {
        console.error("Login request error:", err);
    });

    loginReq.write(loginData);
    loginReq.end();
}

test();
