import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import AddChildModal from '../components/AddChildModal'
import AddMoneyModal from '../components/AddMoneyModal'
import PendingRequests from '../components/PendingRequests'
import ChildList from '../components/ChildList'
import BankDetails from '../components/BankDetails'
import ParentTransactionHistory from '../components/ParentTransactionHistory'
import ProfilePage from '../pages/ProfilePage'
import { DashboardSkeleton } from '../components/Skeleton'
import api from '../utils/api'
import { Users, Clock, ShieldCheck, PlusCircle, Send, ArrowRightLeft, CreditCard } from 'lucide-react'

ChartJS.register(ArcElement, Tooltip, Legend)

const ParentDashboard = () => {
  const [children, setChildren] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [isAddChildOpen, setIsAddChildOpen] = useState(false)
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const [childRes, reqRes] = await Promise.all([
        api.get('/parent/children'),
        api.get('/transactions/pending')
      ])
      setChildren(childRes.data)
      setPendingRequests(reqRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <DashboardSkeleton />

  const totalBalance = children.reduce((acc, child) => acc + child.wallet, 0)
  const totalLimit = children.reduce((acc, child) => acc + (child.monthlyLimit || 0), 0)

  const chartData = {
    labels: children.length > 0 ? children.map(c => c.name) : ['No Children'],
    datasets: [
      {
        data: children.length > 0 ? children.map(c => c.wallet) : [1],
        backgroundColor: ['#0ea5e9', '#3b82f6', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e'],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  }

  const chartOptions = {
    cutout: '80%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'Inter', size: 13 },
        bodyFont: { family: 'Inter', size: 14, weight: 'bold' },
        padding: 12,
        cornerRadius: 12,
        callbacks: { label: (context) => ` ₹${context.raw}` }
      }
    }
  }

  // ─── INLINE dashboard JSX (NOT a nested component — avoids React remount bug) ───
  const dashboardOverview = (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">

      {/* HERO BENTO BOX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Total Wealth Hero Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-8 sm:p-10 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-100/50 dark:bg-primary-900/10 rounded-full blur-[100px] -mr-40 -mt-40 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <CreditCard className="h-5 w-5 text-slate-600 dark:text-slate-300" strokeWidth={2} />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-xs">Family Vault Balance</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold tracking-wide">
                ALL SYSTEMS ACTIVE
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-4">
              <h1 className="text-6xl sm:text-7xl font-display font-medium tracking-tight text-slate-900 dark:text-white">
                ₹{totalBalance.toLocaleString()}
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm font-medium">
              Safely distributed across {children.length} connected accounts.
            </p>
          </div>

          {/* Quick Actions Row */}
          <div className="relative z-10 mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setIsAddChildOpen(true)}
              className="flex items-center gap-3 p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors group"
            >
              <PlusCircle className="h-5 w-5 text-slate-600 dark:text-slate-300" strokeWidth={2} />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">New Card</span>
            </button>
            <button
              onClick={() => setIsAddMoneyOpen(true)}
              className="flex items-center gap-3 p-4 sm:p-5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 rounded-2xl transition-colors group"
            >
              <Send className="h-5 w-5 text-white dark:text-slate-900" strokeWidth={2} />
              <span className="text-sm font-semibold text-white dark:text-slate-900">Add Funds</span>
            </button>
            <button
              onClick={() => navigate('/parent/transactions')}
              className="flex items-center gap-3 p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors group"
            >
              <ArrowRightLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" strokeWidth={2} />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Activity</span>
            </button>
            <button
              onClick={() => navigate('/parent/bank')}
              className="flex items-center gap-3 p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors group"
            >
              <ShieldCheck className="h-5 w-5 text-slate-600 dark:text-slate-300" strokeWidth={2} />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Settings</span>
            </button>
          </div>
        </motion.div>

        {/* Allocation Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center relative hover:shadow-md transition-shadow duration-500"
        >
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 absolute top-8 left-8 uppercase tracking-widest">Allocation</h3>
          <div className="w-56 h-56 mt-4 relative">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-4xl font-display font-medium text-slate-900 dark:text-white">{children.length}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Accounts</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Children Linked" value={children.length} icon={Users} color="bg-slate-100 dark:bg-slate-800 !text-slate-700 dark:!text-slate-300" hideBg={true} />
        <StatCard title="Pending Approvals" value={pendingRequests.length} icon={Clock} color="bg-slate-100 dark:bg-slate-800 !text-slate-700 dark:!text-slate-300" hideBg={true} />
        <StatCard title="Safety Limits Placed" value={`₹${totalLimit}`} icon={ShieldCheck} color="bg-slate-100 dark:bg-slate-800 !text-slate-700 dark:!text-slate-300" hideBg={true} />
      </div>

      {/* LISTS */}
      <div className="flex flex-col gap-8">
        {pendingRequests.length > 0 && <PendingRequests requests={pendingRequests} onActionFinished={fetchData} />}
        <ChildList children={children} onActionFinished={fetchData} />
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-[#09090b] transition-colors overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={dashboardOverview} />
            <Route path="/children" element={<div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] min-h-[80vh] shadow-sm"><ChildList children={children} onActionFinished={fetchData} /></div>} />
            <Route path="/bank" element={<div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] min-h-[80vh] flex items-center justify-center shadow-sm"><BankDetails /></div>} />
            <Route path="/transactions" element={<div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] min-h-[80vh] shadow-sm"><ParentTransactionHistory /></div>} />
            <Route path="/settings" element={<div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] min-h-[80vh] shadow-sm"><ProfilePage /></div>} />
          </Routes>
        </div>
      </main>

      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={() => setIsAddChildOpen(false)}
        onChildAdded={fetchData}
      />
      <AddMoneyModal
        isOpen={isAddMoneyOpen}
        onClose={() => setIsAddMoneyOpen(false)}
        childrenList={children}
        onMoneyAdded={fetchData}
      />
    </div>
  )
}

export default ParentDashboard
