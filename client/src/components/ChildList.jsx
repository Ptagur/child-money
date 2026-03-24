import React, { useState } from 'react'
import api from '../utils/api'
import { toast } from 'react-hot-toast'
import { Trash2, ShieldCheck, X, Target, CreditCard as CardIcon, LockKeyhole, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const ChildList = ({ children, onActionFinished }) => {
  const [selectedChildForLimit, setSelectedChildForLimit] = useState(null)
  const [limitValue, setLimitValue] = useState('')
  const [loadingLimit, setLoadingLimit] = useState(false)
  const [loadingFreeze, setLoadingFreeze] = useState(null)
  const navigate = useNavigate()

  const onSetLimit = (child) => {
    setSelectedChildForLimit(child)
    setLimitValue(child.monthlyLimit || '')
  }

  const handleSetLimitSubmit = async (e) => {
    e.preventDefault()
    setLoadingLimit(true)
    try {
      await api.post('/parent/set-limit', { childId: selectedChildForLimit._id, monthlyLimit: limitValue })
      toast.success('Monthly limit updated')
      setSelectedChildForLimit(null)
      onActionFinished()
    } catch (err) {
      toast.error('Failed to update limit')
    } finally {
      setLoadingLimit(false)
    }
  }

  const handleDelete = async (childId) => {
    if (!window.confirm('Are you certain you want to remove this account? This action cannot be undone.')) return
    try {
      await api.delete(`/parent/child/${childId}`)
      toast.success('Account permanently deleted')
      onActionFinished()
    } catch (err) {
      toast.error('Failed to delete account')
    }
  }

  const handleToggleFreeze = async (childId) => {
    setLoadingFreeze(childId)
    try {
      const res = await api.post('/parent/toggle-freeze', { childId })
      toast.success(res.data.message)
      onActionFinished()
    } catch (err) {
      toast.error('Failed to toggle lock status')
    } finally {
      setLoadingFreeze(null)
    }
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          Family Cards
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs rounded-full font-bold">{children.length}</span>
        </h2>
      </div>

      {children.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-slate-400 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
          <CardIcon className="h-10 w-10 mb-4 opacity-30" strokeWidth={1.5} />
          <p className="font-medium text-sm">No family cards issued yet. Add a child to begin.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {children.map((child, index) => {
             const isFrozen = child.isFrozen
             
             // Calculate Limit Bar
             const limit = child.monthlyLimit || 0;
             const spent = child.spentAmount || 0;
             let percentage = 0;
             if (limit > 0) {
               percentage = Math.min((spent / limit) * 100, 100);
             }
             
             return (
              <motion.div 
                key={child._id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border relative flex flex-col xl:flex-row items-center gap-6 xl:gap-10 transition-all duration-300 ${isFrozen ? 'border-rose-100 dark:border-rose-900/50 grayscale-[10%]' : 'border-slate-100 dark:border-slate-800 hover:shadow-md'}`}
              >
                {/* Visual Red Warning Left Border if frozen */}
                {isFrozen && <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 rounded-l-[2rem]"></div>}

                {/* --- 1. HEADER: Name & Avatar --- */}
                <div className="flex items-center gap-4 w-full xl:w-[25%] flex-shrink-0">
                  <div className={`h-14 w-14 rounded-full flex items-center justify-center text-lg font-black shadow-sm flex-shrink-0 ${isFrozen ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400' : 'bg-slate-50 text-slate-900 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white'}`}>
                    {child.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight leading-none mb-1 capitalize truncate max-w-[150px]">
                      {child.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold tracking-widest uppercase">
                      {child.childAge} YRS
                    </p>
                  </div>
                </div>

                {/* --- 2. BALANCE --- */}
                <div className="flex flex-col justify-center w-full xl:w-[25%] border-l-0 xl:border-l-2 border-slate-100 dark:border-slate-800 pl-0 xl:pl-8">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Balance</p>
                  <p className={`text-4xl font-display font-medium tracking-tighter truncate ${isFrozen ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                     ₹{child.wallet.toLocaleString()}
                  </p>
                </div>

                {/* --- 3. LIMIT PROGRESS BAR --- */}
                <div className="w-full xl:w-[25%] flex flex-col justify-center border-l-0 xl:border-l-2 border-slate-100 dark:border-slate-800 pl-0 xl:pl-8">
                  <div className="flex justify-between items-end mb-2">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Limit</p>
                     <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                       {limit > 0 ? `₹${spent} / ₹${limit}` : 'No Limit'}
                     </p>
                  </div>
                  {limit > 0 ? (
                    <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700/50">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${percentage >= 80 ? 'bg-rose-500' : 'bg-slate-800 dark:bg-slate-200'}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  ) : (
                    <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-dashed border-slate-200 dark:border-slate-700/50"></div>
                  )}
                </div>

                {/* --- 4. BOTTOM CONTROLS --- */}
                <div className="w-full xl:w-[25%] flex items-center justify-end gap-3 mt-4 xl:mt-0 border-t xl:border-none border-slate-100 dark:border-slate-800 pt-4 xl:pt-0">
                  
                  {/* Freeze iOS Toggle */}
                  <div className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-colors ${isFrozen ? 'bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30' : 'bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700/50'}`}>
                    <div className="flex items-center gap-1.5">
                      {isFrozen ? <LockKeyhole className="w-3.5 h-3.5 text-rose-500" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                      <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block ${isFrozen ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {isFrozen ? 'Frozen' : 'Active'}
                      </span>
                    </div>
                    <button
                        onClick={() => handleToggleFreeze(child._id)}
                        disabled={loadingFreeze === child._id}
                        className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none ${isFrozen ? 'bg-rose-500' : 'bg-emerald-500'}`}
                     >
                       <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${isFrozen ? 'translate-x-[18px]' : 'translate-x-1'}`} />
                     </button>
                  </div>

                  {/* Icon Actions */}
                  <button
                    onClick={() => onSetLimit(child)}
                    className="p-3 bg-white border border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                    title="Set Limit"
                  >
                    <Target className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(child._id)}
                    className="p-3 bg-white border border-rose-100 text-rose-600 dark:bg-slate-900 dark:border-rose-900/50 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors shadow-sm"
                    title="Remove Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
             )
          })}
        </div>
      )}

      {/* Set Limit Modal */}
      {selectedChildForLimit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setSelectedChildForLimit(null)}></div>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-sm bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800"
          >
            <button onClick={() => setSelectedChildForLimit(null)} className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-all">
              <X className="h-4 w-4 text-slate-500" />
            </button>

            <div className="flex mb-6">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <Target className="h-6 w-6 text-slate-900 dark:text-white" strokeWidth={2} />
              </div>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Spending Limit</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">Control the maximum monthly spending for {selectedChildForLimit.name}.</p>
            
            <form onSubmit={handleSetLimitSubmit} className="space-y-6">
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-medium text-slate-400">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={limitValue}
                  onChange={(e) => setLimitValue(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-10 pr-6 py-4 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 outline-none transition-all text-slate-900 dark:text-white font-bold text-xl"
                  placeholder="5000"
                />
              </div>
              <button
                type="submit"
                disabled={loadingLimit}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-70 active:scale-95"
              >
                {loadingLimit ? 'Saving...' : 'Set Limit'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ChildList
