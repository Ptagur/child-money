import React from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Send, History, User, LogOut, Wallet } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'

const ChildSidebar = () => {
  const location = useLocation()
  const { logout } = useAuth()

  const links = [
    { name: 'Overview', icon: LayoutDashboard, path: '/child' },
    { name: 'Request Money', icon: Send, path: '/child/request' },
    { name: 'Profile', icon: User, path: '/child/profile' },
    { name: 'History', icon: History, path: '/child/transactions' },
  ]

  return (
    <div className="flex h-screen w-64 flex-col glass border-r transition-colors z-40">
      <div className="flex h-20 items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="bg-primary-600 p-1.5 rounded-lg shadow-lg shadow-primary-600/30">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
          Kids<span className="text-primary-600">Money</span>
        </span>
      </div>
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {links.map((link) => (
          <motion.div
            key={link.name}
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                location.pathname === link.path
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <link.icon className={`h-5 w-5 ${location.pathname === link.path ? 'text-primary-600' : ''}`} />
              {link.name}
            </Link>
          </motion.div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-2">
          <ThemeToggle />
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default ChildSidebar
