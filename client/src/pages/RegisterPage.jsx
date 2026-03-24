import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { Wallet, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(formData.name, formData.email, formData.password)
      toast.success('Account created! Welcome to the future.')
      navigate('/parent')
    } catch (err) {
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.errors?.[0]?.msg 
        || err.response?.data?.error 
        || 'Registration failed';
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center mesh-gradient dark:mesh-gradient px-4">
      <Link to="/" className="fixed top-8 left-8 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-full glass">
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-bold">Back to Home</span>
      </Link>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md glass p-10 rounded-[2.5rem] shadow-2xl border-white/20"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-600/30">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-display font-black tracking-tighter leading-none text-slate-900 dark:text-white">
              Child Money Management System
            </span>
          </div>
          <h2 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white leading-tight">Join the Future</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Create your family oversight account today.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <input
                type="text"
                required
                autoComplete="new-password"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                placeholder="Sarah Jenkins"
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
                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                placeholder="sarah@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl disabled:opacity-70 active:scale-[0.98]"
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>

          <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-slate-900 dark:text-white hover:opacity-80 underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}

export default RegisterPage
