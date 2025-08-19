// Performance optimization utilities

// Debounce function to limit API calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function to limit function calls
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Lazy load images
export function lazyLoadImage(img: HTMLImageElement) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        img.src = img.dataset.src || ''
        img.classList.remove('lazy')
        observer.unobserve(img)
      }
    })
  })
  
  observer.observe(img)
}

// Preload critical resources
export function preloadCriticalResources() {
  const criticalResources = [
    '/api/auth/login',
    '/api/upload'
  ]
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = resource
    document.head.appendChild(link)
  })
}

// Optimize bundle loading
export function optimizeBundleLoading() {
  // Remove unused CSS
  if (typeof window !== 'undefined') {
    const styleSheets = Array.from(document.styleSheets)
    styleSheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || [])
        rules.forEach(rule => {
          if (rule instanceof CSSStyleRule) {
            const selector = rule.selectorText
            if (selector && !document.querySelector(selector)) {
              // Remove unused CSS rules (be careful with this)
              // sheet.deleteRule(rule)
            }
          }
        })
      } catch (e) {
        // Cross-origin stylesheets will throw errors
      }
    })
  }
}

// Cache management
export function setupCache() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.error)
  }
}

// Performance monitoring
export function monitorPerformance() {
  if (typeof window !== 'undefined') {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
  
        }
        if (entry.entryType === 'first-input') {
          const firstInput = entry as PerformanceEventTiming
  
        }
        if (entry.entryType === 'layout-shift') {
          const layoutShift = entry as any
  
        }
      })
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
  }
}

// Initialize performance optimizations
export function initPerformanceOptimizations() {
  if (typeof window !== 'undefined') {
    preloadCriticalResources()
    optimizeBundleLoading()
    setupCache()
    monitorPerformance()
  }
} 

interface PerformanceMetric {
  operation: string
  duration: number
  timestamp: number
  success: boolean
  error?: string
  metadata?: Record<string, any>
}

interface PerformanceStats {
  totalOperations: number
  successfulOperations: number
  failedOperations: number
  averageDuration: number
  minDuration: number
  maxDuration: number
  successRate: number
  recentMetrics: PerformanceMetric[]
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private maxMetrics = 1000 // Keep last 1000 metrics

  trackOperation(
    operation: string,
    duration: number,
    success: boolean,
    error?: string,
    metadata?: Record<string, any>
  ) {
    const metric: PerformanceMetric = {
      operation,
      duration,
      timestamp: Date.now(),
      success,
      error,
      metadata
    }

    this.metrics.push(metric)

    // Keep only the last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Log performance data for monitoring
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance: ${operation} - ${duration}ms - ${success ? '✅' : '❌'}`)
    }
  }

  getStats(operation?: string, timeWindow?: number): PerformanceStats {
    let filteredMetrics = this.metrics

    // Filter by operation if specified
    if (operation) {
      filteredMetrics = filteredMetrics.filter(m => m.operation === operation)
    }

    // Filter by time window if specified (in milliseconds)
    if (timeWindow) {
      const cutoffTime = Date.now() - timeWindow
      filteredMetrics = filteredMetrics.filter(m => m.timestamp >= cutoffTime)
    }

    if (filteredMetrics.length === 0) {
      return {
        totalOperations: 0,
        successfulOperations: 0,
        failedOperations: 0,
        averageDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        successRate: 0,
        recentMetrics: []
      }
    }

    const successfulOperations = filteredMetrics.filter(m => m.success).length
    const durations = filteredMetrics.map(m => m.duration)

    return {
      totalOperations: filteredMetrics.length,
      successfulOperations,
      failedOperations: filteredMetrics.length - successfulOperations,
      averageDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      successRate: Math.round((successfulOperations / filteredMetrics.length) * 100),
      recentMetrics: filteredMetrics.slice(-10) // Last 10 metrics
    }
  }

  getAIAnalysisStats(timeWindow?: number): PerformanceStats {
    return this.getStats('ai_image_analysis', timeWindow)
  }

  getBatchAnalysisStats(timeWindow?: number): PerformanceStats {
    return this.getStats('ai_batch_analysis', timeWindow)
  }

  getImageOptimizationStats(timeWindow?: number): PerformanceStats {
    return this.getStats('image_optimization', timeWindow)
  }

  // Performance decorator for functions
  static track<T extends (...args: any[]) => any>(
    operation: string,
    fn: T
  ): T {
    return ((...args: Parameters<T>): ReturnType<T> => {
      const startTime = Date.now()
      const monitor = new PerformanceMonitor()

      try {
        const result = fn(...args)
        
        // Handle both sync and async functions
        if (result instanceof Promise) {
          return result
            .then(value => {
              monitor.trackOperation(operation, Date.now() - startTime, true)
              return value
            })
            .catch(error => {
              monitor.trackOperation(operation, Date.now() - startTime, false, error.message)
              throw error
            }) as ReturnType<T>
        } else {
          monitor.trackOperation(operation, Date.now() - startTime, true)
          return result
        }
      } catch (error) {
        monitor.trackOperation(
          operation, 
          Date.now() - startTime, 
          false, 
          error instanceof Error ? error.message : 'Unknown error'
        )
        throw error
      }
    }) as T
  }

  // Clear old metrics
  clearOldMetrics(olderThanMs: number = 24 * 60 * 60 * 1000) { // Default: 24 hours
    const cutoffTime = Date.now() - olderThanMs
    this.metrics = this.metrics.filter(m => m.timestamp >= cutoffTime)
  }

  // Get performance insights
  getInsights(): string[] {
    const insights: string[] = []
    const aiStats = this.getAIAnalysisStats(60 * 60 * 1000) // Last hour

    if (aiStats.totalOperations > 0) {
      if (aiStats.successRate < 90) {
        insights.push(`⚠️ AI analysis success rate is ${aiStats.successRate}% - consider checking API configuration`)
      }

      if (aiStats.averageDuration > 10000) {
        insights.push(`🐌 AI analysis is slow (${aiStats.averageDuration}ms avg) - consider image optimization`)
      }

      if (aiStats.averageDuration < 3000) {
        insights.push(`⚡ AI analysis is performing well (${aiStats.averageDuration}ms avg)`)
      }

      const recentFailures = aiStats.recentMetrics.filter(m => !m.success).length
      if (recentFailures > 2) {
        insights.push(`🚨 ${recentFailures} recent AI analysis failures detected`)
      }
    }

    return insights
  }

  // Export metrics for external monitoring
  exportMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  // Reset all metrics
  reset(): void {
    this.metrics = []
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions for common operations
export const trackAIAnalysis = (duration: number, success: boolean, error?: string, metadata?: Record<string, any>) => {
  performanceMonitor.trackOperation('ai_image_analysis', duration, success, error, metadata)
}

export const trackBatchAnalysis = (duration: number, success: boolean, error?: string, metadata?: Record<string, any>) => {
  performanceMonitor.trackOperation('ai_batch_analysis', duration, success, error, metadata)
}

export const trackImageOptimization = (duration: number, success: boolean, error?: string, metadata?: Record<string, any>) => {
  performanceMonitor.trackOperation('image_optimization', duration, success, error, metadata)
}

// Performance decorator for class methods
export function TrackPerformance(operation: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now()
      
      try {
        const result = await method.apply(this, args)
        performanceMonitor.trackOperation(operation, Date.now() - startTime, true)
        return result
      } catch (error) {
        performanceMonitor.trackOperation(
          operation, 
          Date.now() - startTime, 
          false, 
          error instanceof Error ? error.message : 'Unknown error'
        )
        throw error
      }
    }
  }
}

export { PerformanceMonitor }
export type { PerformanceMetric, PerformanceStats } 