import React, { useState } from 'react'
import api from '../utils/api'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'

const SpendingModal = ({ isOpen, onClose, currentWallet, onActionFinished }) => {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (Number(amount) > currentWallet) {
      return toast.error('Insufficient balance!')
    }
    setLoading(true)
    try {
      await api.post('/transactions/spend', { amount, description })
      toast.success('Transaction logged!')
      onActionFinished()
      onClose()
    } catch (err) {
      toast.error('Failed to log transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Log Spending</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-700 text-sm font-medium">
            Available Balance: ₹{currentWallet}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
              placeholder="e.g. Snacks, Games, Stationery"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 mt-4"
          >
            {loading ? 'Processing...' : 'Log Spend'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SpendingModal
