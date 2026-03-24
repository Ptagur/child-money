import React from 'react'
import { motion } from 'framer-motion'

const Skeleton = ({ className }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 dark:bg-slate-800 rounded-lg ${className}`}
    />
  )
}

export const DashboardSkeleton = () => (
  <div className="space-y-8 p-8 max-w-7xl mx-auto">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="lg:col-span-1">
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  </div>
)

export default Skeleton
