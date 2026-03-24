import React from 'react'
import { ShieldAlert } from 'lucide-react'

const LimitGauge = ({ limitStatus }) => {
  const { monthlyLimit, spentAmount } = limitStatus
  
  if (!monthlyLimit || monthlyLimit === 0) return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 italic text-gray-400">
      No spending limit set for this month.
    </div>
  )

  const percentage = Math.min(Math.round((spentAmount / monthlyLimit) * 100), 100)
  
  let color = 'bg-green-500'
  if (percentage >= 100) color = 'bg-red-600'
  else if (percentage >= 80) color = 'bg-amber-500'

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Monthly Spending Limit</h2>
        {percentage >= 80 && (
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold ${percentage >= 100 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
            <ShieldAlert className="h-3.5 w-3.5" />
            {percentage >= 100 ? 'LIMIT REACHED' : 'WARNING: 80% USED'}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
          <span>Spent: ₹{spentAmount}</span>
          <span>Limit: ₹{monthlyLimit}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <div 
            className={`${color} h-full transition-all duration-1000 ease-out`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-right text-xs font-semibold text-gray-500 mt-1">{percentage}% consumed</p>
      </div>
    </div>
  )
}

export default LimitGauge
