/**
 * ============================================================================
 * BLOODBRIDGE — CORE APPLICATION JAVASCRIPT
 * HTML + CSS + Vanilla JavaScript ONLY (Zero External Dependencies)
 * Local Storage Lifeline Prototype
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. CONFIGURATION & CONSTANTS
     ========================================================================== */
  const STORAGE_KEYS = {
    DONORS: 'bloodBridgeDonors',
    SEARCH_HISTORY: 'bloodBridgeSearchHistory',
    ADMIN_SESSION: 'bloodBridgeAdminSession',
    SHEET_URL: 'bloodBridgeSheetUrl'
  };

  /**
   * Cryptographic SHA-256 Administrative Hashes
   * No plaintext passwords or emails exist anywhere in this source code.
   * Authentication is validated via one-way cryptographic SHA-256 comparison.
   */
  const ADMIN_CONFIG = {
    EMAIL_HASH: 'f85718f939b3fd436e931442de19a854e3e9737bb54e255e4d339484d44cbc3c',
    PASSWORD_HASH: 'a4ae36f1be2ce5316b5c7cbca1e18276e67fd6dec830b37db47c340b7c5a4754'
  };

  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  /* ==========================================================================
     2. GEOGRAPHIC DATA: INDIAN STATES & DISTRICTS
     ========================================================================== */
  const INDIA_LOCATIONS = {
    "Andhra Pradesh": [
      "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla", 
      "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur", 
      "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam", 
      "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Srikakulam", "Tirupati", 
      "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"
    ],
    "Telangana": [
      "Adilabad", "Bhadradri Kothagudem", "Hanamkonda", "Hyderabad", "Jagtial", 
      "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", 
      "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", 
      "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", 
      "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", 
      "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"
    ],
    "Karnataka": [
      "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", 
      "Bidar", "Chamarajanagara", "Chikkaballapura", "Chikkamagaluru", "Chitradurga", 
      "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", 
      "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", 
      "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"
    ],
    "Tamil Nadu": [
      "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
      "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", 
      "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", 
      "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", 
      "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", 
      "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", 
      "Viluppuram", "Virudhunagar"
    ],
    "Maharashtra": [
      "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", 
      "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", 
      "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", 
      "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", 
      "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", 
      "Washim", "Yavatmal"
    ],
    "Kerala": [
      "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", 
      "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", 
      "Thrissur", "Wayanad"
    ],
    "Delhi": [
      "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", 
      "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", 
      "West Delhi"
    ],
    "Gujarat": [
      "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", 
      "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", 
      "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", 
      "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", 
      "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
    ],
    "Rajasthan": [
      "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", 
      "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", 
      "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", 
      "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", 
      "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"
    ],
    "West Bengal": [
      "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", 
      "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", 
      "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", 
      "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"
    ],
    "Uttar Pradesh": [
      "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", 
      "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", 
      "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", 
      "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", 
      "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", 
      "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", 
      "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", 
      "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", 
      "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", 
      "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", 
      "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
    ],
    "Bihar": [
      "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", 
      "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", 
      "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", 
      "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", 
      "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", 
      "Supaul", "Vaishali", "West Champaran"
    ],
    "Odisha": [
      "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", 
      "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", 
      "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", 
      "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", 
      "Subarnapur", "Sundargarh"
    ],
    "Madhya Pradesh": [
      "Bhopal", "Gwalior", "Indore", "Jabalpur", "Ujjain", "Sagar", "Rewa", "Satna", 
      "Ratlam", "Dewas", "Chhindwara", "Shivpuri", "Vidisha", "Khandwa", "Khargone"
    ],
    "Punjab": [
      "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", 
      "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", 
      "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar (Mohali)", 
      "Sangrur", "Shahid Bhagat Singh Nagar", "Tarn Taran"
    ],
    "Haryana": [
      "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", 
      "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", 
      "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"
    ],
    "Assam": [
      "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", 
      "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", 
      "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", 
      "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", 
      "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"
    ],
    "Goa": [
      "North Goa", "South Goa"
    ],
    "Jharkhand": [
      "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", 
      "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", 
      "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", 
      "Seraikela Kharsawan", "Simdega", "West Singhbhum"
    ],
    "Chhattisgarh": [
      "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", 
      "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", 
      "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", 
      "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"
    ],
    "Uttarakhand": [
      "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", 
      "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"
    ],
    "Himachal Pradesh": [
      "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", 
      "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
    ]
  };

  /* ==========================================================
     3. INITIAL SEED / DEMO DONORS
     ========================================================== */
  const SAMPLE_DONORS = [
    {
      id: "BB000001",
      registrationDate: "2026-01-10T10:30:00.000Z",
      lastUpdated: "2026-01-10T10:30:00.000Z",
      fullName: "Ravi Kumar",
      bloodGroup: "O+",
      mobile: "9876543210",
      email: "ravi.kumar@example.com",
      country: "India",
      state: "Andhra Pradesh",
      district: "West Godavari",
      city: "Bhimavaram",
      area: "Bhimavaram Town, Gandhi Nagar",
      lastDonationDate: "2025-08-15",
      nextAvailableDate: "2025-11-15",
      availability: "Available",
      adminStatus: "ACTIVE",
      consent: true,
      notes: "Verified donor. Regular volunteer at community camps."
    },
    {
      id: "BB000002",
      registrationDate: "2026-01-15T11:20:00.000Z",
      lastUpdated: "2026-01-15T11:20:00.000Z",
      fullName: "Priya Sharma",
      bloodGroup: "A+",
      mobile: "9848022338",
      email: "priya.sharma@example.com",
      country: "India",
      state: "Telangana",
      district: "Hyderabad",
      city: "Hyderabad",
      area: "Madhapur, HITEC City",
      lastDonationDate: "2025-10-01",
      nextAvailableDate: "2026-01-01",
      availability: "Available this week",
      adminStatus: "ACTIVE",
      consent: true,
      notes: "Available on weekends and evenings."
    },
    {
      id: "BB000003",
      registrationDate: "2026-02-01T09:15:00.000Z",
      lastUpdated: "2026-02-01T09:15:00.000Z",
      fullName: "K. Venkatesh",
      bloodGroup: "O-",
      mobile: "9440123456",
      email: "k.venkat@example.com",
      country: "India",
      state: "Andhra Pradesh",
      district: "West Godavari",
      city: "Bhimavaram",
      area: "J.P. Road, Near Bus Stand",
      lastDonationDate: "2025-07-20",
      nextAvailableDate: "2025-10-20",
      availability: "Available",
      adminStatus: "ACTIVE",
      consent: true,
      notes: "Universal donor O- negative."
    },
    {
      id: "BB000004",
      registrationDate: "2026-02-10T14:45:00.000Z",
      lastUpdated: "2026-02-10T14:45:00.000Z",
      fullName: "Anita Desai",
      bloodGroup: "B+",
      mobile: "9980345678",
      email: "anita.desai@example.com",
      country: "India",
      state: "Karnataka",
      district: "Bengaluru Urban",
      city: "Bengaluru",
      area: "Indiranagar 100ft Road",
      lastDonationDate: "2025-11-10",
      nextAvailableDate: "2026-02-10",
      availability: "Available",
      adminStatus: "ACTIVE",
      consent: true,
      notes: "Ready for emergency calls."
    },
    {
      id: "BB000005",
      registrationDate: "2026-02-15T16:00:00.000Z",
      lastUpdated: "2026-02-15T16:00:00.000Z",
      fullName: "Vikram Singhania",
      bloodGroup: "AB+",
      mobile: "9820198765",
      email: "vikram.s@example.com",
      country: "India",
      state: "Maharashtra",
      district: "Mumbai Suburban",
      city: "Mumbai",
      area: "Andheri West",
      lastDonationDate: "2025-09-05",
      nextAvailableDate: "2025-12-05",
      availability: "Contact me first",
      adminStatus: "ACTIVE",
      consent: true,
      notes: "Please call after office hours."
    },
    {
      id: "BB000006",
      registrationDate: "2026-02-20T12:00:00.000Z",
      lastUpdated: "2026-02-20T12:00:00.000Z",
      fullName: "Suresh Babu",
      bloodGroup: "O+",
      mobile: "9490876543",
      email: "suresh.babu@example.com",
      country: "India",
      state: "Andhra Pradesh",
      district: "East Godavari",
      city: "Rajahmundry",
      area: "Danavaipeta",
      lastDonationDate: "2026-02-05", // Recently donated! Within 3 months -> Temporarily unavailable test case
      nextAvailableDate: "2026-05-05",
      availability: "Temporarily unavailable",
      adminStatus: "ACTIVE",
      consent: true,
      notes: "Donated recently on Feb 5, 2026. 3-month waiting interval active."
    },
    {
      id: "BB000007",
      registrationDate: "2026-02-22T08:30:00.000Z",
      lastUpdated: "2026-02-22T08:30:00.000Z",
      fullName: "Deepa Nair",
      bloodGroup: "A-",
      mobile: "9447112233",
      email: "deepa.nair@example.com",
      country: "India",
      state: "Kerala",
      district: "Ernakulam",
      city: "Kochi",
      area: "Marine Drive",
      lastDonationDate: "2025-06-12",
      nextAvailableDate: "2025-09-12",
      availability: "Available",
      adminStatus: "ACTIVE",
      consent: true,
      notes: "Rare blood group registered donor."
    },
    {
      id: "BB000008",
      registrationDate: "2026-02-25T17:15:00.000Z",
      lastUpdated: "2026-02-25T17:15:00.000Z",
      fullName: "Arjun Verma",
      bloodGroup: "B-",
      mobile: "9811223344",
      email: "arjun.verma@example.com",
      country: "India",
      state: "Delhi",
      district: "South Delhi",
      city: "New Delhi",
      area: "Saket",
      lastDonationDate: "2025-10-18",
      nextAvailableDate: "2026-01-18",
      availability: "Available this week",
      adminStatus: "ACTIVE",
      consent: true,
      notes: "Volunteer at Red Cross camp."
    }
  ];

  /* ==========================================================================
     4. STORAGE SERVICE (SAFE LOCALSTORAGE OPERATIONS)
     ========================================================================== */
  const StorageService = {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
      } catch (err) {
        console.error(`[StorageService] Failed to read "${key}" from localStorage:`, err);
        return defaultValue;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.error(`[StorageService] Failed to save "${key}" to localStorage:`, err);
        alert("Storage error: Browser localStorage limit reached or storage disabled.");
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (err) {
        console.error(`[StorageService] Failed to remove "${key}":`, err);
        return false;
      }
    },

    clearAll() {
      try {
        localStorage.removeItem(STORAGE_KEYS.DONORS);
        localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
        return true;
      } catch (err) {
        console.error("[StorageService] Failed to clear all keys:", err);
        return false;
      }
    },

    initDatabase() {
      const existing = this.get(STORAGE_KEYS.DONORS, null);
      if (!existing || !Array.isArray(existing) || existing.length === 0) {
        this.set(STORAGE_KEYS.DONORS, SAMPLE_DONORS);
      }

      const searches = this.get(STORAGE_KEYS.SEARCH_HISTORY, null);
      if (!searches || !Array.isArray(searches)) {
        this.set(STORAGE_KEYS.SEARCH_HISTORY, []);
      }
    }
  };

  /**
   * Cryptographic SHA-256 Utility
   * Computes a one-way hexadecimal hash using the Web Crypto API
   */
  async function computeSHA256(message) {
    if (!message) return '';
    try {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {
      console.warn("Web Crypto unavailable, using fallback:", e);
    }
    // Fallback simple deterministic hash if subtle crypto is unsupported
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      hash = ((hash << 5) - hash) + message.charCodeAt(i);
      hash |= 0;
    }
    return String(Math.abs(hash));
  }

  /* ==========================================================================
     5. AUTHENTICATION SERVICE (ADMIN SESSION & SHA-256 SECURITY)
     ========================================================================== */
  const AuthService = {
    isAuthenticated() {
      const session = StorageService.get(STORAGE_KEYS.ADMIN_SESSION, null);
      return session && session.authenticated === true;
    },

    getCurrentUser() {
      return StorageService.get(STORAGE_KEYS.ADMIN_SESSION, null);
    },

    async login(email, password) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      const emailHash = await computeSHA256(cleanEmail);
      const passwordHash = await computeSHA256(cleanPassword);

      if (emailHash === ADMIN_CONFIG.EMAIL_HASH && passwordHash === ADMIN_CONFIG.PASSWORD_HASH) {
        const sessionData = {
          authenticated: true,
          email: cleanEmail,
          loginTime: new Date().toISOString()
        };
        StorageService.set(STORAGE_KEYS.ADMIN_SESSION, sessionData);
        return { success: true };
      }

      return {
        success: false,
        message: 'Invalid administrator email or password.'
      };
    },

    logout() {
      StorageService.remove(STORAGE_KEYS.ADMIN_SESSION);
    }
  };

  /* ==========================================================================
     5B. GOOGLE SHEETS CLOUD SYNC SERVICE
     ========================================================================== */
  const GoogleSheetService = {
    getUrl() {
      return StorageService.get(STORAGE_KEYS.SHEET_URL, '') || '';
    },

    setUrl(url) {
      return StorageService.set(STORAGE_KEYS.SHEET_URL, (url || '').trim());
    },

    async fetchDonorsFromSheet() {
      const url = this.getUrl();
      if (!url) return null;
      try {
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const localDonors = DonorService.getAllDonors();
          const localMap = new Map();
          localDonors.forEach(d => localMap.set(d.id, d));

          data.forEach(remoteDonor => {
            if (remoteDonor && remoteDonor.id) {
              localMap.set(remoteDonor.id, {
                ...remoteDonor,
                consent: remoteDonor.consent === true || remoteDonor.consent === 'YES' || remoteDonor.consent === 'true'
              });
            }
          });

          const merged = Array.from(localMap.values());
          StorageService.set(STORAGE_KEYS.DONORS, merged);
          return merged;
        }
        return null;
      } catch (err) {
        console.warn("[GoogleSheetService] Error fetching donors:", err);
        return null;
      }
    },

    async pushDonorToSheet(donor) {
      const url = this.getUrl();
      if (!url) return false;
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(donor)
        });
        return true;
      } catch (err) {
        console.warn("[GoogleSheetService] Error pushing donor to sheet:", err);
        return false;
      }
    }
  };

  /* ==========================================================================
     6. DONOR SERVICE (CRUD, 3-MONTH ELIGIBILITY, ID GENERATOR)
     ========================================================================== */
  const DonorService = {
    getAllDonors() {
      return StorageService.get(STORAGE_KEYS.DONORS, []);
    },

    getDonorById(id) {
      const donors = this.getAllDonors();
      return donors.find(d => d.id === id) || null;
    },

    isDuplicateMobile(mobile, excludeId = null) {
      const donors = this.getAllDonors();
      const cleanMobile = (mobile || '').replace(/\D/g, '');
      return donors.some(d => {
        if (excludeId && d.id === excludeId) return false;
        return (d.mobile || '').replace(/\D/g, '') === cleanMobile;
      });
    },

    generateDonorId() {
      const donors = this.getAllDonors();
      let maxNum = 0;
      donors.forEach(d => {
        if (d.id && d.id.startsWith('BB')) {
          const num = parseInt(d.id.replace('BB', ''), 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      });
      const nextNum = maxNum + 1;
      return 'BB' + String(nextNum).padStart(6, '0');
    },

    /**
     * 3-Month Availability Rule Calculation
     * Next Available Date = Last Donation Date + 3 months
     */
    calculateAvailabilityFromDate(lastDonationDateStr, chosenAvailability = 'Available') {
      if (!lastDonationDateStr) {
        return {
          calculatedAvailability: chosenAvailability,
          nextAvailableDate: null,
          isUnderCooldown: false,
          daysRemaining: 0
        };
      }

      const lastDate = new Date(lastDonationDateStr + 'T00:00:00');
      if (isNaN(lastDate.getTime())) {
        return {
          calculatedAvailability: chosenAvailability,
          nextAvailableDate: null,
          isUnderCooldown: false,
          daysRemaining: 0
        };
      }

      const nextDate = new Date(lastDate);
      nextDate.setMonth(nextDate.getMonth() + 3);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const nextDateIso = nextDate.toISOString().split('T')[0];

      if (today < nextDate) {
        const diffTime = nextDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
          calculatedAvailability: 'Temporarily unavailable',
          nextAvailableDate: nextDateIso,
          isUnderCooldown: true,
          daysRemaining: diffDays
        };
      }

      return {
        calculatedAvailability: chosenAvailability,
        nextAvailableDate: nextDateIso,
        isUnderCooldown: false,
        daysRemaining: 0
      };
    },

    addDonor(donorData) {
      const donors = this.getAllDonors();

      // Check duplicate mobile
      if (this.isDuplicateMobile(donorData.mobile)) {
        return {
          success: false,
          error: "Your donor record already exists with this mobile number."
        };
      }

      // Check 3-month calculation
      const availInfo = this.calculateAvailabilityFromDate(
        donorData.lastDonationDate,
        donorData.availability
      );

      const newDonor = {
        id: this.generateDonorId(),
        registrationDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        fullName: donorData.fullName.trim(),
        bloodGroup: donorData.bloodGroup,
        mobile: donorData.mobile.replace(/\D/g, ''),
        email: donorData.email.trim().toLowerCase(),
        country: donorData.country || 'India',
        state: donorData.state.trim(),
        district: donorData.district.trim(),
        city: donorData.city.trim(),
        area: (donorData.area || '').trim(),
        lastDonationDate: donorData.lastDonationDate || '',
        nextAvailableDate: availInfo.nextAvailableDate || '',
        availability: availInfo.calculatedAvailability,
        adminStatus: 'ACTIVE',
        consent: Boolean(donorData.consent),
        notes: (donorData.notes || '').trim()
      };

      donors.unshift(newDonor);
      const saved = StorageService.set(STORAGE_KEYS.DONORS, donors);

      if (saved) {
        // Asynchronously push to Google Sheets in background if URL is configured
        GoogleSheetService.pushDonorToSheet(newDonor);
        return { success: true, donor: newDonor };
      } else {
        return { success: false, error: "Failed to persist donor record into browser storage." };
      }
    },

    updateDonor(id, updatedFields) {
      const donors = this.getAllDonors();
      const index = donors.findIndex(d => d.id === id);
      if (index === -1) {
        return { success: false, error: "Donor record not found." };
      }

      // Duplicate mobile check for update
      if (updatedFields.mobile && this.isDuplicateMobile(updatedFields.mobile, id)) {
        return { success: false, error: "Another donor record already exists with this mobile number." };
      }

      const existing = donors[index];

      // Re-evaluate 3-month date if last donation date or availability changed
      let finalAvailability = updatedFields.availability || existing.availability;
      let finalNextDate = existing.nextAvailableDate;

      if (updatedFields.lastDonationDate !== undefined) {
        const availInfo = this.calculateAvailabilityFromDate(
          updatedFields.lastDonationDate,
          finalAvailability
        );
        finalAvailability = availInfo.calculatedAvailability;
        finalNextDate = availInfo.nextAvailableDate || '';
      }

      donors[index] = {
        ...existing,
        ...updatedFields,
        availability: finalAvailability,
        nextAvailableDate: finalNextDate,
        lastUpdated: new Date().toISOString()
      };

      StorageService.set(STORAGE_KEYS.DONORS, donors);
      return { success: true, donor: donors[index] };
    },

    toggleAvailability(id, newStatus) {
      return this.updateDonor(id, { availability: newStatus });
    },

    deleteDonor(id) {
      let donors = this.getAllDonors();
      const initialLength = donors.length;
      donors = donors.filter(d => d.id !== id);
      if (donors.length === initialLength) {
        return { success: false, error: "Donor ID not found." };
      }
      StorageService.set(STORAGE_KEYS.DONORS, donors);
      return { success: true };
    }
  };

  /* ==========================================================================
     7. SEARCH SERVICE (BLOOD MATCHING & SEARCH LOGGING)
     ========================================================================== */
  const SearchService = {
    getSearchHistory() {
      return StorageService.get(STORAGE_KEYS.SEARCH_HISTORY, []);
    },

    generateSearchId() {
      const history = this.getSearchHistory();
      let maxNum = 0;
      history.forEach(h => {
        if (h.id && h.id.startsWith('SRCH')) {
          const num = parseInt(h.id.replace('SRCH', ''), 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      });
      return 'SRCH' + String(maxNum + 1).padStart(6, '0');
    },

    logSearch(params, resultsCount) {
      const history = this.getSearchHistory();
      const record = {
        id: this.generateSearchId(),
        date: new Date().toISOString(),
        bloodGroup: params.bloodGroup,
        state: params.state,
        district: params.district || 'Any',
        city: params.city || 'Any',
        resultsCount: resultsCount,
        status: resultsCount > 0 ? 'MATCH_FOUND' : 'NO_MATCH'
      };
      history.unshift(record);
      // Keep up to 200 searches
      if (history.length > 200) history.pop();
      StorageService.set(STORAGE_KEYS.SEARCH_HISTORY, history);
    },

    /**
     * Search Donors with strict requirements:
     * 1. consent = true
     * 2. adminStatus = ACTIVE
     * 3. Currently available (not "Temporarily unavailable")
     * 4. Passed next availability date where applicable
     * 5. Match Blood Group, State, optional District, optional City
     */
    searchDonors(searchParams) {
      const allDonors = DonorService.getAllDonors();
      const targetGroup = (searchParams.bloodGroup || '').trim();
      const targetState = (searchParams.state || '').trim().toLowerCase();
      const targetDistrict = (searchParams.district || '').trim().toLowerCase();
      const targetCity = (searchParams.city || '').trim().toLowerCase();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const matchedDonors = allDonors.filter(donor => {
        // 1. Consent must be true
        if (donor.consent !== true) return false;

        // 2. Admin status must be ACTIVE
        if (donor.adminStatus !== 'ACTIVE') return false;

        // 3. Availability check
        if (donor.availability === 'Temporarily unavailable') return false;

        // 4. Next available date check (3-month rule)
        if (donor.nextAvailableDate) {
          const nextDate = new Date(donor.nextAvailableDate + 'T00:00:00');
          if (!isNaN(nextDate.getTime()) && today < nextDate) {
            return false;
          }
        }

        // Blood Group match
        if (donor.bloodGroup !== targetGroup) return false;

        // State match (case-insensitive & trimmed)
        const donorState = (donor.state || '').trim().toLowerCase();
        if (donorState !== targetState) return false;

        // Optional District match
        if (targetDistrict && targetDistrict !== '') {
          const donorDistrict = (donor.district || '').trim().toLowerCase();
          if (donorDistrict !== targetDistrict) return false;
        }

        // Optional City match (partial / fuzzy match or exact)
        if (targetCity && targetCity !== '') {
          const donorCity = (donor.city || '').trim().toLowerCase();
          if (!donorCity.includes(targetCity)) return false;
        }

        return true;
      });

      // Log search query & result count
      this.logSearch(searchParams, matchedDonors.length);

      return matchedDonors;
    }
  };

  /* ==========================================================================
     8. ANALYTICS SERVICE (METRICS & DATA AGGREGATION)
     ========================================================================== */
  const AnalyticsService = {
    getMetrics() {
      const donors = DonorService.getAllDonors();
      const searches = SearchService.getSearchHistory();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let availableCount = 0;
      let unavailableCount = 0;
      let blockedCount = 0;

      const bloodGroupCounts = {
        'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
        'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0
      };

      const stateCounts = {};

      donors.forEach(d => {
        // Status counts
        if (d.adminStatus === 'BLOCKED') {
          blockedCount++;
        } else {
          // Check availability
          let isAvail = false;
          if (d.consent === true && d.adminStatus === 'ACTIVE' && d.availability !== 'Temporarily unavailable') {
            if (d.nextAvailableDate) {
              const nd = new Date(d.nextAvailableDate + 'T00:00:00');
              isAvail = isNaN(nd.getTime()) || today >= nd;
            } else {
              isAvail = true;
            }
          }

          if (isAvail) {
            availableCount++;
          } else {
            unavailableCount++;
          }
        }

        // Blood group distribution
        if (bloodGroupCounts[d.bloodGroup] !== undefined) {
          bloodGroupCounts[d.bloodGroup]++;
        }

        // State counts
        const st = d.state || 'Other';
        stateCounts[st] = (stateCounts[st] || 0) + 1;
      });

      // Searches stats
      const totalSearches = searches.length;
      const successSearches = searches.filter(s => s.status === 'MATCH_FOUND').length;
      const noResultSearches = totalSearches - successSearches;

      return {
        totalDonors: donors.length,
        availableDonors: availableCount,
        unavailableDonors: unavailableCount,
        blockedDonors: blockedCount,
        totalSearches,
        successSearches,
        noResultSearches,
        bloodGroupCounts,
        stateCounts
      };
    }
  };

  /* ==========================================================================
     9. EXPORT & IMPORT SERVICE (CSV & JSON BACKUP)
     ========================================================================== */
  const ExportImportService = {
    exportDonorsCSV() {
      const donors = DonorService.getAllDonors();
      if (!donors.length) {
        alert("No donor records to export.");
        return;
      }

      const headers = [
        "Donor ID", "Full Name", "Blood Group", "Mobile", "Email",
        "Country", "State", "District", "City", "Area",
        "Last Donation Date", "Next Available Date", "Availability",
        "Admin Status", "Consent", "Registration Date", "Last Updated", "Notes"
      ];

      const rows = donors.map(d => [
        `"${d.id || ''}"`,
        `"${(d.fullName || '').replace(/"/g, '""')}"`,
        `"${d.bloodGroup || ''}"`,
        `"${d.mobile || ''}"`,
        `"${d.email || ''}"`,
        `"${d.country || 'India'}"`,
        `"${(d.state || '').replace(/"/g, '""')}"`,
        `"${(d.district || '').replace(/"/g, '""')}"`,
        `"${(d.city || '').replace(/"/g, '""')}"`,
        `"${(d.area || '').replace(/"/g, '""')}"`,
        `"${d.lastDonationDate || ''}"`,
        `"${d.nextAvailableDate || ''}"`,
        `"${d.availability || ''}"`,
        `"${d.adminStatus || ''}"`,
        `"${d.consent ? 'YES' : 'NO'}"`,
        `"${d.registrationDate || ''}"`,
        `"${d.lastUpdated || ''}"`,
        `"${(d.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
      this.triggerDownload(csvContent, `BloodBridge_Donors_${this.getDateStamp()}.csv`, "text/csv;charset=utf-8;");
    },

    exportSearchHistoryCSV() {
      const history = SearchService.getSearchHistory();
      if (!history.length) {
        alert("No search history records to export.");
        return;
      }

      const headers = ["Search ID", "Date", "Blood Group", "State", "District", "City", "Results Count", "Status"];
      const rows = history.map(h => [
        `"${h.id || ''}"`,
        `"${h.date || ''}"`,
        `"${h.bloodGroup || ''}"`,
        `"${(h.state || '').replace(/"/g, '""')}"`,
        `"${(h.district || '').replace(/"/g, '""')}"`,
        `"${(h.city || '').replace(/"/g, '""')}"`,
        `"${h.resultsCount || 0}"`,
        `"${h.status || ''}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
      this.triggerDownload(csvContent, `BloodBridge_SearchHistory_${this.getDateStamp()}.csv`, "text/csv;charset=utf-8;");
    },

    exportFullBackupJSON() {
      const data = {
        app: "BloodBridge",
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        donors: DonorService.getAllDonors(),
        searchHistory: SearchService.getSearchHistory()
      };

      const jsonStr = JSON.stringify(data, null, 2);
      this.triggerDownload(jsonStr, `BloodBridge_Backup_${this.getDateStamp()}.json`, "application/json");
    },

    importDonorsCSV(file, callback) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
          if (lines.length < 2) {
            callback({ success: false, error: "The selected CSV file appears to be empty." });
            return;
          }

          // Parse CSV
          let importedCount = 0;
          let skippedDuplicates = 0;
          let invalidRows = 0;

          // Process rows (skip header)
          for (let i = 1; i < lines.length; i++) {
            const cols = this.parseCSVLine(lines[i]);
            if (cols.length < 5) {
              invalidRows++;
              continue;
            }

            // Columns mapping:
            // 0: Donor ID, 1: Full Name, 2: Blood Group, 3: Mobile, 4: Email, 5: Country, 6: State, 7: District, 8: City, 9: Area
            const fullName = cols[1] || '';
            const bloodGroup = (cols[2] || '').trim();
            const mobile = (cols[3] || '').replace(/\D/g, '');
            const email = cols[4] || '';
            const state = cols[6] || '';
            const district = cols[7] || '';
            const city = cols[8] || '';

            if (!fullName || !BLOOD_GROUPS.includes(bloodGroup) || mobile.length !== 10 || !state) {
              invalidRows++;
              continue;
            }

            if (DonorService.isDuplicateMobile(mobile)) {
              skippedDuplicates++;
              continue;
            }

            // Add valid donor
            const donorResult = DonorService.addDonor({
              fullName: fullName,
              bloodGroup: bloodGroup,
              mobile: mobile,
              email: email || `${mobile}@example.com`,
              country: cols[5] || 'India',
              state: state,
              district: district || 'Not Specified',
              city: city || 'Not Specified',
              area: cols[9] || '',
              lastDonationDate: cols[10] || '',
              availability: cols[12] || 'Available',
              consent: true,
              notes: cols[17] || 'Imported via CSV'
            });

            if (donorResult.success) {
              importedCount++;
            }
          }

          callback({
            success: true,
            importedCount,
            skippedDuplicates,
            invalidRows
          });
        } catch (err) {
          console.error("CSV import error:", err);
          callback({ success: false, error: "Failed to parse CSV file. Please verify format." });
        }
      };
      reader.readAsText(file);
    },

    importBackupJSON(file, callback) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          if (!json || typeof json !== 'object' || !Array.isArray(json.donors)) {
            callback({ success: false, error: "Invalid backup JSON structure. Missing donors array." });
            return;
          }

          // Validate and restore donors
          StorageService.set(STORAGE_KEYS.DONORS, json.donors);

          if (Array.isArray(json.searchHistory)) {
            StorageService.set(STORAGE_KEYS.SEARCH_HISTORY, json.searchHistory);
          }

          callback({
            success: true,
            donorCount: json.donors.length,
            searchCount: (json.searchHistory || []).length
          });
        } catch (err) {
          console.error("JSON restore error:", err);
          callback({ success: false, error: "Failed to read JSON backup. Invalid JSON file." });
        }
      };
      reader.readAsText(file);
    },

    parseCSVLine(line) {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    },

    triggerDownload(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },

    getDateStamp() {
      const now = new Date();
      return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    }
  };

  /* ==========================================================================
     10. UI CONTROLLER (EVENT HANDLING, VIEW SWITCHING, RENDERING)
     ========================================================================== */
  const UI = {
    activeView: 'home',
    activeAdminTab: 'tab-overview',
    pendingConfirmAction: null,

    init() {
      // 1. Initialize DB if empty
      StorageService.initDatabase();

      // 2. Populate States in Dropdowns
      this.populateStates();

      // 3. Bind UI Events
      this.bindNavigation();
      this.bindRegistrationForm();
      this.bindSearchForm();
      this.bindAdminAuth();
      this.bindAdminTabs();
      this.bindAdminTableControls();
      this.bindDataTools();
      this.bindModals();

      // 4. Check URL hash for routing
      this.handleHashChange();
      window.addEventListener('hashchange', () => this.handleHashChange());

      // 5. Update initial counter displays on Home
      this.updateHomeCounters();

      // 6. Set current year in footer
      const yearEl = document.getElementById('currentYear');
      if (yearEl) yearEl.textContent = new Date().getFullYear();

      // 7. Auto-sync from Google Sheet in background if URL is configured
      if (GoogleSheetService.getUrl()) {
        GoogleSheetService.fetchDonorsFromSheet().then((donors) => {
          if (donors) {
            this.updateHomeCounters();
            if (this.activeView === 'admin') this.renderAdminView();
          }
        });
      }
    },

    /* Navigation & SPA Views */
    handleHashChange() {
      let hash = window.location.hash.replace('#', '').trim();
      if (!hash || !['home', 'search', 'register', 'admin'].includes(hash)) {
        hash = 'home';
      }
      this.navigateTo(hash, false);
    },

    navigateTo(viewName, updateHash = true) {
      this.activeView = viewName;

      // Update nav links
      document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.view === viewName) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Update sections
      document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
      });

      const targetSection = document.getElementById(`view-${viewName}`);
      if (targetSection) {
        targetSection.classList.add('active');
      }

      // Close mobile nav if open
      const mainNav = document.getElementById('mainNav');
      if (mainNav) mainNav.classList.remove('mobile-open');

      if (updateHash) {
        window.location.hash = viewName;
      }

      // Page-specific setup
      if (viewName === 'home') {
        this.updateHomeCounters();
      } else if (viewName === 'admin') {
        this.renderAdminView();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    bindNavigation() {
      // Data-view click delegation
      document.body.addEventListener('click', (e) => {
        const viewTrigger = e.target.closest('[data-view]');
        if (viewTrigger) {
          e.preventDefault();
          const targetView = viewTrigger.dataset.view;
          this.navigateTo(targetView, true);
        }
      });

      // Mobile Menu Toggle
      const mobileBtn = document.getElementById('mobileMenuBtn');
      const mainNav = document.getElementById('mainNav');
      if (mobileBtn && mainNav) {
        mobileBtn.addEventListener('click', () => {
          mainNav.classList.toggle('mobile-open');
          const isOpen = mainNav.classList.contains('mobile-open');
          mobileBtn.setAttribute('aria-expanded', isOpen);
        });
      }
    },

    /* Geographic State & District Cascades */
    populateStates() {
      const stateDropdowns = [
        document.getElementById('regState'),
        document.getElementById('searchState'),
        document.getElementById('adminFilterState'),
        document.getElementById('editState')
      ];

      const states = Object.keys(INDIA_LOCATIONS).sort();

      stateDropdowns.forEach(dd => {
        if (!dd) return;
        states.forEach(st => {
          const opt = document.createElement('option');
          opt.value = st;
          opt.textContent = st;
          dd.appendChild(opt);
        });
      });

      // Bind cascade: Registration
      const regState = document.getElementById('regState');
      const regDistrict = document.getElementById('regDistrict');
      if (regState && regDistrict) {
        regState.addEventListener('change', () => {
          this.populateDistricts(regState.value, regDistrict, '-- Select District --');
          regDistrict.disabled = false;
        });
      }

      // Bind cascade: Search
      const searchState = document.getElementById('searchState');
      const searchDistrict = document.getElementById('searchDistrict');
      if (searchState && searchDistrict) {
        searchState.addEventListener('change', () => {
          this.populateDistricts(searchState.value, searchDistrict, '-- All Districts (Optional) --');
          searchDistrict.disabled = false;
        });
      }

      // Bind cascade: Edit Modal
      const editState = document.getElementById('editState');
      if (editState) {
        editState.addEventListener('change', () => {
          // In edit modal, district is text or populated
        });
      }
    },

    populateDistricts(stateName, districtSelectEl, placeholderText) {
      districtSelectEl.innerHTML = '';
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = placeholderText;
      districtSelectEl.appendChild(defaultOpt);

      const districts = INDIA_LOCATIONS[stateName] || [];
      districts.forEach(dist => {
        const opt = document.createElement('option');
        opt.value = dist;
        opt.textContent = dist;
        districtSelectEl.appendChild(opt);
      });
    },

    /* Home Stats Counter */
    updateHomeCounters() {
      const metrics = AnalyticsService.getMetrics();
      const totalEl = document.getElementById('homeTotalDonors');
      const availEl = document.getElementById('homeAvailDonors');
      if (totalEl) totalEl.textContent = metrics.totalDonors;
      if (availEl) availEl.textContent = metrics.availableDonors;
    },

    /* Registration Form Handler */
    bindRegistrationForm() {
      const form = document.getElementById('donorRegistrationForm');
      const lastDonationInput = document.getElementById('regLastDonationDate');
      const previewBox = document.getElementById('regNextAvailablePreview');
      const availSelect = document.getElementById('regAvailability');
      const submitBtn = document.getElementById('regSubmitBtn');
      const spinner = document.getElementById('regSpinner');
      const btnText = document.getElementById('regSubmitBtnText');

      // Live 3-month calculation preview
      if (lastDonationInput && previewBox) {
        const updateDatePreview = () => {
          const val = lastDonationInput.value;
          if (!val) {
            previewBox.style.display = 'none';
            return;
          }

          // Check future date
          const enteredDate = new Date(val + 'T00:00:00');
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (enteredDate > today) {
            previewBox.className = 'calc-preview-box unavailable';
            previewBox.innerHTML = `⚠️ Donation date cannot be in the future.`;
            previewBox.style.display = 'block';
            return;
          }

          const calc = DonorService.calculateAvailabilityFromDate(val, availSelect.value);
          if (calc.isUnderCooldown) {
            previewBox.className = 'calc-preview-box unavailable';
            previewBox.innerHTML = `
              ⏳ <strong>Calculated Waiting Period:</strong> Next available donation date is <strong>${calc.nextAvailableDate}</strong> (~${calc.daysRemaining} days remaining).
              <br><small>Your profile will be registered as 'Temporarily unavailable' until this date passes.</small>
            `;
            availSelect.value = 'Temporarily unavailable';
          } else {
            previewBox.className = 'calc-preview-box available';
            previewBox.innerHTML = `
              ✅ 3-Month interval passed! Next eligible date was <strong>${calc.nextAvailableDate}</strong>. You are currently eligible to donate.
            `;
            if (availSelect.value === 'Temporarily unavailable') {
              availSelect.value = 'Available';
            }
          }
          previewBox.style.display = 'block';
        };

        lastDonationInput.addEventListener('change', updateDatePreview);
        availSelect.addEventListener('change', () => {
          if (lastDonationInput.value) updateDatePreview();
        });
      }

      // Form submission
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();

          // Reset all field error states
          document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
          document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

          let isValid = true;

          // 1. Full Name
          const fullName = document.getElementById('regFullName');
          if (!fullName.value || fullName.value.trim().length < 2) {
            this.showFieldError('errFullName', fullName);
            isValid = false;
          }

          // 2. Blood Group
          const bloodGroup = document.getElementById('regBloodGroup');
          if (!bloodGroup.value || !BLOOD_GROUPS.includes(bloodGroup.value)) {
            this.showFieldError('errBloodGroup', bloodGroup);
            isValid = false;
          }

          // 3. Mobile Number (10 digits starting with 6-9)
          const mobile = document.getElementById('regMobile');
          const cleanMobile = mobile.value.replace(/\D/g, '');
          if (!cleanMobile || cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
            this.showFieldError('errMobile', mobile);
            isValid = false;
          }

          // 4. Email
          const email = document.getElementById('regEmail');
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!email.value || !emailPattern.test(email.value.trim())) {
            this.showFieldError('errEmail', email);
            isValid = false;
          }

          // 5. State
          const state = document.getElementById('regState');
          if (!state.value) {
            this.showFieldError('errState', state);
            isValid = false;
          }

          // 6. District
          const district = document.getElementById('regDistrict');
          if (!district.value) {
            this.showFieldError('errDistrict', district);
            isValid = false;
          }

          // 7. City
          const city = document.getElementById('regCity');
          if (!city.value || city.value.trim().length < 2) {
            this.showFieldError('errCity', city);
            isValid = false;
          }

          // 8. Consent
          const consent = document.getElementById('regConsent');
          if (!consent.checked) {
            this.showFieldError('errConsent', consent);
            isValid = false;
          }

          // 9. Last Donation Date (cannot be future)
          if (lastDonationInput.value) {
            const d = new Date(lastDonationInput.value + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (d > today) {
              this.showToast("Donation date cannot be in the future.", "error");
              isValid = false;
            }
          }

          if (!isValid) {
            this.showToast("Please review the highlighted required fields.", "error");
            return;
          }

          // Check duplicate mobile before saving
          if (DonorService.isDuplicateMobile(cleanMobile)) {
            this.showToast("Your donor record already exists.", "warn");
            const errMobile = document.getElementById('errMobile');
            errMobile.textContent = "Your donor record already exists.";
            errMobile.classList.add('visible');
            mobile.classList.add('is-invalid');
            mobile.focus();
            return;
          }

          // Disable button while saving to prevent duplicate submits
          submitBtn.disabled = true;
          spinner.style.display = 'inline-block';
          btnText.textContent = 'REGISTERING DONOR...';

          setTimeout(() => {
            const result = DonorService.addDonor({
              fullName: fullName.value,
              bloodGroup: bloodGroup.value,
              mobile: cleanMobile,
              email: email.value,
              country: document.getElementById('regCountry').value || 'India',
              state: state.value,
              district: district.value,
              city: city.value,
              area: document.getElementById('regArea').value,
              lastDonationDate: lastDonationInput.value,
              availability: availSelect.value,
              consent: consent.checked,
              notes: document.getElementById('regNotes').value
            });

            submitBtn.disabled = false;
            spinner.style.display = 'none';
            btnText.textContent = 'SUBMIT DONOR REGISTRATION';

            if (result.success) {
              form.reset();
              if (previewBox) previewBox.style.display = 'none';
              this.showSuccessModal(result.donor.id);
            } else {
              this.showToast(result.error || "Failed to register donor.", "error");
            }
          }, 350);
        });
      }

      // Success modal back to home button
      const btnBackHome = document.getElementById('btnSuccessBackHome');
      if (btnBackHome) {
        btnBackHome.addEventListener('click', () => {
          this.closeModal('modalRegisterSuccess');
          this.navigateTo('home', true);
        });
      }
    },

    showFieldError(errorId, inputEl) {
      const err = document.getElementById(errorId);
      if (err) err.classList.add('visible');
      if (inputEl) inputEl.classList.add('is-invalid');
    },

    showSuccessModal(donorId) {
      const idEl = document.getElementById('successDonorId');
      if (idEl) idEl.textContent = donorId;
      this.openModal('modalRegisterSuccess');
    },

    /* Blood Search Handler */
    bindSearchForm() {
      const form = document.getElementById('bloodSearchForm');
      const clearBtn = document.getElementById('searchClearBtn');
      const bloodGroupSelect = document.getElementById('searchBloodGroup');
      const stateSelect = document.getElementById('searchState');
      const districtSelect = document.getElementById('searchDistrict');
      const cityInput = document.getElementById('searchCity');

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();

          // Reset errors
          const errGroup = document.getElementById('errSearchBloodGroup');
          const errState = document.getElementById('errSearchState');
          if (errGroup) errGroup.classList.remove('visible');
          if (errState) errState.classList.remove('visible');

          let isValid = true;
          if (!bloodGroupSelect.value) {
            if (errGroup) errGroup.classList.add('visible');
            isValid = false;
          }
          if (!stateSelect.value) {
            if (errState) errState.classList.add('visible');
            isValid = false;
          }

          if (!isValid) {
            this.showToast("Please choose both a Blood Group and State.", "error");
            return;
          }

          const searchParams = {
            bloodGroup: bloodGroupSelect.value,
            state: stateSelect.value,
            district: districtSelect.value,
            city: cityInput.value
          };

          const matchedDonors = SearchService.searchDonors(searchParams);
          this.renderSearchResults(matchedDonors, searchParams);
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          form.reset();
          districtSelect.disabled = true;
          districtSelect.innerHTML = '<option value="">-- All Districts --</option>';
          const resultsArea = document.getElementById('searchResultsArea');
          if (resultsArea) resultsArea.style.display = 'none';
        });
      }

      // No Results modal buttons
      const btnTryAnother = document.getElementById('btnTryAnotherSearch');
      const btnSearchAgain = document.getElementById('btnSearchAgain');

      if (btnTryAnother) {
        btnTryAnother.addEventListener('click', () => {
          this.closeModal('modalNoResults');
          // Clear optional district/city to broaden
          if (districtSelect) districtSelect.value = '';
          if (cityInput) cityInput.value = '';
          const stateVal = stateSelect ? stateSelect.value : '';
          const groupVal = bloodGroupSelect ? bloodGroupSelect.value : '';
          if (stateVal && groupVal) {
            const matched = SearchService.searchDonors({
              bloodGroup: groupVal,
              state: stateVal,
              district: '',
              city: ''
            });
            this.renderSearchResults(matched, {
              bloodGroup: groupVal,
              state: stateVal,
              district: '',
              city: ''
            });
          }
        });
      }

      if (btnSearchAgain) {
        btnSearchAgain.addEventListener('click', () => {
          this.closeModal('modalNoResults');
          if (bloodGroupSelect) bloodGroupSelect.focus();
        });
      }
    },

    renderSearchResults(donors, params) {
      const resultsArea = document.getElementById('searchResultsArea');
      const countHeading = document.getElementById('resultsCountHeading');
      const querySummary = document.getElementById('resultsQuerySummary');
      const grid = document.getElementById('donorCardsGrid');

      if (!resultsArea || !grid) return;

      if (!donors || donors.length === 0) {
        resultsArea.style.display = 'none';
        this.openModal('modalNoResults');
        return;
      }

      resultsArea.style.display = 'block';
      countHeading.textContent = `${donors.length} Available Donor${donors.length === 1 ? '' : 's'} Found`;

      let summaryText = `Blood Group: ${params.bloodGroup} in ${params.state}`;
      if (params.district) summaryText += ` &bull; District: ${params.district}`;
      if (params.city) summaryText += ` &bull; City: ${params.city}`;
      querySummary.innerHTML = summaryText;

      grid.innerHTML = '';

      donors.forEach(donor => {
        const card = document.createElement('div');
        card.className = 'donor-card';

        let pillClass = 'status-avail';
        if (donor.availability === 'Available this week') pillClass = 'status-week';
        if (donor.availability === 'Contact me first') pillClass = 'status-contact';

        card.innerHTML = `
          <div class="donor-card-top">
            <div class="donor-blood-badge">${this.escapeHTML(donor.bloodGroup)}</div>
            <span class="donor-status-pill ${pillClass}">${this.escapeHTML(donor.availability)}</span>
          </div>
          <h4 class="donor-name">${this.escapeHTML(donor.fullName)}</h4>
          <div class="donor-location">
            <span class="loc-city">📍 ${this.escapeHTML(donor.city)}${donor.area ? ', ' + this.escapeHTML(donor.area) : ''}</span>
            <span class="loc-state">${this.escapeHTML(donor.district)}, ${this.escapeHTML(donor.state)}</span>
          </div>
          <div class="donor-card-actions">
            <a href="tel:+91${this.escapeHTML(donor.mobile)}" class="btn-call-donor">
              📞 CALL DONOR (+91 ${this.escapeHTML(donor.mobile)})
            </a>
          </div>
        `;
        grid.appendChild(card);
      });

      // Scroll smoothly down to results
      resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    /* Admin Authentication */
    bindAdminAuth() {
      const loginForm = document.getElementById('adminLoginForm');
      const logoutBtn = document.getElementById('adminLogoutBtn');
      const refreshBtn = document.getElementById('adminRefreshBtn');
      const togglePwdBtn = document.getElementById('toggleAdminPwd');
      const pwdInput = document.getElementById('adminPassword');

      if (togglePwdBtn && pwdInput) {
        togglePwdBtn.addEventListener('click', () => {
          if (pwdInput.type === 'password') {
            pwdInput.type = 'text';
            togglePwdBtn.textContent = '🔒';
          } else {
            pwdInput.type = 'password';
            togglePwdBtn.textContent = '👁️';
          }
        });
      }

      if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const emailInput = document.getElementById('adminEmail');
          const errEl = document.getElementById('errAdminLogin');
          const loginBtn = document.getElementById('adminLoginBtn');

          if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.textContent = 'VERIFYING CREDENTIALS...';
          }

          const auth = await AuthService.login(emailInput.value, pwdInput.value);

          if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = 'LOGIN TO ADMIN DASHBOARD';
          }

          if (auth.success) {
            if (errEl) errEl.style.display = 'none';
            this.showToast("Welcome to Admin Dashboard", "success");
            this.renderAdminView();
          } else {
            if (errEl) {
              errEl.textContent = auth.message;
              errEl.style.display = 'block';
            }
            this.showToast(auth.message, "error");
          }
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          AuthService.logout();
          this.showToast("Logged out of Admin Session", "info");
          this.renderAdminView();
        });
      }

      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          this.renderAdminView();
          this.showToast("Data refreshed from localStorage", "success");
        });
      }
    },

    renderAdminView() {
      const loginScreen = document.getElementById('adminLoginScreen');
      const dashboardScreen = document.getElementById('adminDashboardScreen');
      const isAuth = AuthService.isAuthenticated();

      if (!isAuth) {
        if (loginScreen) loginScreen.style.display = 'block';
        if (dashboardScreen) dashboardScreen.style.display = 'none';
        return;
      }

      if (loginScreen) loginScreen.style.display = 'none';
      if (dashboardScreen) dashboardScreen.style.display = 'block';

      // Update current admin user email
      const user = AuthService.getCurrentUser();
      const userEl = document.getElementById('adminUserEmail');
      if (userEl && user) userEl.textContent = user.email || ADMIN_CONFIG.EMAIL;

      // Render Active Tab
      this.renderAdminTab(this.activeAdminTab);
    },

    /* Admin Tabs */
    bindAdminTabs() {
      const tabs = document.querySelectorAll('.admin-tab-btn');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const targetTab = tab.dataset.tab;
          this.activeAdminTab = targetTab;
          this.renderAdminTab(targetTab);
        });
      });
    },

    renderAdminTab(tabId) {
      document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
      });
      const activeEl = document.getElementById(tabId);
      if (activeEl) activeEl.classList.add('active');

      if (tabId === 'tab-overview') {
        this.renderAdminKPIsAndAnalytics();
      } else if (tabId === 'tab-donors') {
        this.renderAdminDonorsTable();
      } else if (tabId === 'tab-searches') {
        this.renderAdminSearchTable();
      }
    },

    /* Admin Overview & Pure CSS Visual Charts */
    renderAdminKPIsAndAnalytics() {
      const m = AnalyticsService.getMetrics();

      // KPIs
      document.getElementById('kpiTotalDonors').textContent = m.totalDonors;
      document.getElementById('kpiAvailDonors').textContent = m.availableDonors;
      document.getElementById('kpiUnavailDonors').textContent = m.unavailableDonors;
      document.getElementById('kpiBlockedDonors').textContent = m.blockedDonors;
      document.getElementById('kpiTotalSearches').textContent = m.totalSearches;
      document.getElementById('kpiSuccessSearches').textContent = m.successSearches;
      document.getElementById('kpiNoResultSearches').textContent = m.noResultSearches;

      // Pure CSS Chart 1: Blood Group Distribution
      const bloodGroupContainer = document.getElementById('bloodGroupBars');
      if (bloodGroupContainer) {
        bloodGroupContainer.innerHTML = '';
        const maxVal = Math.max(...Object.values(m.bloodGroupCounts), 1);

        BLOOD_GROUPS.forEach(bg => {
          const count = m.bloodGroupCounts[bg] || 0;
          const percent = Math.round((count / (m.totalDonors || 1)) * 100);
          const barWidth = Math.round((count / maxVal) * 100);

          const item = document.createElement('div');
          item.className = 'chart-bar-item';
          item.innerHTML = `
            <div class="bar-meta">
              <span><strong>${bg}</strong> (${count} donors)</span>
              <span>${percent}%</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width: ${barWidth}%;"></div>
            </div>
          `;
          bloodGroupContainer.appendChild(item);
        });
      }

      // Pure CSS Chart 2: Status Ratios
      const statusContainer = document.getElementById('statusRatioBars');
      if (statusContainer) {
        const total = m.totalDonors || 1;
        const availPct = Math.round((m.availableDonors / total) * 100);
        const unavailPct = Math.round((m.unavailableDonors / total) * 100);
        const blockedPct = Math.round((m.blockedDonors / total) * 100);

        statusContainer.innerHTML = `
          <div class="chart-bar-item">
            <div class="bar-meta">
              <span>Available (${m.availableDonors})</span>
              <span>${availPct}%</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill fill-green" style="width: ${availPct}%;"></div>
            </div>
          </div>
          <div class="chart-bar-item">
            <div class="bar-meta">
              <span>Unavailable / Cooldown (${m.unavailableDonors})</span>
              <span>${unavailPct}%</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill fill-amber" style="width: ${unavailPct}%;"></div>
            </div>
          </div>
          <div class="chart-bar-item">
            <div class="bar-meta">
              <span>Blocked (${m.blockedDonors})</span>
              <span>${blockedPct}%</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill fill-red" style="width: ${blockedPct}%;"></div>
            </div>
          </div>
        `;
      }

      // Pure CSS Chart 3: Search Conversion
      const searchRatioContainer = document.getElementById('searchRatioBars');
      if (searchRatioContainer) {
        const totalSrch = m.totalSearches || 1;
        const successPct = Math.round((m.successSearches / totalSrch) * 100);
        const noResPct = Math.round((m.noResultSearches / totalSrch) * 100);

        searchRatioContainer.innerHTML = `
          <div class="chart-bar-item">
            <div class="bar-meta">
              <span>Matches Found (${m.successSearches})</span>
              <span>${successPct}%</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill fill-green" style="width: ${successPct}%;"></div>
            </div>
          </div>
          <div class="chart-bar-item">
            <div class="bar-meta">
              <span>No Donors Found (${m.noResultSearches})</span>
              <span>${noResPct}%</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill fill-red" style="width: ${noResPct}%;"></div>
            </div>
          </div>
        `;
      }

      // Pure CSS Chart 4: State Breakdown
      const stateBarsContainer = document.getElementById('stateCountBars');
      if (stateBarsContainer) {
        stateBarsContainer.innerHTML = '';
        const sortedStates = Object.entries(m.stateCounts).sort((a, b) => b[1] - a[1]);
        const maxStateVal = sortedStates.length ? sortedStates[0][1] : 1;

        if (sortedStates.length === 0) {
          stateBarsContainer.innerHTML = '<span class="text-muted">No state records available yet.</span>';
        } else {
          sortedStates.forEach(([st, cnt]) => {
            const barWidth = Math.round((cnt / maxStateVal) * 100);
            const item = document.createElement('div');
            item.className = 'chart-bar-item';
            item.innerHTML = `
              <div class="bar-meta">
                <span>${st}</span>
                <span>${cnt} donor${cnt === 1 ? '' : 's'}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" style="width: ${barWidth}%;"></div>
              </div>
            `;
            stateBarsContainer.appendChild(item);
          });
        }
      }
    },

    /* Admin Donor Management Table */
    bindAdminTableControls() {
      const searchInput = document.getElementById('adminFilterSearch');
      const bloodSelect = document.getElementById('adminFilterBloodGroup');
      const stateSelect = document.getElementById('adminFilterState');
      const availSelect = document.getElementById('adminFilterAvailability');
      const statusSelect = document.getElementById('adminFilterStatus');
      const clearBtn = document.getElementById('adminClearFiltersBtn');
      const addNavBtn = document.getElementById('adminAddNewDonorNavBtn');

      const triggerFilter = () => this.renderAdminDonorsTable();

      if (searchInput) searchInput.addEventListener('input', triggerFilter);
      if (bloodSelect) bloodSelect.addEventListener('change', triggerFilter);
      if (stateSelect) stateSelect.addEventListener('change', triggerFilter);
      if (availSelect) availSelect.addEventListener('change', triggerFilter);
      if (statusSelect) statusSelect.addEventListener('change', triggerFilter);

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          if (bloodSelect) bloodSelect.value = '';
          if (stateSelect) stateSelect.value = '';
          if (availSelect) availSelect.value = '';
          if (statusSelect) statusSelect.value = '';
          this.renderAdminDonorsTable();
        });
      }

      if (addNavBtn) {
        addNavBtn.addEventListener('click', () => {
          this.navigateTo('register', true);
        });
      }
    },

    renderAdminDonorsTable() {
      const tbody = document.getElementById('adminDonorsTableBody');
      const countEl = document.getElementById('adminTableCount');
      if (!tbody) return;

      const donors = DonorService.getAllDonors();
      const kw = (document.getElementById('adminFilterSearch')?.value || '').toLowerCase().trim();
      const bg = document.getElementById('adminFilterBloodGroup')?.value || '';
      const st = document.getElementById('adminFilterState')?.value || '';
      const av = document.getElementById('adminFilterAvailability')?.value || '';
      const as = document.getElementById('adminFilterStatus')?.value || '';

      const filtered = donors.filter(d => {
        if (kw) {
          const matchKw = (d.id || '').toLowerCase().includes(kw) ||
                          (d.fullName || '').toLowerCase().includes(kw) ||
                          (d.mobile || '').includes(kw) ||
                          (d.city || '').toLowerCase().includes(kw);
          if (!matchKw) return false;
        }
        if (bg && d.bloodGroup !== bg) return false;
        if (st && d.state !== st) return false;
        if (av && d.availability !== av) return false;
        if (as && d.adminStatus !== as) return false;
        return true;
      });

      if (countEl) countEl.textContent = `Showing ${filtered.length} of ${donors.length} donors`;

      tbody.innerHTML = '';

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="text-center" style="padding: 2.5rem;">
              <span class="text-muted">No donor records matching the selected filters.</span>
            </td>
          </tr>
        `;
        return;
      }

      filtered.forEach(donor => {
        const tr = document.createElement('tr');

        let availBadge = '<span class="badge badge-success">Available</span>';
        if (donor.availability === 'Available this week') availBadge = '<span class="badge badge-warning">This Week</span>';
        if (donor.availability === 'Contact me first') availBadge = '<span class="badge badge-warning">Contact 1st</span>';
        if (donor.availability === 'Temporarily unavailable') availBadge = '<span class="badge badge-danger">Unavailable</span>';

        let statusBadge = '<span class="badge badge-success">ACTIVE</span>';
        if (donor.adminStatus === 'BLOCKED') statusBadge = '<span class="badge badge-danger">BLOCKED</span>';
        if (donor.adminStatus === 'PENDING') statusBadge = '<span class="badge badge-warning">PENDING</span>';

        tr.innerHTML = `
          <td data-label="Donor ID"><span class="table-id-badge">${this.escapeHTML(donor.id)}</span></td>
          <td data-label="Full Name"><strong>${this.escapeHTML(donor.fullName)}</strong></td>
          <td data-label="Blood"><span class="blood-tag">${this.escapeHTML(donor.bloodGroup)}</span></td>
          <td data-label="Phone">${this.escapeHTML(donor.mobile)}</td>
          <td data-label="Location">${this.escapeHTML(donor.city)}, ${this.escapeHTML(donor.district)}, ${this.escapeHTML(donor.state)}</td>
          <td data-label="Availability">${availBadge}</td>
          <td data-label="Status">${statusBadge}</td>
          <td data-label="Actions">
            <div class="table-actions-cell">
              <button type="button" class="btn btn-secondary btn-sm" onclick="BloodBridgeUI.viewDonorDetails('${donor.id}')" title="View Full Details">👁️</button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="BloodBridgeUI.openEditDonorModal('${donor.id}')" title="Edit Donor">✏️</button>
              ${donor.availability === 'Available' ? 
                `<button type="button" class="btn btn-secondary btn-sm" onclick="BloodBridgeUI.quickToggleAvail('${donor.id}', 'Temporarily unavailable')" title="Mark Unavailable">⏳</button>` :
                `<button type="button" class="btn btn-secondary btn-sm" onclick="BloodBridgeUI.quickToggleAvail('${donor.id}', 'Available')" title="Mark Available">✅</button>`
              }
              <button type="button" class="btn btn-danger btn-sm" onclick="BloodBridgeUI.confirmDeleteDonor('${donor.id}')" title="Delete Donor">🗑️</button>
            </div>
          </td>
        `;

        tbody.appendChild(tr);
      });
    },

    /* View Donor Details Modal */
    viewDonorDetails(id) {
      const donor = DonorService.getDonorById(id);
      if (!donor) return;

      const container = document.getElementById('donorDetailsContent');
      if (!container) return;

      container.innerHTML = `
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Donor ID</span>
            <span class="detail-val font-mono">${this.escapeHTML(donor.id)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Blood Group</span>
            <span class="detail-val"><span class="blood-tag">${this.escapeHTML(donor.bloodGroup)}</span></span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Full Name</span>
            <span class="detail-val">${this.escapeHTML(donor.fullName)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Mobile Number</span>
            <span class="detail-val"><a href="tel:+91${this.escapeHTML(donor.mobile)}">+91 ${this.escapeHTML(donor.mobile)}</a></span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Private Email</span>
            <span class="detail-val">${this.escapeHTML(donor.email)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Country / State</span>
            <span class="detail-val">${this.escapeHTML(donor.country)} / ${this.escapeHTML(donor.state)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">District / City</span>
            <span class="detail-val">${this.escapeHTML(donor.district)} / ${this.escapeHTML(donor.city)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Area / Locality</span>
            <span class="detail-val">${this.escapeHTML(donor.area || 'None specified')}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Last Blood Donation Date</span>
            <span class="detail-val">${donor.lastDonationDate || 'None recorded'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Next Available Date (3-mo rule)</span>
            <span class="detail-val">${donor.nextAvailableDate || 'Immediately eligible'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Current Availability</span>
            <span class="detail-val">${this.escapeHTML(donor.availability)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Admin Status</span>
            <span class="detail-val">${this.escapeHTML(donor.adminStatus)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Consent Given</span>
            <span class="detail-val">${donor.consent ? 'YES (Authorized for search display)' : 'NO'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Registration Date</span>
            <span class="detail-val">${new Date(donor.registrationDate).toLocaleString()}</span>
          </div>
          <div class="detail-item detail-full-width">
            <span class="detail-label">Internal Admin Notes</span>
            <span class="detail-val">${this.escapeHTML(donor.notes || 'No administrative notes.')}</span>
          </div>
        </div>
      `;

      this.openModal('modalDonorDetails');
    },

    /* Edit Donor Modal */
    openEditDonorModal(id) {
      const donor = DonorService.getDonorById(id);
      if (!donor) return;

      document.getElementById('editDonorId').value = donor.id;
      document.getElementById('editFullName').value = donor.fullName;
      document.getElementById('editBloodGroup').value = donor.bloodGroup;
      document.getElementById('editMobile').value = donor.mobile;
      document.getElementById('editEmail').value = donor.email;
      document.getElementById('editState').value = donor.state;
      document.getElementById('editDistrict').value = donor.district;
      document.getElementById('editCity').value = donor.city;
      document.getElementById('editArea').value = donor.area || '';
      document.getElementById('editLastDonationDate').value = donor.lastDonationDate || '';
      document.getElementById('editAvailability').value = donor.availability;
      document.getElementById('editAdminStatus').value = donor.adminStatus;
      document.getElementById('editNotes').value = donor.notes || '';

      this.openModal('modalEditDonor');
    },

    quickToggleAvail(id, newStatus) {
      const res = DonorService.toggleAvailability(id, newStatus);
      if (res.success) {
        this.showToast(`Donor status updated to: ${newStatus}`, "success");
        this.renderAdminDonorsTable();
        this.renderAdminKPIsAndAnalytics();
      } else {
        this.showToast(res.error || "Update failed", "error");
      }
    },

    confirmDeleteDonor(id) {
      const donor = DonorService.getDonorById(id);
      if (!donor) return;

      this.showConfirmDialog(
        `Are you sure you want to delete donor ${donor.fullName} (${donor.id})?`,
        () => {
          const res = DonorService.deleteDonor(id);
          if (res.success) {
            this.showToast(`Donor ${id} deleted successfully.`, "success");
            this.renderAdminDonorsTable();
            this.renderAdminKPIsAndAnalytics();
          } else {
            this.showToast(res.error || "Deletion failed.", "error");
          }
        },
        "Delete Donor Record"
      );
    },

    /* Admin Search Audit History Table */
    renderAdminSearchTable() {
      const tbody = document.getElementById('adminSearchTableBody');
      const countEl = document.getElementById('adminSearchCount');
      if (!tbody) return;

      const history = SearchService.getSearchHistory();
      if (countEl) countEl.textContent = `${history.length} searches logged locally`;

      tbody.innerHTML = '';

      if (history.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="text-center" style="padding: 2.5rem;">
              <span class="text-muted">No search queries logged on this browser yet.</span>
            </td>
          </tr>
        `;
        return;
      }

      history.forEach(item => {
        const tr = document.createElement('tr');
        const isMatch = item.status === 'MATCH_FOUND';
        const statusBadge = isMatch ? 
          '<span class="badge badge-success">MATCH FOUND</span>' : 
          '<span class="badge badge-danger">NO MATCH</span>';

        tr.innerHTML = `
          <td data-label="Search ID"><span class="table-id-badge">${this.escapeHTML(item.id)}</span></td>
          <td data-label="Date">${new Date(item.date).toLocaleString()}</td>
          <td data-label="Blood"><span class="blood-tag">${this.escapeHTML(item.bloodGroup)}</span></td>
          <td data-label="State">${this.escapeHTML(item.state)}</td>
          <td data-label="District">${this.escapeHTML(item.district)}</td>
          <td data-label="City">${this.escapeHTML(item.city)}</td>
          <td data-label="Results">${item.resultsCount}</td>
          <td data-label="Status">${statusBadge}</td>
        `;
        tbody.appendChild(tr);
      });
    },

    /* Data Management: CSV, JSON, Google Sheets, Clear */
    bindDataTools() {
      // Google Sheets Live Sync URL controls
      const sheetUrlInput = document.getElementById('googleSheetUrlInput');
      const btnSaveSheet = document.getElementById('btnSaveSheetUrl');
      const btnSyncSheet = document.getElementById('btnSyncGoogleSheet');
      const statusLabel = document.getElementById('sheetSyncStatus');

      const updateSheetStatusDisplay = () => {
        const savedUrl = GoogleSheetService.getUrl();
        if (sheetUrlInput) sheetUrlInput.value = savedUrl;
        if (statusLabel) {
          if (savedUrl) {
            statusLabel.style.color = '#34D399';
            statusLabel.innerHTML = `✅ <strong>Connected:</strong> Live syncing active with Google Sheet.`;
          } else {
            statusLabel.style.color = '#94A3B8';
            statusLabel.innerHTML = `Status: Not connected (Using device localStorage)`;
          }
        }
      };

      updateSheetStatusDisplay();

      if (btnSaveSheet) {
        btnSaveSheet.addEventListener('click', async () => {
          const url = (sheetUrlInput ? sheetUrlInput.value : '').trim();
          GoogleSheetService.setUrl(url);
          updateSheetStatusDisplay();

          if (url) {
            this.showToast("Google Sheet URL saved. Testing connection...", "info");
            const donors = await GoogleSheetService.fetchDonorsFromSheet();
            if (donors !== null) {
              this.showToast(`Connected! Synced ${donors.length} donors from Google Sheet.`, "success");
              this.renderAdminView();
            } else {
              this.showToast("URL saved. Make sure your Web App deployment is set to 'Anyone'.", "warn");
            }
          } else {
            this.showToast("Google Sheet URL removed. Reverted to offline localStorage mode.", "info");
          }
        });
      }

      if (btnSyncSheet) {
        btnSyncSheet.addEventListener('click', async () => {
          const url = GoogleSheetService.getUrl();
          if (!url) {
            this.showToast("Please enter and save a Google Apps Script Web App URL first.", "warn");
            if (sheetUrlInput) sheetUrlInput.focus();
            return;
          }
          this.showToast("Fetching live donors from Google Sheet...", "info");
          const donors = await GoogleSheetService.fetchDonorsFromSheet();
          if (donors !== null) {
            this.showToast(`Sync complete! ${donors.length} donors loaded from Google Sheet.`, "success");
            this.renderAdminView();
          } else {
            this.showToast("Could not reach Google Sheet. Check network connection and Web App permissions.", "error");
          }
        });
      }

      // Export CSV Donors
      const btnExportDonors = document.getElementById('btnExportDonorsCSV');
      if (btnExportDonors) {
        btnExportDonors.addEventListener('click', () => {
          ExportImportService.exportDonorsCSV();
          this.showToast("Donors exported to CSV", "success");
        });
      }

      // Export CSV Search History
      const btnExportSearch = document.getElementById('btnExportSearchCSV');
      if (btnExportSearch) {
        btnExportSearch.addEventListener('click', () => {
          ExportImportService.exportSearchHistoryCSV();
          this.showToast("Search history exported to CSV", "success");
        });
      }

      // Import CSV Donors
      const csvInput = document.getElementById('csvImportInput');
      if (csvInput) {
        csvInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          ExportImportService.importDonorsCSV(file, (res) => {
            csvInput.value = '';
            if (res.success) {
              this.showToast(`Imported ${res.importedCount} donors (${res.skippedDuplicates} duplicates skipped).`, "success");
              this.renderAdminView();
            } else {
              this.showToast(res.error || "CSV Import failed.", "error");
            }
          });
        });
      }

      // Export JSON Backup
      const btnExportJSON = document.getElementById('btnExportBackupJSON');
      if (btnExportJSON) {
        btnExportJSON.addEventListener('click', () => {
          ExportImportService.exportFullBackupJSON();
          this.showToast("Full backup downloaded as JSON", "success");
        });
      }

      // Import JSON Backup
      const jsonInput = document.getElementById('jsonRestoreInput');
      if (jsonInput) {
        jsonInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          this.showConfirmDialog(
            "Restoring this backup will replace current local donors and search records with the file data. Proceed?",
            () => {
              ExportImportService.importBackupJSON(file, (res) => {
                jsonInput.value = '';
                if (res.success) {
                  this.showToast(`Restored ${res.donorCount} donors & ${res.searchCount} searches!`, "success");
                  this.renderAdminView();
                } else {
                  this.showToast(res.error || "Backup restore failed.", "error");
                }
              });
            },
            "Restore Full Backup"
          );
        });
      }

      // Reset to Sample Donors
      const btnResetSample = document.getElementById('btnLoadSampleData');
      if (btnResetSample) {
        btnResetSample.addEventListener('click', () => {
          this.showConfirmDialog(
            "This will reset the donor database to initial verified sample records for testing.",
            () => {
              StorageService.set(STORAGE_KEYS.DONORS, SAMPLE_DONORS);
              this.showToast("Reset to sample records complete!", "success");
              this.renderAdminView();
            },
            "Reset Sample Data"
          );
        });
      }

      // Clear All Data
      const btnClear = document.getElementById('btnClearAllData');
      if (btnClear) {
        btnClear.addEventListener('click', () => {
          this.showConfirmDialog(
            "This will permanently remove all locally stored donor and search data from this browser.",
            () => {
              StorageService.clearAll();
              this.showToast("All local application data cleared.", "info");
              AuthService.logout();
              this.renderAdminView();
            },
            "Permanent Data Wipe"
          );
        });
      }
    },

    /* Modals & Edit Form Submissions */
    bindModals() {
      // Close Details Modal
      const btnCloseDetails = document.getElementById('btnCloseDetailsModal');
      const btnCloseDetailsBtn = document.getElementById('btnCloseDetailsModalBtn');
      if (btnCloseDetails) btnCloseDetails.addEventListener('click', () => this.closeModal('modalDonorDetails'));
      if (btnCloseDetailsBtn) btnCloseDetailsBtn.addEventListener('click', () => this.closeModal('modalDonorDetails'));

      // Close Edit Modal
      const btnCloseEdit = document.getElementById('btnCloseEditModal');
      const btnCancelEdit = document.getElementById('btnCancelEditModal');
      if (btnCloseEdit) btnCloseEdit.addEventListener('click', () => this.closeModal('modalEditDonor'));
      if (btnCancelEdit) btnCancelEdit.addEventListener('click', () => this.closeModal('modalEditDonor'));

      // Edit Form Submission
      const editForm = document.getElementById('adminEditDonorForm');
      if (editForm) {
        editForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const id = document.getElementById('editDonorId').value;
          const fullName = document.getElementById('editFullName').value.trim();
          const bloodGroup = document.getElementById('editBloodGroup').value;
          const mobile = document.getElementById('editMobile').value.replace(/\D/g, '');
          const email = document.getElementById('editEmail').value.trim();
          const state = document.getElementById('editState').value;
          const district = document.getElementById('editDistrict').value.trim();
          const city = document.getElementById('editCity').value.trim();
          const area = document.getElementById('editArea').value.trim();
          const lastDonationDate = document.getElementById('editLastDonationDate').value;
          const availability = document.getElementById('editAvailability').value;
          const adminStatus = document.getElementById('editAdminStatus').value;
          const notes = document.getElementById('editNotes').value.trim();

          if (!fullName || !bloodGroup || mobile.length !== 10 || !state || !district || !city) {
            this.showToast("Please fill all required fields correctly.", "error");
            return;
          }

          const res = DonorService.updateDonor(id, {
            fullName,
            bloodGroup,
            mobile,
            email,
            state,
            district,
            city,
            area,
            lastDonationDate,
            availability,
            adminStatus,
            notes
          });

          if (res.success) {
            this.closeModal('modalEditDonor');
            this.showToast("Donor profile updated successfully.", "success");
            this.renderAdminDonorsTable();
            this.renderAdminKPIsAndAnalytics();
          } else {
            this.showToast(res.error || "Update failed.", "error");
          }
        });
      }

      // Confirmation Modal Cancel / Proceed
      const btnConfirmCancel = document.getElementById('btnConfirmCancel');
      const btnConfirmProceed = document.getElementById('btnConfirmProceed');

      if (btnConfirmCancel) {
        btnConfirmCancel.addEventListener('click', () => {
          this.closeModal('modalConfirm');
          this.pendingConfirmAction = null;
        });
      }

      if (btnConfirmProceed) {
        btnConfirmProceed.addEventListener('click', () => {
          if (typeof this.pendingConfirmAction === 'function') {
            const action = this.pendingConfirmAction;
            this.pendingConfirmAction = null;
            this.closeModal('modalConfirm');
            action();
          }
        });
      }

      // Close modals on clicking outside backdrop
      document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) {
            this.closeModal(backdrop.id);
          }
        });
      });
    },

    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    },

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    },

    showConfirmDialog(message, onConfirm, title = "Confirm Action") {
      const msgEl = document.getElementById('confirmMessage');
      const titleEl = document.getElementById('confirmTitle');
      if (msgEl) msgEl.textContent = message;
      if (titleEl) titleEl.textContent = title;
      this.pendingConfirmAction = onConfirm;
      this.openModal('modalConfirm');
    },

    /* Toast Notification System */
    showToast(message, type = 'info') {
      const container = document.getElementById('toastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      let icon = 'ℹ️';
      if (type === 'success') icon = '✅';
      if (type === 'error') icon = '❌';
      if (type === 'warn') icon = '⚠️';

      toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span>${this.escapeHTML(message)}</span>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('toast-hiding');
        setTimeout(() => toast.remove(), 250);
      }, 3500);
    },

    escapeHTML(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  };

  // Expose UI namespace for inline onclick handlers
  window.BloodBridgeUI = UI;

  // Initialize Application on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UI.init());
  } else {
    UI.init();
  }

})();
