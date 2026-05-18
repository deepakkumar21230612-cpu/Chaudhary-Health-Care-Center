// ==================== PATIENT RECORD MODULE ====================
let currentRecordPatientId = null;

function renderPatientRecord() {
    const moduleEl = document.getElementById('module-patient-record');
    if (!moduleEl) return;

    moduleEl.innerHTML = `
        <div class="patient-record-layout">
            <div class="search-section no-print" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 20px;">
                <h3 style="margin-top:0;"><i class="fas fa-search"></i> Select Patient for Case Record</h3>
                <div style="position:relative; display:flex; gap:10px;">
                    <input type="text" id="record-patient-search" class="search-input" placeholder="Search by ID or Name..." style="flex:1; padding:12px; border-radius:8px; border:2px solid #e2e8f0; font-size:15px;" oninput="filterRecordPatients(this.value)" onclick="filterRecordPatients(this.value)">
                    <div id="record-search-results" class="autocomplete-dropdown" style="display:none; position:absolute; top:100%; left:0; right:0; z-index:1000; background:white; border:1px solid #ddd; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.1); margin-top:5px; max-height:300px; overflow-y:auto;"></div>
                </div>
            </div>

            <div id="patient-record-controls" class="no-print" style="display:none; margin-bottom:15px; display:flex; justify-content:flex-end; gap:10px;">
                <button class="btn btn-success" onclick="savePatientRecord()"><i class="fas fa-save"></i> Save Record</button>
                <button class="btn btn-primary" onclick="window.print()"><i class="fas fa-print"></i> Print Record</button>
            </div>

            <div id="record-form-container" class="a4-container" style="display:none;">
                <div class="record-paper" id="record-printable">
                    <!-- Header -->
                    <div class="record-header" style="text-align: center; border-bottom: 2px solid #2b6cb0; padding-bottom: 10px; margin-bottom: 20px; position: relative;">
                         <div style="display:flex; align-items:center; justify-content:center; gap:20px;">
                             <img src="hlogo.png" alt="Logo" style="height: 80px;">
                             <div>
                                 <h1 style="margin: 0; color: #2b6cb0; font-size: 28px; font-weight: 900;">Chaudhary Health Care Centre</h1>
                                 <p style="margin: 5px 0; font-weight: bold; color: #2d3748;">A Complete Healthcare Point</p>
                                 <p style="margin: 2px 0;">Koraon-Prayagraj</p>
                                 <p style="margin: 2px 0; font-weight: bold;">Mob.: 9918333370, 8896017340</p>
                             </div>
                         </div>
                         <div style="margin-top: 15px; display: inline-block; padding: 4px 15px; border: 2px solid #000; font-weight: bold; text-transform: uppercase;">In Patient Record</div>
                    </div>

                    <!-- Top Info Line -->
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <div>
                            <strong>INDOOR No.:</strong> 
                            <input type="text" id="rec-indoor-no" style="border:none; border-bottom: 1px dotted #000; width: 120px; outline:none; font-weight:bold;">
                        </div>
                        <div>
                            <strong>WARD No.:</strong> 
                            <input type="text" id="rec-ward-no" style="border:none; border-bottom: 1px dotted #000; width: 120px; outline:none; font-weight:bold;">
                        </div>
                    </div>

                    <!-- Main Form Fields -->
                    <div class="form-body" style="line-height: 2.2;">
                        <div class="form-row">
                            <strong>Patient's Name:</strong> 
                            <span id="rec-patient-name" style="border-bottom: 1px dotted #000; flex: 1; display: inline-block; min-width: 300px; font-weight:bold;"></span>
                        </div>
                        <div class="form-row">
                            <strong>Fathers/Husband Name:</strong> 
                            <span id="rec-guardian" style="border-bottom: 1px dotted #000; flex: 1; display: inline-block; min-width: 250px; font-weight:bold;"></span>
                        </div>
                        <div style="display: flex; gap: 20px;">
                            <div style="flex: 1;">
                                <strong>Age:</strong> <span id="rec-age" style="border-bottom: 1px dotted #000; width: 60px; display: inline-block; font-weight:bold;"></span>
                            </div>
                            <div style="flex: 1;">
                                <strong>Sex:</strong> <span id="rec-sex" style="border-bottom: 1px dotted #000; width: 80px; display: inline-block; font-weight:bold;"></span>
                            </div>
                            <div style="flex: 1.5;">
                                <strong>Religion:</strong> <input type="text" id="rec-religion" style="border:none; border-bottom: 1px dotted #000; width: 150px; outline:none;">
                            </div>
                        </div>
                        <div class="form-row">
                            <strong>Address:</strong> 
                            <span id="rec-address" style="border-bottom: 1px dotted #000; flex: 1; display: inline-block; font-weight:bold;"></span>
                        </div>
                        <div style="display: flex; justify-content: flex-end;">
                             <strong>Mobile No.</strong> <span id="rec-mobile" style="border-bottom: 1px dotted #000; width: 200px; display: inline-block; font-weight:bold; margin-left:10px;"></span>
                        </div>

                        <div class="form-row">
                            <strong>Physician/Surgeon-in-Charge:</strong> 
                            <span id="rec-physician" style="border-bottom: 1px dotted #000; flex: 1; display: inline-block; font-weight:bold;"></span>
                        </div>

                        <div style="display: flex; gap: 20px;">
                            <div style="flex: 1;">
                                <strong>Date of Admission:</strong> <span id="rec-doa" style="border-bottom: 1px dotted #000; width: 150px; display: inline-block; font-weight:bold;"></span>
                            </div>
                            <div style="flex: 1;">
                                <strong>Time:</strong> <span id="rec-toa" style="border-bottom: 1px dotted #000; width: 120px; display: inline-block; font-weight:bold;"></span>
                            </div>
                        </div>

                        <div style="display: flex; gap: 20px;">
                            <div style="flex: 1;">
                                <strong>Date of Discharge:</strong> <input type="date" id="rec-dod" style="border:none; border-bottom: 1px dotted #000; outline:none;">
                            </div>
                            <div style="flex: 1;">
                                <strong>Time:</strong> <input type="time" id="rec-tod" style="border:none; border-bottom: 1px dotted #000; outline:none;">
                            </div>
                        </div>

                        <div class="form-row">
                            <strong>Provisional Diagnosis:</strong> 
                            <input type="text" id="rec-provisional" style="border:none; border-bottom: 1px dotted #000; width: 75%; outline:none;">
                        </div>

                        <div class="form-row">
                            <strong>Final Diagnosis:</strong> 
                            <input type="text" id="rec-final" style="border:none; border-bottom: 1px dotted #000; width: 80%; outline:none;">
                        </div>

                        <div class="form-row" style="display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px;">
                            <strong>Result:</strong> 
                            <label><input type="radio" name="rec-result" value="DOPR" onclick="toggleRadioDeSelection(this)"> DOPR</label>
                            <label><input type="radio" name="rec-result" value="Cured" onclick="toggleRadioDeSelection(this)"> Cured</label>
                            <label><input type="radio" name="rec-result" value="Relieved" onclick="toggleRadioDeSelection(this)"> Relieved</label>
                            <label><input type="radio" name="rec-result" value="LAMA" onclick="toggleRadioDeSelection(this)"> LAMA</label>
                            <label><input type="radio" name="rec-result" value="Died" onclick="toggleRadioDeSelection(this)"> Died</label>
                        </div>
                    </div>

                    <!-- Consent Section -->
                    <div style="margin-top: 30px; font-size: 14px; color: #2b6cb0; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
                        <p style="font-weight: bold; line-height: 1.6;">
                            मैं एतद्द्वारा अपने रोगी के किसी प्रकार के नैदानिक परीक्षण, उपचार एवं तद हेतु आवश्यक शल्य क्रिया व निश्चेतक औषधियों के प्रयोग की अनुमति देता / देती हूं। मुझे इसके सभी संभावित परिणामों से अवगत करा दिया गया है।
                        </p>
                    </div>

                    <!-- Signatures Section -->
                    <div style="margin-top: 50px; display: flex; justify-content: space-between;">
                        <div style="width: 45%;">
                            <p style="margin-bottom: 10px; font-weight: bold;">साक्षी गवाह</p>
                            <div style="margin-bottom: 8px;">नाम: <input type="text" id="rec-witness-name" style="border:none; border-bottom: 1px dotted #000; width: 80%; outline:none;"></div>
                            <div style="margin-bottom: 8px;">वर्तमान पता: <input type="text" id="rec-witness-address" style="border:none; border-bottom: 1px dotted #000; width: 70%; outline:none;"></div>
                            <div style="margin-bottom: 8px;">दिनांक: <input type="date" id="rec-witness-date" style="border:none; border-bottom: 1px dotted #000; outline:none;"></div>
                            <div style="margin-bottom: 8px;">स्थान: <input type="text" id="rec-witness-place" style="border:none; border-bottom: 1px dotted #000; width: 80%; outline:none;"></div>
                        </div>

                        <div style="width: 45%;">
                            <p style="margin-bottom: 10px; font-weight: bold;">रोगी से संबंधित हस्ताक्षर</p>
                            
                            <!-- Signature Upload Area -->
                            <div class="sig-upload-container no-print" style="margin-bottom: 10px; border: 1px dashed #ccc; padding: 10px; border-radius: 8px; text-align: center; background: #f9f9f9;">
                                <p style="font-size: 11px; margin: 0 0 5px 0;">Upload Signature Image:</p>
                                <input type="file" id="sig-upload-input" accept="image/*" onchange="handleSignatureUpload(this)" style="font-size: 11px;">
                            </div>
                            
                            <div id="sig-preview-wrap" style="height: 100px; border-bottom: 1px solid #000; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
                                <img id="sig-preview-img" src="" style="max-height: 100%; display: none;">
                                <span id="sig-placeholder" style="color: #ccc; font-style: italic;">Signature / अंगूठा</span>
                            </div>

                            <div style="margin-bottom: 8px;">नाम: <input type="text" id="rec-rel-name" style="border:none; border-bottom: 1px dotted #000; width: 80%; outline:none;"></div>
                            <div style="margin-bottom: 8px;">वर्तमान पता: <input type="text" id="rec-rel-address" style="border:none; border-bottom: 1px dotted #000; width: 70%; outline:none;"></div>
                            <div style="margin-bottom: 8px;">दिनांक: <input type="date" id="rec-rel-date" style="border:none; border-bottom: 1px dotted #000; outline:none;"></div>
                            <div style="margin-bottom: 8px;">स्थान: <input type="text" id="rec-rel-place" style="border:none; border-bottom: 1px dotted #000; width: 80%; outline:none;"></div>
                        </div>
                    </div>

                    <!-- Patient Complete Journey Log (A4 Printable Sections) -->
                    <div id="patient-journey-log" style="margin-top: 50px; border-top: 3px double #2b6cb0; padding-top: 30px;">
                        <h2 style="text-align: center; color: #2b6cb0; font-family: serif; margin-bottom: 25px; font-weight: 800; text-transform: uppercase; font-size: 20px;">
                            Patient Complete Medical Journey & Case History
                        </h2>
                        
                        <!-- 1. Ward & Bed Stay timeline -->
                        <div style="margin-bottom: 25px;">
                            <h4 style="color: #2b6cb0; margin-bottom: 8px; border-bottom: 2px solid #edf2f7; padding-bottom: 5px; font-weight: bold; font-size: 14px;"><i class="fas fa-bed"></i> 1. Ward & Bed Stay Timeline</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                                <thead>
                                    <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
                                        <th style="padding: 6px; border: 1px solid #cbd5e1;">Ward Type</th>
                                        <th style="padding: 6px; border: 1px solid #cbd5e1;">Bed No.</th>
                                        <th style="padding: 6px; border: 1px solid #cbd5e1;">From Date</th>
                                        <th style="padding: 6px; border: 1px solid #cbd5e1;">To Date</th>
                                        <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: right;">Rate / Day</th>
                                    </tr>
                                </thead>
                                <tbody id="journey-bed-history">
                                    <!-- Dynamic -->
                                </tbody>
                            </table>
                        </div>

                        <!-- 2. Surgery History -->
                        <div style="margin-bottom: 25px;">
                            <h4 style="color: #2b6cb0; margin-bottom: 8px; border-bottom: 2px solid #edf2f7; padding-bottom: 5px; font-weight: bold; font-size: 14px;"><i class="fas fa-procedures"></i> 2. Surgeries & Interventions</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                                <thead>
                                    <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
                                        <th style="padding: 6px; border: 1px solid #cbd5e1;">Surgery/Procedure</th>
                                        <th style="padding: 6px; border: 1px solid #cbd5e1;">Surgeon</th>
                                        <th style="padding: 6px; border: 1px solid #cbd5e1;">Date</th>
                                        <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: right;">Charges</th>
                                        <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: center;">Guardian Proof</th>
                                    </tr>
                                </thead>
                                <tbody id="journey-surgery-history">
                                    <!-- Dynamic -->
                                </tbody>
                            </table>
                        </div>

                        <!-- 3. Daily observations (Vitals) -->
                        <div style="margin-bottom: 25px;">
                            <h4 style="color: #2b6cb0; margin-bottom: 8px; border-bottom: 2px solid #edf2f7; padding-bottom: 5px; font-weight: bold; font-size: 14px;"><i class="fas fa-heartbeat"></i> 3. Clinical Observation Chart (Vitals Log)</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                                <thead>
                                    <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
                                        <th style="padding: 5px; border: 1px solid #cbd5e1;">Date & Time</th>
                                        <th style="padding: 5px; border: 1px solid #cbd5e1;">Pulse</th>
                                        <th style="padding: 5px; border: 1px solid #cbd5e1;">BP</th>
                                        <th style="padding: 5px; border: 1px solid #cbd5e1;">Temp</th>
                                        <th style="padding: 5px; border: 1px solid #cbd5e1;">SpO2</th>
                                        <th style="padding: 5px; border: 1px solid #cbd5e1;">RBS</th>
                                        <th style="padding: 5px; border: 1px solid #cbd5e1;">Observer</th>
                                    </tr>
                                </thead>
                                <tbody id="journey-vitals-history">
                                    <!-- Dynamic -->
                                </tbody>
                            </table>
                        </div>

                        <!-- 4. Medication Chart -->
                        <div style="margin-bottom: 25px;">
                            <h4 style="color: #2b6cb0; margin-bottom: 8px; border-bottom: 2px solid #edf2f7; padding-bottom: 5px; font-weight: bold; font-size: 14px;"><i class="fas fa-pills"></i> 4. Medication & Treatment Logs</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                                <thead>
                                    <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
                                        <th style="padding: 5px; border: 1px solid #cbd5e1;">Prescribed</th>
                                        <th style="padding: 5px; border: 1px solid #cbd5e1;">Medicine Name</th>
                                        <th style="padding: 5px; border: 1px solid #cbd5e1;">Type & Dose</th>
                                        <th style="padding: 5px; border: 1px solid #cbd5e1;">Status</th>
                                        <th style="padding: 5px; border: 1px solid #cbd5e1;">Administered Details</th>
                                    </tr>
                                </thead>
                                <tbody id="journey-meds-history">
                                    <!-- Dynamic -->
                                </tbody>
                            </table>
                        </div>

                        <!-- 5. Final billing & Payments summary -->
                        <div>
                            <h4 style="color: #2b6cb0; margin-bottom: 8px; border-bottom: 2px solid #edf2f7; padding-bottom: 5px; font-weight: bold; font-size: 14px;"><i class="fas fa-file-invoice-dollar"></i> 5. Final Billing & Financial Ledger</h4>
                            <div style="display: flex; justify-content: space-between; gap: 20px; font-size: 12px; align-items: flex-start;">
                                <div style="flex: 1.2;">
                                    <table style="width: 100%; border-collapse: collapse; font-size:11px;">
                                        <thead>
                                            <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; text-align: left;">
                                                <th style="padding: 5px;">Payment Date</th>
                                                <th style="padding: 5px;">Mode</th>
                                                <th style="padding: 5px; text-align: right;">Amount Paid</th>
                                            </tr>
                                        </thead>
                                        <tbody id="journey-financial-history">
                                            <!-- Dynamic -->
                                        </tbody>
                                    </table>
                                </div>
                                <div style="flex: 0.8; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px;">
                                    <table style="width: 100%; line-height: 1.6;">
                                        <tr>
                                            <td><strong>Total Bill:</strong></td>
                                            <td style="text-align: right;" id="j-total-bill">₹0</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Discount:</strong></td>
                                            <td style="text-align: right; color: #ef4444;" id="j-discount">₹0</td>
                                        </tr>
                                        <tr style="border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; font-weight: bold;">
                                            <td><strong>Net Payable:</strong></td>
                                            <td style="text-align: right;" id="j-net-payable">₹0</td>
                                        </tr>
                                        <tr style="font-weight: bold; color: #10b981;">
                                            <td><strong>Total Paid:</strong></td>
                                            <td style="text-align: right;" id="j-total-paid">₹0</td>
                                        </tr>
                                        <tr style="border-top: 2px double #cbd5e1; font-weight: 900; color: #ef4444; font-size: 13px;">
                                            <td><strong>Balance Due:</strong></td>
                                            <td style="text-align: right;" id="j-balance-due">₹0</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .patient-record-layout {
                max-width: 900px;
                margin: 0 auto;
            }
            .a4-container {
                background: white;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                border-radius: 8px;
                padding: 10px;
                overflow-x: auto;
            }
            .record-paper {
                width: 794px; /* A4 width in pixels roughly */
                min-height: 1123px; /* A4 height */
                margin: 0 auto;
                padding: 40px;
                background: white;
                color: #000;
                font-family: serif;
            }
            @media print {
                .no-print, .sidebar, .mobile-header, .content-header, #patient-record-controls, .sidebar-overlay, #loading-overlay, #notification { display: none !important; }
                .main-content { margin: 0 !important; padding: 0 !important; width: 100% !important; box-shadow: none !important; }
                .a4-container { box-shadow: none; padding: 0; width: 100% !important; max-width: 100% !important; }
                .record-paper { width: 100%; padding: 0; margin: 0; box-shadow: none; border: none; }
                body { background: white !important; color: black !important; }
                input[type="date"]::-webkit-inner-spin-button,
                input[type="date"]::-webkit-calendar-picker-indicator {
                    display: none;
                    -webkit-appearance: none;
                }
                input[type="time"]::-webkit-inner-spin-button,
                input[type="time"]::-webkit-calendar-picker-indicator {
                    display: none;
                    -webkit-appearance: none;
                }
            }
            .form-row {
                display: flex;
                align-items: baseline;
                gap: 10px;
            }
        </style>
    `;
    loadRecordDropdownListener();
}

function loadRecordDropdownListener() {
    if (!window.recordDropdownListenerAdded) {
        document.addEventListener('click', function(e) {
            const dropdown = document.getElementById('record-search-results');
            const input = document.getElementById('record-patient-search');
            if (dropdown && input && e.target !== input && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        window.recordDropdownListenerAdded = true;
    }
}

function filterRecordPatients(query) {
    const term = (query || '').toLowerCase().trim();
    const resultsContainer = document.getElementById('record-search-results');

    if (term.length === 0) {
        resultsContainer.style.display = 'none';
        return;
    }

    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const filtered = patients.filter(p =>
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.patient_id && p.patient_id.toLowerCase().includes(term))
    );

    if (filtered.length === 0) {
        resultsContainer.innerHTML = '<div style="padding:15px; text-align:center; color:#888;">No results found</div>';
    } else {
        resultsContainer.innerHTML = filtered.map(p => `
            <div class="autocomplete-item" style="padding:12px; border-bottom:1px solid #eee; cursor:pointer;" onclick="loadPatientToRecord('${p.patient_id}')">
                <div style="font-weight:bold; color:#2d3748;">${p.name}</div>
                <div style="font-size:12px; color:#718096;">Patient ID: ${p.patient_id}</div>
            </div>
        `).join('');
    }
    resultsContainer.style.display = 'block';
}

function loadPatientToRecord(patientId) {
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const p = patients.find(pat => pat.patient_id === patientId || pat.id === patientId);
    if (!p) {
        showNotification('Patient not found in registry', 'error');
        return;
    }

    currentRecordPatientId = p.patient_id || p.id;
    document.getElementById('record-search-results').style.display = 'none';
    document.getElementById('record-patient-search').value = `${p.name} | ${currentRecordPatientId}`;
    document.getElementById('record-form-container').style.display = 'block';
    document.getElementById('patient-record-controls').style.display = 'flex';

    // 1. Basic Identity from Patient Registration
    document.getElementById('rec-patient-name').textContent = p.name || '';
    document.getElementById('rec-guardian').textContent = p.guardian_name || p.relative_name || p.fathers_name || '';
    document.getElementById('rec-age').textContent = p.age || '';
    document.getElementById('rec-sex').textContent = p.gender || '';
    document.getElementById('rec-address').textContent = p.address || '';
    document.getElementById('rec-mobile').textContent = p.mobile || '';
    document.getElementById('rec-doa').textContent = p.admission_date || '';
    document.getElementById('rec-toa').textContent = p.admission_time || '';
    
    // Logic for Physician/Surgeon-in-Charge (Check if surgery patient)
    const allSurgeries = JSON.parse(localStorage.getItem('surgeries') || '[]');
    const patientSurgeries = allSurgeries.filter(s => String(s.patient_id) === String(currentRecordPatientId));
    
    if (patientSurgeries.length > 0) {
        // If surgery exists, show latest surgeon's name
        const latestSurgery = patientSurgeries[patientSurgeries.length - 1];
        document.getElementById('rec-physician').textContent = latestSurgery.surgeonName || p.doctor_assigned || '';
    } else {
        // Otherwise show default assigned doctor
        document.getElementById('rec-physician').textContent = p.doctor_assigned || '';
    }

    // 2. Try to fetch from latest Discharge Summary for Diagnosis/Dates
    const dischargeList = JSON.parse(localStorage.getItem('discharge_records') || '[]');
    const latestDischarge = [...dischargeList].reverse().find(d => d.patientId === currentRecordPatientId);
    
    if (latestDischarge) {
        document.getElementById('rec-dod').value = latestDischarge.dischargeDate || p.discharge_date || '';
        document.getElementById('rec-provisional').value = latestDischarge.diagnosis || '';
        document.getElementById('rec-final').value = latestDischarge.diagnosis || '';
    } else {
        document.getElementById('rec-dod').value = p.discharge_date || '';
    }

    // 3. Load saved Case Record (overwrites if user previously saved specific data here)
    const records = JSON.parse(localStorage.getItem('patient_records') || '{}');
    const saved = records[currentRecordPatientId];
    
    if (saved) {
        document.getElementById('rec-indoor-no').value = saved.indoor_no || '';
        document.getElementById('rec-ward-no').value = saved.ward_no || '';
        document.getElementById('rec-religion').value = saved.religion || '';
        document.getElementById('rec-toa').value = saved.toa || '';
        if (saved.dod) document.getElementById('rec-dod').value = saved.dod;
        document.getElementById('rec-tod').value = saved.tod || '';
        if (saved.provisional) document.getElementById('rec-provisional').value = saved.provisional;
        if (saved.final) document.getElementById('rec-final').value = saved.final;
        
        if (saved.result) {
            const radio = document.querySelector('input[name="rec-result"][value="' + saved.result + '"]');
            if (radio) {
                radio.checked = true;
                // Initialize wasChecked for toggle logic
                document.querySelectorAll('input[name="rec-result"]').forEach(r => r.wasChecked = false);
                radio.wasChecked = true;
            }
        }

        document.getElementById('rec-witness-name').value = saved.witness_name || '';
        document.getElementById('rec-witness-address').value = saved.witness_address || '';
        document.getElementById('rec-witness-date').value = saved.witness_date || '';
        document.getElementById('rec-witness-place').value = saved.witness_place || '';

        document.getElementById('rec-rel-name').value = saved.rel_name || '';
        document.getElementById('rec-rel-address').value = saved.rel_address || '';
        document.getElementById('rec-rel-date').value = saved.rel_date || '';
        document.getElementById('rec-rel-place').value = saved.rel_place || '';

        if (saved.signature) {
            const imgEl = document.getElementById('sig-preview-img');
            imgEl.src = saved.signature;
            imgEl.style.display = 'block';
            document.getElementById('sig-placeholder').style.display = 'none';
        } else {
            document.getElementById('sig-preview-img').style.display = 'none';
            document.getElementById('sig-placeholder').style.display = 'block';
        }
        showNotification('Loaded all available info for this patient', 'success');
    } else {
        // Clear non-autofilled fields if no saved record exists
        document.getElementById('rec-indoor-no').value = '';
        document.getElementById('rec-ward-no').value = '';
        document.getElementById('rec-religion').value = '';
        document.getElementById('rec-toa').value = '';
        document.getElementById('rec-tod').value = '';
        document.querySelectorAll('input[name="rec-result"]').forEach(r => {
            r.checked = false;
            r.wasChecked = false;
        });
        document.getElementById('rec-witness-name').value = '';
        document.getElementById('rec-rel-name').value = '';
        document.getElementById('sig-preview-img').src = '';
        document.getElementById('sig-preview-img').style.display = 'none';
        document.getElementById('sig-placeholder').style.display = 'block';
    }

    populatePatientJourney(currentRecordPatientId, p);
}

function handleSignatureUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgEl = document.getElementById('sig-preview-img');
            imgEl.src = e.target.result;
            imgEl.style.display = 'block';
            document.getElementById('sig-placeholder').style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function savePatientRecord() {
    if (!currentRecordPatientId) return;

    const resultEl = document.querySelector('input[name="rec-result"]:checked');
    
    const recordData = {
        indoor_no: document.getElementById('rec-indoor-no').value,
        ward_no: document.getElementById('rec-ward-no').value,
        religion: document.getElementById('rec-religion').value,
        toa: document.getElementById('rec-toa').value,
        dod: document.getElementById('rec-dod').value,
        tod: document.getElementById('rec-tod').value,
        provisional: document.getElementById('rec-provisional').value,
        final: document.getElementById('rec-final').value,
        result: resultEl ? resultEl.value : '',
        witness_name: document.getElementById('rec-witness-name').value,
        witness_address: document.getElementById('rec-witness-address').value,
        witness_date: document.getElementById('rec-witness-date').value,
        witness_place: document.getElementById('rec-witness-place').value,
        rel_name: document.getElementById('rec-rel-name').value,
        rel_name: document.getElementById('rec-rel-name').value,
        rel_address: document.getElementById('rec-rel-address').value,
        rel_date: document.getElementById('rec-rel-date').value,
        rel_place: document.getElementById('rec-rel-place').value,
        signature: document.getElementById('sig-preview-img').src
    };

    const records = JSON.parse(localStorage.getItem('patient_records') || '{}');
    records[currentRecordPatientId] = recordData;
    localStorage.setItem('patient_records', JSON.stringify(records));

    showNotification('Patient case record saved successfully!', 'success');
}

function toggleRadioDeSelection(radio) {
    if (radio.wasChecked) {
        radio.checked = false;
        radio.wasChecked = false;
    } else {
        const name = radio.name;
        document.querySelectorAll('input[name="' + name + '"]').forEach(r => r.wasChecked = false);
        radio.wasChecked = true;
    }
}

async function populatePatientJourney(patientId, p) {
    // 1. Bed Stay history
    const bedHistoryTbody = document.getElementById('journey-bed-history');
    if (bedHistoryTbody) {
        if (p && p.bedHistory && p.bedHistory.length > 0) {
            bedHistoryTbody.innerHTML = p.bedHistory.map(b => {
                const start = b.start_date ? new Date(b.start_date).toLocaleDateString() : '-';
                const end = b.end_date ? new Date(b.end_date).toLocaleDateString() : 'Present';
                return `
                    <tr>
                        <td style="padding:6px; border:1px solid #cbd5e1;">${b.ward_type}</td>
                        <td style="padding:6px; border:1px solid #cbd5e1;">${b.bed_no}</td>
                        <td style="padding:6px; border:1px solid #cbd5e1;">${start}</td>
                        <td style="padding:6px; border:1px solid #cbd5e1;">${end}</td>
                        <td style="padding:6px; border:1px solid #cbd5e1; text-align:right;">₹${b.daily_charge || 0}</td>
                    </tr>
                `;
            }).join('');
        } else if (p) {
            // Render at least current admission bed stay
            const currentCharge = p.daily_charges || p.dailyCharge || 0;
            const start = p.admission_date ? new Date(p.admission_date).toLocaleDateString() : '-';
            bedHistoryTbody.innerHTML = `
                <tr>
                    <td style="padding:6px; border:1px solid #cbd5e1;">${p.ward_type || 'General Ward'}</td>
                    <td style="padding:6px; border:1px solid #cbd5e1;">${p.bed_no || '-'}</td>
                    <td style="padding:6px; border:1px solid #cbd5e1;">${start}</td>
                    <td style="padding:6px; border:1px solid #cbd5e1;">Present</td>
                    <td style="padding:6px; border:1px solid #cbd5e1; text-align:right;">₹${currentCharge}</td>
                </tr>
            `;
        } else {
            bedHistoryTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:10px; color:#cbd5e1;">No Bed Stay History found.</td></tr>`;
        }
    }

    // 2. Surgeries
    const surgeryHistoryTbody = document.getElementById('journey-surgery-history');
    if (surgeryHistoryTbody) {
        if (p && p.surgeries && p.surgeries.length > 0) {
            surgeryHistoryTbody.innerHTML = p.surgeries.map(s => {
                const date = s.surgeryDate ? new Date(s.surgeryDate).toLocaleDateString() : '-';
                const imgProof = s.guardianSignature 
                    ? `<img src="${s.guardianSignature}" style="max-height: 35px; border: 1px solid #cbd5e1; border-radius: 4px; padding: 2px; background: #fff;" alt="Sign Proof">`
                    : '<span style="color:#cbd5e1; font-style:italic;">No Proof</span>';
                return `
                    <tr>
                        <td style="padding:6px; border:1px solid #cbd5e1; font-weight:bold;">${s.surgeryName}</td>
                        <td style="padding:6px; border:1px solid #cbd5e1;">${s.surgeonName}</td>
                        <td style="padding:6px; border:1px solid #cbd5e1;">${date}</td>
                        <td style="padding:6px; border:1px solid #cbd5e1; text-align:right;">₹${s.cost || 0}</td>
                        <td style="padding:6px; border:1px solid #cbd5e1; text-align:center;">${imgProof}</td>
                    </tr>
                `;
            }).join('');
        } else {
            surgeryHistoryTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:10px; color:#cbd5e1;">No surgical procedures recorded.</td></tr>`;
        }
    }

    // 3. Vitals & Medications from Daily Notes API
    try {
        const response = await fetch(`${API_BASE}notes/${patientId}`, {
            headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
        });
        const result = await response.json();
        if (result.success) {
            const vitals = result.notes.filter(n => n.type === 'vitals');
            const meds = result.notes.filter(n => n.type === 'medication');

            // Vitals
            const vitalsTbody = document.getElementById('journey-vitals-history');
            if (vitalsTbody) {
                if (vitals.length > 0) {
                    vitals.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
                    vitalsTbody.innerHTML = vitals.map(v => `
                        <tr>
                            <td style="padding:5px; border:1px solid #cbd5e1;">${v.date} ${v.time}</td>
                            <td style="padding:5px; border:1px solid #cbd5e1; font-weight:bold;">${v.pulse || '-'}</td>
                            <td style="padding:5px; border:1px solid #cbd5e1;">${v.bp || '-'}</td>
                            <td style="padding:5px; border:1px solid #cbd5e1;">${v.temp || '-'}</td>
                            <td style="padding:5px; border:1px solid #cbd5e1;">${v.spo2 || '-'}</td>
                            <td style="padding:5px; border:1px solid #cbd5e1;">${v.rbs || '-'}</td>
                            <td style="padding:5px; border:1px solid #cbd5e1; color:#4a5568;">${v.addedBy}</td>
                        </tr>
                    `).join('');
                } else {
                    vitalsTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:10px; color:#cbd5e1;">No clinical observations charted.</td></tr>`;
                }
            }

            // Medications
            const medsTbody = document.getElementById('journey-meds-history');
            if (medsTbody) {
                if (meds.length > 0) {
                    meds.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
                    medsTbody.innerHTML = meds.map(m => {
                        const isGiven = m.status !== 'Pending';
                        const statusText = isGiven 
                            ? `<span style="color:#10b981; font-weight:bold;"><i class="fas fa-check-double"></i> Given</span>`
                            : `<span style="color:#f59e0b; font-weight:bold;"><i class="fas fa-clock"></i> Scheduled</span>`;
                        const doneDetails = isGiven
                            ? `${m.doneBy} on ${m.doneTime}`
                            : '-';
                        return `
                            <tr>
                                <td style="padding:5px; border:1px solid #cbd5e1;">${m.date} ${m.time}</td>
                                <td style="padding:5px; border:1px solid #cbd5e1; font-weight:bold;">${m.drugName}</td>
                                <td style="padding:5px; border:1px solid #cbd5e1;">${m.medType || 'Medicine'} (${m.dose})</td>
                                <td style="padding:5px; border:1px solid #cbd5e1;">${statusText}</td>
                                <td style="padding:5px; border:1px solid #cbd5e1; font-size:10px; color:#4a5568;">${doneDetails}</td>
                            </tr>
                        `;
                    }).join('');
                } else {
                    medsTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:10px; color:#cbd5e1;">No medications prescribed.</td></tr>`;
                }
            }
        }
    } catch (err) {
        console.error("Error populating clinical journey history:", err);
    }

    // 4. Billings & Financial ledger
    try {
        const billingRes = await fetch(`${API_BASE}billing`, {
            headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
        });
        const bResult = await billingRes.json();
        if (bResult.success) {
            const patientBill = bResult.billings.find(b => b.patient_id === patientId);
            if (patientBill) {
                // Payments
                const ledgerTbody = document.getElementById('journey-financial-history');
                if (ledgerTbody) {
                    if (patientBill.payments && patientBill.payments.length > 0) {
                        ledgerTbody.innerHTML = patientBill.payments.map(pay => `
                            <tr>
                                <td style="padding:5px; border-bottom: 1px solid #e2e8f0;">${pay.date}</td>
                                <td style="padding:5px; border-bottom: 1px solid #e2e8f0; font-weight:bold;">${pay.mode}</td>
                                <td style="padding:5px; border-bottom: 1px solid #e2e8f0; text-align:right; font-weight:bold; color:#10b981;">₹${pay.amount}</td>
                            </tr>
                        `).join('');
                    } else {
                        ledgerTbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:10px; color:#cbd5e1;">No payments received yet.</td></tr>`;
                    }
                }

                // Billing totals
                const disc = parseFloat(patientBill.discount) || 0;
                const totalPaid = (patientBill.payments || []).reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
                const grandTotal = parseFloat(patientBill.grandTotal) || (p ? p.totalBill : 0) || 0;
                const netPayable = grandTotal - disc;
                const balDue = netPayable - totalPaid;

                document.getElementById('j-total-bill').textContent = `₹${grandTotal}`;
                document.getElementById('j-discount').textContent = `₹${disc}`;
                document.getElementById('j-net-payable').textContent = `₹${netPayable}`;
                document.getElementById('j-total-paid').textContent = `₹${totalPaid}`;
                
                const balDueEl = document.getElementById('j-balance-due');
                balDueEl.textContent = `₹${balDue}`;
                if (balDue > 0) {
                    balDueEl.style.color = '#ef4444';
                } else {
                    balDueEl.style.color = '#10b981';
                }
            } else {
                // Fallback if no bill exists
                const grandTotal = (p ? p.totalBill : 0) || 0;
                const totalPaid = (p ? p.paid_amount : 0) || 0;
                const balDue = (p ? p.pending_amount : 0) || 0;
                document.getElementById('j-total-bill').textContent = `₹${grandTotal}`;
                document.getElementById('j-discount').textContent = `₹0`;
                document.getElementById('j-net-payable').textContent = `₹${grandTotal}`;
                document.getElementById('j-total-paid').textContent = `₹${totalPaid}`;
                document.getElementById('j-balance-due').textContent = `₹${balDue}`;
                
                const ledgerTbody = document.getElementById('journey-financial-history');
                if (ledgerTbody) {
                    ledgerTbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:10px; color:#cbd5e1;">No financial ledger recorded in Billing.</td></tr>`;
                }
            }
        }
    } catch (err) {
        console.error("Error populating billing journey history:", err);
    }
}

