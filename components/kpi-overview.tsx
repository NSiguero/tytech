"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, ShoppingCart, AlertTriangle, Users } from "lucide-react"

interface KPIOverviewProps {
  selectedChains: string[]
  selectedSupermarkets: string[]
  selectedBrands: string[]
  selectedProducts: string[]
  dateFrom?: Date
  dateTo?: Date
}

export function KPIOverview({
  selectedChains,
  selectedSupermarkets,
  selectedBrands,
  selectedProducts,
  dateFrom,
  dateTo,
}: KPIOverviewProps) {
  // Mock data that would be filtered based on selections
  const kpis = [
    {
      title: "Visitas Totales",
      value: "2,847",
      change: "+12.5%",
      trend: "up" as const,
      icon: Eye,
      description: "vs mes anterior",
    },
    {
      title: "Productos Monitoreados",
      value: "1,234",
      change: "+8.2%",
      trend: "up" as const,
      icon: ShoppingCart,
      description: "productos activos",
    },
    {
      title: "Alertas Activas",
      value: "23",
      change: "-15.3%",
      trend: "down" as const,
      icon: AlertTriangle,
      description: "requieren atención",
    },
    {
      title: "Supermercados",
      value: "156",
      change: "+3.1%",
      trend: "up" as const,
      icon: Users,
      description: "en seguimiento",
    },
  ]

  const getFilterSummary = () => {
    const parts = []
    if (selectedChains.length > 0) parts.push(`${selectedChains.length} cadena${selectedChains.length > 1 ? "s" : ""}`)
    if (selectedSupermarkets.length > 0)
      parts.push(`${selectedSupermarkets.length} supermercado${selectedSupermarkets.length > 1 ? "s" : ""}`)
    if (selectedBrands.length > 0) parts.push(`${selectedBrands.length} marca${selectedBrands.length > 1 ? "s" : ""}`)
    if (selectedProducts.length > 0)
      parts.push(`${selectedProducts.length} producto${selectedProducts.length > 1 ? "s" : ""}`)

    return parts.length > 0 ? parts.join(", ") : "Todos los datos"
  }

  return (
    <div className="space-y-4">
      {/* Filter Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Resumen de KPIs</h2>
        <Badge variant="outline" className="text-xs">
          {getFilterSummary()}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{kpi.title}</CardTitle>
                <Icon className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={kpi.trend === "up" ? "text-green-600" : "text-red-600"}>{kpi.change}</span>
                  <span>{kpi.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
