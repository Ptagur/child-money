import React from 'react'
import { motion } from 'framer-motion'

const StatCard = ({ title, value, icon: Icon, color }) => {
  const textColor = color.replace('bg-', 'text-')
  
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass p-6 rounded-3xl flex items-center gap-5 transition-all duration-300"
    >
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 shadow-inner`}>
        <Icon className={`h-6 w-6 ${textColor}`} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white leading-none">{value}</h3>
      </div>
    </motion.div>
  )
}

export default StatCard
