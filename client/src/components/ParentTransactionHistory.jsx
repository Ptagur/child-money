import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import { History, ArrowUpRight, ArrowDownLeft, Clock, Search } from 'lucide-react'

const ParentTransactionHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions/history')
        setTransactions(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter(t => 
    t.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">All Transactions</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-full md:w-64 dark:text-gray-200"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading transactions...</div>
      ) : filteredTransactions.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <History className="h-12 w-12 mx-auto mb-2 opacity-20" />
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800">
                <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400 text-sm">Child</th>
                <th className="pb-3 font-semibold text-gray-600 dark:text-gray-400 text-sm">Description</th>
                <th className="pb-3 font-semibold text-gray-600 text-sm">Type</th>
                <th className="pb-3 font-semibold text-gray-600 text-sm">Amount</th>
                <th className="pb-3 font-semibold text-gray-600 text-sm">Date</th>
                <th className="pb-3 font-semibold text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {filteredTransactions.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{t.userId?.name || 'Deleted User'}</td>
                  <td className="py-4 text-sm text-gray-500">{t.description}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                      t.type === 'credit' ? 'bg-green-100 text-green-700' : 
                      t.type === 'debit' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {t.type === 'credit' ? <ArrowDownLeft className="h-3 w-3" /> : 
                       t.type === 'debit' ? <ArrowUpRight className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      <span className="capitalize">{t.type}</span>
                    </span>
                  </td>
                  <td className={`py-4 text-sm font-bold ${
                    t.type === 'credit' ? 'text-green-600' : 
                    t.type === 'debit' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {t.type === 'credit' ? '+' : t.type === 'debit' ? '-' : ''}₹{t.amount}
                  </td>
                  <td className="py-4 text-sm text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="py-4">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      t.status === 'approved' || t.status === 'completed' ? 'text-green-600' : 
                      t.status === 'rejected' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ParentTransactionHistory
