const fetch = require('node-fetch'); // Needs installation or use built-in if node 18+

const BASE_URL = 'http://localhost:5001/api';

async function verify() {
    try {
        console.log('--- 1. Login Admin ---');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.message);
        const token = loginData.token;
        console.log('Admin Token received');

        console.log('\n--- 2. Get Customer ID (via mock login for now) ---');
        // In real app we lookup customer, here we use login to get ID easily
        const custLoginRes = await fetch(`${BASE_URL}/auth/customer-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: '9876543210', otp: '1234' })
        });
        const custData = await custLoginRes.json();
        if (!custLoginRes.ok) throw new Error(custData.message);
        const customerId = custData.customer.id;
        console.log('Customer ID:', customerId);

        console.log('\n--- 3. Create Vehicle ---');
        const vehRes = await fetch(`${BASE_URL}/vehicles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                make: 'Toyota',
                model: 'Corolla',
                year: 2022,
                plateNumber: 'ABC-1234',
                customerId: customerId
            })
        });
        const vehicle = await vehRes.json();
        if (!vehRes.ok) throw new Error(vehicle.message || JSON.stringify(vehicle));
        console.log('Vehicle Created:', vehicle._id);

        console.log('\n--- 4. Create Job ---');
        const jobRes = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                customerId: customerId,
                vehicleId: vehicle._id, // Fixed: use _id from response
                serviceType: 'Full PPF',
                estimatedCost: 50000,
                estimatedCompletion: new Date(Date.now() + 86400000 * 3) // 3 days
            })
        });
        const job = await jobRes.json();
        if (!jobRes.ok) throw new Error(job.message || JSON.stringify(job));
        console.log('Job Created:', job._id);

        console.log('\n--- 5. Get Jobs ---');
        const jobsRes = await fetch(`${BASE_URL}/jobs`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const jobs = await jobsRes.json();
        console.log('Jobs found:', jobs.length);

        console.log('\n--- 6. Update Job Status ---');
        const updateRes = await fetch(`${BASE_URL}/jobs/${job._id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'Washing' })
        });
        const updatedJob = await updateRes.json();
        console.log('Job Status Updated:', updatedJob.status);

        console.log('\n--- VERIFICATION SUCCESSFUL ---');

    } catch (err) {
        console.error('VERIFICATION FAILED:', err);
    }
}

verify();
