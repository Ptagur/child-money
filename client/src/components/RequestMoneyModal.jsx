import React, { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'

const RequestMoneyModal = ({ isOpen, onClose, onActionFinished }) => {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/child/request-money', { amount, description })
      toast.success('Request sent to parent!')
      onActionFinished()
      onClose()
    } catch (err) {
      toast.error('Failed to send request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={inline ? "" : "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"}>
      <motion.div 
        initial={inline ? {} : { scale: 0.9, opacity: 0 }}
        animate={inline ? {} : { scale: 1, opacity: 1 }}
        className={`w-full max-w-md ${inline ? "bg-transparent" : "glass p-10 rounded-[2.5rem] shadow-2xl border-white/20 relative"}`}
      >
        {!inline && (
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        )}

        <div className={`text-center ${inline ? "mb-6" : "mb-8"}`}>
          <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white leading-tight">Request Funds</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Ask your parent for a little extra.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Amount Needed (₹)</label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
              placeholder="100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">What's it for?</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
              placeholder="e.g. Science project supplies"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/30 disabled:opacity-70 mt-2 active:scale-95"
          >
            {loading ? 'Sending Request...' : 'Send Request'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default RequestMoneyModal
