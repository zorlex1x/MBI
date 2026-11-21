import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Smartphone, 
  ArrowRight, 
  ArrowLeft,
  X,
  Check,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function SetMpinModal({ isOpen, onClose, user, onMpinSetSuccess }) {
  const [step, setStep] = useState('ENTER_MPIN'); // 'ENTER_MPIN' or 'VERIFY_OTP'
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [maskedMobile, setMaskedMobile] = useState('');
  const [otpPreview, setOtpPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const userId = user?.userId;
  const birthYear = user?.birthYear || (user?.dateOfBirth ? String(user.dateOfBirth).slice(0, 4) : null);
  const isFirstLogin = !user?.isMpinSet;

  useEffect(() => {
    if (isOpen) {
      setStep('ENTER_MPIN');
      setMpin('');
      setConfirmMpin('');
      setOtpCode('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Criteria checks
  const isLengthValid = mpin.length === 4 && /^\d{4}$/.test(mpin);
  const isNot1234 = mpin !== '1234';
  const isNotFourSame = !(
    mpin.length === 4 && 
    mpin[0] === mpin[1] && 
    mpin[1] === mpin[2] && 
    mpin[2] === mpin[3]
  );
  const isNotBirthYear = !birthYear || (mpin.length === 4 && mpin !== String(birthYear));
  const isMatch = mpin.length === 4 && mpin === confirmMpin;

  const allCriteriaMet = isLengthValid && isNot1234 && isNotFourSame && isNotBirthYear && isMatch;

  // Step 1: Send OTP to Mobile
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLengthValid) {
      setError('MPIN must be exactly 4 numeric digits.');
      return;
    }
    if (!isNot1234) {
      setError('MPIN cannot be "1234". Please choose a more secure 4-digit code.');
      return;
    }
    if (!isNotFourSame) {
      setError('MPIN cannot consist of four identical numbers (e.g. 1111, 2222).');
      return;
    }
    if (!isNotBirthYear) {
      setError(`MPIN cannot be your birth year (${birthYear}).`);
      return;
    }
    if (!isMatch) {
      setError('MPIN and Confirm MPIN do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.requestMpinOtp({
        userId,
        mpin,
        confirmMpin
      });

      if (res.success) {
        setOtpPreview(res.data?.otpPreview || '');
        setMaskedMobile(res.data?.mobileMasked || '');
        setStep('VERIFY_OTP');
      } else {
        setError(res.message || 'Failed to generate verification OTP.');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with core banking server.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and save MPIN
  const handleVerifyOtpAndSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.setMpin({
        userId,
        mpin,
        confirmMpin,
        otpCode: otpCode.trim()
      });

      if (res.success) {
        setSuccess(true);
        try {
          localStorage.setItem('mbi_saved_user', JSON.stringify({
            userId: user?.userId || userId,
            fullName: user?.fullName || 'Customer',
            isMpinSet: true
          }));
        } catch (e) {}
        setTimeout(() => {
          onMpinSetSuccess();
          if (onClose) onClose();
        }, 1800);
      } else {
        setError(res.message || 'OTP verification failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while saving 4-digit MPIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 sm:p-8 max-w-md relative">
        {/* Close Button - ONLY if not mandatory first login */}
        {!isFirstLogin && (
          <button 
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100 shadow-sm">
            <KeyRound className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {isFirstLogin ? 'Set Up Mandatory 4-Digit MPIN' : 'Update Your 4-Digit MPIN'}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {isFirstLogin ? (
              <span className="text-blue-700 font-semibold">
                First-Time Login Security Setup: You must set your confidential 4-digit MPIN with mobile OTP verification to activate your account.
              </span>
            ) : (
              <span>
                Your 4-digit MPIN will be used for <strong className="text-slate-800">Quick Login</strong> and <strong className="text-slate-800">Authorizing Transfers</strong>.
              </span>
            )}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* SUCCESS VIEW */}
        {success ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-emerald-800 space-y-2.5">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="text-base font-extrabold text-emerald-950">4-Digit MPIN Activated!</div>
            <p className="text-xs text-emerald-700">
              Your MPIN is securely saved with cryptographic BCrypt hashing. You can now use quick MPIN login without OTP and authorize banking transactions.
            </p>
            <div className="text-[11px] text-emerald-600 font-mono font-bold animate-pulse pt-1">
              Opening Secure NetBanking Dashboard...
            </div>
          </div>
        ) : step === 'ENTER_MPIN' ? (
          /* STEP 1: ENTER 4-DIGIT MPIN TWICE */
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Enter New 4-Digit MPIN *
              </label>
              <input 
                type="password"
                required
                maxLength={4}
                autoFocus
                value={mpin}
                onChange={(e) => {
                  setMpin(e.target.value.replace(/\D/g, ''));
                  if (error) setError('');
                }}
                placeholder="• • • •"
                className="input-field text-center tracking-[0.5em] text-2xl font-mono py-2.5 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Re-Enter 4-Digit MPIN (Confirm) *
              </label>
              <input 
                type="password"
                required
                maxLength={4}
                value={confirmMpin}
                onChange={(e) => {
                  setConfirmMpin(e.target.value.replace(/\D/g, ''));
                  if (error) setError('');
                }}
                placeholder="• • • •"
                className="input-field text-center tracking-[0.5em] text-2xl font-mono py-2.5 font-bold"
              />
            </div>

            {/* Criteria Checklist */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                MPIN Security Requirements:
              </div>
              
              <div className="space-y-1.5 text-[11px]">
                <div className={`flex items-center gap-2 ${isLengthValid ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isLengthValid ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                    {isLengthValid ? <Check className="w-2.5 h-2.5" /> : '•'}
                  </span>
                  <span>Exactly 4 numeric digits</span>
                </div>

                <div className={`flex items-center gap-2 ${mpin && isNot1234 ? 'text-emerald-700 font-semibold' : mpin === '1234' ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${mpin && isNot1234 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                    {mpin && isNot1234 ? <Check className="w-2.5 h-2.5" /> : '•'}
                  </span>
                  <span>Cannot be <strong>1234</strong></span>
                </div>

                <div className={`flex items-center gap-2 ${mpin.length === 4 && isNotFourSame ? 'text-emerald-700 font-semibold' : !isNotFourSame && mpin.length === 4 ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${mpin.length === 4 && isNotFourSame ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                    {mpin.length === 4 && isNotFourSame ? <Check className="w-2.5 h-2.5" /> : '•'}
                  </span>
                  <span>Cannot be 4 same numbers (e.g. 1111, 2222)</span>
                </div>

                {birthYear && (
                  <div className={`flex items-center gap-2 ${mpin.length === 4 && isNotBirthYear ? 'text-emerald-700 font-semibold' : !isNotBirthYear && mpin.length === 4 ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${mpin.length === 4 && isNotBirthYear ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                      {mpin.length === 4 && isNotBirthYear ? <Check className="w-2.5 h-2.5" /> : '•'}
                    </span>
                    <span>Cannot be your birth year ({birthYear})</span>
                  </div>
                )}

                <div className={`flex items-center gap-2 ${isMatch ? 'text-emerald-700 font-semibold' : confirmMpin ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isMatch ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                    {isMatch ? <Check className="w-2.5 h-2.5" /> : '•'}
                  </span>
                  <span>Both entered MPINs match</span>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !allCriteriaMet}
              className="btn btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validating & Dispatching OTP...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Proceed to Mobile OTP Verification →</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: VERIFY OTP AND ACTIVATE MPIN */
          <form onSubmit={handleVerifyOtpAndSave} className="space-y-5">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-900">OTP Verification Required</div>
              <p className="text-[11px] text-slate-600">
                To confirm and activate your 4-digit MPIN, enter the 6-digit verification OTP sent to registered mobile <span className="font-mono font-bold text-slate-900">{maskedMobile}</span>.
              </p>
              {otpPreview && (
                <div className="inline-block bg-white px-3 py-1 rounded-full border border-blue-300 text-blue-700 text-xs font-mono font-bold shadow-sm">
                  Simulated SMS OTP: {otpPreview}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                Enter 6-Digit OTP Code
              </label>
              <input 
                type="text"
                required
                maxLength={6}
                autoFocus
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, ''));
                  if (error) setError('');
                }}
                placeholder="• • • • • •"
                className="input-field text-center tracking-[0.5em] text-2xl font-mono py-3 font-bold bg-slate-50"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setOtpCode(otpPreview)}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold underline"
              >
                Auto-fill Demo OTP ({otpPreview})
              </button>
            </div>

            <button 
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="btn btn-success w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying OTP & Securing MPIN...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP & Activate 4-Digit MPIN</span>
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button 
                type="button"
                onClick={() => {
                  setStep('ENTER_MPIN');
                  setError('');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change 4-Digit MPIN</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}