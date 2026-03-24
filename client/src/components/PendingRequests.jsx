import React from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api'
import { toast } from 'react-hot-toast'
import { Check, X, Clock } from 'lucide-react'

const PendingRequests = ({ requests, onActionFinished }) => {
  const handleAction = async (requestId, status) => {
    try {
      await api.post('/parent/approve-request', { requestId, status })
      toast.success(`Request ${status}!`)
      onActionFinished()
    } catch (err) {
      toast.error('Failed to update request')
    }
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white leading-tight">Pending Requests</h2>
        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-4 py-1.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
          {requests.length} New
        </span>
      </div>
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Clock className="h-16 w-16 mb-4 opacity-10" />
          <p className="font-semibold">All caught up! No requests pending.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <motion.div 
              key={req._id} 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center justify-between p-5 bg-white/40 dark:bg-slate-800/40 rounded-[1.5rem] border border-white/20 dark:border-slate-700/50 shadow-sm group hover:scale-[1.01] transition-all"
            >
              <div>
                <p className="font-display font-black text-slate-900 dark:text-white text-lg">{req.childId?.name || 'Child'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-primary-600 font-black">₹{req.amount}</span>
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">• {req.description}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(req._id, 'rejected')}
                  className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:scale-110 transition-all shadow-sm"
                >
                  <X className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleAction(req._id, 'approved')}
                  className="p-3 bg-primary-600 text-white rounded-xl hover:scale-110 transition-all shadow-lg shadow-primary-600/30"
                >
                  <Check className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PendingRequests
