import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api'
import { toast } from 'react-hot-toast'
import { X, ShieldCheck, CheckCircle2, Building } from 'lucide-react'

const TopUpModal = ({ isOpen, onClose, onTopUp }) => {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setAmount('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const doDeposit = async () => {
    setStep(2)
    try {
      await api.post('/parent/deposit', { amount })
      setTimeout(() => setStep(3), 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deposit failed')
      setStep(1)
    }
  }

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  }

  const sheetStyle = {
    width: '100%',
    maxWidth: '448px',
    borderRadius: '1.5rem 1.5rem 0 0',
    overflow: 'hidden',
  }

  // ─── STEP 1: Enter Amount ───
  if (step === 1) return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={sheetStyle} onClick={e => e.stopPropagation()}>
        <div style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column' }} className="bg-white dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-6 h-6 text-indigo-500" />
              Vault Deposit
            </h2>
            <button onClick={onClose} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault()
              if (Number(amount) <= 0) return toast.error('Enter a valid amount')
              doDeposit()
            }}
            className="flex flex-col flex-1 p-6 gap-6"
          >
            {/* Big Amount Input */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Deposit Amount</span>
              <div className="flex items-center gap-1">
                <span className="text-4xl font-bold text-slate-300">₹</span>
                <input
                  type="number"
                  autoFocus
                  required
                  min="1"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-40 bg-transparent text-center text-6xl font-extrabold text-slate-900 dark:text-white outline-none placeholder:text-slate-200 dark:placeholder:text-slate-700"
                  style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg active:scale-95 transition-all shadow-[0_8px_30px_rgb(16,185,129,0.3)]"
            >
              Add to Vault Securely →
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  // ─── STEP 2: Processing ───
  if (step === 2) return (
    <div style={overlayStyle}>
      <div style={sheetStyle} onClick={e => e.stopPropagation()}>
        <div style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '32px', textAlign: 'center' }} className="bg-white dark:bg-slate-900">
          <div style={{ position: 'relative', width: 112, height: 112 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid #e2e8f0' }} />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
              style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid #10b981', borderTopColor: 'transparent' }}
            />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck className="w-10 h-10 text-emerald-500 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Connecting to Bank...</h3>
            <p className="text-slate-500">Depositing ₹{amount} to Family Vault</p>
          </div>
        </div>
      </div>
    </div>
  )

  // ─── STEP 3: Success ───
  if (step === 3) return (
    <div style={overlayStyle}>
      <div style={sheetStyle} onClick={e => e.stopPropagation()}>
        <div style={{ background: '#10b981', minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '32px', textAlign: 'center', color: 'white' }}>
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            style={{ background: 'white', borderRadius: '50%', padding: '24px', color: '#10b981' }}
          >
            <CheckCircle2 style={{ width: 72, height: 72 }} />
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>Deposit Successful!</h3>
            <p style={{ fontSize: '1.1rem', color: '#d1fae5', marginBottom: 4 }}>₹{amount} added to</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>Family Vault</p>
          </motion.div>

          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={() => { onTopUp(); onClose() }}
            style={{ marginTop: 24, width: '100%', background: '#0f172a', color: 'white', padding: '16px', borderRadius: '1rem', fontSize: '1.1rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            Continue ✓
          </motion.button>
        </div>
      </div>
    </div>
  )

  return null
}

export default TopUpModal
