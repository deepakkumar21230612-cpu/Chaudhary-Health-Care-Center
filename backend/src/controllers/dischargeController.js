const Discharge = require('../models/Discharge');
const Patient = require('../models/Patient');

exports.createDischarge = async (req, res) => {
    try {
        const { patientId, dischargeDate } = req.body;
        
        // Save discharge record
        const newDischarge = new Discharge(req.body);
        await newDischarge.save();
        
        // Update patient status to Discharged and close active bed history stay
        const patient = await Patient.findOne({ patient_id: patientId });
        if (patient) {
            patient.status = 'Discharged';
            patient.discharge_date = dischargeDate || Date.now();
            
            if (patient.bedHistory && patient.bedHistory.length > 0) {
                const lastBed = patient.bedHistory[patient.bedHistory.length - 1];
                if (!lastBed.end_date) {
                    lastBed.end_date = dischargeDate || Date.now();
                }
            }
            await patient.save();
        }
        
        res.status(201).json({ success: true, discharge: newDischarge });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getDischargeByPatient = async (req, res) => {
    try {
        const discharge = await Discharge.findOne({ patientId: req.params.patientId }).sort({ createdAt: -1 });
        if (!discharge) return res.status(404).json({ success: false, message: 'Discharge record not found' });
        res.status(200).json({ success: true, discharge });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
