"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Calendar, 
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react'

interface SupermercadoData {
  id: number
  codigo: string
  cadena: string
  rotulo: string
  direccion: string
  municipio: string
  provincia: string
  area: string
  cereales: string
  snacks: string
  total_visitas: number
  visitas_completadas: number
  visitas_pendientes: number
  visitas_en_progreso: number
  promedio_horas: number
  ultima_visita: string
}

export function AnalyticsSupermercados() {
  const [supermercados, setSupermercados] = useState<SupermercadoData[]>([])
  const [filteredSupermercados, setFilteredSupermercados] = useState<SupermercadoData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCadena, setSelectedCadena] = useState<string>('all')
  const [selectedArea, setSelectedArea] = useState<string>('all')

  useEffect(() => {
    fetchSupermercados()
  }, [])

  useEffect(() => {
    filterSupermercados()
  }, [supermercados, searchTerm, selectedCadena, selectedArea])

  const fetchSupermercados = async () => {
    try {
      const response = await fetch('/api/analytics/supermercados')
      const result = await response.json()
      
      if (result.success) {
        setSupermercados(result.data)
      }
    } catch (error) {
      console.error('Error fetching supermercados:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSupermercados = () => {
    let filtered = supermercados

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(super_ => 
        super_.rotulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        super_.cadena.toLowerCase().includes(searchTerm.toLowerCase()) ||
        super_.municipio.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by cadena
    if (selectedCadena !== 'all') {
      filtered = filtered.filter(super_ => super_.cadena === selectedCadena)
    }

    // Filter by area
    if (selectedArea !== 'all') {
      filtered = filtered.filter(super_ => super_.area === selectedArea)
    }

    setFilteredSupermercados(filtered)
  }

  const getUniqueValues = (field: keyof SupermercadoData) => {
    return [...new Set(supermercados.map(item => item[field]))].filter(Boolean)
  }

  const getStatusColor = (completadas: number, total: number) => {
    if (total === 0) return 'bg-gray-100 text-gray-600'
    const percentage = (completadas / total) * 100
    if (percentage >= 80) return 'bg-green-100 text-green-700'
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin visitas'
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            Análisis de Supermercados
          </h2>
          <p className="text-muted-foreground">
            Datos de visitas y rendimiento por supermercado
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredSupermercados.length} supermercados
        </Badge>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar supermercados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCadena} onValueChange={setSelectedCadena}>
          <SelectTrigger>
            <SelectValue placeholder="Todas las cadenas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las cadenas</SelectItem>
            {getUniqueValues('cadena').map((cadena) => (
              <SelectItem key={cadena} value={cadena}>
                {cadena}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger>
            <SelectValue placeholder="Todas las áreas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las áreas</SelectItem>
            {getUniqueValues('area').map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-center text-sm text-muted-foreground">
          {filteredSupermercados.length} de {supermercados.length} supermercados
        </div>
      </div>

      {/* Supermercados Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSupermercados.map((super_) => (
          <Card key={super_.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-blue-700">
                    {super_.rotulo}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {super_.cadena}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {super_.area}
                    </Badge>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(super_.visitas_completadas, super_.total_visitas)}`}>
                  {super_.total_visitas > 0 
                    ? `${Math.round((super_.visitas_completadas / super_.total_visitas) * 100)}%`
                    : '0%'
                  }
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              
              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{super_.direccion}, {super_.municipio}</span>
              </div>

              {/* Visit Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Visitas</span>
                  </div>
                  <div className="text-2xl font-bold">{super_.total_visitas}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Horas Prom.</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {super_.promedio_horas ? super_.promedio_horas.toFixed(1) : '0'}h
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Completadas</span>
                  </div>
                  <span className="font-medium">{super_.visitas_completadas}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-orange-600" />
                    <span>En progreso</span>
                  </div>
                  <span className="font-medium">{super_.visitas_en_progreso}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-600" />
                    <span>Pendientes</span>
                  </div>
                  <span className="font-medium">{super_.visitas_pendientes}</span>
                </div>
              </div>

              {/* Market Data */}
              <div className="pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Snacks:</span>
                    <div className="font-medium">{parseFloat(super_.snacks || '0').toFixed(1)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cereales:</span>
                    <div className="font-medium">{parseFloat(super_.cereales || '0').toFixed(1)}</div>
                  </div>
                </div>
              </div>

              {/* Last Visit */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-gray-100">
                <span>Última visita:</span>
                <span>{formatDate(super_.ultima_visita)}</span>
              </div>
              
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSupermercados.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron supermercados</h3>
            <p className="text-muted-foreground">
              Intenta ajustar los filtros para ver más resultados
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
