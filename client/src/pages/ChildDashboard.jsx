import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Routes, Route, useNavigate } from 'react-router-dom'
import ChildSidebar from '../components/ChildSidebar'
import StatCard from '../components/StatCard'
import RequestMoneyModal from '../components/RequestMoneyModal'
import UPIPayModal from '../components/UPIPayModal'
import RecentTransactions from '../components/RecentTransactions'
import SpendingChart from '../components/SpendingChart'
import LimitGauge from '../components/LimitGauge'
import ProfilePage from '../pages/ProfilePage'
import { DashboardSkeleton } from '../components/Skeleton'
import api from '../utils/api'
import { Wallet, Send, ShoppingBag, ShieldAlert, Sparkles, QrCode, ArrowDownToLine, Bell, LockKeyhole } from 'lucide-react'

const ChildDashboard = () => {
  const [child, setChild] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [limitStatus, setLimitStatus] = useState({ monthlyLimit: 0, spentAmount: 0 })
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [isUPIOpen, setIsUPIOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const [childRes, transRes, limitRes] = await Promise.all([
        api.get('/child/me'),
        api.get('/child/transactions'),
        api.get('/child/limit-status')
      ])
      setChild(childRes.data)
      setTransactions(transRes.data)
      setLimitStatus(limitRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading || !child) return <DashboardSkeleton />

  const DashboardOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. HERO NEO-BANK CARD (Minimalist Stripe Style) */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-full rounded-[2.5rem] p-8 sm:p-12 shadow-sm border relative overflow-hidden flex flex-col justify-between transition-colors duration-1000 ${child.isFrozen ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}
      >
        {/* Subtle Background Glow for Pristine UI */}
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -mr-40 -mt-40 transition-colors duration-1000 ${child.isFrozen ? 'bg-rose-200/50 dark:bg-rose-900/10' : 'bg-primary-50 dark:bg-primary-900/10'}`}></div>
        
        {/* Header inside Card */}
        <div className="relative z-10 flex justify-between items-start mb-12">
           <div>
              <p className={`font-bold uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2 mb-3 ${child.isFrozen ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {child.isFrozen ? <LockKeyhole className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-emerald-500" />} 
                {child.isFrozen ? 'CARD TEMPORARILY FROZEN' : 'Active Portfolio'}
              </p>
              <h1 className="text-4xl sm:text-5xl font-display font-medium text-slate-900 dark:text-white leading-tight tracking-tight">
                {child.name.split(' ')[0]}'s Funds
              </h1>
           </div>
           <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300">
             <Bell className="w-5 h-5" />
           </button>
        </div>

        {/* Balance Display */}
        <div className={`relative z-10 mb-12 border-l-2 pl-6 sm:pl-8 ${child.isFrozen ? 'border-rose-200 dark:border-rose-800/50' : 'border-slate-200 dark:border-slate-700'}`}>
          <p className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-xs mb-2">Available Balance</p>
          <div className="flex items-baseline gap-2">
            <h1 className={`text-6xl sm:text-8xl font-display font-medium tracking-tighter ${child.isFrozen ? 'text-rose-900 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
              ₹{child.wallet.toLocaleString()}<span className="text-3xl text-slate-400 dark:text-slate-500">.00</span>
            </h1>
          </div>
          {child.isFrozen && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-bold uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4" /> Transactions Blocked by Parent
            </div>
          )}
        </div>

        {/* Quick Actions Row Minimalist Style */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button 
              onClick={() => setIsUPIOpen(true)} 
              disabled={child.isFrozen}
              className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl transition-all ${child.isFrozen ? 'bg-slate-100 dark:bg-slate-800 opacity-50 cursor-not-allowed text-slate-400' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] shadow-lg shadow-slate-900/10 dark:shadow-white/10'}`}
            >
              <QrCode className="h-6 w-6" strokeWidth={2} />
              <span className="font-bold text-sm">Scan & Pay</span>
            </button>
            
            <button 
              onClick={() => setIsRequestOpen(true)} 
              disabled={child.isFrozen}
              className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl transition-all ${child.isFrozen ? 'bg-slate-100 dark:bg-slate-800 opacity-50 cursor-not-allowed text-slate-400' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
            >
              <ArrowDownToLine className="h-6 w-6 text-slate-900 dark:text-white" strokeWidth={2} />
              <span className="font-bold text-sm">Request</span>
            </button>

            <button 
              onClick={() => navigate('/child/transactions')} 
              className="flex flex-col items-center justify-center gap-3 p-5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all text-slate-700 dark:text-slate-200 group"
            >
              <Wallet className="h-6 w-6 text-slate-900 dark:text-white group-hover:-translate-y-1 transition-transform" strokeWidth={2} />
              <span className="font-semibold text-sm">History</span>
            </button>

            <button 
              onClick={() => navigate('/child/profile')} 
              className="flex flex-col items-center justify-center gap-3 p-5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all text-slate-700 dark:text-slate-200 group"
            >
              <ShieldAlert className="h-6 w-6 text-slate-900 dark:text-white group-hover:-translate-y-1 transition-transform" strokeWidth={2} />
              <span className="font-semibold text-sm">Profile</span>
            </button>
        </div>
      </motion.div>

      {/* 2. STATS ROW (Cleaned up) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
        <StatCard title="Monthly Spending" value={`₹${limitStatus.spentAmount}`} icon={ShoppingBag} color="bg-slate-100 dark:bg-slate-800 !text-slate-700 dark:!text-slate-300" hideBg={true} />
        <StatCard title="Total Requests" value={transactions.filter(t => t.type === 'request').length} icon={Send} color="bg-slate-100 dark:bg-slate-800 !text-slate-700 dark:!text-slate-300" hideBg={true} />
        <StatCard title="Transactions" value={transactions.length} icon={Wallet} color="bg-slate-100 dark:bg-slate-800 !text-slate-700 dark:!text-slate-300" hideBg={true} />
      </div>

      {/* 3. CHARTS & LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <LimitGauge limitStatus={limitStatus} />
          <SpendingChart transactions={transactions} />
        </div>
        <div className="lg:col-span-1">
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-[#09090b] transition-colors overflow-hidden font-sans">
      <ChildSidebar />
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4"></div>

          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/profile" element={<div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] min-h-[80vh] shadow-sm"><ProfilePage /></div>} />
            <Route path="/transactions" element={<div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] min-h-[80vh] shadow-sm"><RecentTransactions transactions={transactions} fullWidth /></div>} />
            <Route path="/request" element={<div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] min-h-[80vh] shadow-sm"><RequestMoneyModal isOpen={true} onClose={() => {}} onActionFinished={fetchData} inline /></div>} />
          </Routes>
        </div>
      </main>

      <RequestMoneyModal 
        isOpen={isRequestOpen} 
        onClose={() => setIsRequestOpen(false)} 
        onActionFinished={fetchData} 
      />
      <UPIPayModal 
        isOpen={isUPIOpen} 
        onClose={() => setIsUPIOpen(false)} 
        currentWallet={child.wallet}
        onActionFinished={fetchData} 
      />
    </div>
  )
}

export default ChildDashboard
