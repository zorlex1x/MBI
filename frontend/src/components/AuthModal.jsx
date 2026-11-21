import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  User, 
  KeyRound, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ isOpen, onClose, initialTab = 'CUSTOMER', onLoginSuccess }) {
  const [tab, setTab] = useState(initialTab); // 'CUSTOMER', 'MPIN', 'ADMIN'
  const [step, setStep] = useState('CREDENTIALS'); // 'CREDENTIALS' or 'OTP'
  
  // Saved user for second-time MPIN-only login
  const [savedUser, setSavedUser] = useState(null);
  const [useSavedMpinOnly, setUseSavedMpinOnly] = useState(false);

  // Form fields
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [mpin, setMpin] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // OTP state
  const [maskedMobile, setMaskedMobile] = useState('');
  const [otpPreview, setOtpPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (isOpen) {
      let su = null;
      try {
        su = JSON.parse(localStorage.getItem('mbi_saved_user') || 'null');
      } catch (e) {}
      setSavedUser(su);

      if (initialTab === 'ADMIN') {
        setTab('ADMIN');
        setUseSavedMpinOnly(false);
      } else if (su && su.userId && su.isMpinSet) {
        setTab('MPIN');
        setUserId(su.userId);
        setUseSavedMpinOnly(true);
      } else {
        setTab(initialTab);
        setUseSavedMpinOnly(false);
      }
      setMpin('');
      setPassword('');
      setOtpCode('');
      setError('');
      setInfo('');
      setStep('CREDENTIALS');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const resetForm = () => {
    setUserId('');
    setPassword('');
    setMpin('');
    setOtpCode('');
    setError('');
    setInfo('');
    setStep('CREDENTIALS');
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    resetForm();
  };

  const fillDemoCredentials = (role) => {
    setError('');
    setInfo('');
    if (role === 'ADMIN') {
      setTab('ADMIN');
      setUserId('admin');
      setPassword('Admin@12345');
    }
  };

  // Step 1: Password or MPIN or Admin submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (tab === 'MPIN') {
        const targetUserId = (useSavedMpinOnly && savedUser?.userId) ? savedUser.userId : userId.trim();
        const res = await api.login({
          userId: targetUserId,
          mpin: mpin.trim(),
          loginType: 'MPIN'
        });

        if (res.success) {
          localStorage.setItem('apex_user', JSON.stringify(res));
          if (res.isMpinSet) {
            try {
              localStorage.setItem('mbi_saved_user', JSON.stringify({
                userId: res.userId,
                fullName: res.fullName,
                isMpinSet: true
              }));
            } catch (e) {}
          }
          onLoginSuccess(res);
          onClose();
        } else {
          setError(res.message || 'MPIN authentication failed.');
        }
      } else if (tab === 'CUSTOMER') {
        // Customer standard password login -> triggers OTP
        const res = await api.login({
          userId: userId.trim(),
          password: password,
          loginType: 'PASSWORD'
        });

        if (res.success && res.requiresOtp) {
          setMaskedMobile(res.mobileMasked);
          setOtpPreview(res.otpPreview);
          setStep('OTP');
          setInfo(res.message || 'OTP sent to your registered mobile number.');
        } else if (res.success) {
          localStorage.setItem('apex_user', JSON.stringify(res));
          if (res.isMpinSet) {
            try {
              localStorage.setItem('mbi_saved_user', JSON.stringify({
                userId: res.userId,
                fullName: res.fullName,
                isMpinSet: true
              }));
            } catch (e) {}
          }
          onLoginSuccess(res);
          onClose();
        } else {
          setError(res.message || 'Invalid User ID or Password.');
        }
      } else if (tab === 'ADMIN') {
        const res = await api.login({
          userId: userId.trim(),
          password: password,
          loginType: 'PASSWORD'
        });

        if (res.success) {
          localStorage.setItem('apex_user', JSON.stringify(res));
          onLoginSuccess(res);
          onClose();
        } else {
          setError(res.message || 'Admin authentication failed.');
        }
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Customer Login OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.verifyOtp({
        userId: userId.trim(),
        otpCode: otpCode.trim(),
        purpose: 'LOGIN_2FA'
      });

      if (res.success) {
        localStorage.setItem('apex_user', JSON.stringify(res));
        if (res.isMpinSet) {
          try {
            localStorage.setItem('mbi_saved_user', JSON.stringify({
              userId: res.userId,
              fullName: res.fullName,
              isMpinSet: true
            }));
          } catch (e) {}
        }
        onLoginSuccess(res);
        onClose();
      } else {
        setError(res.message || 'Invalid or expired OTP.');
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 sm:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">MBI Secure Banking Portal</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Multi-factor authorized banking gateway</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Only shown when not in dedicated returning-user MPIN-only mode) */}
        {step === 'CREDENTIALS' && !useSavedMpinOnly && (
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-6 text-xs font-semibold">
            <button 
              type="button"
              onClick={() => handleTabChange('CUSTOMER')}
              className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${tab === 'CUSTOMER' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <User className="w-3.5 h-3.5" />
              <span>User Login</span>
            </button>
            <button 
              type="button"
              onClick={() => handleTabChange('MPIN')}
              className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${tab === 'MPIN' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>MPIN Quick</span>
            </button>
            <button 
              type="button"
              onClick={() => handleTabChange('ADMIN')}
              className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${tab === 'ADMIN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Bank Admin</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Info Alert */}
        {info && (
          <div className="mb-5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
            <span>{info}</span>
          </div>
        )}

        {/* STEP 1: CREDENTIALS FORM */}
        {step === 'CREDENTIALS' && (
          useSavedMpinOnly && savedUser ? (
            /* Dedicated Second-Time MPIN-Only Login Screen */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Welcome Back</div>
                    <div className="font-extrabold text-slate-900 text-base">{savedUser.fullName}</div>
                    <div className="text-[11px] font-mono text-slate-500 font-semibold">{savedUser.userId}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="badge badge-active text-[10px]">MPIN Login</span>
                </div>
              </div>

              {/* Only MPIN input is requested from the user */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                  Enter 4-Digit MPIN
                </label>
                <div className="relative">
                  <input 
                    type="password"
                    required
                    autoFocus
                    maxLength={4}
                    value={mpin}
                    onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • •"
                    className="input-field text-center tracking-[0.6em] text-2xl font-mono py-3 font-bold bg-white shadow-inner"
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center mt-1.5">
                  Second-time instant biometric & MPIN authentication (no OTP needed).
                </p>
              </div>

              <button 
                type="submit"
                disabled={loading || mpin.length !== 4}
                className="btn btn-success w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Unlock Account & Log In</span>
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <button 
                  type="button"
                  onClick={() => {
                    setUseSavedMpinOnly(false);
                    setTab('CUSTOMER');
                    setUserId('');
                    setMpin('');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                >
                  Switch User or Password Login
                </button>

                <button 
                  type="button"
                  onClick={() => {
                    setUseSavedMpinOnly(false);
                    setTab('ADMIN');
                    setUserId('admin');
                    setPassword('Admin@12345');
                  }}
                  className="text-slate-500 hover:text-slate-800 font-medium hover:underline"
                >
                  Bank Admin Portal →
                </button>
              </div>
            </form>
          ) : (
            /* Standard Full Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {savedUser && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex justify-between items-center">
                  <span className="text-emerald-800 text-[11px]">
                    Logged in earlier as <span className="font-bold">{savedUser.fullName}</span>?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUseSavedMpinOnly(true);
                      setUserId(savedUser.userId);
                      setTab('MPIN');
                    }}
                    className="text-emerald-700 font-bold hover:underline text-[11px]"
                  >
                    Use 4-Digit MPIN →
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {tab === 'ADMIN' ? 'Admin Username / Email' : 'Customer User ID or Account Number'}
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder={tab === 'ADMIN' ? 'e.g. admin' : 'e.g. CUST100821 or 100924018821'}
                    className="input-field pl-10"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* If MPIN Tab: Show 4-digit MPIN input */}
              {tab === 'MPIN' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex justify-between">
                    <span>4-Digit Confidential MPIN</span>
                    <span className="text-emerald-600 font-semibold lowercase">quick login (no otp)</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="password"
                      required
                      maxLength={4}
                      value={mpin}
                      onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • •"
                      className="input-field pl-10 text-center tracking-[0.5em] text-xl font-mono"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Direct single-step authentication using your registered 4-digit MPIN (no OTP needed).</p>
                </div>
              ) : (
                /* Password Input for Customer and Admin */
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex justify-between">
                    <span>Password</span>
                    {tab === 'CUSTOMER' && (
                      <span className="text-blue-600 text-[11px] font-medium">Step 1 of 2 (OTP Follows)</span>
                    )}
                  </label>
                  <div className="relative">
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="input-field pl-10"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className={`btn w-full py-3 text-sm flex items-center justify-center gap-2 mt-2 ${tab === 'MPIN' ? 'btn-success' : 'btn-primary'}`}
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : tab === 'CUSTOMER' ? (
                  <>
                    <span>Verify & Proceed to OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : tab === 'MPIN' ? (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Log In with 4-Digit MPIN</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Access Admin Console</span>
                  </>
                )}
              </button>

              {/* Quick Demo Fill Buttons */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Instant Admin Access
                </p>
                <div className="flex justify-center">
                  <button 
                    type="button"
                    onClick={() => fillDemoCredentials('ADMIN')}
                    className="text-xs px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-bold transition-colors border border-slate-200"
                  >
                    Fill Bank Admin (Master Console)
                  </button>
                </div>
              </div>
            </form>
          )
        )}

        {/* STEP 2: CUSTOMER 2FA OTP VERIFICATION */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Two-Factor Authentication</h3>
              <p className="text-xs text-slate-600 mt-1">
                Enter the 6-digit OTP sent to registered mobile <span className="font-mono font-bold text-slate-900">{maskedMobile}</span>
              </p>
              {otpPreview && (
                <div className="mt-2.5 inline-block bg-white px-3 py-1 rounded-full border border-blue-300 text-blue-700 text-xs font-mono font-bold">
                  Demo Simulated SMS OTP: {otpPreview}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                6-Digit Security OTP
              </label>
              <input 
                type="text"
                required
                maxLength={6}
                autoFocus
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="input-field text-center tracking-[0.5em] text-2xl font-mono py-3 font-bold"
              />
            </div>

            <button 
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="btn btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 font-bold"
            >
              {loading ? (
                <span>Validating OTP...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP & Open NetBanking</span>
                </>
              )}
            </button>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
              <button 
                type="button"
                onClick={() => setStep('CREDENTIALS')}
                className="hover:text-slate-900 underline"
              >
                ← Back to Password
              </button>
              <button 
                type="button"
                onClick={() => {
                  setOtpCode(otpPreview);
                  setInfo('Demo OTP filled.');
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Auto-fill Demo OTP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
