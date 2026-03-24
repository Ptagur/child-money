import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scanner } from '@yudiel/react-qr-scanner'
import api from '../utils/api'
import { toast } from 'react-hot-toast'
import { X, Send, QrCode, Keyboard, CheckCircle2, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react'

const UPIPayModal = ({ isOpen, onClose, currentWallet, onActionFinished }) => {
  const [step, setStep] = useState(1) // 1: Scan, 2: Amount, 3: PIN, 4: Processing, 5: Success
  const [mode, setMode] = useState('scan') // 'scan' or 'manual'
  const [upiId, setUpiId] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [warning, setWarning] = useState(null)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setMode('scan')
      setUpiId('')
      setAmount('')
      setDescription('')
      setPin('')
      setWarning(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleScan = (result) => {
    if (result && result.length > 0) {
      let scannedId = result[0].rawValue || result[0].text || result[0]
      if (typeof scannedId === 'object') {
        scannedId = scannedId.rawValue || ''
      }
      if (scannedId.includes('upi://pay')) {
        const urlParams = new URLSearchParams(scannedId.split('?')[1])
        scannedId = urlParams.get('pa') || scannedId
      }
      setUpiId(scannedId)
      setStep(2)
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (upiId.trim().length > 3) setStep(2)
    else toast.error('Enter valid UPI ID')
  }

  const handleAmountSubmit = (e) => {
    e.preventDefault()
    if (Number(amount) <= 0) return toast.error('Enter valid amount')
    if (Number(amount) > currentWallet) return toast.error('Insufficient balance!')
    setStep(3)
  }

  const handlePinInput = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num)
    }
  }

  const handlePinDelete = () => {
    setPin(prev => prev.slice(0, -1))
  }

  const executePayment = async () => {
    setStep(4)
    try {
      const res = await api.post('/child/wallet/pay', { upiId, amount, description })
      if (res.data.warning) setWarning(res.data.warning)
      
      // Simulate network delay for real-time feel
      setTimeout(() => {
        setStep(5)
      }, 1500)

    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
      setStep(2) // go back to amount
    }
  }

  useEffect(() => {
    if (step === 3 && pin.length === 4) {
      executePayment()
    }
  }, [pin, step])

  const closeAndRefresh = () => {
    onActionFinished()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 sm:p-0">
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full sm:max-w-md bg-white dark:bg-slate-900 sm:rounded-[2.5rem] h-[90vh] sm:h-[85vh] shadow-2xl relative overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-4">
            {step > 1 && step < 4 && (
              <button onClick={() => setStep(step - 1)} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <ArrowLeft className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              </button>
            )}
            <h2 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
              {step === 1 ? 'Scan & Pay' : step === 2 ? 'Enter Amount' : step === 3 ? 'Enter PIN' : ''}
            </h2>
          </div>
          {step !== 4 && step !== 5 && (
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative bg-slate-50 dark:bg-slate-900 flex flex-col">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SCAN */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex-[1_0_auto] flex flex-col min-h-full"
              >
                {mode === 'scan' ? (
                  <div className="flex-1 bg-black relative flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                      <Scanner onScan={handleScan} formats={['qr_code']} components={{ tracker: false, audio: false }} />
                    </div>
                    {/* Scanner Overlay UI */}
                    <div className="z-10 w-64 h-64 border-2 border-white/20 rounded-3xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-3xl -mt-0.5 -ml-0.5"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-3xl -mt-0.5 -mr-0.5"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-3xl -mb-0.5 -ml-0.5"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-3xl -mb-0.5 -mr-0.5"></div>
                      <motion.div 
                        animate={{ y: [0, 240, 0] }} 
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-full h-1 bg-primary-500 shadow-[0_0_15px_3px_rgba(14,165,233,0.8)]"
                      />
                    </div>
                    <div className="z-10 absolute bottom-12 inset-x-0 w-full flex flex-col items-center">
                      <p className="text-white mb-6 font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Point camera at a QR code</p>
                      <button 
                        onClick={() => setMode('manual')}
                        className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold flex items-center gap-2 hover:bg-white/20 transition-all border border-white/20 shadow-xl"
                      >
                        <Keyboard className="h-5 w-5" /> Enter UPI ID instead
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 flex flex-col flex-1 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex-1 mt-8">
                      <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Merchant or Friend's UPI ID</label>
                      <form onSubmit={handleManualSubmit} className="flex flex-col gap-6">
                        <input
                          type="text"
                          autoFocus
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-bold text-lg text-center"
                          placeholder="e.g. merchant@paytm"
                        />
                        <button type="submit" className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all active:scale-95 shadow-xl shadow-primary-600/30">
                          Verify UPI ID
                        </button>
                      </form>
                    </div>
                    <button 
                      onClick={() => setMode('scan')}
                      className="mt-auto w-full py-4 rounded-2xl text-primary-600 dark:text-primary-400 font-bold flex items-center justify-center gap-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                    >
                      <QrCode className="h-5 w-5" /> Open Scanner
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: AMOUNT */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="p-8 flex flex-col h-full items-center justify-center bg-slate-50 dark:bg-slate-900"
              >
                <div className="flex flex-col items-center gap-3 mb-12">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold text-3xl shadow-xl border-4 border-white dark:border-slate-800">
                    {upiId.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Paying To</p>
                    <p className="font-bold text-slate-900 dark:text-white text-lg truncate max-w-[250px]">{upiId}</p>
                  </div>
                </div>

                <form onSubmit={handleAmountSubmit} className="w-full flex flex-col flex-1 max-w-sm mx-auto">
                  <div className="text-center mb-10 flex justify-center items-center">
                    <span className="text-4xl font-bold text-slate-400 mr-2">₹</span>
                    <input
                      type="number"
                      autoFocus
                      required
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-48 bg-transparent text-center text-6xl font-display font-extrabold text-slate-900 dark:text-white outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0 appearance-none"
                      placeholder="0"
                      style={{ WebkitAppearance: 'none', margin: 0 }}
                    />
                  </div>

                  <div className="mt-auto mb-8 w-full">
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium text-center shadow-sm"
                      placeholder="Add a note (Optional)"
                    />
                  </div>
                  
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-700 dark:text-primary-300 text-sm font-bold flex justify-between items-center mb-6 border border-primary-100 dark:border-primary-800/30">
                    <span>Available Balance:</span>
                    <span className="text-lg">₹{currentWallet}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-bold text-xl hover:scale-[1.02] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    Proceed to Pay
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: PIN ENTRY */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
                className="flex flex-col h-full bg-[#1A1A2E] text-white absolute inset-0 z-20"
              >
                <div className="border-b border-white/10 p-6 flex justify-between items-center bg-[#16213E]/50">
                   <div className="flex flex-col">
                     <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">To</span>
                     <span className="font-bold truncate max-w-[200px]">{upiId}</span>
                   </div>
                   <div className="flex flex-col items-end">
                     <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Amount</span>
                     <span className="font-bold text-xl">₹{amount}</span>
                   </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center py-8">
                  <ShieldCheck className="w-16 h-16 text-[#0F3460] fill-white mx-auto mb-6 drop-shadow-lg" />
                  <h3 className="text-2xl font-bold mb-8">Enter 4-Digit UPI PIN</h3>
                  
                  <div className="flex justify-center gap-5 mb-8">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${pin.length > i ? 'bg-white border-white scale-110' : 'bg-transparent border-slate-500'}`} />
                    ))}
                  </div>
                </div>

                {/* Keypad */}
                <div className="bg-[#16213E] p-6 pb-12 rounded-t-[2.5rem] grid grid-cols-3 gap-y-4 gap-x-4 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-white/5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button 
                      key={num} 
                      onClick={() => handlePinInput(num.toString())}
                      className="text-4xl font-display font-medium text-white py-5 active:bg-white/10 rounded-2xl transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                  <div />
                  <button 
                    onClick={() => handlePinInput('0')}
                    className="text-4xl font-display font-medium text-white py-5 active:bg-white/10 rounded-2xl transition-colors"
                  >
                    0
                  </button>
                  <button 
                    onClick={handlePinDelete}
                    className="text-xl font-bold text-slate-400 py-5 active:bg-white/10 rounded-2xl flex items-center justify-center transition-colors"
                  >
                    <X className="w-10 h-10" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: PROCESSING */}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-8 text-center absolute inset-0 z-30"
              >
                <div className="relative">
                  <div className="w-28 h-28 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="absolute inset-0 w-28 h-28 rounded-full border-4 border-primary-500 border-t-transparent border-b-transparent shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <ShieldCheck className="w-10 h-10 text-primary-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-2">Processing Payment...</h3>
                <p className="text-slate-500 dark:text-slate-400">Securely connecting to bank</p>
              </motion.div>
            )}

            {/* STEP 5: SUCCESS */}
            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center bg-[#10b981] text-white p-8 text-center absolute inset-0 z-40 pattern-dots pattern-white pattern-bg-transparent pattern-size-4 pattern-opacity-10"
              >
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                  <motion.div
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12, mass: 0.8 }}
                    className="bg-white text-[#10b981] rounded-full p-6 shadow-[0_0_40px_rgba(255,255,255,0.4)] mb-8 relative"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-white rounded-full opacity-30"
                    />
                    <CheckCircle2 className="w-24 h-24 relative z-10" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  >
                    <h3 className="text-4xl font-display font-extrabold mb-2 drop-shadow-md">Payment Successful!</h3>
                    <p className="text-emerald-100 text-xl font-medium mb-1 drop-shadow-sm">₹{amount} paid securely to</p>
                    <p className="text-white text-3xl font-display font-bold truncate max-w-[300px] mb-8 drop-shadow-md">{upiId}</p>
                  </motion.div>
                  
                  {warning && (
                     <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ delay: 0.6 }}
                     className="bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl mb-8 w-full border border-white/20 shadow-lg"
                   >
                     <p className="font-bold text-yellow-300 flex justify-center items-center gap-2"><ShieldCheck className="w-4 h-4" /> Warning</p>
                     <p className="text-sm text-emerald-50 mt-1">{warning}</p>
                   </motion.div>
                  )}
                </div>

                <motion.button
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={closeAndRefresh}
                  className="mt-auto w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-xl active:scale-95 border border-slate-700/50"
                  style={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)" }}
                >
                  Done
                </motion.button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default UPIPayModal
