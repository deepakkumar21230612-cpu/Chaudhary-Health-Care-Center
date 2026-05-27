const mongoose = require('mongoose');
const Patient = require('./src/models/Patient');
const Billing = require('./src/models/Billing');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

// Copy-paste of syncPatientBilling from billingController
async function syncPatientBilling(patientId) {
    try {
        const billing = await Billing.findOne({ patient_id: patientId });
        const patient = await Patient.findOne({ patient_id: patientId });
        if (!patient) {
            console.log('Patient not found');
            return;
        }

        console.log('Initial Patient in DB:', {
            totalBill: patient.totalBill,
            pending_amount: patient.pending_amount,
            payment_status: patient.payment_status
        });

        let grandTotal = 0;
        let discount = 0;
        let totalPaid = 0;

        if (billing) {
            discount = billing.discount || 0;
            
            // 1. Calculate Bed Stay charges
            if (patient.bedHistory && patient.bedHistory.length > 0) {
                console.log('Calculating bedHistory stay...');
                patient.bedHistory.forEach(bed => {
                    const startDate = new Date(bed.start_date);
                    const endDate = bed.end_date ? new Date(bed.end_date) : new Date();
                    const diffTime = Math.abs(endDate - startDate);
                    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays < 1) diffDays = 1;
                    const bedTotal = (bed.daily_charge || 0) * diffDays;
                    grandTotal += bedTotal;
                    console.log(`Bed: ${bed.bed_no} | Days: ${diffDays} | Daily: ${bed.daily_charge} | Total: ${bedTotal}`);
                });
            } else if (patient.bed_no) {
                console.log('Calculating main bed stay...');
                const startDate = new Date(patient.admission_date);
                const endDate = patient.discharge_date ? new Date(patient.discharge_date) : new Date();
                const diffTime = Math.abs(endDate - startDate);
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays < 1) diffDays = 1;
                const bedTotal = (patient.wardChargePerDay || 0) * diffDays;
                grandTotal += bedTotal;
                console.log(`Bed: ${patient.bed_no} | Days: ${diffDays} | Daily: ${patient.wardChargePerDay} | Total: ${bedTotal}`);
            }

            // 2. Calculate Surgery charges
            if (patient.surgeries && patient.surgeries.length > 0) {
                console.log('Calculating surgery charges...');
                patient.surgeries.forEach(s => {
                    grandTotal += (s.cost || 0);
                    console.log(`Surgery: ${s.surgeryName} | Cost: ${s.cost}`);
                });
            }

            // 3. Add other billing items from the billing record (skip duplicate bed charges / surgery items)
            if (billing.items && billing.items.length > 0) {
                console.log('Calculating other billing items...');
                billing.items.forEach(item => {
                    const isBedCharge = item.name.startsWith('Bed Charge');
                    const isSurgery = item.name.startsWith('Surgery:');
                    if (!isBedCharge && !isSurgery) {
                        const itemAmt = (item.fee || 0) * (item.days || 1);
                        grandTotal += itemAmt;
                        if (itemAmt > 0) {
                            console.log(`Item: ${item.name} | Fee: ${item.fee} | Days: ${item.days} | Total: ${itemAmt}`);
                        }
                    }
                });
            }

            // 4. Calculate total paid
            if (billing.payments && billing.payments.length > 0) {
                billing.payments.forEach(p => {
                    totalPaid += (p.amount || 0);
                });
            }
        } else {
            grandTotal = patient.totalBill || 0;
        }

        const netPayable = Math.max(0, grandTotal - discount);
        const pendingAmount = Math.max(0, netPayable - totalPaid);
        const paymentStatus = (pendingAmount <= 0 && netPayable > 0) ? 'Paid' : 'Pending';

        console.log('Calculated values:', {
            grandTotal,
            discount,
            netPayable,
            totalPaid,
            pendingAmount,
            paymentStatus
        });

        patient.totalBill = grandTotal;
        patient.pending_amount = pendingAmount;
        patient.payment_status = paymentStatus;
        
        console.log('Saving patient status to database...');
        await patient.save();
        console.log('Saved successfully!');

    } catch (err) {
        console.error('Error syncing patient billing:', err);
    }
}

async function run() {
    await mongoose.connect(uri);
    await syncPatientBilling('P-862748');
    process.exit(0);
}

run();
