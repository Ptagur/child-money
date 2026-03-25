import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import { toast } from 'react-hot-toast'
import { X, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react'

/* 
  Completely self-contained PhonePe-style payment modal.
  Uses a simple portal-style fixed overlay — no nested component tricks.
  All steps rendered as conditional returns to avoid CSS clipping issues.
*/

const AddMoneyModal = ({ isOpen, onClose, childrenList = [], onMoneyAdded }) => {
  const [step, setStep] = useState(1)
  const [selectedChild, setSelectedChild] = useState('')
  const [amount, setAmount] = useState('')
  const [pin, setPin] = useState('')

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setSelectedChild('')
      setAmount('')
      setPin('')
    }
  }, [isOpen])

  useEffect(() => {
    if (step === 2 && pin.length === 4) {
      doPayment()
    }
  }, [pin, step])

  if (!isOpen) return null

  const safeList = Array.isArray(childrenList) ? childrenList : []
  const childName = safeList.find(c => c._id === selectedChild)?.name || 'Child'

  const doPayment = async () => {
    setStep(3)
    try {
      await api.post('/parent/add-money', { childId: selectedChild, amount })
      setTimeout(() => setStep(4), 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
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

  // ─── STEP 1: Select + Amount ───
  if (step === 1) return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={sheetStyle} onClick={e => e.stopPropagation()}>
        <div style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column' }} className="bg-white dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">💸 Send Money</h2>
            <button onClick={onClose} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault()
              if (!selectedChild) return toast.error('Please select a child')
              if (Number(amount) <= 0) return toast.error('Enter a valid amount')
              setStep(2)
            }}
            className="flex flex-col flex-1 p-6 gap-6"
          >
            {/* Child Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Paying To</label>
              <select
                required
                value={selectedChild}
                onChange={e => setSelectedChild(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-slate-900 dark:text-white font-semibold outline-none appearance-none focus:border-indigo-500 transition-colors"
              >
                <option value="">Choose a child...</option>
                {safeList.map(child => (
                  <option key={child._id} value={child._id}>
                    {child.name} · ₹{child.wallet ?? 0}
                  </option>
                ))}
              </select>
            </div>

            {/* Big Amount Input */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Enter Amount</span>
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
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Proceed to Pay →
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  // ─── STEP 2: PIN Pad ───
  if (step === 2) return (
    <div style={overlayStyle}>
      <div style={sheetStyle} onClick={e => e.stopPropagation()}>
        <div style={{ background: '#1A1A2E', minHeight: '70vh', display: 'flex', flexDirection: 'column', color: 'white' }}>
          {/* Header */}
          <div style={{ background: 'rgba(22,33,62,0.8)', borderBottom: '1px solid rgba(255,255,255,0.1)' }} className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep(1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">To: {childName}</p>
                <p className="font-bold text-emerald-400 text-lg">₹{amount}</p>
              </div>
            </div>
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>

          {/* PIN dots */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
            <h3 className="text-lg font-bold text-slate-200">Enter 4-Digit Security PIN</h3>
            <div className="flex gap-5 mt-2">
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid',
                  borderColor: pin.length > i ? '#fff' : '#475569',
                  background: pin.length > i ? '#fff' : 'transparent',
                  transition: 'all 0.2s'
                }} />
              ))}
            </div>
          </div>

          {/* Keypad */}
          <div style={{ background: '#16213E', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px 40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button
                  key={n}
                  onClick={() => pin.length < 4 && setPin(p => p + n)}
                  style={{ background: 'none', border: 'none', color: 'white', fontSize: '2rem', fontWeight: '600', padding: '16px', borderRadius: '1rem', cursor: 'pointer' }}
                  onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.target.style.background = 'none'}
                >
                  {n}
                </button>
              ))}
              <div />
              <button
                onClick={() => pin.length < 4 && setPin(p => p + '0')}
                style={{ background: 'none', border: 'none', color: 'white', fontSize: '2rem', fontWeight: '600', padding: '16px', borderRadius: '1rem', cursor: 'pointer' }}
              >
                0
              </button>
              <button
                onClick={() => setPin(p => p.slice(0, -1))}
                style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '16px', borderRadius: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X style={{ width: 28, height: 28 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ─── STEP 3: Processing ───
  if (step === 3) return (
    <div style={overlayStyle}>
      <div style={sheetStyle} onClick={e => e.stopPropagation()}>
        <div style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '32px', textAlign: 'center' }} className="bg-white dark:bg-slate-900">
          <div style={{ position: 'relative', width: 112, height: 112 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid #e2e8f0' }} />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
              style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid #6366f1', borderTopColor: 'transparent' }}
            />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck className="w-10 h-10 text-indigo-500 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Processing Transfer...</h3>
            <p className="text-slate-500">Sending ₹{amount} to {childName}</p>
          </div>
        </div>
      </div>
    </div>
  )

  // ─── STEP 4: Success ───
  if (step === 4) return (
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
            <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>Transfer Successful!</h3>
            <p style={{ fontSize: '1.1rem', color: '#d1fae5', marginBottom: 4 }}>₹{amount} sent to</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{childName}</p>
          </motion.div>

          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={() => { onMoneyAdded(); onClose() }}
            style={{ marginTop: 24, width: '100%', background: '#0f172a', color: 'white', padding: '16px', borderRadius: '1rem', fontSize: '1.1rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            Done ✓
          </motion.button>
        </div>
      </div>
    </div>
  )

  return null
}

export default AddMoneyModal
