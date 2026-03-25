# 🚀 Child Money Management System

A professional full-stack web application designed to teach children financial responsibility through supervised digital banking simulation.

![Hero Screenshot](https://images.unsplash.com/photo-1550565118-3a14e8d0386f?auto=format&fit=crop&q=80&w=1000)

## 🌟 Key Features

### 👨‍👩‍👧‍👦 Parent Supervision
- **Managed Accounts**: Create and monitor sub-accounts for all children.
- **Spending Controls**: Set hard monthly limits with automatic 80% used warnings.
- **Request Approval**: Real-time dashboard for approving or rejecting money requests.
- **Security**: AES-256 encrypted storage for sensitive bank details.

### 🧒 Child Financial Learning
- **Digital Wallet**: Real-time balance tracking and transaction history.
- **UPI Simulation**: Learn to pay using a simulated UPI interface (no real money).
- **Allowance Requests**: Request funds for specific needs with descriptive notes.
- **Smart Analytics**: Category-wise and monthly spending trends via interactive charts.

### 🛡️ Production Hardening
- **Dark Mode**: Premium UI with seamless theme switching.
- **Security**: JWT session management, Bcrypt hashing, and API rate limiting.
- **Audit Trail**: Full activity logging for every administrative and financial action.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS 4, Framer Motion, Chart.js
- **Backend**: Node.js, Express.js, MongoDB + Mongoose
- **Security**: JWT, Bcrypt, Express-Rate-Limit, Crypto (AES)
- **Utilities**: Lucide Icons, React Hot Toast, Axios

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18+
- firebase installed locally fairbase URL

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd child-money-management-system

# Install all dependencies (Root, Client, and Server)
npm run install-all
```

### 3. Environment Setup
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cmms
JWT_SECRET=your_super_secret_key
AES_SECRET=32_character_long_secret_phrase
```

### 4. Run Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 API Documentation

See [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) for full endpoint details.

## 📄 License
Final Year Project Submission - 2026.
