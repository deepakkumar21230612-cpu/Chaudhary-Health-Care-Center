const mongoose = require('mongoose');
const Patient = require('./src/models/Patient');
const { syncPatientBilling } = require('./src/controllers/billingController');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://deepak:Deepak123456@cluster0.evytu0b.mongodb.net/chaudhary_hms_db?retryWrites=true&w=majority';

async function run() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(uri);
        console.log('Connected to database!');

        const patients = await Patient.find({ isDeleted: false });
        console.log(`Found ${patients.length} patients. Syncing billing status...`);

        for (const p of patients) {
            const oldStatus = p.payment_status;
            const oldPending = p.pending_amount;
            const oldTotal = p.totalBill;

            await syncPatientBilling(p.patient_id);

            // Refetch to see updated fields
            const updatedPatient = await Patient.findOne({ patient_id: p.patient_id });
            console.log(`Patient: ${p.patient_id} (${p.name}) | Status: ${p.status}`);
            console.log(`  BEFORE: Total: ${oldTotal} | Pending: ${oldPending} | PayStatus: ${oldStatus}`);
            console.log(`  AFTER : Total: ${updatedPatient.totalBill} | Pending: ${updatedPatient.pending_amount} | PayStatus: ${updatedPatient.payment_status}`);
        }

        console.log('All patients synchronized successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

run();
