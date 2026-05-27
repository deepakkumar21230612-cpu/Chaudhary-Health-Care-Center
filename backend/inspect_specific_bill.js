const mongoose = require('mongoose');
const Patient = require('./src/models/Patient');
const Billing = require('./src/models/Billing');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function check() {
    await mongoose.connect(uri);
    const p = await Patient.findOne({ patient_id: 'P-862748' });
    const b = await Billing.findOne({ patient_id: 'P-862748' });
    console.log('--- Patient P-862748 ---');
    console.log(JSON.stringify(p, null, 2));
    console.log('--- Billing P-982765 ---');
    console.log(JSON.stringify(b, null, 2));
    process.exit(0);
}

check();
