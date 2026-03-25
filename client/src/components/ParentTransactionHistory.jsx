import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import { History, ArrowUpRight, ArrowDownLeft, Clock, Search, Building, Send, CreditCard, Sparkles } from 'lucide-react'

const ParentTransactionHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions/history')
        setTransactions(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter(t => 
    t.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 p-6 md:p-8 transition-colors flex flex-col min-h-[60vh]"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Activity History
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Track family spendings, deposits, and transfers.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 py-3 border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm w-full md:w-80 dark:text-white font-medium transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <Clock className="w-8 h-8 opacity-50" />
          </motion.div>
          <p className="mt-4 font-semibold text-sm tracking-widest uppercase">Fetching Records...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
          <History className="h-16 w-16 mb-4 opacity-20" strokeWidth={1} />
          <p className="font-semibold text-lg text-slate-600 dark:text-slate-300">No activity found</p>
          <p className="text-sm text-slate-500 mt-1">Looks like it's quiet right now.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filteredTransactions.map((t, index) => {
              // Determine aesthetics based on transaction type/description
              let ActionIcon = Clock;
              let iconBg = 'bg-slate-100 dark:bg-slate-800';
              let iconColor = 'text-slate-500';
              let amountColor = 'text-slate-900 dark:text-white';
              let amountPrefix = '';

              if (t.description.includes('Deposited to Family Vault')) {
                ActionIcon = Building;
                iconBg = 'bg-emerald-100 dark:bg-emerald-900/30';
                iconColor = 'text-emerald-600 dark:text-emerald-400';
                amountColor = 'text-emerald-600 dark:text-emerald-400';
                amountPrefix = '+';
              } else if (t.description.includes('Transferred to child')) {
                ActionIcon = Send;
                iconBg = 'bg-indigo-100 dark:bg-indigo-900/30';
                iconColor = 'text-indigo-600 dark:text-indigo-400';
                amountColor = 'text-slate-900 dark:text-white';
                amountPrefix = '-';
              } else if (t.description.includes('Added by parent')) {
                ActionIcon = ArrowDownLeft;
                iconBg = 'bg-emerald-100 dark:bg-emerald-900/30';
                iconColor = 'text-emerald-600 dark:text-emerald-400';
                amountColor = 'text-emerald-600 dark:text-emerald-400';
                amountPrefix = '+';
              } else if (t.type === 'debit') {
                ActionIcon = CreditCard;
                iconBg = 'bg-rose-100 dark:bg-rose-900/30';
                iconColor = 'text-rose-600 dark:text-rose-400';
                amountColor = 'text-rose-600 dark:text-rose-400';
                amountPrefix = '-';
              }

              return (
                <motion.div
                  key={t._id || t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${iconBg} transition-colors group-hover:scale-110 duration-300`}>
                      <ActionIcon className={`w-6 h-6 ${iconColor}`} strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {t.description}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded uppercase tracking-wider">
                          {t.userName || t.userId?.name || 'Vault'}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          • {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {' '}{new Date(t.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                    <span className={`text-xl sm:text-lg font-bold ${amountColor}`}>
                      {amountPrefix}₹{t.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mt-1">
                      {t.status}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

export default ParentTransactionHistory
