import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ArrowRightLeft, 
  CreditCard, 
  FileText, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  Smartphone, 
  BadgePercent, 
  Users, 
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function LandingPage({ onOpenAuth }) {
  const [preRegSubmitted, setPreRegSubmitted] = useState(false);
  const [preRegName, setPreRegName] = useState('');
  const [preRegMobile, setPreRegMobile] = useState('');
  const [preRegEmail, setPreRegEmail] = useState('');

  const handlePreReg = (e) => {
    e.preventDefault();
    setPreRegSubmitted(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-b border-slate-200 py-16 sm:py-24">
        <div className="app-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Call to Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>MBI • Modern Bank Of India</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Banking Built with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-600 to-indigo-600">Absolute Integrity</span> & Modern Power
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Welcome to <strong>MBI - Modern Bank Of India</strong>. Experience seamless NEFT & IMPS fund transfers, verified Aadhaar KYC onboarding, and hardware-grade 4-digit MPIN authorization. Built on a strict real-time double-entry ledger without simulated dummy balances.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3.5 pt-2">
                <button 
                  onClick={() => onOpenAuth('CUSTOMER')}
                  className="btn btn-primary text-base px-6 py-3.5 flex items-center gap-2 shadow-lg"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                  <span>Customer NetBanking</span>
                </button>

                <button 
                  onClick={() => onOpenAuth('ADMIN')}
                  className="btn btn-secondary text-base px-6 py-3.5 flex items-center gap-2 border-slate-300"
                >
                  <Lock className="w-5 h-5 text-blue-600" />
                  <span>Admin Management Console</span>
                </button>
              </div>

              {/* Regulatory Assurance Highlights */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Reserve Bank of India Regulated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Strict Double-Entry Ledger</span>
                </div>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <span>4-Digit MPIN Protected</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Digital Banking Hub & Live Rates Preview (No Card Details) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Virtual Banking Hub Showcase */}
              <div className="card p-6 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 border-blue-100 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded-md">
                      MBI Digital Banking Hub
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">Verified Real-Time Banking</h3>
                  </div>
                  <div className="w-12 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                    MBI
                  </div>
                </div>

                {/* Core Network & Vault Status */}
                <div className="bg-gradient-to-tr from-slate-900 via-blue-950 to-blue-900 text-white p-5 rounded-2xl shadow-md space-y-4">
                  <div className="flex justify-between items-center text-xs text-blue-200">
                    <span className="font-bold tracking-wider font-mono">MODERN BANK OF INDIA</span>
                    <span className="font-sans font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                      CORE ACTIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                      <div className="text-[10px] text-blue-200 uppercase font-semibold">Primary IFSC</div>
                      <div className="font-mono text-sm font-bold text-emerald-300">MBIN0001042</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                      <div className="text-[10px] text-blue-200 uppercase font-semibold">Encryption</div>
                      <div className="font-mono text-sm font-bold text-blue-300">256-Bit SSL</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1 border-t border-blue-900/60 text-blue-200">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>RBI Regulated</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-blue-300" />
                      <span>4-Digit MPIN Auth</span>
                    </div>
                  </div>
                </div>

                {/* Rates Grid */}
                <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                    <div className="text-[11px] text-slate-500 font-medium">Savings A/C</div>
                    <div className="text-base font-extrabold text-blue-600">4.50%</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Daily Interest</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                    <div className="text-[11px] text-slate-500 font-medium">Fixed Deposit</div>
                    <div className="text-base font-extrabold text-blue-600">7.80%</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Special Tenure</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                    <div className="text-[11px] text-slate-500 font-medium">NEFT / IMPS</div>
                    <div className="text-base font-extrabold text-emerald-600">₹0 Fee</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Instant 24x7</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="app-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              MBI: Designed for Sovereign Financial Integrity
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Every detail is engineered to mirror the security, compliance, and user experience of leading tier-1 financial institutions across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 card-hover">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Admin-Governed KYC</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Only verified Bank Administrators have the authority to open customer accounts following 12-digit Aadhaar Card & Mobile OTP verification.
              </p>
            </div>

            <div className="card p-6 card-hover">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Dummy Balances</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                All account balances are strictly calculated through atomic double-entry ledger transactions with permanent UTR reference receipts.
              </p>
            </div>

            <div className="card p-6 card-hover">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">4-Digit MPIN Protocol</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Secure your online banking session with a 4-digit MPIN for instant one-click login and cryptographic authorization on every fund transfer.
              </p>
            </div>

            <div className="card p-6 card-hover">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Administrative Authority</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Bank Admins have instant freeze/unfreeze controls, branch cash counter deposit/withdrawal desks, and global audit ledger views.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Pre-Registration / Policy Notice Section */}
      <section className="py-16 bg-slate-50">
        <div className="app-container">
          <div className="card p-8 sm:p-12 border-slate-200 bg-white max-w-3xl mx-auto shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">MBI Account Onboarding Protocol</h3>
                <p className="text-xs text-slate-500">Official Bank Account Opening Policy</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 leading-relaxed mb-6 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                Mandatory Regulatory Compliance:
              </p>
              <p>
                In strict compliance with banking regulations, <span className="font-bold">only authorized Bank Administrators can officially issue and activate customer accounts</span>. All new accounts require in-person or e-KYC verification of the 12-digit Aadhaar Card, registered mobile OTP verification, and an initial cash deposit.
              </p>
            </div>

            {preRegSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-emerald-800 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold">Pre-Registration Request Received!</h4>
                <p className="text-xs text-emerald-700">
                  Application Reference: <span className="font-mono font-bold">MBI-PRE-{Date.now().toString().slice(-6)}</span>. 
                  A Bank Administrator will verify your Aadhaar and initiate account issuance.
                </p>
                <div className="pt-3">
                  <button 
                    onClick={() => onOpenAuth('ADMIN')}
                    className="btn btn-primary text-xs px-4 py-2"
                  >
                    Switch to Admin Portal to Process Accounts
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePreReg} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={preRegName}
                      onChange={(e) => setPreRegName(e.target.value)}
                      placeholder="e.g. Vikramaditya Rao" 
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={preRegMobile}
                      onChange={(e) => setPreRegMobile(e.target.value)}
                      placeholder="e.g. 9876543210" 
                      className="input-field" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={preRegEmail}
                    onChange={(e) => setPreRegEmail(e.target.value)}
                    placeholder="e.g. vikram@example.com" 
                    className="input-field" 
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button type="submit" className="btn btn-primary text-xs px-5 py-3 font-bold">
                    Submit Online KYC Pre-Application
                  </button>
                  <button 
                    type="button" 
                    onClick={() => onOpenAuth('ADMIN')}
                    className="btn btn-secondary text-xs px-4 py-3"
                  >
                    Open Admin Account Creation Desk →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="app-container flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800">MBI - Modern Bank Of India Ltd.</span>
            <span>© 2026. All Rights Reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-blue-600">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-blue-600">Terms of Service</a>
            <span>•</span>
            <a href="#kyc" className="hover:text-blue-600">Aadhaar KYC Guidelines</a>
            <span>•</span>
            <a href="#security" className="hover:text-blue-600">Security Assurance</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
