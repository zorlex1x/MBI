import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  CreditCard, 
  ArrowRightLeft, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Smartphone, 
  FileText, 
  Printer, 
  Copy, 
  Building,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { api } from '../../services/api';

const INDIAN_STATES_AND_UT = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

const UNION_TERRITORIES = new Set([
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
]);

const MAJOR_CITIES_BY_STATE = {
  "Andaman and Nicobar Islands": ["Port Blair", "Diglipur", "Mayabunder"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Rajahmundry", "Kakinada"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah"],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  "Delhi (NCT)": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi", "Central Delhi", "Dwarka", "Rohini"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Manali", "Baddi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Kathua"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", "Hazaribagh"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi-Dharwad", "Belagavi", "Kalaburagi", "Ballari", "Udupi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Andrott"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Navi Mumbai", "Kolhapur"],
  "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Ukhrul"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam"],
  "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailashahar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Noida", "Ghaziabad", "Meerut", "Bareilly", "Aligarh"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Kharagpur", "Malda"]
};

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts', 'create', 'teller', 'ledger'
  const [stats, setStats] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Customer Creation Form state
  const [formStep, setFormStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1998-05-15');
  const [mobileNumber, setMobileNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState('400051');
  const [accountType, setAccountType] = useState('SAVINGS');
  const [openingDeposit, setOpeningDeposit] = useState('10000');
  const [issueDebitCard, setIssueDebitCard] = useState(false);
  const [debitCardType, setDebitCardType] = useState('RUPAY'); // 'RUPAY', 'VISA', 'MASTERCARD'
  const [issueCardTargetAccount, setIssueCardTargetAccount] = useState(null); // for Account list issue modal
  const [issueCardModalType, setIssueCardModalType] = useState('RUPAY');
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [aadhaarOtpPreview, setAadhaarOtpPreview] = useState('');

  // Generated Welcome Kit Modal State
  const [welcomeKit, setWelcomeKit] = useState(null);

  // Teller Desk state
  const [tellerAccNumber, setTellerAccNumber] = useState('');
  const [tellerCustomerInfo, setTellerCustomerInfo] = useState(null);
  const [tellerAmount, setTellerAmount] = useState('');
  const [tellerRemarks, setTellerRemarks] = useState('');
  const [tellerType, setTellerType] = useState('DEPOSIT'); // 'DEPOSIT' or 'WITHDRAW'

  // KYC Dossier Modal
  const [selectedKycAccount, setSelectedKycAccount] = useState(null);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, accountsRes, ledgerRes] = await Promise.all([
        api.adminGetStats(),
        api.adminGetAccounts(),
        api.adminGetTransactions()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (accountsRes.success) setAccounts(accountsRes.data);
      if (ledgerRes.success) setTransactions(ledgerRes.data);
    } catch (err) {
      showToast('error', 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Aadhaar OTP simulation
  const handleSendAadhaarOtp = async () => {
    if (aadhaarNumber.replaceAll(/\s+/g, '').length !== 12) {
      showToast('error', 'Please enter a valid 12-digit Aadhaar Card number.');
      return;
    }
    if (!mobileNumber || mobileNumber.length < 10) {
      showToast('error', 'Please enter a valid 10-digit registered mobile number.');
      return;
    }

    try {
      const res = await api.requestAadhaarOtp({
        aadhaarNumber: aadhaarNumber.replaceAll(/\s+/g, ''),
        mobileNumber
      });
      if (res.success) {
        setAadhaarOtpSent(true);
        setAadhaarOtpPreview(res.data.otpPreview);
        setAadhaarOtp(res.data.otpPreview); // auto-fill for smooth testing
        showToast('success', `Aadhaar verification OTP sent to ${mobileNumber}.`);
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to dispatch Aadhaar OTP.');
    }
  };

  // Submit Account Creation
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        fullName,
        email,
        dateOfBirth: dateOfBirth || null,
        mobileNumber,
        aadhaarNumber: aadhaarNumber.replaceAll(/\s+/g, ''),
        panNumber,
        address,
        city,
        state,
        pinCode,
        accountType,
        openingDeposit: parseFloat(openingDeposit) || 0,
        issueDebitCard: !!issueDebitCard,
        debitCardType: issueDebitCard ? debitCardType : null,
        branchName: 'MBI Central Branch, Mumbai',
        aadhaarOtp
      };

      const res = await api.adminCreateCustomer(payload);
      if (res.success) {
        setWelcomeKit(res);
        showToast('success', 'New customer account created and verified successfully!');
        // Reset form
        setFullName('');
        setEmail('');
        setDateOfBirth('1998-05-15');
        setMobileNumber('');
        setAadhaarNumber('');
        setPanNumber('');
        setAddress('');
        setAadhaarOtp('');
        setAadhaarOtpSent(false);
        setIssueDebitCard(false);
        setDebitCardType('RUPAY');
        setFormStep(1);
        loadData();
      } else {
        showToast('error', res.message || 'Account creation rejected.');
      }
    } catch (err) {
      showToast('error', err.message || 'Error occurred during customer creation.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Account Freeze/Unfreeze
  const handleToggleStatus = async (accountNumber, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
    try {
      const res = await api.adminUpdateStatus(accountNumber, nextStatus);
      if (res.success) {
        showToast('success', `Account ${accountNumber} is now ${nextStatus}.`);
        loadData();
      }
    } catch (err) {
      showToast('error', 'Status update failed.');
    }
  };

  // State Change & Dynamic City Suggestion
  const handleStateChange = (selectedState) => {
    setState(selectedState);
    const cities = MAJOR_CITIES_BY_STATE[selectedState];
    if (cities && cities.length > 0) {
      setCity(cities[0]);
    }
  };

  // Issue Debit Card for Account
  const handleIssueDebitCard = async (accountNumber, cardType = 'RUPAY') => {
    try {
      const res = await api.adminIssueCard(accountNumber, cardType);
      if (res.success) {
        showToast('success', res.message || `Debit Card (${cardType}) issued for account ${accountNumber}! Customer can now link it with User ID, MPIN & OTP.`);
        setIssueCardTargetAccount(null);
        loadData();
      } else {
        showToast('error', res.message || 'Failed to issue Debit Card.');
      }
    } catch (err) {
      showToast('error', 'Error issuing debit card.');
    }
  };

  // Teller Account Lookup
  const handleTellerLookup = async (accNum) => {
    setTellerAccNumber(accNum);
    if (accNum.length >= 10) {
      const res = await api.customerLookup(accNum);
      if (res.success && res.data.exists) {
        setTellerCustomerInfo(res.data);
      } else {
        setTellerCustomerInfo(null);
      }
    } else {
      setTellerCustomerInfo(null);
    }
  };

  // Submit Teller Transaction
  const handleTellerSubmit = async (e) => {
    e.preventDefault();
    if (!tellerAmount || parseFloat(tellerAmount) <= 0) {
      showToast('error', 'Please enter a valid amount.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        accountNumber: tellerAccNumber,
        amount: parseFloat(tellerAmount),
        remarks: tellerRemarks || `Branch Counter ${tellerType === 'DEPOSIT' ? 'Cash Credit' : 'Cash Dispense'}`
      };

      const res = tellerType === 'DEPOSIT' 
        ? await api.adminCashDeposit(payload)
        : await api.adminCashWithdraw(payload);

      if (res.success) {
        showToast('success', `${tellerType === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} executed! UTR: ${res.data.referenceNo}`);
        setTellerAmount('');
        setTellerRemarks('');
        loadData();
      } else {
        showToast('error', res.message || 'Transaction rejected.');
      }
    } catch (err) {
      showToast('error', err.message || 'Teller transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  // Filter accounts
  const filteredAccounts = accounts.filter(acc => {
    const matchSearch = 
      acc.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.user?.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.user?.mobileNumber?.includes(searchTerm);

    const matchStatus = statusFilter === 'ALL' || acc.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="app-container py-8 flex-1">
      {/* Toast Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage({ type: '', text: '' })}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Admin Executive Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bank Operations & Customer Governance Desk
            </h1>
            <span className="badge badge-admin">Master Authority</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <span className="font-bold text-slate-800">{user?.fullName || 'Chief Administrator'}</span> • MBI Central Branch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={loadData}
            disabled={loading}
            className="btn btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Ledger</span>
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className="btn btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Open New Customer Account</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5 bg-white border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Bank Deposits</div>
          <div className="text-2xl font-extrabold text-blue-900 mt-1 font-mono">
            ₹ {stats?.totalDeposits ? Number(stats.totalDeposits).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Audited Vault Liquidity</div>
        </div>

        <div className="card p-5 bg-white border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Accounts</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            {stats?.totalAccounts || accounts.length}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Active Customer Ledgers</div>
        </div>

        <div className="card p-5 bg-white border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Transactions</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            {stats?.totalTransactions || transactions.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Immutable Double-Entry Log</div>
        </div>

        <div className="card p-5 bg-white border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Flagged / Frozen</div>
          <div className="text-2xl font-extrabold text-red-600 mt-1 font-mono">
            {stats?.frozenAccounts || accounts.filter(a => a.status === 'FROZEN').length}
          </div>
          <div className="text-[11px] text-red-700 font-semibold mt-1">Administrative Hold</div>
        </div>
      </div>

      {/* Main Admin Console Layout: Left Slidebar Navigation + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Column-Wise Options Navigation (Left Side Slidebar) */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-5 order-1 lg:sticky lg:top-24">
          <div className="card p-4 sm:p-5 bg-white shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Admin Console Options
              </span>
              <span className="text-[11px] font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                4 Services
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              {/* 1. Customer Accounts */}
              <button 
                onClick={() => setActiveTab('accounts')}
                className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                  activeTab === 'accounts' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 border border-slate-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === 'accounts' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold truncate">Customer Accounts</div>
                    <div className={`text-[10px] ${activeTab === 'accounts' ? 'text-blue-100' : 'text-slate-400'} font-normal truncate`}>
                      {accounts.length} Profiles • Manage & Hold
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${activeTab === 'accounts' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* 2. Open Account */}
              <button 
                onClick={() => setActiveTab('create')}
                className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                  activeTab === 'create' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 border border-slate-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === 'create' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold truncate">Open New Account</div>
                    <div className={`text-[10px] ${activeTab === 'create' ? 'text-blue-100' : 'text-slate-400'} font-normal truncate`}>
                      KYC Onboarding Wizard
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${activeTab === 'create' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* 3. Teller Counter */}
              <button 
                onClick={() => setActiveTab('teller')}
                className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                  activeTab === 'teller' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 border border-slate-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === 'teller' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold truncate">Cash Counter Desk</div>
                    <div className={`text-[10px] ${activeTab === 'teller' ? 'text-blue-100' : 'text-slate-400'} font-normal truncate`}>
                      Direct Deposit & Withdrawal
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${activeTab === 'teller' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* 4. Transaction Ledger */}
              <button 
                onClick={() => setActiveTab('ledger')}
                className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                  activeTab === 'ledger' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 border border-slate-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === 'ledger' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold truncate">Transaction Ledger</div>
                    <div className={`text-[10px] ${activeTab === 'ledger' ? 'text-blue-100' : 'text-slate-400'} font-normal truncate`}>
                      Permanent Double-Entry Log
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${activeTab === 'ledger' ? 'text-white' : 'text-slate-400'}`} />
              </button>
            </div>
          </div>

          {/* Admin Vault & Governance Info Card */}
          <div className="card p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white shadow-md">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-1">
              Admin Vault & Governance
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              All transactions and customer account modifications are auditable under RBI Master Directions.
            </p>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 pt-2 border-t border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Core Banking Node Online
            </div>
          </div>
        </aside>

        {/* Active Section Content (Right Side) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6 order-2 min-w-0">

      {/* VIEW 1: CUSTOMER ACCOUNTS DIRECTORY */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="card p-4 flex flex-col sm:flex-row justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer name, 12-digit account number, User ID, or mobile..." 
                className="input-field pl-10 text-xs"
              />
            </div>

            <div className="flex gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field text-xs py-2 w-36"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="FROZEN">Frozen / Held</option>
              </select>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Customer & User ID</th>
                    <th className="py-3 px-4">Account Number</th>
                    <th className="py-3 px-4">Aadhaar (KYC) & Mobile</th>
                    <th className="py-3 px-4">Account Type</th>
                    <th className="py-3 px-4 text-right">Available Balance</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Admin Authority Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No customer accounts found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((acc) => (
                      <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{acc.user?.fullName}</div>
                          <div className="font-mono text-[11px] text-blue-600 font-semibold">{acc.user?.userId}</div>
                          <div className="text-[11px] text-slate-400">{acc.user?.email}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {acc.accountNumber}
                          <div className="text-[10px] text-slate-400 font-sans font-normal">{acc.ifscCode}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-slate-700">XXXX-XXXX-{acc.user?.aadhaarNumber?.slice(-4)}</div>
                          <div className="text-[11px] text-slate-500">{acc.user?.mobileNumber}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            {acc.accountType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-extrabold text-sm text-slate-900">
                          ₹ {Number(acc.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {acc.status === 'ACTIVE' ? (
                            <span className="badge badge-active">Active</span>
                          ) : (
                            <span className="badge badge-frozen">Frozen</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Freeze/Unfreeze Toggle */}
                            <button 
                              onClick={() => handleToggleStatus(acc.accountNumber, acc.status)}
                              className={`btn text-[11px] px-2.5 py-1 ${
                                acc.status === 'ACTIVE' 
                                  ? 'btn-danger' 
                                  : 'btn-success'
                              }`}
                              title={acc.status === 'ACTIVE' ? 'Freeze customer account' : 'Unfreeze customer account'}
                            >
                              {acc.status === 'ACTIVE' ? (
                                <>
                                  <Lock className="w-3 h-3" />
                                  <span>Freeze</span>
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3 h-3" />
                                  <span>Unfreeze</span>
                                </>
                              )}
                            </button>

                            {/* Quick Teller Counter */}
                            <button 
                              onClick={() => {
                                handleTellerLookup(acc.accountNumber);
                                setActiveTab('teller');
                              }}
                              className="btn btn-secondary text-[11px] px-2 py-1"
                              title="Counter Cash Deposit / Withdrawal"
                            >
                              Cash Desk
                            </button>

                            {/* Issue Debit Card */}
                            <button 
                              onClick={() => {
                                setIssueCardTargetAccount(acc.accountNumber);
                                setIssueCardModalType('RUPAY');
                              }}
                              className="btn btn-secondary text-[11px] px-2 py-1 text-purple-700 hover:bg-purple-50 border-purple-200"
                              title="Issue Debit Card (RuPay, Visa, Mastercard) for this account"
                            >
                              <CreditCard className="w-3 h-3 text-purple-600" />
                              <span>Issue Card</span>
                            </button>

                            {/* View Full KYC Dossier */}
                            <button 
                              onClick={() => setSelectedKycAccount(acc)}
                              className="btn btn-secondary text-[11px] px-2 py-1"
                              title="View full KYC Dossier"
                            >
                              KYC
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: OPEN NEW CUSTOMER ACCOUNT (WIZARD) */}
      {activeTab === 'create' && (
        <div className="max-w-3xl mx-auto">
          <div className="card p-6 sm:p-10 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Open New Customer Account</h2>
                <p className="text-xs text-slate-500">Official Branch Onboarding with Mandatory Aadhaar & Mobile OTP Verification</p>
              </div>
            </div>

            {/* Stepper Indicator */}
            <div className="grid grid-cols-4 gap-2 mb-8 text-center text-xs font-bold">
              <div className={`p-2 rounded-lg border ${formStep >= 1 ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-slate-50 text-slate-400'}`}>
                1. Personal Details
              </div>
              <div className={`p-2 rounded-lg border ${formStep >= 2 ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-slate-50 text-slate-400'}`}>
                2. Address
              </div>
              <div className={`p-2 rounded-lg border ${formStep >= 3 ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-slate-50 text-slate-400'}`}>
                3. Aadhaar KYC & OTP
              </div>
              <div className={`p-2 rounded-lg border ${formStep >= 4 ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-slate-50 text-slate-400'}`}>
                4. Account & Deposit
              </div>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-6">
              {/* STEP 1: Personal Details */}
              {formStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Step 1: Customer Personal Profile</h3>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Customer Full Name (as on Aadhaar) *</label>
                    <input 
                      type="text" 
                      required 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aditya Verma" 
                      className="input-field" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. aditya.verma@example.com" 
                        className="input-field" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date of Birth (DOB) *</label>
                      <input 
                        type="date" 
                        required 
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="input-field" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">10-Digit Mobile *</label>
                      <input 
                        type="tel" 
                        required 
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 9820123456" 
                        className="input-field" 
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="button" 
                      disabled={!fullName || !email || !dateOfBirth || mobileNumber.length < 10}
                      onClick={() => setFormStep(2)}
                      className="btn btn-primary text-xs px-5 py-2.5"
                    >
                      Next: Address Details →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Address Details */}
              {formStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Step 2: Permanent & Communication Address</h3>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Residential Street Address</label>
                    <input 
                      type="text" 
                      required 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Flat 301, Silver Sands Apartments, Juhu Road" 
                      className="input-field" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State (All India) *</label>
                      <select 
                        value={state}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="input-field font-semibold text-xs py-2.5"
                      >
                        <option value="">-- Select State / UT --</option>
                        <optgroup label="States of India (28)">
                          {INDIAN_STATES_AND_UT.filter(s => !UNION_TERRITORIES.has(s)).map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Union Territories (8)">
                          {INDIAN_STATES_AND_UT.filter(s => UNION_TERRITORIES.has(s)).map((ut) => (
                            <option key={ut} value={ut}>{ut}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex justify-between">
                        <span>City / District *</span>
                        {state && <span className="text-[10px] text-blue-600 font-normal">in {state}</span>}
                      </label>
                      <input 
                        type="text" 
                        list="city-suggestions"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Select or enter city"
                        className="input-field" 
                      />
                      <datalist id="city-suggestions">
                        {MAJOR_CITIES_BY_STATE[state]?.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">PIN Code *</label>
                      <input 
                        type="text" 
                        required
                        maxLength={6}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 400051"
                        className="input-field font-mono font-bold" 
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button 
                      type="button" 
                      onClick={() => setFormStep(1)}
                      className="btn btn-secondary text-xs px-4 py-2"
                    >
                      ← Back
                    </button>
                    <button 
                      type="button" 
                      disabled={!address || !city || !pinCode}
                      onClick={() => setFormStep(3)}
                      className="btn btn-primary text-xs px-5 py-2.5"
                    >
                      Next: Identity & Aadhaar OTP →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Identity & Aadhaar KYC */}
              {formStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Step 3: Aadhaar Card & Biometric/OTP Verification</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">12-Digit Aadhaar Card Number *</label>
                      <input 
                        type="text" 
                        required 
                        maxLength={12}
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 458912345678" 
                        className="input-field font-mono tracking-wider font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">PAN Card Number</label>
                      <input 
                        type="text" 
                        maxLength={10}
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                        placeholder="e.g. ABCDE1234F" 
                        className="input-field font-mono font-bold" 
                      />
                    </div>
                  </div>

                  {/* OTP Simulation Block */}
                  <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-blue-600" />
                          <span>UIDAI Aadhaar OTP Verification</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          OTP will be sent to registered mobile: <span className="font-mono font-bold">{mobileNumber}</span>
                        </div>
                      </div>

                      <button 
                        type="button"
                        onClick={handleSendAadhaarOtp}
                        className="btn btn-secondary text-xs px-3 py-1.5 border-blue-300 text-blue-700"
                      >
                        {aadhaarOtpSent ? 'Resend OTP' : 'Send Aadhaar OTP'}
                      </button>
                    </div>

                    {aadhaarOtpSent && (
                      <div className="pt-2 border-t border-blue-200/60">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-blue-800 font-semibold">Simulated SMS Alert:</span>
                          <span className="text-xs font-mono font-extrabold bg-white px-2 py-0.5 rounded border border-blue-300 text-blue-700">
                            Demo OTP: {aadhaarOtpPreview}
                          </span>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Enter 6-Digit Aadhaar OTP</label>
                          <input 
                            type="text"
                            maxLength={6}
                            value={aadhaarOtp}
                            onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="• • • • • •"
                            className="input-field text-center font-mono tracking-widest text-lg font-bold bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button 
                      type="button" 
                      onClick={() => setFormStep(2)}
                      className="btn btn-secondary text-xs px-4 py-2"
                    >
                      ← Back
                    </button>
                    <button 
                      type="button" 
                      disabled={aadhaarNumber.length !== 12 || (aadhaarOtpSent && aadhaarOtp.length !== 6)}
                      onClick={() => setFormStep(4)}
                      className="btn btn-primary text-xs px-5 py-2.5"
                    >
                      Next: Account & Initial Deposit →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Account Configuration & Opening Deposit */}
              {formStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Step 4: Account Tier & Opening Deposit Entry</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Account Type</label>
                      <select 
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="input-field font-semibold"
                      >
                        <option value="SAVINGS">Savings Account (4.5% p.a.)</option>
                        <option value="CURRENT">Current Account (Commercial)</option>
                        <option value="SALARY">Corporate Salary Account</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Initial Cash / Cheque Deposit (₹) *
                      </label>
                      <input 
                        type="number" 
                        required 
                        min="0"
                        step="100"
                        value={openingDeposit}
                        onChange={(e) => setOpeningDeposit(e.target.value)}
                        placeholder="e.g. 10000" 
                        className="input-field font-mono font-bold text-base" 
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Strict ledger entry: Credited as <span className="font-semibold text-slate-700">OPENING_DEPOSIT</span> with physical counter receipt.
                      </p>
                    </div>
                  </div>

                  {/* DEBIT CARD ISSUANCE OPT-IN */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    issueDebitCard 
                      ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-100' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={issueDebitCard}
                        onChange={(e) => setIssueDebitCard(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CreditCard className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-bold text-slate-900">
                            Issue Virtual Platinum Debit Card (Customer Opt-In)
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            issueDebitCard ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {issueDebitCard ? 'CARD WILL BE ISSUED' : 'DEFAULT: NO CARD ISSUED'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                          {issueDebitCard ? (
                            <span className="text-purple-800 font-medium">
                              ✓ Virtual Debit Card will be issued in the backend. In the customer dashboard, it will not appear as an active card until the user explicitly adds and verifies it using their <strong>User ID</strong>, <strong>4-digit MPIN</strong>, and <strong>OTP</strong>.
                            </span>
                          ) : (
                            <span>
                              Leave unchecked if the customer does not request a debit card. No debit card will be created or displayed in their dashboard. The branch admin can always issue one later if requested.
                            </span>
                          )}
                        </p>
                      </div>
                    </label>

                    {/* CARD TYPE / NETWORK SELECTOR */}
                    {issueDebitCard && (
                      <div className="mt-4 pt-3 border-t border-purple-200/80">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                          Select Debit Card Network / Type *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* RuPay */}
                          <div 
                            onClick={() => setDebitCardType('RUPAY')}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                              debitCardType === 'RUPAY'
                                ? 'bg-white border-emerald-600 shadow-sm ring-2 ring-emerald-100'
                                : 'bg-white/80 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-extrabold text-sm tracking-tight text-emerald-700">
                                RuPay <span className="text-[10px] font-bold text-slate-400">»</span>
                              </span>
                              <input 
                                type="radio" 
                                name="debitCardType" 
                                checked={debitCardType === 'RUPAY'} 
                                onChange={() => setDebitCardType('RUPAY')}
                                className="text-emerald-600 cursor-pointer"
                              />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">RuPay Platinum</div>
                              <div className="text-[10px] text-slate-500">NPCI Domestic & Global • BIN 6521</div>
                            </div>
                          </div>

                          {/* Visa */}
                          <div 
                            onClick={() => setDebitCardType('VISA')}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                              debitCardType === 'VISA'
                                ? 'bg-white border-blue-600 shadow-sm ring-2 ring-blue-100'
                                : 'bg-white/80 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-extrabold text-sm italic tracking-wider text-blue-800">
                                VISA
                              </span>
                              <input 
                                type="radio" 
                                name="debitCardType" 
                                checked={debitCardType === 'VISA'} 
                                onChange={() => setDebitCardType('VISA')}
                                className="text-blue-600 cursor-pointer"
                              />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">Visa Platinum</div>
                              <div className="text-[10px] text-slate-500">Global Signature • BIN 4591</div>
                            </div>
                          </div>

                          {/* Mastercard */}
                          <div 
                            onClick={() => setDebitCardType('MASTERCARD')}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                              debitCardType === 'MASTERCARD'
                                ? 'bg-white border-red-600 shadow-sm ring-2 ring-red-100'
                                : 'bg-white/80 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] -mr-1.5 opacity-90"></div>
                                <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90"></div>
                                <span className="text-[11px] font-bold text-slate-800 ml-1.5 font-sans lowercase">mastercard</span>
                              </div>
                              <input 
                                type="radio" 
                                name="debitCardType" 
                                checked={debitCardType === 'MASTERCARD'} 
                                onChange={() => setDebitCardType('MASTERCARD')}
                                className="text-red-600 cursor-pointer"
                              />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">Mastercard World</div>
                              <div className="text-[10px] text-slate-500">Worldwide Acceptance • BIN 5241</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="font-bold text-slate-900">Automatic Credential Generation Policy:</div>
                    <p>
                      Upon submitting, the system will automatically generate a unique <span className="font-bold text-blue-700">User ID</span>, a secure <span className="font-bold text-blue-700">Temporary Password</span>, and a 12-digit <span className="font-bold text-blue-700">Account Number</span> with IFSC <span className="font-mono">MBIN0001042</span>.
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button 
                      type="button" 
                      onClick={() => setFormStep(3)}
                      className="btn btn-secondary text-xs px-4 py-2"
                    >
                      ← Back
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn btn-success text-xs px-6 py-3 font-bold flex items-center gap-2"
                    >
                      {loading ? (
                        <span>Issuing Account & Generating Slip...</span>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Approve KYC & Activate Customer Account</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* VIEW 3: BRANCH CASH TELLER COUNTER */}
      {activeTab === 'teller' && (
        <div className="max-w-2xl mx-auto">
          <div className="card p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Branch Cash Counter Desk</h2>
                <p className="text-xs text-slate-500">Teller Cash Credit & Dispense Desk with Double-Entry Audit Trail</p>
              </div>
            </div>

            <form onSubmit={handleTellerSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button 
                  type="button"
                  onClick={() => setTellerType('DEPOSIT')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    tellerType === 'DEPOSIT' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                  <span>Cash Deposit (Credit)</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setTellerType('WITHDRAW')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    tellerType === 'WITHDRAW' ? 'bg-white text-red-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-red-600" />
                  <span>Cash Dispense (Debit)</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Customer Account Number</label>
                <input 
                  type="text" 
                  required 
                  value={tellerAccNumber}
                  onChange={(e) => handleTellerLookup(e.target.value.trim())}
                  placeholder="Enter 12-digit Account Number" 
                  className="input-field font-mono font-bold" 
                />
              </div>

              {/* Verified Account Preview Card */}
              {tellerCustomerInfo && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{tellerCustomerInfo.holderName}</div>
                    <div className="text-[11px] text-slate-500">{tellerCustomerInfo.branchName} • {tellerCustomerInfo.accountType}</div>
                  </div>
                  <div className="badge badge-active">Account Verified</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Transaction Amount (₹)</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  step="50"
                  value={tellerAmount}
                  onChange={(e) => setTellerAmount(e.target.value)}
                  placeholder="e.g. 5000" 
                  className="input-field text-lg font-mono font-bold" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teller Remarks / Voucher Note</label>
                <input 
                  type="text" 
                  value={tellerRemarks}
                  onChange={(e) => setTellerRemarks(e.target.value)}
                  placeholder="e.g. In-person cash counter operation" 
                  className="input-field" 
                />
              </div>

              <button 
                type="submit"
                disabled={loading || !tellerAccNumber || !tellerAmount}
                className={`btn w-full py-3 text-sm font-bold flex items-center justify-center gap-2 ${
                  tellerType === 'DEPOSIT' ? 'btn-success' : 'btn-danger'
                }`}
              >
                {tellerType === 'DEPOSIT' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                <span>Execute {tellerType === 'DEPOSIT' ? 'Cash Credit' : 'Cash Dispense'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 4: SYSTEM-WIDE AUDIT LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="card overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Global Banking Transaction Journal</h3>
                <p className="text-xs text-slate-500">Permanent double-entry record of all credits, debits, and transfers</p>
              </div>
              <span className="badge badge-admin">{transactions.length} Total Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Reference UTR</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Sender Account</th>
                    <th className="py-3 px-4">Beneficiary Account</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-4 text-center">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-sans text-slate-600">
                        {new Date(t.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-700">{t.referenceNo}</td>
                      <td className="py-3 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">
                          {t.transactionType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {t.fromAccount ? t.fromAccount.accountNumber : <span className="text-slate-400 italic">Branch Counter</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {t.toAccount ? t.toAccount.accountNumber : <span className="text-slate-400 italic">Cash Dispense</span>}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-slate-900 font-sans">
                        ₹ {Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="badge badge-active">{t.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      </div>{/* End Active Section Content */}

      </div>{/* End Main Admin Console Layout */}

      {/* MODAL 1: OFFICIAL CUSTOMER WELCOME KIT & OPENING SLIP */}
      {welcomeKit && (
        <div className="modal-overlay">
          <div className="modal-content p-6 sm:p-8 max-w-xl printable-area">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-900 to-blue-600 text-white flex items-center justify-center shadow-md font-bold text-sm">
                  MBI
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Official Customer Welcome Slip</h3>
                  <p className="text-xs text-slate-500 font-mono">MBI - MODERN BANK OF INDIA • KYC VERIFIED</p>
                </div>
              </div>
              <button 
                onClick={() => setWelcomeKit(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Body */}
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-blue-200">
                <span className="badge badge-active">Account Activated & Live</span>
                <p className="text-slate-600 mt-1 font-sans">
                  Account successfully opened and registered with core banking servers.
                </p>
              </div>

              {/* Crucial Credentials Block */}
              <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-blue-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Customer User ID</span>
                  <div className="text-base font-extrabold text-blue-800 font-mono select-all">
                    {welcomeKit.userId}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Used for NetBanking Login</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Temporary Password</span>
                  <div className="text-base font-extrabold text-slate-900 font-mono select-all bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                    {welcomeKit.temporaryPassword}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Reset on first login</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Account Number</span>
                  <div className="text-base font-extrabold text-slate-900 font-mono select-all">
                    {welcomeKit.accountNumber}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{welcomeKit.accountType} Account</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Branch IFSC Code</span>
                  <div className="text-base font-extrabold text-slate-900 font-mono select-all">
                    {welcomeKit.ifscCode}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{welcomeKit.branchName}</div>
                </div>
              </div>

              {/* Customer KYC Summary */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                <div>
                  <span className="text-slate-400">Account Holder:</span>
                  <div className="font-bold text-slate-800">{welcomeKit.fullName}</div>
                </div>
                <div>
                  <span className="text-slate-400">Registered Mobile:</span>
                  <div className="font-bold text-slate-800">{welcomeKit.mobileNumber}</div>
                </div>
                <div>
                  <span className="text-slate-400">Aadhaar Card:</span>
                  <div className="font-mono font-bold text-slate-800">{welcomeKit.aadhaarMasked}</div>
                </div>
                <div>
                  <span className="text-slate-400">Opening Cash Deposit:</span>
                  <div className="font-mono font-bold text-emerald-700">
                    ₹ {Number(welcomeKit.openingDeposit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                {welcomeKit.debitCardNumberMasked && (
                  <div className="col-span-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="text-slate-400">Issued Debit Card:</span>
                      <span className="font-mono font-bold text-purple-700 ml-1.5">{welcomeKit.debitCardNumberMasked}</span>
                      <span className="ml-2 text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full uppercase">
                        {welcomeKit.debitCardType || 'RUPAY'}
                      </span>
                    </div>
                    <span className="badge badge-warning text-[9px]">Awaiting Customer Add (MPIN + OTP)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => {
                  const text = `MBI - Modern Bank Of India Welcome Kit\nCustomer: ${welcomeKit.fullName}\nUser ID: ${welcomeKit.userId}\nTemporary Password: ${welcomeKit.temporaryPassword}\nAccount Number: ${welcomeKit.accountNumber}\nIFSC: ${welcomeKit.ifscCode}`;
                  navigator.clipboard.writeText(text);
                  showToast('success', 'Customer credentials copied to clipboard!');
                }}
                className="btn btn-secondary text-xs flex-1 py-2.5 flex items-center justify-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Credentials</span>
              </button>

              <button 
                onClick={() => window.print()}
                className="btn btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Slip</span>
              </button>

              <button 
                onClick={() => setWelcomeKit(null)}
                className="btn btn-primary text-xs px-6 py-2.5 font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL KYC DOSSIER */}
      {selectedKycAccount && (
        <div className="modal-overlay">
          <div className="modal-content p-6 sm:p-8 max-w-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Customer KYC & Compliance Dossier</h3>
                <p className="text-xs text-slate-500 font-mono">Account: {selectedKycAccount.accountNumber}</p>
              </div>
              <button onClick={() => setSelectedKycAccount(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Full Name</span>
                <span className="font-bold text-slate-900">{selectedKycAccount.user?.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Assigned User ID</span>
                <span className="font-mono font-bold text-blue-700">{selectedKycAccount.user?.userId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Aadhaar Card Number</span>
                <span className="font-mono font-bold text-slate-900">{selectedKycAccount.user?.aadhaarNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">PAN Card Number</span>
                <span className="font-mono font-bold text-slate-900">{selectedKycAccount.user?.panNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Mobile Phone</span>
                <span className="font-bold text-slate-900">{selectedKycAccount.user?.mobileNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Email Address</span>
                <span className="font-bold text-slate-900">{selectedKycAccount.user?.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Residential Address</span>
                <span className="font-semibold text-slate-800 text-right max-w-xs">
                  {selectedKycAccount.user?.address}, {selectedKycAccount.user?.city}, {selectedKycAccount.user?.state} - {selectedKycAccount.user?.pinCode}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Opened By Admin</span>
                <span className="font-mono font-bold text-slate-700">{selectedKycAccount.openedByAdminId || 'admin'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Account Open Timestamp</span>
                <span className="font-mono text-slate-700">{new Date(selectedKycAccount.createdAt).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedKycAccount(null)} className="btn btn-secondary text-xs px-5 py-2">
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ISSUE DEBIT CARD WITH NETWORK SELECTION */}
      {issueCardTargetAccount && (
        <div className="modal-overlay">
          <div className="modal-content p-6 max-w-md">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-extrabold text-slate-900">Issue Debit Card</h3>
              </div>
              <button 
                onClick={() => setIssueCardTargetAccount(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-slate-600">Target Account Number:</div>
                <div className="font-mono font-extrabold text-sm text-purple-900 mt-0.5">{issueCardTargetAccount}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Select Card Network / Type:
                </label>
                <div className="space-y-2">
                  {/* RuPay */}
                  <label 
                    className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      issueCardModalType === 'RUPAY' 
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-100' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="issueModalCardType" 
                        checked={issueCardModalType === 'RUPAY'} 
                        onChange={() => setIssueCardModalType('RUPAY')}
                        className="text-emerald-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>RuPay Platinum</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">NPCI</span>
                        </div>
                        <div className="text-[11px] text-slate-500">BIN 6521 • Domestic & Global Zero Surcharge</div>
                      </div>
                    </div>
                    <span className="font-black italic text-emerald-700 text-sm">RuPay »</span>
                  </label>

                  {/* Visa */}
                  <label 
                    className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      issueCardModalType === 'VISA' 
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="issueModalCardType" 
                        checked={issueCardModalType === 'VISA'} 
                        onChange={() => setIssueCardModalType('VISA')}
                        className="text-blue-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>Visa Platinum</span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">Classic</span>
                        </div>
                        <div className="text-[11px] text-slate-500">BIN 4591 • Global Signature & Verified by Visa</div>
                      </div>
                    </div>
                    <span className="font-black italic text-blue-800 text-sm">VISA</span>
                  </label>

                  {/* Mastercard */}
                  <label 
                    className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      issueCardModalType === 'MASTERCARD' 
                        ? 'border-red-600 bg-red-50/50 ring-2 ring-red-100' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="issueModalCardType" 
                        checked={issueCardModalType === 'MASTERCARD'} 
                        onChange={() => setIssueCardModalType('MASTERCARD')}
                        className="text-red-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>Mastercard World</span>
                          <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-bold">Global</span>
                        </div>
                        <div className="text-[11px] text-slate-500">BIN 5241 • Worldwide Acceptance & Identity Check</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] -mr-1.5 opacity-90"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90"></div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                Note: The card will be provisioned in the backend. The customer must add and link it to their dashboard using User ID, 4-digit MPIN, and OTP before it becomes active.
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setIssueCardTargetAccount(null)}
                className="btn btn-secondary text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => handleIssueDebitCard(issueCardTargetAccount, issueCardModalType)}
                className="btn btn-primary text-xs px-5 py-2 font-bold"
              >
                Confirm & Issue Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
