"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Users, 
  Clock, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  MapPin,
  Building,
  Calendar
} from 'lucide-react'

interface KPIData {
  total_tareas: number
  tareas_completadas: number
  tareas_pendientes: number
  tareas_en_progreso: number
  total_visitas: number
  total_reportes: number
  tareas_urgentes: number
  tareas_vencidas: number
  promedio_horas_reales: number
  promedio_horas_estimadas: number
  total_horas_trabajadas: number
  agentes_activos: number
  cadenas_visitadas: number
  areas_cubiertas: number
  total_usuarios: number
  total_agentes: number
  total_managers: number
  total_equipos: number
  total_supermercados: number
  areas_disponibles: number
  cadenas_disponibles: number
  promedio_snacks: number
  promedio_cereales: number
  actividad_reciente: number
  completadas_recientes: number
  agentes_activos_recientes: number
  tasa_completacion: string
  eficiencia_horaria: string
  cobertura_supermercados: string
}

export function AnalyticsKPIs() {
  const [kpis, setKpis] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKPIs()
  }, [])

  const fetchKPIs = async () => {
    try {
      const response = await fetch('/api/analytics/kpis')
      const result = await response.json()
      
      if (result.success) {
        setKpis(result.data)
      }
    } catch (error) {
      console.error('Error fetching KPIs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!kpis) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No se pudieron cargar los KPIs
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Resumen de KPIs</h2>
          <p className="text-muted-foreground">
            Métricas principales del sistema de retail analytics
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Actualizado ahora
        </Badge>
      </div>

      {/* Main KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Tasks */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tareas</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.total_tareas}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-green-600">{kpis.tareas_completadas} completadas</span>
              <span>•</span>
              <span className="text-orange-600">{kpis.tareas_pendientes} pendientes</span>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Completación</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.tasa_completacion}%</div>
            <div className="text-xs text-muted-foreground">
              {kpis.tareas_completadas} de {kpis.total_tareas} tareas
            </div>
          </CardContent>
        </Card>

        {/* Active Agents */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agentes Activos</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.agentes_activos}</div>
            <div className="text-xs text-muted-foreground">
              De {kpis.total_agentes} agentes totales
            </div>
          </CardContent>
        </Card>

        {/* Urgent Tasks */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{kpis.tareas_urgentes}</div>
            <div className="text-xs text-muted-foreground">
              {kpis.tareas_vencidas} vencidas
            </div>
          </CardContent>
        </Card>

        {/* Total Hours */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Trabajadas</CardTitle>
            <Clock className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.total_horas_trabajadas.toFixed(1)}h</div>
            <div className="text-xs text-muted-foreground">
              Promedio: {kpis.promedio_horas_reales.toFixed(1)}h por tarea
            </div>
          </CardContent>
        </Card>

        {/* Hour Efficiency */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia Horaria</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.eficiencia_horaria}%</div>
            <div className="text-xs text-muted-foreground">
              Real vs Estimado
            </div>
          </CardContent>
        </Card>

        {/* Supermarket Coverage */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura</CardTitle>
            <Building className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.cobertura_supermercados}%</div>
            <div className="text-xs text-muted-foreground">
              {kpis.cadenas_visitadas} de {kpis.cadenas_disponibles} cadenas
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividad Reciente</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.actividad_reciente}</div>
            <div className="text-xs text-muted-foreground">
              Últimos 30 días
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Visit Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Distribución de Visitas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Visitas</span>
              <Badge variant="secondary">{kpis.total_visitas}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Reportes</span>
              <Badge variant="outline">{kpis.total_reportes}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Áreas Cubiertas</span>
              <Badge variant="secondary">{kpis.areas_cubiertas}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Team Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Resumen del Equipo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Equipos</span>
              <Badge variant="secondary">{kpis.total_equipos}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Managers</span>
              <Badge variant="outline">{kpis.total_managers}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Agentes de Campo</span>
              <Badge variant="secondary">{kpis.total_agentes}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Market Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-orange-600" />
              Estadísticas de Mercado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Supermercados</span>
              <Badge variant="secondary">{kpis.total_supermercados}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Cadenas Disponibles</span>
              <Badge variant="outline">{kpis.cadenas_disponibles}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Áreas Geográficas</span>
              <Badge variant="secondary">{kpis.areas_disponibles}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
