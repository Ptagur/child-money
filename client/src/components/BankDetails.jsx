import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api'
import { toast } from 'react-hot-toast'
import { ShieldCheck, Lock, Edit2 } from 'lucide-react'

const BankDetails = () => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [hasDetails, setHasDetails] = useState(false)
  const [isEditing, setIsEditing] = useState(true) // Default true if no details

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const res = await api.get('/parent/bank-details')
        if (res.data) {
          setFormData({
            bankName: res.data.bankName,
            accountNumber: res.data.accountNumber,
            ifscCode: res.data.ifscCode
          })
          setHasDetails(true)
          setIsEditing(false) // Show view mode if details exist
        }
      } catch (err) {
        console.error('Failed to fetch bank details:', err)
      } finally {
        setFetching(false)
      }
    }
    fetchBankDetails()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/parent/bank-details', formData)
      toast.success('Bank details saved securely!')
      setHasDetails(true)
      setIsEditing(false)
    } catch (err) {
      toast.error('Failed to save details')
    } finally {
      setLoading(false)
    }
  }

  // Mask account number for security UX
  const maskedAccount = formData.accountNumber
    ? `•••• •••• •••• ${formData.accountNumber.slice(-4)}`
    : ''

  if (fetching) {
    return (
      <div className="glass p-10 rounded-[2.5rem] shadow-2xl border-white/20 max-w-2xl flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass p-10 rounded-[2.5rem] shadow-2xl border-white/20 max-w-2xl"
    >
      <div className="flex items-center gap-4 mb-10 justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary-600 rounded-[1.25rem] shadow-lg shadow-primary-600/30">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white leading-tight">Bank Fortress</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Ultra-secure AES-256 encrypted storage for your details.</p>
          </div>
        </div>
        {hasDetails && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-3 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 rounded-2xl transition-all shadow-sm flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold"
          >
            <Edit2 className="h-4 w-4" /> Edit
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Financial Institution</p>
              <p className="font-display font-bold text-2xl">{formData.bankName}</p>
            </div>
            <ShieldCheck className="w-8 h-8 text-emerald-400 opacity-80" />
          </div>

          <div className="mb-8 relative z-10">
            <p className="font-mono text-2xl tracking-widest">{maskedAccount}</p>
          </div>

          <div className="relative z-10">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">IFSC Code</p>
            <p className="font-bold text-lg">{formData.ifscCode}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Financial Institution</label>
              <input
                type="text"
                required
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm"
                placeholder="e.g. Neo Financial"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Number</label>
              <input
                type="text"
                required
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm"
                placeholder="0000 0000 0000"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">IFSC Identifier</label>
              <input
                type="text"
                required
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium shadow-sm"
                placeholder="NEO0001234"
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            {hasDetails && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white py-4.5 rounded-2xl font-bold text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`${hasDetails ? 'flex-[2]' : 'w-full'} bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4.5 rounded-2xl font-black text-lg hover:scale-[1.02] transition-all shadow-2xl disabled:opacity-70 flex items-center justify-center gap-3 active:scale-95`}
            >
              <Lock className="h-5 w-5" />
              {loading ? 'Securing Data...' : hasDetails ? 'Update Bank Secrets' : 'Seal Bank Secrets'}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  )
}

export default BankDetails
