'use client'

import { usePlausible } from 'next-plausible'
import { useEffect } from 'react'

// Custom event types
export type AnalyticsEvent = 
  | 'Contact Form Submitted'
  | 'Resume Downloaded'
  | 'Project Link Clicked'
  | 'Social Link Clicked'
  | 'Chatbot Message Sent'
  | 'Navigation Item Clicked'
  | 'Scroll Depth'

// Custom hook for analytics
export const useAnalytics = () => {
  const plausible = usePlausible()

  const trackEvent = (event: AnalyticsEvent, props?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      try {
        plausible(event, { props })
      } catch (error) {
        console.warn('Analytics tracking failed:', error)
      }
    }
  }

  const trackPageView = (path?: string) => {
    if (typeof window !== 'undefined') {
      try {
        plausible('pageview', { 
          props: { 
            path: path || window.location.pathname 
          } 
        })
      } catch (error) {
        console.warn('Page view tracking failed:', error)
      }
    }
  }

  return { trackEvent, trackPageView }
}

// Track external link clicks (use this inside components)
export const useExternalLinkTracking = () => {
  const plausible = usePlausible()
  
  return (url: string, label?: string) => {
    plausible('External Link Clicked', {
      props: {
        url,
        label: label || 'Unknown'
      }
    })
  }
}

// Component for tracking form submissions
export const FormAnalytics: React.FC<{ 
  formName: string
  onSubmit?: () => void 
}> = ({ formName, onSubmit }) => {
  const { trackEvent } = useAnalytics()

  const handleSubmit = () => {
    trackEvent('Contact Form Submitted', { form: formName })
    onSubmit?.()
  }

  return null // This is a utility component, doesn't render anything
}

// Track resume downloads
export const useResumeDownload = () => {
  const { trackEvent } = useAnalytics()

  return (source: string = 'unknown') => {
    trackEvent('Resume Downloaded', { source })
  }
}

// Track social media clicks
export const useSocialClick = () => {
  const { trackEvent } = useAnalytics()

  return (platform: string, location: string = 'unknown') => {
    trackEvent('Social Link Clicked', { platform, location })
  }
}

// Track project interactions
export const useProjectClick = () => {
  const { trackEvent } = useAnalytics()

  return (projectName: string, action: 'view_code' | 'view_demo') => {
    trackEvent('Project Link Clicked', { 
      project: projectName, 
      action 
    })
  }
}

// Auto-track scroll depth
export const useScrollTracking = () => {
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    let maxScroll = 0
    const scrollThresholds = [25, 50, 75, 90, 100]
    const triggered = new Set<number>()

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      
      maxScroll = Math.max(maxScroll, scrollPercent)

      scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !triggered.has(threshold)) {
          triggered.add(threshold)
          trackEvent('Scroll Depth', { 
            props: { 
              percentage: threshold,
              page: window.location.pathname
            } 
          })
        }
      })
    }

    const debouncedScroll = debounce(handleScroll, 100)
    window.addEventListener('scroll', debouncedScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', debouncedScroll)
    }
  }, [trackEvent])
}

// Utility function for debouncing
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
} 