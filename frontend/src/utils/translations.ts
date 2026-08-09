// MedLink India — Multi-Lingual Translation Dictionary (English, Hindi, Gujarati)

export type Language = 'en' | 'hi' | 'gu';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Header
    brandName: 'MedLink India',
    tagline: 'Healthcare Operating System',
    logout: 'Logout',
    profile: 'Profile',
    demoLogin: 'Quick Demo Login',
    signIn: 'Sign In',
    register: 'Create Account',
    language: 'Language',

    // Role Labels
    role_PATIENT: 'Citizen / Patient',
    role_DOCTOR: 'Doctor / Practitioner',
    role_HOSPITAL_ADMIN: 'Hospital Management',
    role_LAB_TECHNICIAN: 'Diagnostic Lab',
    role_PHARMACIST: 'E-Pharmacy Supply',
    role_AMBULANCE_DRIVER: 'Ambulance Fleet',
    role_BLOOD_BANK_MANAGER: 'Blood Bank Radar',
    role_INSURANCE_TPA: 'Insurance TPA',
    role_GOVT_OFFICIAL: 'Government Health',
    role_NGO_WORKER: 'NGO & Rural Outreach',
    role_PLATFORM_ADMIN: 'Platform Admin',
    role_SUPER_ADMIN: 'Super Admin Console',

    // Common Actions & Badges
    sosButton: '🚨 1-Tap Emergency SOS Panic',
    aiSymptomCheck: '🧠 AI Symptom Check',
    bookAppointment: '📅 Book Appointment',
    abhaVault: '🛡️ ABHA Health Vault',
    cancel: 'Cancel',
    save: 'Save Changes',
    confirm: 'Confirm',
    submit: 'Submit',
    status: 'Status',
    date: 'Date',
    time: 'Time',
    actions: 'Actions',

    // Patient Dashboard
    welcomeBack: 'Welcome back',
    patientSubtitle: 'Your health dashboard — everything at a glance',
    upcoming: 'Upcoming Appointments',
    completed: 'Completed Visits',
    activeRx: 'Active Prescriptions',
    vaultRecords: 'Vault Records',
    overview: 'Overview',
    appointments: 'Appointments',
    prescriptions: 'Prescriptions',
    noAppointments: 'No upcoming appointments',

    // Doctor Dashboard
    doctorGreeting: 'Good Day',
    todaysQueue: "Today's OPD Queue",
    totalConsultations: 'Total Consultations',
    rating: 'Rating',
    inProgress: 'IN PROGRESS',
    writeRx: 'Write Prescription',
    completeConsultation: 'Complete',
    startConsultation: 'Start Consult',

    // Hospital Dashboard
    hospitalTitle: '🏥 Hospital & ER Trauma Bay Control Room',
    hospitalSubtitle: 'Real-time bed availability matrix & pre-arrival trauma bay alerts',
    wardBeds: 'Available Ward Beds',
    icuBeds: 'Available ICU Beds',
    oxygenBeds: 'Available Oxygen Beds',
    updateBeds: 'Update Bed Availability',

    // Ambulance Dashboard
    ambulanceTitle: '🚑 Ambulance Live GPS Dispatch Radar',
    ambulanceSubtitle: 'Real-time fleet tracking, emergency triangulation & ETA routing',
    dispatchAmbulance: 'Dispatch Ambulance',
    markArrived: 'Mark Arrived at Scene',

    // Blood Bank Dashboard
    bloodTitle: '🩸 Blood Bank Network Radar',
    bloodSubtitle: 'Real-time stock tracking of A+, B+, O-ve, AB+, Plasma & Platelets',
    urgentBloodSos: 'Urgent Blood Request SOS',

    // Diagnostic Lab Dashboard
    labTitle: '🧪 Diagnostic Lab Control Portal',
    labSubtitle: 'Direct lab-to-vault report pushing with critical metric escalation alarms',
    newReport: 'New Lab Report',
    pushToVault: 'Push to Vault',

    // E-Pharmacy Dashboard
    pharmacyTitle: '💊 E-Pharmacy & Cold-Chain Supply Desk',
    pharmacySubtitle: 'Prescription verification, order fulfillment & 60-day batch expiry alerts',
    fulfillOrder: 'Fulfill New Order',
    expiringAlert: 'EXPIRING SOON',

    // Insurance Dashboard
    insuranceTitle: '📜 Insurance TPA Cashless Claim Engine',
    insuranceSubtitle: 'Automated paperless pre-authorization & fraud-prevention audit logs',
    submitClaim: 'Submit Cashless Claim',
    preApproved: 'Pre-Approved',

    // Government Health Dashboard
    govtTitle: '🏛️ Government Public Health & Epidemic Analytics',
    govtSubtitle: 'Anonymous disease heatmaps, epidemic outbreak tracking & district resource allocation index',
    reportOutbreak: 'Report Disease Outbreak',
    activeCases: 'Active Reported Cases',

    // Super Admin Dashboard
    adminTitle: '🛡️ Super Admin & Platform Monetization Console',
    adminSubtitle: 'SaaS subscriptions, transaction commissions, ABDM node health & cryptographic audit logs',
    saasRevenue: 'Monthly SaaS Revenue',
    claimCommission: 'Claim Processing Fee',
    abdmNodes: 'Active ABDM Nodes',
  },

  hi: {
    // Brand & Header
    brandName: 'मेडलिंक इंडिया',
    tagline: 'हेल्थकेयर ऑपरेटिंग सिस्टम',
    logout: 'लॉग आउट',
    profile: 'प्रोफ़ाइल',
    demoLogin: 'त्वरित डेमो लॉगिन',
    signIn: 'साइन इन करें',
    register: 'नया खाता बनाएं',
    language: 'भाषा',

    // Role Labels
    role_PATIENT: 'नागरिक / रोगी',
    role_DOCTOR: 'डॉक्टर / चिकित्सक',
    role_HOSPITAL_ADMIN: 'अस्पताल प्रबंधन',
    role_LAB_TECHNICIAN: 'लैब पैथोलॉजी',
    role_PHARMACIST: 'ई-फार्मेसी आपूर्ति',
    role_AMBULANCE_DRIVER: 'एम्बुलेंस बेड़ा',
    role_BLOOD_BANK_MANAGER: 'ब्लड बैंक नेटवर्क',
    role_INSURANCE_TPA: 'बीमा टीपीए',
    role_GOVT_OFFICIAL: 'सरकारी स्वास्थ्य',
    role_NGO_WORKER: 'एनजीओ और ग्रामीण सेवा',
    role_PLATFORM_ADMIN: 'प्लेटफॉर्म एडमिन',
    role_SUPER_ADMIN: 'सुपर एडमिन कंसोल',

    // Common Actions & Badges
    sosButton: '🚨 1-टैप आपातकालीन SOS पैनिक',
    aiSymptomCheck: '🧠 AI लक्षण जांच (Symptom Check)',
    bookAppointment: '📅 अपॉइंटमेंट बुक करें',
    abhaVault: '🛡️ आभा स्वास्थ्य वॉल्ट',
    cancel: 'रद्द करें',
    save: 'बदलाव सहेजें',
    confirm: 'पुष्टि करें',
    submit: 'जमा करें',
    status: 'स्थिति',
    date: 'तिथि',
    time: 'समय',
    actions: 'कार्रवाई',

    // Patient Dashboard
    welcomeBack: 'आपका स्वागत है',
    patientSubtitle: 'आपका स्वास्थ्य डैशबोर्ड — सब कुछ एक नज़र में',
    upcoming: 'आगामी अपॉइंटमेंट',
    completed: 'पूरे किए गए परामर्श',
    activeRx: 'सक्रिय दवा पर्ची (Rx)',
    vaultRecords: 'वॉल्ट रिकॉर्ड्स',
    overview: 'अवलोकन (Overview)',
    appointments: 'अपॉइंटमेंट्स',
    prescriptions: 'दवा पर्चियां',
    noAppointments: 'कोई आगामी अपॉइंटमेंट नहीं है',

    // Doctor Dashboard
    doctorGreeting: 'नमस्ते',
    todaysQueue: 'आज की OPD कतार (Queue)',
    totalConsultations: 'कुल परामर्श',
    rating: 'रेटिंग',
    inProgress: 'परामर्श जारी है',
    writeRx: 'दवा पर्ची (Rx) लिखें',
    completeConsultation: 'पूरा करें',
    startConsultation: 'शुरू करें',

    // Hospital Dashboard
    hospitalTitle: '🏥 अस्पताल एवं ER आघात केंद्र नियंत्रण कक्ष',
    hospitalSubtitle: 'वास्तविक समय बिस्तर उपलब्धता एवं आपातकालीन चेतावनी',
    wardBeds: 'उपलब्ध वार्ड बेड',
    icuBeds: 'उपलब्ध ICU बेड',
    oxygenBeds: 'उपलब्ध ऑक्सीजन बेड',
    updateBeds: 'बिस्तर उपलब्धता अपडेट करें',

    // Ambulance Dashboard
    ambulanceTitle: '🚑 एम्बुलेंस लाइव GPS ट्रैकिंग और प्रेषण',
    ambulanceSubtitle: 'वास्तविक समय बेड़ा ट्रैकिंग एवं आपातकालीन नेविगेशन',
    dispatchAmbulance: 'एम्बुलेंस भेजें',
    markArrived: 'घटनास्थल पर पहुंचे',

    // Blood Bank Dashboard
    bloodTitle: '🩸 ब्लड बैंक नेटवर्क लाइव रडार',
    bloodSubtitle: 'A+, B+, O-ve, AB+, प्लाज्मा और प्लेटलेट्स का सीधा स्टॉक',
    urgentBloodSos: 'तत्काल रक्त मांग SOS',

    // Diagnostic Lab Dashboard
    labTitle: '🧪 डायग्नोस्टिक लैब कंट्रोल पोर्टल',
    labSubtitle: 'आभा वॉल्ट में सीधी रिपोर्ट और गंभीर अलर्ट सिस्टम',
    newReport: 'नई लैब रिपोर्ट',
    pushToVault: 'वॉल्ट में भेजें',

    // E-Pharmacy Dashboard
    pharmacyTitle: '💊 ई-फार्मेसी और आपूर्ति प्रबंधन',
    pharmacySubtitle: 'पर्चा सत्यापन, ऑर्डर पूर्ति और 60-दिवसीय समाप्ति अलर्ट',
    fulfillOrder: 'नया ऑर्डर पूरा करें',
    expiringAlert: 'जल्द समाप्त होने वाला है',

    // Insurance Dashboard
    insuranceTitle: '📜 बीमा TPA कैशलेस क्लेम इंजन',
    insuranceSubtitle: 'स्वचालित पेपरलेस पूर्व-स्वीकृति और धोखाधड़ी रोकथाम',
    submitClaim: 'कैशलेस क्लेम जमा करें',
    preApproved: 'पूर्व-स्वीकृत',

    // Government Health Dashboard
    govtTitle: '🏛️ सरकारी जनस्वास्थ्य एवं महामारी विश्लेषण',
    govtSubtitle: 'गुमनाम बीमारी मानचित्र, प्रकोप ट्रैकिंग और जिला संसाधन आवंटन',
    reportOutbreak: 'बीमारी प्रकोप रिपोर्ट करें',
    activeCases: 'सक्रिय दर्ज मामले',

    // Super Admin Dashboard
    adminTitle: '🛡️ सुपर एडमिन एवं राजस्व कंसोल',
    adminSubtitle: 'SaaS सदस्यता, लेनदेन कमीशन और सुरक्षा ऑडिट लॉग्स',
    saasRevenue: 'मासिक SaaS राजस्व',
    claimCommission: 'क्लेम प्रोसेसिंग शुल्क',
    abdmNodes: 'सक्रिय ABDM नोड्स',
  },

  gu: {
    // Brand & Header
    brandName: 'મેડલિંક ઇન્ડિયા',
    tagline: 'હેલ્થકેર ઓપરેટિંગ સિસ્ટમ',
    logout: 'લૉગ આઉટ',
    profile: 'પ્રોફાઇલ',
    demoLogin: 'ઝડપી ડેમો લૉગિન',
    signIn: 'સાઇન ઇન કરો',
    register: 'નવું ખાતું બનાવો',
    language: 'ભાષા',

    // Role Labels
    role_PATIENT: 'નાગરિક / દર્દી',
    role_DOCTOR: 'ડૉક્ટર / તબીબ',
    role_HOSPITAL_ADMIN: 'હોસ્પિટલ વ્યવસ્થાપન',
    role_LAB_TECHNICIAN: 'ડાયગ્નોસ્ટિક લેબ',
    role_PHARMACIST: 'ઈ-ફાર્મસી સપ્લાય',
    role_AMBULANCE_DRIVER: 'એમ્બ્યુલન્સ ફ્લીટ',
    role_BLOOD_BANK_MANAGER: 'બ્લડ બેંક નેટવર્ક',
    role_INSURANCE_TPA: 'વીમા TPA',
    role_GOVT_OFFICIAL: 'સરકારી આરોગ્ય',
    role_NGO_WORKER: 'એનજીઓ અને ગ્રામીણ સેવા',
    role_PLATFORM_ADMIN: 'પ્લેટફોર્મ એડમિન',
    role_SUPER_ADMIN: 'સુપર એડમિન કન્સોલ',

    // Common Actions & Badges
    sosButton: '🚨 1-ટેપ કટોકટી SOS પેનિક',
    aiSymptomCheck: '🧠 AI લક્ષણ તપાસ (Symptom Check)',
    bookAppointment: '📅 એપોઇન્ટમેન્ટ બુક કરો',
    abhaVault: '🛡️ આભા હેલ્થ વોલ્ટ',
    cancel: 'રદ કરો',
    save: 'ફેરફારો સાચવો',
    confirm: 'ખરી ખાતરી કરો',
    submit: 'સબમિટ કરો',
    status: 'સ્થિતિ',
    date: 'તારીખ',
    time: 'સમય',
    actions: 'પગલાં',

    // Patient Dashboard
    welcomeBack: 'તમારું સ્વાગત છે',
    patientSubtitle: 'તમારું સ્વાસ્થ્ય ડેશબોર્ડ — બધું એક નજરમાં',
    upcoming: 'આગામી એપોઇન્ટમેન્ટ',
    completed: 'પૂર્ણ થયેલ મુલાકાતો',
    activeRx: 'સક્રિય દવા પ્રિસ્ક્રિપ્શન',
    vaultRecords: 'વોલ્ટ રેકોર્ડ્સ',
    overview: 'ઓવરવ્યુ',
    appointments: 'એપોઇન્ટમેન્ટ્સ',
    prescriptions: 'દવાઓ',
    noAppointments: 'કોઈ આગામી એપોઇન્ટમેન્ટ નથી',

    // Doctor Dashboard
    doctorGreeting: 'નમસ્તે',
    todaysQueue: 'આજની OPD કતાર (Queue)',
    totalConsultations: 'કુલ પરામર્શ',
    rating: 'રેટિંગ',
    inProgress: 'પરામર્શ ચાલુ છે',
    writeRx: 'દવા ચિઠ્ઠી (Rx) લખો',
    completeConsultation: 'પૂર્ણ કરો',
    startConsultation: 'શરૂ કરો',

    // Hospital Dashboard
    hospitalTitle: '🏥 હોસ્પિટલ અને ઈમરજન્સી કંટ્રોલ રૂમ',
    hospitalSubtitle: 'રીઅલ-ટાઇમ બેડ ઉપલબ્ધતા અને ઇમરજન્સી એલર્ટ',
    wardBeds: 'ઉપલબ્ધ વોર્ડ બેડ',
    icuBeds: 'ઉપલબ્ધ ICU બેડ',
    oxygenBeds: 'ઉપલબ્ધ ઓક્સિજન બેડ',
    updateBeds: 'બેડ ઉપલબ્ધતા અપડેટ કરો',

    // Ambulance Dashboard
    ambulanceTitle: '🚑 એમ્બ્યુલન્સ લાઈવ GPS ટ્રેકિંગ',
    ambulanceSubtitle: 'રીઅલ-ટાઇમ ફ્લીટ ટ્રેકિંગ અને ઈમરજન્સી નેવિગેશન',
    dispatchAmbulance: 'એમ્બ્યુલન્સ મોકલો',
    markArrived: 'સ્થળ પર પહોંચ્યા',

    // Blood Bank Dashboard
    bloodTitle: '🩸 બ્લડ બેંક નેટવર્ક લાઈવ રડાર',
    bloodSubtitle: 'A+, B+, O-ve, AB+, પ્લાઝમા અને પ્લેટલેટ્સ સ્ટોક',
    urgentBloodSos: 'તાત્કાલિક રક્ત વિનંતી SOS',

    // Diagnostic Lab Dashboard
    labTitle: '🧪 ડાયગ્નોસ્ટિક લેબ કંટ્રોલ પોર્ટલ',
    labSubtitle: 'આભા વોલ્ટમાં સીધો રિપોર્ટ અને એલર્ટ સિસ્ટમ',
    newReport: 'નવો લેબ રિપોર્ટ',
    pushToVault: 'વોલ્ટમાં મોકલો',

    // E-Pharmacy Dashboard
    pharmacyTitle: '💊 ઈ-ફાર્મસી અને સપ્લાય મેનેજમેન્ટ',
    pharmacySubtitle: 'દવા ચકાસણી, ઓર્ડર પરિપૂર્તિ અને 60-દિવસીય સમાપ્તિ એલર્ટ',
    fulfillOrder: 'નવો ઓર્ડર પૂર્ણ કરો',
    expiringAlert: 'ટૂંક સમયમાં સમાપ્ત થાય છે',

    // Insurance Dashboard
    insuranceTitle: '📜 વીમા TPA કેશલેસ ક્લેમ એન્જિન',
    insuranceSubtitle: 'સ્વચાલિત પેપરલેસ પૂર્વ-મંજૂરી અને ઓડિટ લોગ',
    submitClaim: 'કેશલેસ ક્લેમ સબમિટ કરો',
    preApproved: 'પૂર્વ-મંજૂર',

    // Government Health Dashboard
    govtTitle: '🏛️ સરકારી જાહેર આરોગ્ય અને રોગચાળા વિશ્લેષણ',
    govtSubtitle: 'રોગચાળા ટ્રેકિંગ અને જિલ્લા સંસાધન ફાળવણી',
    reportOutbreak: 'રોગચાળો રિપોર્ટ કરો',
    activeCases: 'સક્રિય નોંધાયેલા કેસ',

    // Super Admin Dashboard
    adminTitle: '🛡️ સુપર એડમિન અને પ્લેટફોર્મ કન્સોલ',
    adminSubtitle: 'SaaS સબ્સ્ક્રિપ્શન, કમિશન અને સુરક્ષા ઓડિટ લોગ',
    saasRevenue: 'માસિક SaaS આવક',
    claimCommission: 'ક્લેમ પ્રોસેસિંગ ફી',
    abdmNodes: 'સક્રિય ABDM નોડ્સ',
  },
};
