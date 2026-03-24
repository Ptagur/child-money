import React from 'react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Calendar } from 'lucide-react'

const ProfilePage = () => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8"
    >
      <div className="flex items-center gap-6 mb-8">
        <div className="h-20 w-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <User className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h2>
          <p className="text-gray-500 capitalize">{user.role} Account</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
          <Mail className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Address</p>
            <p className="text-gray-900 dark:text-gray-100">{user.email || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
          <Shield className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Account Role</p>
            <p className="text-gray-900 dark:text-gray-100 capitalize">{user.role}</p>
          </div>
        </div>

        {user.role === 'child' && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Age</p>
              <p className="text-gray-900 dark:text-gray-100">{user.childAge} Years Old</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
        <p className="text-sm text-gray-500">
          Account security is managed by your parent. To change details, please contact them.
        </p>
      </div>
    </motion.div>
  )
}

export default ProfilePage
