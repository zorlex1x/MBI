import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ArrowRightLeft, 
  CreditCard, 
  FileText, 
  Lock, 
  Unlock, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Printer, 
  Search, 
  RefreshCw, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ArrowDownLeft, 
  ArrowUpRight,
  Eye,
  EyeOff,
  UserCheck,
  ChevronRight,
  User,
  Smartphone,
  ArrowRight,
  X
} from 'lucide-react';
import { api } from '../../services/api';

const getCardBranding = (cardType) => {
  const type = (cardType || 'RUPAY').toUpperCase();
  if (type.includes('MASTERCARD')) {
    return {
      network: 'MASTERCARD',
      displayName: 'Mastercard World',
      tierBadge: 'MASTERCARD WORLD',
      bgGradient: 'linear-gradient(135deg, #18181b 0%, #27272a 45%, #7f1d1d 100%)',
      logo: (
        <div className="flex items-center">
          <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-95 -mr-1.5 shadow-sm"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-95 shadow-sm"></div>
          <span className="font-sans lowercase font-black text-[10px] text-white ml-1.5 tracking-tight">mastercard</span>
        </div>
      ),
      logoLarge: (
        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full bg-[#EB001B] opacity-95 -mr-2 shadow-sm"></div>
          <div className="w-5 h-5 rounded-full bg-[#F79E1B] opacity-95 shadow-sm"></div>
          <span className="font-sans lowercase font-black text-sm text-white ml-2 tracking-tight">mastercard</span>
        </div>
      )
    };
  }
  if (type.includes('VISA')) {
    return {
      network: 'VISA',
      displayName: 'Visa Platinum',
      tierBadge: 'PLATINUM VISA',
      bgGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
      logo: <div className="font-black italic text-sm text-white tracking-wider">VISA</div>,
      logoLarge: <div className="font-black italic text-xl text-white tracking-wider">VISA</div>
    };
  }
  // Default: RuPay
  return {
    network: 'RUPAY',
    displayName: 'RuPay Platinum',
    tierBadge: 'RUPAY PLATINUM',
    bgGradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 45%, #0284c7 100%)',
    logo: (
      <div className="flex items-center gap-1">
        <span className="bg-white text-[#097939] px-1 py-0.2 rounded font-black italic text-[10px] leading-tight">RuPay</span>
        <span className="text-[10px] text-orange-400 font-extrabold font-mono">»</span>
      </div>
    ),
    logoLarge: (
      <div className="flex items-center gap-1.5">
        <span className="bg-white text-[#097939] px-1.5 py-0.5 rounded font-black italic text-xs leading-tight">RuPay</span>
        <span className="text-xs text-orange-400 font-extrabold font-mono">»</span>
      </div>
    )
  };
};

export default function CustomerDashboard({ user, onOpenSetMpin }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'transfer', 'statement', 'card', 'beneficiaries', 'profile'
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Transfer Form State
  const [toAccount, setToAccount] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [ifscCode, setIfscCode] = useState('MBIN0001042');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDesc, setTransferDesc] = useState('');
  const [transferType, setTransferType] = useState('INTERNAL_TRANSFER'); // 'INTERNAL_TRANSFER', 'NEFT', 'IMPS'
  const [transferMpin, setTransferMpin] = useState('');
  const [verifiedRecipient, setVerifiedRecipient] = useState(null);

  // Statement & History State
  const [statementTxns, setStatementTxns] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [txnSearch, setTxnSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL', 'CREDIT', 'DEBIT'

  // Beneficiaries State
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [newBeneName, setNewBeneName] = useState('');
  const [newBeneAcc, setNewBeneAcc] = useState('');
  const [newBeneIfsc, setNewBeneIfsc] = useState('MBIN0001042');
  const [newBeneBank, setNewBeneBank] = useState('MBI - Modern Bank Of India');
  const [newBeneNick, setNewBeneNick] = useState('');
  const [newBeneMpin, setNewBeneMpin] = useState('');

  // Card Interactive State
  const [cardFlipped, setCardFlipped] = useState(false);
  const [cardFreezeMpin, setCardFreezeMpin] = useState('');
  const [showCardMpinPrompt, setShowCardMpinPrompt] = useState(false);

  // Card Details Reveal & Protection State (MPIN Protected)
  const [isCardRevealed, setIsCardRevealed] = useState(false);
  const [showCardMpinModal, setShowCardMpinModal] = useState(false);
  const [cardMpinInput, setCardMpinInput] = useState('');
  const [cardMpinError, setCardMpinError] = useState('');
  const [isVerifyingCardMpin, setIsVerifyingCardMpin] = useState(false);

  // Account Details (Account No, IFSC, User ID) Reveal State (MPIN Protected)
  const [isDetailsRevealed, setIsDetailsRevealed] = useState(false);
  const [showDetailsMpinModal, setShowDetailsMpinModal] = useState(false);
  const [detailsMpinInput, setDetailsMpinInput] = useState('');
  const [detailsMpinError, setDetailsMpinError] = useState('');
  const [isVerifyingDetailsMpin, setIsVerifyingDetailsMpin] = useState(false);

  const handleVerifyMpinForDetails = async (e) => {
    if (e) e.preventDefault();
    if (!detailsMpinInput || detailsMpinInput.length !== 4) {
      setDetailsMpinError('Please enter your 4-digit MPIN.');
      return;
    }
    setIsVerifyingDetailsMpin(true);
    setDetailsMpinError('');
    try {
      const res = await api.customerVerifyMpin(detailsMpinInput);
      if (res.success) {
        setIsDetailsRevealed(true);
        setShowDetailsMpinModal(false);
        setDetailsMpinInput('');
        showToast('success', 'Account details revealed.');
      } else {
        setDetailsMpinError(res.message || 'Incorrect 4-digit MPIN. Access denied.');
      }
    } catch (err) {
      setDetailsMpinError('Verification failed. Please check your MPIN.');
    } finally {
      setIsVerifyingDetailsMpin(false);
    }
  };

  // Add/Link Debit Card State (User ID + 4-Digit MPIN + OTP)
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [addCardStep, setAddCardStep] = useState('ENTER_CREDENTIALS'); // 'ENTER_CREDENTIALS' or 'VERIFY_OTP'
  const [addCardUserId, setAddCardUserId] = useState('');
  const [addCardMpin, setAddCardMpin] = useState('');
  const [addCardOtp, setAddCardOtp] = useState('');
  const [addCardOtpPreview, setAddCardOtpPreview] = useState('');
  const [addCardMobileMasked, setAddCardMobileMasked] = useState('');
  const [addCardLoading, setAddCardLoading] = useState(false);
  const [addCardError, setAddCardError] = useState('');

  const handleRequestAddCardOtp = async (e) => {
    if (e) e.preventDefault();
    setAddCardError('');
    if (!addCardUserId.trim()) {
      setAddCardError('Please enter your User ID.');
      return;
    }
    if (!addCardMpin || addCardMpin.trim().length !== 4) {
      setAddCardError('Please enter your 4-digit MPIN.');
      return;
    }
    setAddCardLoading(true);
    try {
      const res = await api.customerRequestAddCardOtp({
        userId: addCardUserId.trim(),
        mpin: addCardMpin.trim()
      });
      if (res.success) {
        setAddCardOtpPreview(res.data?.otpPreview || '');
        setAddCardMobileMasked(res.data?.mobileMasked || '');
        setAddCardOtp(res.data?.otpPreview || '');
        setAddCardStep('VERIFY_OTP');
      } else {
        setAddCardError(res.message || 'Failed to request OTP for card linking.');
      }
    } catch (err) {
      setAddCardError(err.message || 'Error communicating with core banking server.');
    } finally {
      setAddCardLoading(false);
    }
  };

  const handleVerifyAddCard = async (e) => {
    if (e) e.preventDefault();
    setAddCardError('');
    if (!addCardOtp || addCardOtp.trim().length !== 6) {
      setAddCardError('Please enter the 6-digit OTP code.');
      return;
    }
    setAddCardLoading(true);
    try {
      const res = await api.customerAddCard({
        userId: addCardUserId.trim(),
        mpin: addCardMpin.trim(),
        otp: addCardOtp.trim()
      });
      if (res.success) {
        showToast('success', 'Debit card verified and successfully added to your account!');
        setShowAddCardModal(false);
        setAddCardMpin('');
        setAddCardOtp('');
        loadDashboard();
      } else {
        setAddCardError(res.message || 'OTP verification failed.');
      }
    } catch (err) {
      setAddCardError(err.message || 'Error occurred while linking card.');
    } finally {
      setAddCardLoading(false);
    }
  };

  // Printable E-Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState(null);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [dashRes, beneRes] = await Promise.all([
        api.customerGetDashboard(),
        api.customerGetBeneficiaries()
      ]);

      if (dashRes.success) {
        setDashboardData(dashRes.data);
        setStatementTxns(dashRes.data.recentTransactions || []);
      }
      if (beneRes.success) {
        setBeneficiaries(beneRes.data);
      }
    } catch (err) {
      showToast('error', 'Failed to load banking profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Recipient Account lookup as user types
  const handleAccountLookup = async (accNum) => {
    setToAccount(accNum);
    if (accNum.trim().length >= 10) {
      try {
        const res = await api.customerLookup(accNum.trim());
        if (res.success && res.data.exists) {
          setVerifiedRecipient(res.data);
          setBeneficiaryName(res.data.holderName);
          setIfscCode(res.data.ifscCode);
        } else {
          setVerifiedRecipient(null);
        }
      } catch (e) {
        setVerifiedRecipient(null);
      }
    } else {
      setVerifiedRecipient(null);
    }
  };

  // Execute Transfer
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferMpin || transferMpin.length !== 4) {
      showToast('error', 'Please enter your 4-digit MPIN to authorize transfer.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        fromAccountNumber: dashboardData.account.accountNumber,
        toAccountNumber: toAccount.trim(),
        beneficiaryName: beneficiaryName.trim() || 'Beneficiary',
        ifscCode: ifscCode.trim(),
        amount: parseFloat(transferAmount),
        description: transferDesc.trim() || `${transferType} transfer`,
        transferType,
        mpin: transferMpin.trim()
      };

      const res = await api.customerTransfer(payload);
      if (res.success) {
        setActiveReceipt(res.data);
        showToast('success', `Transfer of ₹${transferAmount} completed! UTR: ${res.data.referenceNo}`);
        // Reset form
        setToAccount('');
        setBeneficiaryName('');
        setTransferAmount('');
        setTransferDesc('');
        setTransferMpin('');
        setVerifiedRecipient(null);
        loadDashboard();
      } else {
        showToast('error', res.message || 'Transfer failed.');
      }
    } catch (err) {
      showToast('error', err.message || 'Network error during transfer.');
    } finally {
      setLoading(false);
    }
  };

  // Filter Statement Transactions
  const fetchCustomStatement = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await api.customerGetTransactions(startDate, endDate);
      if (res.success) {
        setStatementTxns(res.data);
      }
    } catch (err) {
      showToast('error', 'Error fetching transaction statement.');
    } finally {
      setLoading(false);
    }
  };

  // Add Beneficiary
  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    if (!newBeneMpin || newBeneMpin.length !== 4) {
      showToast('error', 'Enter your 4-digit MPIN to authorize adding beneficiary.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.customerAddBeneficiary({
        beneficiaryName: newBeneName,
        beneficiaryAccountNumber: newBeneAcc,
        ifscCode: newBeneIfsc,
        bankName: newBeneBank,
        nickname: newBeneNick,
        mpin: newBeneMpin
      });

      if (res.success) {
        showToast('success', 'Beneficiary added successfully!');
        setNewBeneName('');
        setNewBeneAcc('');
        setNewBeneNick('');
        setNewBeneMpin('');
        const bRes = await api.customerGetBeneficiaries();
        if (bRes.success) setBeneficiaries(bRes.data);
      } else {
        showToast('error', res.message || 'Failed to add beneficiary.');
      }
    } catch (err) {
      showToast('error', err.message || 'Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Card Freeze with MPIN
  const handleToggleCardFreeze = async () => {
    if (!cardFreezeMpin || cardFreezeMpin.length !== 4) {
      showToast('error', 'Please enter your 4-digit MPIN.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.customerToggleCardFreeze(cardFreezeMpin);
      if (res.success) {
        showToast('success', res.message);
        setShowCardMpinPrompt(false);
        setCardFreezeMpin('');
        loadDashboard();
      } else {
        showToast('error', res.message || 'Failed to toggle card status.');
      }
    } catch (err) {
      showToast('error', err.message || 'Error toggling card.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMpinForCard = async (e) => {
    if (e) e.preventDefault();
    if (!cardMpinInput || cardMpinInput.length !== 4) {
      setCardMpinError('Please enter your 4-digit MPIN.');
      return;
    }
    setIsVerifyingCardMpin(true);
    setCardMpinError('');
    try {
      const res = await api.customerVerifyMpin(cardMpinInput);
      if (res.success) {
        setIsCardRevealed(true);
        setShowCardMpinModal(false);
        setCardMpinInput('');
        showToast('success', 'Debit card details unlocked.');
      } else {
        setCardMpinError(res.message || 'Incorrect MPIN. Access denied.');
      }
    } catch (err) {
      setCardMpinError('Verification failed. Please check your MPIN.');
    } finally {
      setIsVerifyingCardMpin(false);
    }
  };

  const filteredStatementTxns = statementTxns.filter((t) => {
    const isCredit = t.toAccount && t.toAccount.accountNumber === dashboardData?.account?.accountNumber;
    const isDebit = t.fromAccount && t.fromAccount.accountNumber === dashboardData?.account?.accountNumber;

    if (typeFilter === 'CREDIT' && !isCredit) return false;
    if (typeFilter === 'DEBIT' && !isDebit) return false;

    if (txnSearch) {
      const s = txnSearch.toLowerCase();
      const matchRef = t.referenceNo?.toLowerCase().includes(s);
      const matchDesc = t.description?.toLowerCase().includes(s);
      return matchRef || matchDesc;
    }
    return true;
  });

  if (!dashboardData) {
    return (
      <div className="app-container py-16 flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Loading Core Banking Profile...</p>
        </div>
      </div>
    );
  }

  const { account, user: profile, card } = dashboardData;
  const cardBrand = getCardBranding(card?.cardType);

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

      {/* Account Status Warning if Frozen */}
      {account.status === 'FROZEN' && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-300 text-red-800 flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-sm">Administrative Hold Notice:</span> Your account is currently in a 
            <span className="font-bold"> FROZEN</span> state by Bank Administration. Outgoing fund transfers and debit card usage are temporarily restricted. Please contact your home branch for KYC clearance.
          </div>
        </div>
      )}

      {/* Hero Balance & Account Summary Card */}
      <div className="card p-6 sm:p-8 bg-gradient-to-br from-white via-blue-50/20 to-slate-50 border-blue-100 shadow-md mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Balance Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="badge badge-active">{account.status}</span>
              <span className="text-xs text-slate-500 font-medium">
                {account.accountType} Account • {account.branchName}
              </span>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Audited Balance</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight mt-1">
                ₹ {Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Ledger Balance • Real-Time Value
              </p>
            </div>

            {/* Account Details Strip (Hidden by default, unlocked with 4-Digit MPIN) */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                <span className="text-slate-400">Account No:</span>
                <span className="font-mono font-bold text-slate-900 tracking-wider">
                  {isDetailsRevealed ? account.accountNumber : '•••• •••• ••••'}
                </span>
                {isDetailsRevealed && (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(account.accountNumber);
                      showToast('success', 'Account number copied!');
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Copy Account Number"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                <span className="text-slate-400">IFSC:</span>
                <span className="font-mono font-bold text-slate-900 tracking-wider">
                  {isDetailsRevealed ? account.ifscCode : '•••••••••••'}
                </span>
                {isDetailsRevealed && (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(account.ifscCode);
                      showToast('success', 'IFSC Code copied!');
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Copy IFSC Code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                <span className="text-slate-400">User ID:</span>
                <span className="font-mono font-bold text-blue-700 tracking-wider">
                  {isDetailsRevealed ? profile.userId : '••••••••••'}
                </span>
                {isDetailsRevealed && (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(profile.userId);
                      showToast('success', 'User ID copied!');
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Copy User ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* MPIN Reveal/Hide Details Button */}
              <button
                type="button"
                onClick={() => {
                  if (isDetailsRevealed) {
                    setIsDetailsRevealed(false);
                    showToast('info', 'Account details hidden.');
                  } else {
                    setDetailsMpinInput('');
                    setDetailsMpinError('');
                    setShowDetailsMpinModal(true);
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                  isDetailsRevealed 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300' 
                    : 'btn-primary'
                }`}
              >
                {isDetailsRevealed ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Details</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show Details (Enter MPIN)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Actions Column */}
          <div className="lg:col-span-5 flex flex-wrap lg:flex-col gap-2.5 justify-center">
            <button 
              onClick={() => setActiveTab('transfer')}
              className="btn btn-primary text-xs sm:text-sm py-3 px-5 flex-1 flex items-center justify-center gap-2 font-bold shadow-md"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Send Money (NEFT / IMPS)</span>
            </button>

            <div className="grid grid-cols-2 gap-2 w-full">
              <button 
                onClick={() => setActiveTab('statement')}
                className="btn btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Statements</span>
              </button>

              <button 
                onClick={() => setActiveTab('card')}
                className="btn btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                <span>Debit Card</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Dashboard Layout: Left Slidebar Navigation + Right Section Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Column-Wise Options Navigation (Left Side Slidebar) */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-5 order-1 lg:sticky lg:top-24">
          <div className="card p-4 sm:p-5 bg-white shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Account Services & Options
              </span>
              <span className="text-[11px] font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                6 Options
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              {/* 1. Dashboard Overview */}
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                  activeTab === 'overview' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 border border-slate-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === 'overview' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold truncate">Dashboard Overview</div>
                    <div className={`text-[10px] ${activeTab === 'overview' ? 'text-blue-100' : 'text-slate-400'} font-normal truncate`}>
                      Summary & Recent Activity
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* 2. Fund Transfer */}
              <button 
                onClick={() => setActiveTab('transfer')}
                className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                  activeTab === 'transfer' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 border border-slate-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === 'transfer' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold truncate">Fund Transfer</div>
                    <div className={`text-[10px] ${activeTab === 'transfer' ? 'text-blue-100' : 'text-slate-400'} font-normal truncate`}>
                      4-Digit MPIN • NEFT/IMPS
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${activeTab === 'transfer' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* 3. Account Statement */}
              <button 
                onClick={() => setActiveTab('statement')}
                className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                  activeTab === 'statement' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 border border-slate-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === 'statement' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold truncate">Account Statement</div>
                    <div className={`text-[10px] ${activeTab === 'statement' ? 'text-blue-100' : 'text-slate-400'} font-normal truncate`}>
                      E-Receipts & Passbook
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${activeTab === 'statement' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* 4. Virtual Platinum Debit Card */}
              <button 
                onClick={() => setActiveTab('card')}
                className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                  activeTab === 'card' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 border border-slate-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === 'card' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'
                  }`}>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold truncate flex items-center gap-1.5">
                      <span>Virtual Debit Card</span>
                      {card?.isIssued && !card?.isLinked && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      )}
                    </div>
                    <div className={`text-[10px] ${activeTab === 'card' ? 'text-blue-100' : 'text-slate-400'} font-normal truncate`}>
                      {!card?.isIssued 
                        ? 'Not Issued' 
                        : !card?.isLinked 
                        ? 'Issued • Add with MPIN' 
                        : 'Active & Protected'}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${activeTab === 'card' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* 5. Beneficiaries */}
              <button 
                onClick={() => setActiveTab('beneficiaries')}
                className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                  activeTab === 'beneficiaries' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 border border-slate-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === 'beneficiaries' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold truncate">Beneficiaries ({beneficiaries.length})</div>
                    <div className={`text-[10px] ${activeTab === 'beneficiaries' ? 'text-blue-100' : 'text-slate-400'} font-normal truncate`}>
                      Saved Contacts & Payees
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${activeTab === 'beneficiaries' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* 6. KYC Profile & Security */}
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                  activeTab === 'profile' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700 border border-slate-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === 'profile' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold truncate">KYC Profile & Security</div>
                    <div className={`text-[10px] ${activeTab === 'profile' ? 'text-blue-100' : 'text-slate-400'} font-normal truncate`}>
                      Identity, Aadhaar & MPIN
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${activeTab === 'profile' ? 'text-white' : 'text-slate-400'}`} />
              </button>
            </div>
          </div>

          {/* Quick Branch & Security Assurance Info Card */}
          <div className="card p-4 sm:p-5 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">256-Bit Bank Grade SSL</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              Protected by DICGC coverage up to ₹5,00,000. All transfers require personal 4-digit MPIN authorization.
            </p>
            <div className="pt-2 border-t border-blue-800/80 text-[11px] text-blue-200 flex flex-col gap-1">
              <div><span className="text-slate-400">Branch:</span> {account.branchName}</div>
              <div><span className="text-slate-400">IFSC:</span> <span className="font-mono text-white">{account.ifscCode}</span></div>
            </div>
          </div>
        </aside>

        {/* Active Section Content (Right Side) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6 order-2 min-w-0">

          {/* VIEW 1: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Recent Transactions List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-extrabold text-slate-900">Recent Account Activity</h3>
                  <button 
                    onClick={() => setActiveTab('statement')}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    View Full Statement →
                  </button>
                </div>

            <div className="card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Description / Reference</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-right">Amount (₹)</th>
                      <th className="py-3 px-4 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dashboardData.recentTransactions?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No transactions recorded on this account yet.
                        </td>
                      </tr>
                    ) : (
                      dashboardData.recentTransactions?.map((t) => {
                        const isCredit = t.toAccount && t.toAccount.accountNumber === account.accountNumber;
                        return (
                          <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                              {new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{t.description}</div>
                              <div className="font-mono text-[10px] text-slate-400">{t.referenceNo}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                                {t.transactionType}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-extrabold text-sm whitespace-nowrap">
                              <span className={isCredit ? 'text-emerald-600' : 'text-slate-900'}>
                                {isCredit ? '+' : '-'} ₹ {Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button 
                                onClick={() => setActiveReceipt(t)}
                                className="btn btn-secondary text-[10px] px-2 py-1"
                              >
                                E-Receipt
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mini Virtual Card & Quick Transfer Widget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Quick Virtual Card Preview */}
            <div className="card p-5 bg-white shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Debit Card Status</span>
                {!card?.isIssued ? (
                  <span className="badge badge-frozen">Not Issued</span>
                ) : !card?.isLinked ? (
                  <span className="badge badge-warning">Awaiting Link</span>
                ) : (
                  <span className={`badge ${card?.isActive ? 'badge-active' : 'badge-frozen'}`}>
                    {card?.isActive ? 'Unlocked' : 'Frozen'}
                  </span>
                )}
              </div>

              {!card?.isIssued ? (
                /* Case 1: Debit card has NOT been issued by Admin */
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">No Debit Card on Account</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      A debit card has not been issued for your account. You can request one anytime from your branch administrator.
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400 font-mono">
                    Branch Service: Card Issuance on Request
                  </div>
                </div>
              ) : !card?.isLinked ? (
                /* Case 2: Debit card IS issued by Admin, but NOT yet added/linked by user */
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md shadow-purple-600/20">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">MBI {cardBrand.displayName} Approved!</h4>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <span className="font-mono font-bold text-xs text-purple-700 bg-white px-2.5 py-1 rounded border border-purple-200">
                        {card?.cardNumberMasked || '•••• •••• •••• 4591'}
                      </span>
                      <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full uppercase">
                        {cardBrand.network}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto">
                      Your debit card has been issued by the admin. Add and link it to your dashboard using your User ID, 4-digit MPIN, and OTP.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAddCardUserId(profile.userId || '');
                      setAddCardMpin('');
                      setAddCardOtp('');
                      setAddCardError('');
                      setAddCardStep('ENTER_CREDENTIALS');
                      setShowAddCardModal(true);
                    }}
                    className="btn btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Add & Link Debit Card</span>
                  </button>
                </div>
              ) : (
                /* Case 3: Debit card is linked & active */
                <>
                  {/* Visual Debit Card */}
                  <div 
                    onClick={() => setCardFlipped(!cardFlipped)}
                    className={`card-container ${cardFlipped ? 'flipped' : ''}`}
                    title="Click card to flip"
                  >
                    <div className="card-inner">
                      {/* Front */}
                      <div 
                        className="card-front"
                        style={{ background: cardBrand.bgGradient }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-xs tracking-wider text-blue-100 font-bold">MBI BANK</span>
                          <span className="text-[10px] font-bold tracking-widest text-emerald-300 uppercase">{cardBrand.tierBadge}</span>
                        </div>
                        <div className="w-8 h-6 bg-amber-300 rounded shadow-inner my-2"></div>
                        <div className="font-mono text-sm tracking-widest">
                          {isCardRevealed && card?.cardNumber 
                            ? card.cardNumber.replace(/(\d{4})/g, '$1 ').trim() 
                            : '•••• •••• •••• ••••'}
                        </div>
                        <div className="flex justify-between items-end text-[10px]">
                          <div>
                            <div className="text-[8px] text-blue-200 uppercase">Cardholder</div>
                            <div className="font-bold tracking-wider font-mono">
                              {isCardRevealed ? (card?.cardHolderName || profile.fullName) : '•••• ••••••••'}
                            </div>
                          </div>
                          <div>
                            <div className="text-[8px] text-blue-200 uppercase">Expires</div>
                            <div className="font-mono font-bold">
                              {isCardRevealed ? `${card?.expiryMonth}/${card?.expiryYear}` : '••/••'}
                            </div>
                          </div>
                          <div>{cardBrand.logo}</div>
                        </div>
                      </div>

                      {/* Back */}
                      <div className="card-back">
                        <div className="magnetic-strip"></div>
                        <div className="flex justify-between items-center my-2">
                          <div className="text-[8px] text-slate-400">Authorized Signature</div>
                          <div className="card-signature">
                            CVV: {isCardRevealed ? (card?.cvv || '***') : '•••'}
                          </div>
                        </div>
                        <div className="text-[8px] text-slate-400 leading-tight">
                          For customer service call 1800-200-MBIBANK. Not transferable. Property of Modern Bank Of India.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reveal / Hide Button & Flip Notice */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (isCardRevealed) {
                          setIsCardRevealed(false);
                          showToast('info', 'Debit card details hidden.');
                        } else {
                          setCardMpinInput('');
                          setCardMpinError('');
                          setShowCardMpinModal(true);
                        }
                      }}
                      className={`w-full btn text-xs py-2 flex items-center justify-center gap-1.5 font-bold ${
                        isCardRevealed 
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300' 
                          : 'btn-primary'
                      }`}
                    >
                      {isCardRevealed ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide Card Details</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Card Details (Enter MPIN)</span>
                        </>
                      )}
                    </button>

                    <div className="text-center text-[11px] text-slate-400">
                      Tap card to flip between front & CVV signature panel
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Beneficiary Shortcuts */}
            <div className="card p-5 bg-white shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quick Transfer Payees</span>
                <button 
                  onClick={() => setActiveTab('beneficiaries')}
                  className="text-xs text-blue-600 font-semibold"
                >
                  Manage
                </button>
              </div>

              {beneficiaries.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No saved payees. Add frequent contacts for 1-click transfer.</p>
              ) : (
                <div className="space-y-2">
                  {beneficiaries.slice(0, 3).map((b) => (
                    <div 
                      key={b.id} 
                      onClick={() => {
                        handleAccountLookup(b.beneficiaryAccountNumber);
                        setActiveTab('transfer');
                      }}
                      className="p-2.5 rounded-xl border border-slate-200/80 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{b.beneficiaryName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{b.beneficiaryAccountNumber}</div>
                      </div>
                      <span className="text-blue-600 font-bold text-[11px]">Pay →</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FUND TRANSFER WIZARD (WITH MPIN) */}
      {activeTab === 'transfer' && (
        <div className="max-w-2xl mx-auto">
          <div className="card p-6 sm:p-10 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Send Money / Fund Transfer</h2>
                <p className="text-xs text-slate-500">Instant 24x7 Settlement via NEFT, IMPS, or Internal Transfer</p>
              </div>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-5">
              {/* Transfer Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Transfer Mode</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button 
                    type="button"
                    onClick={() => setTransferType('INTERNAL_TRANSFER')}
                    className={`py-2 rounded-lg transition-all ${
                      transferType === 'INTERNAL_TRANSFER' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    Instant Internal
                  </button>
                  <button 
                    type="button"
                    onClick={() => setTransferType('IMPS')}
                    className={`py-2 rounded-lg transition-all ${
                      transferType === 'IMPS' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    IMPS (Instant)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setTransferType('NEFT')}
                    className={`py-2 rounded-lg transition-all ${
                      transferType === 'NEFT' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    NEFT (Batch)
                  </button>
                </div>
              </div>

              {/* Beneficiary Account Number Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex justify-between">
                  <span>Recipient Account Number *</span>
                  <span className="text-[11px] text-blue-600 lowercase font-medium">auto-verifies name</span>
                </label>
                <input 
                  type="text" 
                  required 
                  value={toAccount}
                  onChange={(e) => handleAccountLookup(e.target.value)}
                  placeholder="Enter 12-digit Beneficiary Account Number" 
                  className="input-field font-mono font-bold text-base" 
                />
              </div>

              {/* Instant Verified Recipient Badge */}
              {verifiedRecipient && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{verifiedRecipient.holderName}</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      {verifiedRecipient.branchName} • IFSC: {verifiedRecipient.ifscCode}
                    </div>
                  </div>
                  <span className="badge badge-active">MBI Verified</span>
                </div>
              )}

              {/* Name and IFSC for External transfers */}
              {(!verifiedRecipient || transferType !== 'INTERNAL_TRANSFER') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Beneficiary Name</label>
                    <input 
                      type="text" 
                      required 
                      value={beneficiaryName}
                      onChange={(e) => setBeneficiaryName(e.target.value)}
                      placeholder="e.g. Priya Patel" 
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">IFSC Code</label>
                    <input 
                      type="text" 
                      required 
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      placeholder="e.g. MBIN0001042" 
                      className="input-field font-mono uppercase font-bold" 
                    />
                  </div>
                </div>
              )}

              {/* Amount and Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Transfer Amount (₹) *</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    step="1"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="e.g. 2500" 
                    className="input-field font-mono font-bold text-lg" 
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    Available: <span className="font-mono font-bold text-slate-900">₹ {Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Remarks / Note</label>
                  <input 
                    type="text" 
                    value={transferDesc}
                    onChange={(e) => setTransferDesc(e.target.value)}
                    placeholder="e.g. Office dinner split" 
                    className="input-field" 
                  />
                </div>
              </div>

              {/* MANDATORY 4-DIGIT MPIN AUTHORIZATION */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-700" />
                    <span>Authorize with 4-Digit MPIN *</span>
                  </label>
                  {!profile.isMpinSet && (
                    <button 
                      type="button"
                      onClick={onOpenSetMpin}
                      className="text-xs text-blue-600 font-bold underline"
                    >
                      Set MPIN First
                    </button>
                  )}
                </div>

                <input 
                  type="password"
                  required
                  maxLength={4}
                  value={transferMpin}
                  onChange={(e) => setTransferMpin(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • •"
                  className="input-field text-center font-mono tracking-[0.5em] text-xl font-bold bg-white"
                />
                <p className="text-[11px] text-amber-800">
                  Required cryptographic confirmation with your confidential 4-digit MPIN.
                </p>
              </div>

              <button 
                type="submit"
                disabled={loading || !toAccount || !transferAmount || transferMpin.length !== 4 || account.status === 'FROZEN'}
                className="btn btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? (
                  <span>Processing Transfer & Updating Ledger...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Send ₹{transferAmount || '0'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 3: FULL ACCOUNT STATEMENT & E-RECEIPTS */}
      {activeTab === 'statement' && (
        <div className="space-y-4">
          <div className="card p-5 bg-white shadow-sm flex flex-col sm:flex-row justify-between gap-4">
            {/* Date Range Filter */}
            <form onSubmit={fetchCustomStatement} className="flex flex-wrap items-center gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">From Date:</span>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field text-xs py-1.5"
                />
              </div>
              <div>
                <span className="text-slate-400 block mb-1">To Date:</span>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field text-xs py-1.5"
                />
              </div>
              <div className="pt-5">
                <button type="submit" className="btn btn-primary text-xs py-2 px-3">
                  Apply Filter
                </button>
              </div>
            </form>

            {/* Keyword Search & Type Filter */}
            <div className="flex items-center gap-2 text-xs">
              <input 
                type="text" 
                value={txnSearch}
                onChange={(e) => setTxnSearch(e.target.value)}
                placeholder="Search description, UTR..."
                className="input-field text-xs py-2"
              />
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input-field text-xs py-2 w-28"
              >
                <option value="ALL">All Flows</option>
                <option value="CREDIT">Credits Only</option>
                <option value="DEBIT">Debits Only</option>
              </select>
            </div>
          </div>

          {/* Statement Table */}
          <div className="card overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
              <div className="font-extrabold text-slate-800 uppercase tracking-wider">
                Official Account Statement: {isDetailsRevealed ? account.accountNumber : '•••• •••• ••••'}
              </div>
              <button onClick={() => window.print()} className="btn btn-secondary text-xs px-3 py-1 flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5" />
                <span>Print Statement</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">UTR Reference</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Debit (₹)</th>
                    <th className="py-3 px-4 text-right">Credit (₹)</th>
                    <th className="py-3 px-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredStatementTxns.map((t) => {
                    const isCredit = t.toAccount && t.toAccount.accountNumber === account.accountNumber;
                    const isDebit = t.fromAccount && t.fromAccount.accountNumber === account.accountNumber;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-sans text-slate-600 whitespace-nowrap text-[11px]">
                          {new Date(t.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </td>
                        <td className="py-3 px-4 font-bold text-blue-700">{t.referenceNo}</td>
                        <td className="py-3 px-4 font-sans font-semibold text-slate-800">{t.description}</td>
                        <td className="py-3 px-4 font-sans">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {t.transactionType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-red-600 font-bold font-sans">
                          {isDebit ? `₹ ${Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-600 font-bold font-sans">
                          {isCredit ? `₹ ${Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td className="py-3 px-4 text-center font-sans">
                          <button 
                            onClick={() => setActiveReceipt(t)}
                            className="btn btn-secondary text-[10px] px-2.5 py-1"
                          >
                            Voucher
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: VIRTUAL PLATINUM DEBIT CARD CONTROLS */}
      {activeTab === 'card' && (
        <div className="max-w-xl mx-auto space-y-6">
          {!card?.isIssued ? (
            /* Case 1: Debit card not issued by Admin yet */
            <div className="card p-8 sm:p-10 bg-white shadow-md text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-sm">
                <CreditCard className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">No Debit Card Issued</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                A debit card has not been issued for your account by the branch administrator yet. Please request your branch admin to issue an MBI Virtual Platinum Debit Card.
              </p>
              <div className="inline-block text-[11px] font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                Status: Not Issued by Branch
              </div>
            </div>
          ) : !card?.isLinked ? (
            /* Case 2: Debit card IS issued by Admin, but NOT yet added by user via User ID, MPIN & OTP */
            <div className="card p-8 sm:p-10 bg-white shadow-md text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-sm ring-8 ring-purple-50">
                <CreditCard className="w-8 h-8" />
              </div>
              
              <div>
                <span className="badge badge-warning text-[10px] mb-2 font-bold uppercase tracking-wider">
                  Approved & Issued by Admin
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">MBI {cardBrand.displayName} Issued!</h2>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <div className="font-mono font-bold text-sm text-purple-700 bg-purple-50 py-1.5 px-3 rounded-lg border border-purple-200">
                    Card: {card?.cardNumberMasked || '•••• •••• •••• 4591'}
                  </div>
                  <span className="text-xs font-extrabold text-purple-700 bg-purple-100 py-1.5 px-3 rounded-lg uppercase">
                    {cardBrand.network}
                  </span>
                </div>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-3 leading-relaxed">
                  Your branch administrator has approved and issued your Virtual {cardBrand.displayName}. To securely add and activate this card on your digital banking dashboard, please authenticate using your <strong>User ID</strong>, <strong>4-digit MPIN</strong>, and <strong>OTP</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>3-Point Security Authentication:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-medium text-slate-600">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>1. User ID</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>2. 4-Digit MPIN</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>3. Mobile OTP</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAddCardUserId(profile.userId || '');
                  setAddCardMpin('');
                  setAddCardOtp('');
                  setAddCardError('');
                  setAddCardStep('ENTER_CREDENTIALS');
                  setShowAddCardModal(true);
                }}
                className="btn btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
              >
                <KeyRound className="w-4 h-4" />
                <span>Link & Add Debit Card (User ID + MPIN + OTP)</span>
              </button>
            </div>
          ) : (
            /* Case 3: Debit card IS issued and ALREADY added/linked by user */
            <div className="card p-6 sm:p-8 bg-white shadow-md text-center space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-left">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Virtual {cardBrand.displayName}</h2>
                  <p className="text-xs text-slate-500">Instant contactless & digital e-commerce management</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (isCardRevealed) {
                      setIsCardRevealed(false);
                      showToast('info', 'Debit card details hidden.');
                    } else {
                      setCardMpinInput('');
                      setCardMpinError('');
                      setShowCardMpinModal(true);
                    }
                  }}
                  className={`btn text-xs px-3.5 py-2 flex items-center gap-1.5 font-bold shrink-0 ${
                    isCardRevealed 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300' 
                      : 'btn-primary'
                  }`}
                >
                  {isCardRevealed ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide Details</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show Details (MPIN)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Security Notice Banner */}
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                isCardRevealed 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>
                    {isCardRevealed 
                      ? 'Card details unlocked. Keep your credentials confidential.' 
                      : 'Card details hidden for your protection. 4-digit MPIN required to view.'}
                  </span>
                </div>
                {isCardRevealed && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(card?.cardNumber || '');
                      showToast('success', 'Card number copied to clipboard.');
                    }}
                    className="font-bold text-[11px] underline ml-2 hover:text-emerald-900"
                  >
                    Copy Number
                  </button>
                )}
              </div>

              {/* Interactive Card */}
              <div 
                onClick={() => setCardFlipped(!cardFlipped)}
                className={`card-container ${cardFlipped ? 'flipped' : ''}`}
              >
                <div className="card-inner">
                  <div 
                    className="card-front"
                    style={{ background: cardBrand.bgGradient }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs tracking-wider text-blue-100 font-bold">MBI - MODERN BANK OF INDIA</span>
                      <span className="text-[10px] font-bold tracking-widest text-emerald-300 uppercase">{cardBrand.tierBadge}</span>
                    </div>
                    <div className="w-10 h-7 bg-amber-300 rounded shadow-inner my-2 flex items-center justify-center">
                      <div className="w-8 h-5 border border-amber-600 rounded"></div>
                    </div>
                    <div className="font-mono text-lg tracking-[0.2em] font-bold">
                      {isCardRevealed && card?.cardNumber 
                        ? card.cardNumber.replace(/(\d{4})/g, '$1 ').trim() 
                        : '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between items-end text-xs">
                      <div>
                        <div className="text-[9px] text-blue-200 uppercase">Cardholder</div>
                        <div className="font-bold tracking-wider font-mono">
                          {isCardRevealed ? card?.cardHolderName : '•••• ••••••••'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-blue-200 uppercase">Valid Thru</div>
                        <div className="font-mono font-bold">
                          {isCardRevealed ? `${card?.expiryMonth}/${card?.expiryYear}` : '••/••'}
                        </div>
                      </div>
                      <div>{cardBrand.logoLarge}</div>
                    </div>
                  </div>

                  <div className="card-back">
                    <div className="magnetic-strip"></div>
                    <div className="flex justify-between items-center my-3 px-2">
                      <div className="text-[9px] text-slate-400">Security CVV</div>
                      <div className="card-signature">
                        CVV: {isCardRevealed ? card?.cvv : '•••'}
                      </div>
                    </div>
                    <div className="text-[9px] text-slate-400 leading-relaxed text-center px-4">
                      Authorized signature required. This card remains property of Modern Bank Of India.
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Tap card to flip between front and back
              </div>

              {/* Card Scheme & Limit Specifications */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left">
                <div>
                  <span className="text-slate-400">Card Scheme / Network:</span>
                  <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                    <span>{cardBrand.displayName}</span>
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded uppercase">
                      {cardBrand.network}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Daily Transaction Limit:</span>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">
                    ₹ {Number(card?.dailyLimit || 50000).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Security Controls */}
              <div className="pt-4 border-t border-slate-100 space-y-4 text-left">
                <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Card Freeze / Temporary Lock</div>
                    <div className="text-xs text-slate-500">Block all POS and online transactions instantly</div>
                  </div>
                  <button 
                    onClick={() => setShowCardMpinPrompt(!showCardMpinPrompt)}
                    className={`btn text-xs px-4 py-2 ${card?.isActive ? 'btn-danger' : 'btn-success'}`}
                  >
                    {card?.isActive ? 'Freeze Card' : 'Unfreeze Card'}
                  </button>
                </div>

                {/* MPIN Prompt for Card Toggle */}
                {showCardMpinPrompt && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                    <div className="text-xs font-bold text-amber-900">
                      Authorize Card Status Change with 4-Digit MPIN:
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="password"
                        maxLength={4}
                        value={cardFreezeMpin}
                        onChange={(e) => setCardFreezeMpin(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 4-digit MPIN"
                        className="input-field text-center font-mono tracking-widest text-base font-bold bg-white"
                      />
                      <button 
                        onClick={handleToggleCardFreeze}
                        disabled={loading || cardFreezeMpin.length !== 4}
                        className="btn btn-primary text-xs px-4 shrink-0 font-bold"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 5: BENEFICIARY MANAGER */}
      {activeTab === 'beneficiaries' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Add Beneficiary Form */}
          <div className="xl:col-span-5">
            <div className="card p-6 bg-white shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Add New Beneficiary</h3>
              </div>

              <form onSubmit={handleAddBeneficiary} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Beneficiary Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={newBeneName}
                    onChange={(e) => setNewBeneName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar" 
                    className="input-field" 
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Account Number *</label>
                  <input 
                    type="text" 
                    required 
                    value={newBeneAcc}
                    onChange={(e) => setNewBeneAcc(e.target.value)}
                    placeholder="Enter 12-digit account number" 
                    className="input-field font-mono font-bold" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">IFSC Code</label>
                    <input 
                      type="text" 
                      value={newBeneIfsc}
                      onChange={(e) => setNewBeneIfsc(e.target.value.toUpperCase())}
                      className="input-field font-mono uppercase" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Bank Name</label>
                    <input 
                      type="text" 
                      value={newBeneBank}
                      onChange={(e) => setNewBeneBank(e.target.value)}
                      className="input-field" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nickname (Optional)</label>
                  <input 
                    type="text" 
                    value={newBeneNick}
                    onChange={(e) => setNewBeneNick(e.target.value)}
                    placeholder="e.g. Landlord, Landlady" 
                    className="input-field" 
                  />
                </div>

                {/* MPIN for adding payee */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <label className="block font-bold text-amber-950 uppercase mb-1">Authorize with 4-Digit MPIN</label>
                  <input 
                    type="password" 
                    required 
                    maxLength={4}
                    value={newBeneMpin}
                    onChange={(e) => setNewBeneMpin(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • •" 
                    className="input-field text-center font-mono tracking-widest text-base font-bold bg-white" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !newBeneName || !newBeneAcc || newBeneMpin.length !== 4}
                  className="btn btn-primary w-full py-2.5 font-bold"
                >
                  Save Beneficiary Payee
                </button>
              </form>
            </div>
          </div>

          {/* Beneficiaries List */}
          <div className="xl:col-span-7 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Saved Payees ({beneficiaries.length})</h3>
            
            {beneficiaries.length === 0 ? (
              <div className="card p-8 text-center text-slate-400 text-xs">
                No saved beneficiaries. Add frequent contacts using the form.
              </div>
            ) : (
              <div className="space-y-3">
                {beneficiaries.map((b) => (
                  <div key={b.id} className="card p-4 flex justify-between items-center shadow-sm">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{b.beneficiaryName}</div>
                      <div className="font-mono text-xs text-slate-500">
                        {b.beneficiaryAccountNumber} • {b.ifscCode}
                      </div>
                      <div className="text-[11px] text-blue-600 font-medium">
                        {b.bankName} {b.nickname ? `(${b.nickname})` : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          handleAccountLookup(b.beneficiaryAccountNumber);
                          setActiveTab('transfer');
                        }}
                        className="btn btn-primary text-xs px-3 py-1.5"
                      >
                        Transfer
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm(`Remove ${b.beneficiaryName}?`)) {
                            await api.customerDeleteBeneficiary(b.id);
                            loadDashboard();
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 6: KYC PROFILE & SECURITY */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="card p-6 sm:p-8 bg-white shadow-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">KYC Verification & Security Dossier</h2>
                <p className="text-xs text-slate-500 font-mono">Government Identity Compliance • Verified Status</p>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Account Holder Name</span>
                <span className="font-bold text-slate-900">{profile.fullName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Assigned Customer User ID</span>
                <span className="font-mono font-bold text-blue-700">{profile.userId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Aadhaar Card (e-KYC)</span>
                <span className="font-mono font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{profile.aadhaarMasked}</span>
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">PAN Card</span>
                <span className="font-mono font-bold text-slate-800">{profile.panNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Registered Mobile</span>
                <span className="font-mono font-bold text-slate-800">{profile.mobileNumber}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Registered Email</span>
                <span className="font-bold text-slate-800">{profile.email}</span>
              </div>
            </div>

            {/* Security Options */}
            <div className="p-4 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <div>
                <div className="font-bold text-slate-900">4-Digit MPIN Status</div>
                <div className="text-slate-500">
                  {profile.isMpinSet ? 'Active and secured with BCrypt hash' : 'Not set yet'}
                </div>
              </div>
              <button 
                onClick={onOpenSetMpin}
                className="btn btn-secondary text-xs px-4 py-2"
              >
                {profile.isMpinSet ? 'Change 4-Digit MPIN' : 'Set Up 4-Digit MPIN'}
              </button>
            </div>
          </div>
        </div>
      )}

      </div>{/* End Active Section Content */}

      </div>{/* End Main Dashboard Layout */}

      {/* MODAL: MPIN VERIFICATION TO REVEAL ACCOUNT CREDENTIALS (ACC NO, IFSC, USER ID) */}
      {showDetailsMpinModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-sm p-6 sm:p-7 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Security Verification</h3>
                  <p className="text-[11px] text-slate-500 font-medium">4-Digit MPIN Authorization</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowDetailsMpinModal(false);
                  setDetailsMpinInput('');
                  setDetailsMpinError('');
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              To reveal your full unmasked <strong>Account Number</strong>, <strong>IFSC Code</strong>, and <strong>User ID</strong> on your dashboard, enter your confidential <strong>4-digit MPIN</strong>:
            </p>

            <form onSubmit={handleVerifyMpinForDetails} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                  Enter 4-Digit MPIN
                </label>
                <input 
                  type="password"
                  autoFocus
                  maxLength={4}
                  value={detailsMpinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setDetailsMpinInput(val);
                    if (detailsMpinError) setDetailsMpinError('');
                  }}
                  placeholder="••••"
                  className="input-field text-center font-mono tracking-[0.5em] text-2xl font-bold py-2.5 bg-slate-50 border-slate-300"
                />
              </div>

              {detailsMpinError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{detailsMpinError}</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDetailsMpinModal(false);
                    setDetailsMpinInput('');
                    setDetailsMpinError('');
                  }}
                  className="btn btn-secondary text-xs flex-1 py-2.5 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingDetailsMpin || detailsMpinInput.length !== 4}
                  className="btn btn-primary text-xs flex-1 py-2.5 font-bold flex items-center justify-center gap-1.5"
                >
                  {isVerifyingDetailsMpin ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock Details</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MPIN VERIFICATION TO REVEAL DEBIT CARD DETAILS */}
      {showCardMpinModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-sm p-6 sm:p-7 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Security Verification</h3>
                  <p className="text-[11px] text-slate-500 font-medium">4-Digit MPIN Authorization</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowCardMpinModal(false);
                  setCardMpinInput('');
                  setCardMpinError('');
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              To reveal your full unmasked 16-digit debit card number, valid thru date, and 3-digit CVV, enter your personal <strong>4-digit MPIN</strong>:
            </p>

            <form onSubmit={handleVerifyMpinForCard} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                  Enter 4-Digit MPIN
                </label>
                <input 
                  type="password"
                  autoFocus
                  maxLength={4}
                  value={cardMpinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setCardMpinInput(val);
                    if (cardMpinError) setCardMpinError('');
                  }}
                  placeholder="••••"
                  className="input-field text-center font-mono tracking-[0.5em] text-2xl font-bold py-2.5 bg-slate-50 border-slate-300"
                />
              </div>

              {cardMpinError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cardMpinError}</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCardMpinModal(false);
                    setCardMpinInput('');
                    setCardMpinError('');
                  }}
                  className="btn btn-secondary text-xs flex-1 py-2.5 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingCardMpin || cardMpinInput.length !== 4}
                  className="btn btn-primary text-xs flex-1 py-2.5 font-bold flex items-center justify-center gap-1.5"
                >
                  {isVerifyingCardMpin ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock Details</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LINK & ADD DEBIT CARD (USER ID + 4-DIGIT MPIN + OTP) */}
      {showAddCardModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6 sm:p-8 max-w-md">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Add & Link Debit Card</h3>
                  <p className="text-xs text-slate-500">Security verification via User ID, MPIN & OTP</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowAddCardModal(false);
                  setAddCardError('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Issued Card Brief */}
            <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs text-purple-950 mb-5 flex justify-between items-center">
              <div>
                <span className="font-bold text-[10px] uppercase tracking-wider text-purple-700">Issued Card</span>
                <div className="font-mono font-bold text-sm text-slate-900">
                  {card?.cardNumberMasked || '•••• •••• •••• 4591'}
                </div>
                <div className="text-[10px] text-purple-800">MBI Platinum Visa • Daily Limit ₹50,000</div>
              </div>
              <span className="badge badge-warning text-[10px]">Awaiting Link</span>
            </div>

            {/* Error Message */}
            {addCardError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addCardError}</span>
              </div>
            )}

            {/* STEP 1: Enter User ID & 4-Digit MPIN */}
            {addCardStep === 'ENTER_CREDENTIALS' && (
              <form onSubmit={handleRequestAddCardOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Step 1: Confirm User ID *
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      value={addCardUserId}
                      onChange={(e) => setAddCardUserId(e.target.value)}
                      placeholder="e.g. CUST100821" 
                      className="input-field pl-10 font-mono font-bold" 
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex justify-between">
                    <span>Step 2: Enter 4-Digit MPIN *</span>
                    <span className="text-[11px] text-blue-600 lowercase font-medium">cryptographic authorization</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="password" 
                      required 
                      autoFocus
                      maxLength={4}
                      value={addCardMpin}
                      onChange={(e) => setAddCardMpin(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • •" 
                      className="input-field pl-10 text-center font-mono tracking-[0.5em] text-xl font-bold bg-white" 
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your personal 4-digit MPIN is verified before an OTP is dispatched.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={addCardLoading || !addCardUserId || addCardMpin.length !== 4}
                  className="btn btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                >
                  {addCardLoading ? (
                    <span>Verifying MPIN & Generating OTP...</span>
                  ) : (
                    <>
                      <span>Proceed to Mobile OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Enter OTP */}
            {addCardStep === 'VERIFY_OTP' && (
              <form onSubmit={handleVerifyAddCard} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-900">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>OTP Sent to Registered Mobile</span>
                  </div>
                  <div className="text-xs text-slate-600 font-mono font-semibold">
                    {addCardMobileMasked}
                  </div>
                  {addCardOtpPreview && (
                    <div className="pt-1.5 border-t border-blue-200/80">
                      <span className="inline-block bg-white px-2.5 py-0.5 rounded border border-blue-300 text-blue-700 text-xs font-mono font-bold">
                        Demo OTP: {addCardOtpPreview}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                    Step 3: Enter 6-Digit Verification OTP *
                  </label>
                  <input 
                    type="text" 
                    required 
                    autoFocus
                    maxLength={6}
                    value={addCardOtp}
                    onChange={(e) => setAddCardOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •" 
                    className="input-field text-center font-mono tracking-[0.5em] text-2xl font-bold py-3 bg-white" 
                  />
                </div>

                <button 
                  type="submit"
                  disabled={addCardLoading || addCardOtp.length !== 6}
                  className="btn btn-success w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  {addCardLoading ? (
                    <span>Validating OTP & Activating Card...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify OTP & Link Debit Card</span>
                    </>
                  )}
                </button>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                  <button 
                    type="button" 
                    onClick={() => {
                      setAddCardStep('ENTER_CREDENTIALS');
                      setAddCardError('');
                    }}
                    className="hover:text-slate-900 underline"
                  >
                    ← Back to MPIN
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAddCardOtp(addCardOtpPreview)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    Auto-fill Demo OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: PRINTABLE TRANSACTION E-RECEIPT VOUCHER */}
      {activeReceipt && (
        <div className="modal-overlay">
          <div className="modal-content p-6 sm:p-8 max-w-lg printable-area">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Official Electronic Receipt</h3>
                  <p className="text-xs text-slate-500 font-mono">MBI - MODERN BANK OF INDIA • CLEARANCE VOUCHER</p>
                </div>
              </div>
              <button onClick={() => setActiveReceipt(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs font-mono">
              <div className="text-center pb-3 border-b border-slate-200">
                <span className="badge badge-active">{activeReceipt.status}</span>
                <div className="text-2xl font-extrabold text-slate-900 font-sans mt-2">
                  ₹ {Number(activeReceipt.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-slate-500 font-sans text-[11px] mt-0.5">{activeReceipt.description}</div>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Transaction UTR:</span>
                  <span className="font-bold text-blue-700">{activeReceipt.referenceNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Timestamp:</span>
                  <span className="text-slate-800">
                    {new Date(activeReceipt.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Payment Mode:</span>
                  <span className="text-slate-800">{activeReceipt.transactionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Debited Account:</span>
                  <span className="text-slate-800">
                    {activeReceipt.fromAccount ? activeReceipt.fromAccount.accountNumber : 'Branch Counter Cash'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Credited Account:</span>
                  <span className="text-slate-800">
                    {activeReceipt.toAccount ? activeReceipt.toAccount.accountNumber : 'Branch Cash Dispense'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => window.print()}
                className="btn btn-secondary text-xs flex-1 py-2.5 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Voucher</span>
              </button>
              <button 
                onClick={() => setActiveReceipt(null)}
                className="btn btn-primary text-xs px-6 py-2.5 font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
