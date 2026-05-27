const mongoose = require('mongoose');
const Patient = require('./src/models/Patient');
const Billing = require('./src/models/Billing');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function check() {
    await mongoose.connect(uri);
    const patients = await Patient.find({ isDeleted: false }, 'patient_id name payment_status pending_amount totalBill status');
    console.log('--- Patients ---');
    for (const p of patients) {
        const billing = await Billing.findOne({ patient_id: p.patient_id });
        let paymentsCount = 0;
        let totalPaid = 0;
        if (billing && billing.payments) {
            paymentsCount = billing.payments.length;
            billing.payments.forEach(pay => totalPaid += pay.amount);
        }
        console.log(`ID: ${p.patient_id} | Name: ${p.name} | Status: ${p.status} | PayStatus: ${p.payment_status} | PendingAmt: ${p.pending_amount} | TotalBill: ${p.totalBill} | Payments Count: ${paymentsCount} | TotalPaid: ${totalPaid}`);
    }
    process.exit(0);
}

check();
