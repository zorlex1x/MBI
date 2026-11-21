# MBI - Modern Bank Of India

A modern digital banking management platform with role-based access for Customers and Bank Administrators, powered by a **React** frontend, a **Java (Spring Boot 3.4)** backend, and a **SQL** relational database.

---

## ⚡ Quick Start (1-Click)

Simply double-click the **`start.bat`** file in `E:\MBI`. It will automatically:
1. Start the Spring Boot backend on `http://localhost:8080`.
2. Start the Vite React frontend on `http://localhost:5173`.
3. Open `http://localhost:5173` in your default browser.

---

## 🛠️ Manual Terminal Run Instructions

If you prefer running via separate terminals or PowerShell:

### 1. Run Backend (Java Spring Boot)
Open a terminal / PowerShell window:
```powershell
cd E:\MBI\backend
.\mvnw.cmd spring-boot:run
```
- **Backend Port**: `http://localhost:8080`
- **H2 Database Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:./data/bankdb`
  - User: `sa`
  - Password: *(leave blank)*

---

### 2. Run Frontend (React + Vite)
Open a second terminal / PowerShell window:
```powershell
cd E:\MBI\frontend
npm run dev
```
- **Frontend App**: `http://localhost:5173`

---

## 🔑 Login & Account Governance

### 1. Bank Administrator (Master Authority)
- **Portal**: Click **"Admin Portal"** on the top right
- **User ID**: `admin`
- **Password**: `Admin@12345`
- **Authority**:
  - **Open New Customer Accounts**: Enter customer details, Date of Birth (DOB), select from all **28 States & 8 Union Territories of India** with dynamic city suggestions, 12-digit Aadhaar & Mobile OTP verification, and set **ANY opening balance** (e.g. ₹0, ₹10,000, ₹50,000, etc.).
  - Automatically generates **User ID**, **Temporary Password**, 12-digit **Account Number**, and **IFSC** (`MBIN0001042`).
  - **Issue Debit Cards**: Issues Virtual Platinum Debit Cards for customer accounts directly from the customer accounts ledger or upon account creation.
  - View & print customer **Welcome Kit & Account Opening Slip**.
  - **Freeze / Unfreeze** customer accounts.
  - Branch Cash Counter Desk for cash deposits and withdrawals.
  - View system-wide double-entry transaction ledger.
  - Left-hand slidebar navigation for quick access between services.

---

### 2. Customer Account Lifecycle & Security Features
All dummy users have been removed so the bank administrator can create fresh customer accounts with any balance:
1. **Creation**: Admin creates the account via **Admin Portal -> Open New Account** with initial deposit, customer Date of Birth, and Indian state/city selection.
2. **First Login**: Customer logs in using the assigned **User ID** and **Temporary Password**. A 2FA OTP is dispatched and verified.
3. **Mandatory 4-Digit MPIN Setup**: Immediately upon first login, the customer **must** set their 4-digit MPIN. It cannot be skipped or closed:
   - Must be exactly **4 numeric digits**.
   - Must be entered twice (MPIN and Confirm MPIN must match).
   - **Criteria**: Cannot be `1234`, cannot be 4 identical digits (e.g. `1111`, `2222`), and cannot be the customer's **birth year**.
   - Verified via **6-digit mobile OTP** before activation.
4. **Second-Time & Returning Login (Only 4-Digit MPIN)**: When the customer returns to log in, the portal automatically recognizes the user and **only prompts for the 4-digit MPIN**. No password, no user ID typing, and no OTP required! (With an option to switch user or use password).
5. **Debit Card Issuance & Linking**: If a debit card is issued by the branch admin, the customer securely links and adds it to their dashboard by verifying their **User ID**, **4-digit MPIN**, and **mobile OTP**. Once linked, full interactive card controls (3D flip, lock/freeze, details reveal) are unlocked.
6. **Dashboard Privacy**: Account Number, IFSC Code, and User ID are **hidden/masked** by default. To reveal these details, the customer clicks **"Show Details"** and enters their 4-digit MPIN.
7. **Left Slidebar Navigation**: Dashboard options are organized into an intuitive left-hand slidebar navigation menu.
