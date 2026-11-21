import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  User, 
  LogOut, 
  PhoneCall, 
  ArrowRightLeft, 
  KeyRound, 
  CreditCard 
} from 'lucide-react';

export default function Navbar({ user, onLogout, onOpenAuth, activeTab, setActiveTab }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* Top Banking Assurance Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="app-container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> RBI Regulated & DICGC Insured
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">256-Bit Bank Grade SSL Encryption</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" /> 24/7 Priority Desk: 1800-200-MBIBANK
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-blue-300 font-mono">IFSC: MBIN0001042</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="app-container py-3.5 flex justify-between items-center">
        {/* Logo & Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-blue-600 flex items-center justify-center text-white shadow-md font-extrabold text-sm tracking-wider">
            MBI
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">MBI</span>
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                MODERN BANK OF INDIA
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Empowering India's Digital Financial Future</p>
          </div>
        </div>

        {/* Navigation Items / User Status */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Role Indicator & User Info */}
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 justify-end">
                  {user.fullName}
                  {user.role === 'ADMIN' ? (
                    <span className="badge badge-admin">Bank Admin</span>
                  ) : (
                    <span className="badge badge-customer">Customer</span>
                  )}
                </div>
                <div className="text-xs font-mono text-slate-500">
                  {user.role === 'ADMIN' ? `Admin ID: ${user.userId}` : 'Verified Customer Portal'}
                </div>
              </div>

              {/* Navigation shortcuts if logged in */}
              <button 
                onClick={() => setActiveTab(user.role === 'ADMIN' ? 'admin' : 'dashboard')}
                className={`btn btn-secondary text-xs px-3 py-2 ${activeTab === 'dashboard' || activeTab === 'admin' ? 'border-blue-600 bg-blue-50 text-blue-700' : ''}`}
              >
                {user.role === 'ADMIN' ? 'Admin Console' : 'My Dashboard'}
              </button>

              <button 
                onClick={onLogout}
                className="btn btn-danger text-xs px-3 py-2 flex items-center gap-1.5"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => onOpenAuth('CUSTOMER')}
                className="btn btn-secondary text-xs sm:text-sm px-3.5 py-2 flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>NetBanking Login</span>
              </button>

              <button 
                onClick={() => onOpenAuth('MPIN')}
                className="btn btn-secondary text-xs sm:text-sm px-3.5 py-2 hidden sm:flex items-center gap-1.5"
                title="Instant 4-Digit MPIN Login"
              >
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>MPIN Login</span>
              </button>

              <button 
                onClick={() => onOpenAuth('ADMIN')}
                className="btn btn-primary text-xs sm:text-sm px-4 py-2 flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Portal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
