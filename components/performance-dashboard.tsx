"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Activity,
  Gauge,
  Target
} from "lucide-react"

interface PerformanceStats {
  totalOperations: number
  successfulOperations: number
  failedOperations: number
  averageDuration: number
  minDuration: number
  maxDuration: number
  successRate: number
  recentMetrics: any[]
}

interface PerformanceDashboardProps {
  refreshInterval?: number // in milliseconds
}

export function PerformanceDashboard({ refreshInterval = 30000 }: PerformanceDashboardProps) {
  const [aiStats, setAiStats] = useState<PerformanceStats | null>(null)
  const [batchStats, setBatchStats] = useState<PerformanceStats | null>(null)
  const [optimizationStats, setOptimizationStats] = useState<PerformanceStats | null>(null)
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchPerformanceData = async () => {
    try {
      setLoading(true)
      
      // In a real implementation, you would fetch this from an API endpoint
      // For now, we'll simulate the data structure
      const mockAiStats: PerformanceStats = {
        totalOperations: 156,
        successfulOperations: 148,
        failedOperations: 8,
        averageDuration: 4200,
        minDuration: 1200,
        maxDuration: 8900,
        successRate: 95,
        recentMetrics: []
      }

      const mockBatchStats: PerformanceStats = {
        totalOperations: 23,
        successfulOperations: 22,
        failedOperations: 1,
        averageDuration: 8500,
        minDuration: 3200,
        maxDuration: 15600,
        successRate: 96,
        recentMetrics: []
      }

      const mockOptimizationStats: PerformanceStats = {
        totalOperations: 156,
        successfulOperations: 156,
        failedOperations: 0,
        averageDuration: 450,
        minDuration: 120,
        maxDuration: 1200,
        successRate: 100,
        recentMetrics: []
      }

      setAiStats(mockAiStats)
      setBatchStats(mockBatchStats)
      setOptimizationStats(mockOptimizationStats)

      // Generate insights
      const mockInsights = [
        "⚡ AI analysis is performing well (4.2s avg)",
        "🎯 95% success rate for single image analysis",
        "📦 Batch processing shows 96% success rate",
        "🖼️ Image optimization achieving 100% success rate"
      ]
      setInsights(mockInsights)

      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error fetching performance data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPerformanceData()
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchPerformanceData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval])

  const getPerformanceColor = (successRate: number) => {
    if (successRate >= 95) return "text-green-600"
    if (successRate >= 85) return "text-yellow-600"
    return "text-red-600"
  }

  const getDurationColor = (duration: number, threshold: number = 5000) => {
    if (duration <= threshold) return "text-green-600"
    if (duration <= threshold * 1.5) return "text-yellow-600"
    return "text-red-600"
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Performance Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of GPT-5 image analysis performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchPerformanceData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <span className="text-sm">{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Single Image Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Single Image Analysis
            </CardTitle>
            <CardDescription>GPT-5 vision performance</CardDescription>
          </CardHeader>
          <CardContent>
            {aiStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getPerformanceColor(aiStats.successRate)}`}>
                      {aiStats.successRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getDurationColor(aiStats.averageDuration)}`}>
                      {formatDuration(aiStats.averageDuration)}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Duration</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success Rate</span>
                    <span>{aiStats.successRate}%</span>
                  </div>
                  <Progress value={aiStats.successRate} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Total Operations</div>
                    <div className="font-medium">{aiStats.totalOperations}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Failed</div>
                    <div className="font-medium text-red-600">{aiStats.failedOperations}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Batch Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Batch Analysis
            </CardTitle>
            <CardDescription>Multiple images processing</CardDescription>
          </CardHeader>
          <CardContent>
            {batchStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getPerformanceColor(batchStats.successRate)}`}>
                      {batchStats.successRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getDurationColor(batchStats.averageDuration, 10000)}`}>
                      {formatDuration(batchStats.averageDuration)}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Duration</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success Rate</span>
                    <span>{batchStats.successRate}%</span>
                  </div>
                  <Progress value={batchStats.successRate} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Total Batches</div>
                    <div className="font-medium">{batchStats.totalOperations}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Failed</div>
                    <div className="font-medium text-red-600">{batchStats.failedOperations}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Image Optimization
            </CardTitle>
            <CardDescription>Pre-processing performance</CardDescription>
          </CardHeader>
          <CardContent>
            {optimizationStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getPerformanceColor(optimizationStats.successRate)}`}>
                      {optimizationStats.successRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getDurationColor(optimizationStats.averageDuration, 1000)}`}>
                      {formatDuration(optimizationStats.averageDuration)}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Duration</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success Rate</span>
                    <span>{optimizationStats.successRate}%</span>
                  </div>
                  <Progress value={optimizationStats.successRate} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Total Optimized</div>
                    <div className="font-medium">{optimizationStats.totalOperations}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Failed</div>
                    <div className="font-medium text-red-600">{optimizationStats.failedOperations}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Alerts */}
      {(aiStats?.successRate < 90 || batchStats?.successRate < 90) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Performance degradation detected. Consider checking API configuration and network connectivity.
          </AlertDescription>
        </Alert>
      )}

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">Image Caching Active</div>
                <div className="text-sm text-green-600">Cached results reduce processing time by 80%</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">Concurrent Processing</div>
                <div className="text-sm text-blue-600">Up to 3 images processed simultaneously</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <Zap className="h-4 w-4 text-purple-600 mt-0.5" />
              <div>
                <div className="font-medium text-purple-800">Smart Image Optimization</div>
                <div className="text-sm text-purple-600">Automatic compression maintains quality while reducing size</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
