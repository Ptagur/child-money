import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation, useSpring, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Wallet, ShieldCheck, TrendingUp, Smartphone, 
  Star, Users, Lock, ArrowRight, CheckCircle2, 
  Bell, Activity, CreditCard as CardIcon, Zap
} from 'lucide-react'

// Reusable Scroll Animation Wrapper
const FadeInWhenVisible = ({ children, delay = 0, direction = 'up' }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
      x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: 0.8, delay: delay, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  }

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
      {children}
    </motion.div>
  )
}

const LandingPage = () => {
  // 3D Parallax Mouse Tracking State
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const x = (clientX / window.innerWidth - 0.5) * 30  // Max rotate 15deg
    const y = (clientY / window.innerHeight - 0.5) * -30
    setMousePosition({ x, y })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white overflow-x-hidden font-sans selection:bg-primary-500/30 selection:text-primary-900 dark:selection:text-primary-100" onMouseMove={handleMouseMove}>
      
      {/* GLOWING AMBIENT BACKGROUNDS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-900/20 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 dark:bg-emerald-900/20 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-10000 delay-1000"></div>
      </div>

      {/* 1. ULTRA PREMIUM NAVIGATION */}
      <nav className="fixed w-full z-50 bg-white/70 dark:bg-[#050505]/70 backdrop-blur-2xl border-b border-white/20 dark:border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-slate-900 dark:bg-white p-2 rounded-xl group-hover:scale-105 transition-transform">
                <Wallet className="h-6 w-6 text-white dark:text-slate-900" strokeWidth={2.5} />
              </div>
              <span className="text-xl md:text-2xl font-display font-black tracking-tighter leading-none hidden sm:block">
                Child Money Management System
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-10">
              <a href="#platform" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-[0.2em]">Platform</a>
              <a href="#features" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-[0.2em]">Features</a>
              <a href="#security" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-[0.2em]">Security</a>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="relative group overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 hidden sm:block border border-slate-700 dark:border-slate-200">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 hidden group-hover:block absolute inset-0 text-center py-2.5 text-white">Get Started</span>
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* 2. JAW-DROPPING HERO SECTION */}
      <main className="pt-48 pb-10 px-4 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="inline-flex items-center gap-2 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 px-6 py-2 rounded-full text-xs font-bold mb-12 uppercase tracking-[0.2em] shadow-lg"
          >
            <Zap className="h-4 w-4 text-emerald-500 fill-emerald-500" />
            <span>The Generation Alpha Financial Engine</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[9rem] font-display font-black tracking-tighter text-slate-900 dark:text-white mb-6 leading-[0.9] max-w-6xl"
          >
            Money, <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-400 to-slate-800 dark:from-slate-100 dark:to-slate-600">Simulated.</span>
          </motion.h1>

          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-3xl text-slate-500 dark:text-slate-400 max-w-3xl mb-16 leading-tight font-medium"
          >
            Give your kids virtual cards. Set hard limits. Approve transactions. Zero real-world financial risk.
          </motion.p>

          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-5 mb-32 w-full sm:w-auto"
          >
            <Link to="/register" className="bg-slate-900 border border-slate-700 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-full text-lg font-bold shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)] flex justify-center items-center gap-3 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto hover:bg-slate-800 dark:hover:bg-slate-200">
              Open a Family Vault
              <ArrowRight className="h-5 w-5" strokeWidth={3} />
            </Link>
          </motion.div>

          {/* 3D PARALLAX SHOWCASE */}
          <div className="relative w-full max-w-5xl h-[400px] md:h-[600px] perspective-[2000px] flex justify-center items-center">
             
             {/* The Parallax Container */}
             <motion.div 
               initial={{ y: 150, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               style={{ rotateX: mousePosition.y, rotateY: mousePosition.x }}
               transition={{ type: "spring", stiffness: 70, damping: 20, mass: 0.5 }}
               className="relative w-full h-full transform-style-3d cursor-crosshair"
             >
                {/* Background Dashboard Mock */}
                <div className="absolute inset-x-8 md:inset-x-20 bottom-0 top-10 bg-white dark:bg-[#0c0c0e] rounded-t-[3rem] border-x border-t border-slate-200 dark:border-white/10 shadow-2xl p-10 overflow-hidden transform translate-z-[-50px]">
                   <div className="w-full h-12 border-b border-slate-100 dark:border-white/5 mb-8 flex items-center">
                     <div className="h-4 w-4 rounded-full bg-rose-500/50 mr-2"></div>
                     <div className="h-4 w-4 rounded-full bg-amber-500/50 mr-2"></div>
                     <div className="h-4 w-4 rounded-full bg-emerald-500/50"></div>
                   </div>
                   <div className="grid grid-cols-3 gap-8 opacity-20 dark:opacity-40">
                      <div className="col-span-2 space-y-4">
                        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
                        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
                      </div>
                      <div className="col-span-1 space-y-4">
                        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
                      </div>
                   </div>
                   {/* Gradient Fade Overlay to ground the illusion */}
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent dark:from-[#050505]"></div>
                </div>

                {/* Floating 3D Credit Card (Pops out of the screen!) */}
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[320px] md:w-[400px] aspect-[1.58/1] bg-slate-900/90 dark:bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 dark:border-slate-400 p-8 flex flex-col justify-between transform translate-z-[120px] transition-shadow duration-500 hover:shadow-[0_80px_120px_-20px_rgba(0,0,0,0.6)]">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-14 bg-gradient-to-br from-yellow-100 to-yellow-500 rounded-lg shadow-inner opacity-90 border border-yellow-200"></div>
                      <div className="px-3 py-1 bg-white/20 dark:bg-slate-900/10 rounded-full text-[10px] font-bold tracking-widest uppercase text-white dark:text-slate-900 backdrop-blur-md">
                        Virtual Only
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Available Limits</p>
                      <p className="text-4xl md:text-5xl font-display font-medium tracking-tighter text-white dark:text-slate-900">
                        ₹42,500
                      </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-xl md:text-2xl font-bold font-display uppercase tracking-widest text-white dark:text-slate-900">
                        Rajesh T.
                      </p>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" className="h-8 opacity-80 mix-blend-screen dark:mix-blend-multiply" alt="card" />
                    </div>
                </div>

             </motion.div>
          </div>
        </div>
      </main>

      {/* INFINITE MARQUEE */}
      <div className="w-full bg-slate-900 dark:bg-white py-6 overflow-hidden flex whitespace-nowrap border-y border-slate-800 dark:border-slate-200 relative z-20">
         <div className="animate-marquee flex gap-12 items-center text-white dark:text-slate-900 font-bold uppercase tracking-[0.3em] text-sm md:text-base">
            <span>• 100% Simulated Environment</span>
            <span>• Bank-Grade AES-256 Encryption</span>
            <span>• Zero Real-World Financial Risk</span>
            <span>• Instant Parent Override</span>
            <span>• UPI Payment Simulation</span>
            <span>• Custom Spending Analytics</span>
            {/* Duplicated for smooth infinite loop */}
            <span>• 100% Simulated Environment</span>
            <span>• Bank-Grade AES-256 Encryption</span>
            <span>• Zero Real-World Financial Risk</span>
            <span>• Instant Parent Override</span>
            <span>• UPI Payment Simulation</span>
            <span>• Custom Spending Analytics</span>
         </div>
      </div>

      {/* 4. DUALITY PLATFORM SECTION */}
      <section id="platform" className="py-40 bg-white dark:bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <FadeInWhenVisible>
            <div className="text-center mb-32">
              <h2 className="text-[3rem] md:text-[5rem] font-display font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                One System.<br/>
                <span className="text-slate-300 dark:text-slate-800">Two Views.</span>
              </h2>
            </div>
          </FadeInWhenVisible>

          <div className="space-y-40">
            
            {/* View 1: PARENTS */}
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <FadeInWhenVisible direction="right" delay={0.2}>
                <div className="flex-1 relative w-full aspect-square bg-slate-50 dark:bg-[#0a0a0c] rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl p-10 flex flex-col justify-center gap-6 group hover:shadow-3xl transition-shadow duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-indigo-500/5 dark:to-indigo-500/10 rounded-[3rem]"></div>
                  
                  {/* Abstract Parent UI */}
                  <div className="bg-white dark:bg-[#111116] p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-white/5 transform group-hover:-translate-y-4 transition-transform duration-500">
                     <div className="flex justify-between items-center mb-4">
                       <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Child Request</span>
                       <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-bold uppercase">Pending</span>
                     </div>
                     <p className="text-2xl font-display font-medium text-slate-800 dark:text-white mb-6">₹500 for Books</p>
                     <div className="flex gap-3">
                       <div className="flex-1 bg-slate-100 dark:bg-white/5 py-4 rounded-xl text-center font-bold text-slate-500 dark:text-slate-400 text-sm">Deny</div>
                       <div className="flex-1 bg-indigo-600 py-4 rounded-xl text-center font-bold text-white text-sm shadow-lg shadow-indigo-600/30">Approve</div>
                     </div>
                  </div>

                </div>
              </FadeInWhenVisible>
              
              <FadeInWhenVisible direction="left" delay={0.4}>
                <div className="flex-1 space-y-8">
                  <h4 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">Total parental oversight. Built-in.</h4>
                  <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Add children automatically. Review every request. Instantly freeze virtual cards. You hold the master key to their financial sandbox.</p>
                  <ul className="space-y-5 pt-4">
                    {['Global Account Freezing', 'Limit Enforcement', 'Real-time Approvals'].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-slate-800 dark:text-slate-200 font-bold text-lg">
                        <CheckCircle2 className="h-6 w-6 text-indigo-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInWhenVisible>
            </div>

            {/* View 2: KIDS */}
            <div className="flex flex-col-reverse lg:flex-row items-center gap-20">
              <FadeInWhenVisible direction="right" delay={0.4}>
                <div className="flex-1 space-y-8 lg:pr-12">
                  <h4 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">True independence. Safely simulated.</h4>
                  <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Children experience a breathtaking, modern banking UI. They learn to balance budgets, request funds, and use a simulated UPI scanner—just like the real world.</p>
                  <ul className="space-y-5 pt-4">
                    {['Simulated UPI Scanner', 'Visual Spending Analytics', 'Automated Allowance'].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-slate-800 dark:text-slate-200 font-bold text-lg">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInWhenVisible>

              <FadeInWhenVisible direction="left" delay={0.2}>
                <div className="flex-1 relative w-full aspect-square bg-slate-900 dark:bg-white rounded-[3rem] shadow-2xl p-10 flex flex-col justify-between group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-emerald-500/20 dark:to-emerald-500/10 rounded-[3rem]"></div>
                  
                  {/* Abstract Child UI */}
                  <div className="relative z-10 text-white dark:text-slate-900 mt-10">
                     <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Vault Balance</p>
                     <p className="text-[4rem] font-display font-medium tracking-tighter leading-none mt-2">₹12,450</p>
                  </div>
                  
                  <div className="relative z-10 bg-white/10 dark:bg-slate-900/10 backdrop-blur-xl border border-white/20 dark:border-slate-900/10 p-6 rounded-[2rem] flex justify-between items-center transform group-hover:scale-[1.03] transition-transform duration-500 cursor-pointer">
                     <div className="flex items-center gap-4 text-white dark:text-slate-900">
                       <div className="p-3 bg-white/20 dark:bg-slate-900/20 rounded-xl"><Smartphone /></div>
                       <span className="font-bold text-lg">Scan QR Code</span>
                     </div>
                     <ArrowRight className="text-white dark:text-slate-900" />
                  </div>

                </div>
              </FadeInWhenVisible>
            </div>

          </div>
        </div>
      </section>

      {/* 5. GIGANTIC CTA */}
      <section className="py-40 bg-slate-50 dark:bg-[#030303] relative border-t border-slate-200 dark:border-white/5">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <FadeInWhenVisible>
            <h2 className="text-[4rem] md:text-[6rem] lg:text-[8rem] font-display font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] mb-12">
              Ready for <br/> the future?
            </h2>
            <Link to="/register" className="inline-flex bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-14 py-6 rounded-full text-2xl font-black hover:scale-110 active:scale-95 transition-all shadow-2xl items-center gap-4 group">
              Start Free Trial
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
            </Link>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* 6. MINIMALIST FOOTER */}
      <footer className="border-t border-slate-200 dark:border-white/5 py-12 bg-white dark:bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 dark:bg-white p-2 rounded-lg">
              <Wallet className="h-5 w-5 text-white dark:text-slate-900" strokeWidth={3} />
            </div>
            <span className="text-xl font-display font-black tracking-tighter text-slate-900 dark:text-white">
              Child Money Management System.
            </span>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm uppercase tracking-widest">Privacy</a>
            <a href="#" className="font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm uppercase tracking-widest">Terms</a>
            <a href="#" className="font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm uppercase tracking-widest">Engineering</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
