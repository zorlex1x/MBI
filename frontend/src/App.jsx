import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import SetMpinModal from './components/SetMpinModal';
import CustomerDashboard from './components/customer/CustomerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_user');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role === 'ADMIN' ? 'admin' : 'dashboard';
      }
    } catch (e) {}
    return 'home';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('CUSTOMER'); // 'CUSTOMER', 'MPIN', 'ADMIN'
  const [setMpinModalOpen, setSetMpinModalOpen] = useState(false);

  // Check if newly logged-in customer needs to set their 6-digit MPIN
  useEffect(() => {
    if (user && user.role === 'CUSTOMER' && !user.isMpinSet) {
      setSetMpinModalOpen(true);
    }
  }, [user]);

  const handleOpenAuth = (roleTab = 'CUSTOMER') => {
    setAuthInitialTab(roleTab);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'ADMIN') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
      if (!userData.isMpinSet) {
        setSetMpinModalOpen(true);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('apex_user');
    setUser(null);
    setActiveTab('home');
  };

  const handleMpinSetSuccess = () => {
    const updated = { ...user, isMpinSet: true };
    localStorage.setItem('apex_user', JSON.stringify(updated));
    try {
      localStorage.setItem('mbi_saved_user', JSON.stringify({
        userId: user?.userId,
        fullName: user?.fullName,
        isMpinSet: true
      }));
    } catch (e) {}
    setUser(updated);
    setSetMpinModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Bank Navbar */}
      <Navbar 
        user={user}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 flex flex-col">
        {user?.role === 'ADMIN' && activeTab === 'admin' ? (
          <AdminDashboard user={user} />
        ) : user?.role === 'CUSTOMER' && activeTab === 'dashboard' ? (
          <CustomerDashboard 
            user={user} 
            onOpenSetMpin={() => setSetMpinModalOpen(true)} 
          />
        ) : (
          <LandingPage onOpenAuth={handleOpenAuth} />
        )}
      </main>

      {/* Multi-Factor Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authInitialTab}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Mandatory / Profile 4-Digit MPIN Modal */}
      <SetMpinModal 
        isOpen={setMpinModalOpen}
        onClose={() => {
          if (user?.isMpinSet) {
            setSetMpinModalOpen(false);
          }
        }}
        user={user}
        onMpinSetSuccess={handleMpinSetSuccess}
      />
    </div>
  );
}

export default App;
