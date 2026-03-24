import React from 'react'
import { motion } from 'framer-motion'
import { History, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react'

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mb-8 leading-tight">Stream Activity</h2>
      {transactions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
          <History className="h-16 w-16 mb-4 opacity-10" />
          <p className="font-semibold text-center">No digital footprints yet in this sector.</p>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[480px] pr-2 custom-scrollbar">
          {transactions.slice(0, 15).map((t, idx) => (
            <motion.div 
              key={t._id} 
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-4 bg-white/30 dark:bg-slate-800/30 rounded-[1.25rem] border border-white/20 dark:border-slate-700/50 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl shadow-sm ${
                  t.type === 'credit' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 
                  t.type === 'debit' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 
                  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {t.type === 'credit' ? <ArrowDownLeft className="h-4 w-4" /> : 
                   t.type === 'debit' ? <ArrowUpRight className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{t.description}</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-base font-black ${
                  t.type === 'credit' ? 'text-primary-600' : 
                  t.type === 'debit' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {t.type === 'credit' ? '+' : t.type === 'debit' ? '-' : ''}₹{t.amount}
                </p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'approved' || t.status === 'completed' ? 'bg-primary-500' : 'bg-amber-500'}`}></span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{t.status}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentTransactions
