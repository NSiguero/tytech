"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Eye, 
  Clock, 
  Zap, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Package,
  Euro
} from "lucide-react"

interface ProductDetection {
  id: number
  nombre: string
  marca: string
  facing: number
  precio_detectado: string | null
  es_reconocido: boolean
  confidence: number
  created_at: string
}

interface AnalysisStats {
  totalDetected: number
  recognized: number
  unrecognized: number
  processingTime?: number
  aiProcessingTime?: number
}

interface ProductDetectionResultsProps {
  fotoId?: number
  fotoIds?: number[]
  onAnalysisComplete?: (results: ProductDetection[], stats: AnalysisStats) => void
  autoAnalyze?: boolean
}

export function ProductDetectionResults({ 
  fotoId, 
  fotoIds, 
  onAnalysisComplete, 
  autoAnalyze = false 
}: ProductDetectionResultsProps) {
  const [products, setProducts] = useState<ProductDetection[]>([])
  const [stats, setStats] = useState<AnalysisStats | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  useEffect(() => {
    if (autoAnalyze && (fotoId || fotoIds)) {
      handleAnalyze()
    }
  }, [fotoId, fotoIds, autoAnalyze])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setError(null)
    setAnalysisProgress(0)

    try {
      const startTime = Date.now()
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(fotoId && { fotoId }),
          ...(fotoIds && { fotoIds })
        }),
      })

      clearInterval(progressInterval)
      setAnalysisProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const data = await response.json()
      
      if (data.success) {
        // Handle both single and batch results
        if (data.results) {
          // Batch analysis results
          const allProducts: ProductDetection[] = []
          let totalStats: AnalysisStats = {
            totalDetected: 0,
            recognized: 0,
            unrecognized: 0,
            processingTime: data.batchStats?.totalProcessingTime
          }

          data.results.forEach((result: any) => {
            if (result.success && result.products) {
              allProducts.push(...result.products)
              totalStats.totalDetected += result.stats.totalDetected
              totalStats.recognized += result.stats.recognized
              totalStats.unrecognized += result.stats.unrecognized
            }
          })

          setProducts(allProducts)
          setStats(totalStats)
        } else {
          // Single analysis results
          setProducts(data.products || [])
          setStats(data.analysisStats || {
            totalDetected: data.products?.length || 0,
            recognized: data.products?.filter((p: ProductDetection) => p.es_reconocido).length || 0,
            unrecognized: data.products?.filter((p: ProductDetection) => !p.es_reconocido).length || 0,
            processingTime: data.analysisStats?.processingTime,
            aiProcessingTime: data.analysisStats?.aiProcessingTime
          })
        }

        onAnalysisComplete?.(products, stats!)
      } else {
        throw new Error(data.error || 'Analysis failed')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAnalyzing(false)
      setTimeout(() => setAnalysisProgress(0), 1000)
    }
  }

  const getRecognitionRate = () => {
    if (!stats || stats.totalDetected === 0) return 0
    return Math.round((stats.recognized / stats.totalDetected) * 100)
  }

  const getAverageFacing = () => {
    if (products.length === 0) return 0
    const totalFacing = products.reduce((sum, product) => sum + product.facing, 0)
    return Math.round(totalFacing / products.length)
  }

  const getTotalValue = () => {
    return products.reduce((sum, product) => {
      if (product.precio_detectado) {
        const price = parseFloat(product.precio_detectado.replace('€', '').trim())
        return sum + (price * product.facing)
      }
      return sum
    }, 0)
  }

  const getPriceAnomalyCount = () => {
    return products.filter(product => product.price_anomaly).length
  }

  return (
    <div className="space-y-6">
      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Product Detection Analysis
          </CardTitle>
          <CardDescription>
            {fotoIds ? `Batch analysis for ${fotoIds.length} images` : 'Single image analysis'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAnalyzing && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 animate-pulse text-blue-500" />
                <span className="text-sm font-medium">Analyzing with GPT-5...</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Processing image{analysisProgress > 50 ? 's' : ''} with AI vision...
              </p>
            </div>
          )}

          {!isAnalyzing && (
            <Button 
              onClick={handleAnalyze} 
              disabled={!fotoId && !fotoIds}
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              {fotoIds ? `Analyze ${fotoIds.length} Images` : 'Analyze Image'}
            </Button>
          )}

          {error && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analysis Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.processingTime ? `${Math.round(stats.processingTime / 1000)}s` : '-'}
                </div>
                <div className="text-xs text-muted-foreground">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.aiProcessingTime ? `${Math.round(stats.aiProcessingTime / 1000)}s` : '-'}
                </div>
                <div className="text-xs text-muted-foreground">AI Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {getRecognitionRate()}%
                </div>
                <div className="text-xs text-muted-foreground">Recognition Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.totalDetected}
                </div>
                <div className="text-xs text-muted-foreground">Products Found</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Detection Results
            </CardTitle>
            <CardDescription>
              {stats?.recognized} recognized, {stats?.unrecognized} unrecognized products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-semibold text-green-800">{stats?.recognized}</div>
                  <div className="text-sm text-green-600">Recognized</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-semibold text-yellow-800">{stats?.unrecognized}</div>
                  <div className="text-sm text-green-600">Unrecognized</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-800">{getAverageFacing()}</div>
                  <div className="text-sm text-blue-600">Avg. Facings</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-semibold text-red-800">{getPriceAnomalyCount()}</div>
                  <div className="text-sm text-red-600">Price Anomalies</div>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-3">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.nombre}</span>
                      <Badge variant={product.es_reconocido ? "default" : "secondary"}>
                        {product.es_reconocido ? "Recognized" : "Unrecognized"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Brand: {product.marca} • Facings: {product.facing}
                    </div>
                  </div>
                  <div className="text-right">
                    {product.precio_detectado && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Euro className="h-4 w-4" />
                        <span className="font-medium">{product.precio_detectado}</span>
                        {product.price_anomaly && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            {product.price_anomaly}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Confidence: {Math.round(product.confidence * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Anomalies Summary */}
            {getPriceAnomalyCount() > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">Price Anomalies Detected</span>
                </div>
                <div className="space-y-1">
                  {products.filter(p => p.price_anomaly).map((product, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-red-700">{product.nombre}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">{product.precio_detectado}</span>
                        <Badge variant="destructive" className="text-xs">
                          {product.price_anomaly}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Value */}
            {getTotalValue() > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Shelf Value:</span>
                  <span className="text-lg font-bold text-green-600">
                    €{getTotalValue().toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 