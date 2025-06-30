'use client'

import React from 'react'

// Generic skeleton component
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
)

// Project card skeleton
export const ProjectCardSkeleton: React.FC = () => (
  <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-green-900/30">
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
)

// Projects grid skeleton
export const ProjectsGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }, (_, i) => (
      <ProjectCardSkeleton key={i} />
    ))}
  </div>
)

// Work experience skeleton
export const WorkExperienceSkeleton: React.FC = () => (
  <div className="bg-gray-800/80 rounded-xl p-5 shadow-md border-l-4 border-green-500">
    <div className="space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  </div>
)

// Contact form skeleton
export const ContactFormSkeleton: React.FC = () => (
  <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 space-y-6">
    <Skeleton className="h-8 w-1/3" />
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
    
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
    
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
    
    <Skeleton className="h-12 w-32 rounded-lg" />
  </div>
)

// Navigation skeleton
export const NavSkeleton: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 w-full px-8 py-4 z-50 backdrop-blur bg-gray-900/90">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      
      <div className="hidden md:flex items-center space-x-6">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-18" />
      </div>
      
      <div className="md:hidden">
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  </nav>
)

// Generic loading spinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
    </div>
  )
}

// Full page loading
export const PageLoading: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" className="mx-auto" />
      <p className="text-gray-400 font-mono">{message}</p>
    </div>
  </div>
) 