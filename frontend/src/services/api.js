const API_BASE = '/api';

export const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('apex_user') || '{}');
  return {
    'Content-Type': 'application/json',
    'X-User-Id': user.userId || '',
    'X-Admin-User': user.userId || 'admin',
  };
};

export const api = {
  // Auth APIs
  async login(payload) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async verifyOtp(payload) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async setMpin(payload) {
    const res = await fetch(`${API_BASE}/auth/set-mpin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async requestMpinOtp(payload) {
    const res = await fetch(`${API_BASE}/auth/request-mpin-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async requestAadhaarOtp(payload) {
    const res = await fetch(`${API_BASE}/auth/aadhaar-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Admin APIs
  async adminCreateCustomer(payload) {
    const res = await fetch(`${API_BASE}/admin/accounts/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async adminGetAccounts() {
    const res = await fetch(`${API_BASE}/admin/accounts`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async adminUpdateStatus(accountNumber, status) {
    const res = await fetch(`${API_BASE}/admin/accounts/${accountNumber}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async adminIssueCard(accountNumber, cardType = 'RUPAY') {
    const res = await fetch(`${API_BASE}/admin/accounts/${encodeURIComponent(accountNumber)}/issue-card`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ cardType }),
    });
    return res.json();
  },

  async adminCashDeposit(payload) {
    const res = await fetch(`${API_BASE}/admin/accounts/deposit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async adminCashWithdraw(payload) {
    const res = await fetch(`${API_BASE}/admin/accounts/withdraw`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async adminGetStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async adminGetTransactions() {
    const res = await fetch(`${API_BASE}/admin/transactions`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Customer APIs
  async customerGetDashboard() {
    const res = await fetch(`${API_BASE}/customer/dashboard`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async customerLookup(accountNumber) {
    const res = await fetch(`${API_BASE}/customer/lookup?accountNumber=${encodeURIComponent(accountNumber)}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async customerTransfer(payload) {
    const res = await fetch(`${API_BASE}/customer/transfer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async customerGetTransactions(startDate = '', endDate = '') {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/customer/transactions${qs}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async customerGetBeneficiaries() {
    const res = await fetch(`${API_BASE}/customer/beneficiaries`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async customerAddBeneficiary(payload) {
    const res = await fetch(`${API_BASE}/customer/beneficiaries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async customerDeleteBeneficiary(id) {
    const res = await fetch(`${API_BASE}/customer/beneficiaries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async customerToggleCardFreeze(mpin) {
    const res = await fetch(`${API_BASE}/customer/card/toggle-freeze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ mpin }),
    });
    return res.json();
  },

  async customerRequestAddCardOtp(payload) {
    const res = await fetch(`${API_BASE}/customer/card/request-add-otp`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async customerAddCard(payload) {
    const res = await fetch(`${API_BASE}/customer/card/add-card`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async customerVerifyMpin(mpin) {
    const res = await fetch(`${API_BASE}/customer/verify-mpin`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ mpin }),
    });
    return res.json();
  },
};
