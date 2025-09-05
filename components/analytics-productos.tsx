"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  TrendingUp, 
  Eye, 
  Euro, 
  Star,
  Calendar,
  Search,
  BarChart3,
  Award,
  DollarSign,
  Layers,
  Users
} from 'lucide-react'

interface ProductoData {
  nombre: string
  marca: string
  detecciones?: number
  confidence_promedio?: number
  facing_promedio?: number
  ultima_deteccion?: string
  precio_detectado?: string
  precio_numerico?: number
  usuario?: string
  created_at?: string
  facing?: number
  confidence?: number
  total_detecciones?: number
  productos_unicos?: number
  facing_maximo?: number
  categoria?: string
}

interface ProductAnalytics {
  stats: {
    total_detecciones: number
    productos_unicos: number
    marcas_unicas: number
    precio_promedio: string | number
    precio_mediano: string | number
    precio_maximo: string | number
    precio_minimo: string | number
    total_con_precio?: number
  }
  top_productos: ProductoData[]
  top_marcas: ProductoData[]
  productos_caros: ProductoData[]
  detecciones_recientes: ProductoData[]
  facing_analysis: ProductoData[]
  tendencias_precios: ProductoData[]
}

export function AnalyticsProductos() {
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCadena, setSelectedCadena] = useState<string>('all')
  const [selectedMarca, setSelectedMarca] = useState<string>('all')

  useEffect(() => {
    fetchAnalytics()
  }, [selectedMarca])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (selectedMarca !== 'all') {
        params.append('marca', selectedMarca)
      }

      const response = await fetch(`/api/analytics/productos?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('API Response:', result) // Debug log
      
      if (result.success) {
        setAnalytics(result.data)
      } else {
        console.error('API returned error:', result.error)
      }
    } catch (error) {
      console.error('Error fetching product analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getConfidenceColor = (confidence: number | null | undefined) => {
    const conf = Number(confidence) || 0
    if (conf >= 0.9) return 'text-green-600 bg-green-50'
    if (conf >= 0.8) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const safeNumber = (value: any, decimals: number = 1): string => {
    const num = Number(value) || 0
    return num.toFixed(decimals)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No se pudieron cargar los análisis de productos
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-green-600" />
            Análisis de Productos IA
          </h2>
          <p className="text-muted-foreground">
            Insights basados en productos detectados por inteligencia artificial
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {analytics.stats.total_detecciones} detecciones
        </Badge>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <Select value={selectedMarca} onValueChange={setSelectedMarca}>
          <SelectTrigger>
            <SelectValue placeholder="Todas las marcas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las marcas</SelectItem>
            {analytics && analytics.top_marcas && analytics.top_marcas.slice(0, 10).map((marca) => (
              <SelectItem key={marca.marca} value={marca.marca}>
                {marca.marca} ({marca.total_detecciones})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-center text-sm text-muted-foreground">
          {analytics ? analytics.stats.productos_unicos : 0} productos únicos detectados
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Detecciones</span>
            </div>
            <div className="text-2xl font-bold">{analytics.stats.total_detecciones}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Productos</span>
            </div>
            <div className="text-2xl font-bold">{analytics.stats.productos_unicos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Marcas</span>
            </div>
            <div className="text-2xl font-bold">{analytics.stats.marcas_unicas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Euro className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Precio Prom.</span>
            </div>
            <div className="text-2xl font-bold">{analytics.stats.precio_promedio}€</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="popular">Más Populares</TabsTrigger>
          <TabsTrigger value="marcas">Top Marcas</TabsTrigger>
          <TabsTrigger value="precios">Análisis Precios</TabsTrigger>
          <TabsTrigger value="facing">Facing</TabsTrigger>
          <TabsTrigger value="recientes">Recientes</TabsTrigger>
        </TabsList>

        {/* Most Popular Products */}
        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Productos Más Detectados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.top_productos.map((producto, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{producto.nombre}</div>
                      <div className="text-sm text-muted-foreground">
                        {producto.marca} • {producto.detecciones} detecciones
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getConfidenceColor(producto.confidence_promedio || 0)}>
                        {((producto.confidence_promedio || 0) * 100).toFixed(0)}%
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        Facing: {safeNumber(producto.facing_promedio, 1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Brands */}
        <TabsContent value="marcas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Marcas Más Detectadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.top_marcas.map((marca, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="font-semibold text-lg">{marca.marca}</div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Detecciones:</span>
                        <div className="font-medium">{marca.total_detecciones}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Productos:</span>
                        <div className="font-medium">{marca.productos_unicos}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge className={getConfidenceColor(marca.confidence_promedio || 0)}>
                        Confianza: {((marca.confidence_promedio || 0) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Price Analysis */}
        <TabsContent value="precios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Price Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-orange-600" />
                  Estadísticas de Precios
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {analytics.stats.total_con_precio || 0} productos con precio detectado
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Promedio</span>
                    <div className="text-xl font-bold">{safeNumber(analytics.stats.precio_promedio, 2)}€</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Mediana</span>
                    <div className="text-xl font-bold">{safeNumber(analytics.stats.precio_mediano, 2)}€</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Máximo</span>
                    <div className="text-xl font-bold text-red-600">{safeNumber(analytics.stats.precio_maximo, 2)}€</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Mínimo</span>
                    <div className="text-xl font-bold text-green-600">{safeNumber(analytics.stats.precio_minimo, 2)}€</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Most Expensive Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-red-600" />
                  Productos Más Caros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.productos_caros.slice(0, 8).map((producto, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{producto.nombre}</div>
                        <div className="text-xs text-muted-foreground">{producto.marca}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={index < 3 ? "destructive" : "secondary"}>
                          {producto.precio_detectado}
                        </Badge>
                        {producto.precio_numerico && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {safeNumber(producto.precio_numerico, 2)}€
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Facing Analysis */}
        <TabsContent value="facing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                Análisis de Facing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.facing_analysis.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">{item.nombre}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.marca} • {item.detecciones} veces detectado
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {safeNumber(item.facing_promedio, 1)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Máx: {item.facing_maximo}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Detections */}
        <TabsContent value="recientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Detecciones Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.detecciones_recientes.map((deteccion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{deteccion.nombre}</div>
                      <div className="text-sm text-muted-foreground">
                        {deteccion.marca} • Por {deteccion.usuario}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(deteccion.created_at || '')}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      {deteccion.precio_detectado && (
                        <Badge variant="outline">{deteccion.precio_detectado}</Badge>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Facing: {deteccion.facing} | {((deteccion.confidence || 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
