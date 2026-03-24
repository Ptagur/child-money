import React, { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'

const AddChildModal = ({ isOpen, onClose, onChildAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    childAge: '',
  })
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/register/child', formData)
      toast.success('Child account created!')
      onChildAdded()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md glass p-10 rounded-[2.5rem] shadow-2xl border-white/20 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-colors transition-colors">
          <X className="h-5 w-5 text-slate-500" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">New Child Account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Set up a digital wallet for your child.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input
              type="text"
              required
              autoComplete="new-password"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
              placeholder="e.g. Leo Jenkins"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input
              type="email"
              required
              autoComplete="new-password"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
              placeholder="leo@cmms.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Age</label>
              <input
                type="number"
                required
                autoComplete="new-password"
                value={formData.childAge}
                onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                placeholder="12"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Initial Pin</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                placeholder="••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/30 disabled:opacity-70 mt-4 active:scale-95"
          >
            {loading ? 'Creating Wallet...' : 'Create Account'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default AddChildModal
