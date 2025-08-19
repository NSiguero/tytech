"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, AlertTriangle, CheckCircle, Eye, Lightbulb } from "lucide-react"

interface SmartInsightsProps {
  selectedChains: string[]
  selectedSupermarkets: string[]
  selectedBrands: string[]
  selectedProducts: string[]
  dateFrom?: Date
  dateTo?: Date
}

export function SmartInsights({
  selectedChains,
  selectedSupermarkets,
  selectedBrands,
  selectedProducts,
  dateFrom,
  dateTo,
}: SmartInsightsProps) {
  // Mock insights data
  const insights = [
    {
      id: 1,
      type: "opportunity" as const,
      title: "Oportunidad de Crecimiento",
      description: "Oreo Original muestra un 15% más de ventas en Mercadona vs otras cadenas",
      impact: "Alto",
      confidence: 92,
      action: "Expandir presencia en displays",
      chains: ["Mercadona"],
      products: ["Oreo Original"],
    },
    {
      id: 2,
      type: "alert" as const,
      title: "Alerta de Stock",
      description: "Nutella 400g tiene baja disponibilidad en 3 supermercados",
      impact: "Medio",
      confidence: 87,
      action: "Contactar con responsables de reposición",
      chains: ["Carrefour", "Día"],
      products: ["Nutella 400g"],
    },
    {
      id: 3,
      type: "trend" as const,
      title: "Tendencia Positiva",
      description: "Coca-Cola 330ml incrementó visibilidad un 22% este mes",
      impact: "Alto",
      confidence: 95,
      action: "Mantener estrategia actual",
      chains: ["Mercadona", "Carrefour", "Día"],
      products: ["Coca-Cola 330ml"],
    },
    {
      id: 4,
      type: "recommendation" as const,
      title: "Recomendación de Precio",
      description: "Cereales Nestlé podría optimizar precio en Alcampo",
      impact: "Medio",
      confidence: 78,
      action: "Revisar estrategia de precios",
      chains: ["Alcampo"],
      products: ["Cereales Nestlé"],
    },
  ]

  // Filter insights based on selections
  const filteredInsights = insights.filter((insight) => {
    const matchesChain = selectedChains.length === 0 || selectedChains.some((chain) => insight.chains.includes(chain))
    const matchesProduct =
      selectedProducts.length === 0 || selectedProducts.some((product) => insight.products.includes(product))

    return matchesChain && matchesProduct
  })

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "trend":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "recommendation":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "border-green-200 bg-green-50"
      case "alert":
        return "border-red-200 bg-red-50"
      case "trend":
        return "border-blue-200 bg-blue-50"
      case "recommendation":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Alto":
        return "bg-red-100 text-red-800"
      case "Medio":
        return "bg-yellow-100 text-yellow-800"
      case "Bajo":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Insights Inteligentes</CardTitle>
          <Badge variant="outline" className="text-xs">
            {filteredInsights.length} insights
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {filteredInsights.length > 0 ? (
          <div className="space-y-4">
            {filteredInsights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <h3 className="font-medium text-sm text-slate-900">{insight.title}</h3>
                  </div>
                  <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>{insight.impact}</Badge>
                </div>

                <p className="text-sm text-slate-600 mb-3">{insight.description}</p>

                {/* Confidence Score */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Confianza</span>
                    <span>{insight.confidence}%</span>
                  </div>
                  <Progress value={insight.confidence} className="h-2" />
                </div>

                {/* Action */}
                <div className="mb-3">
                  <span className="text-xs font-medium text-slate-700">Acción recomendada:</span>
                  <p className="text-sm text-slate-600 mt-1">{insight.action}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {insight.chains.map((chain) => (
                    <Badge key={chain} variant="secondary" className="text-xs">
                      {chain}
                    </Badge>
                  ))}
                  {insight.products.map((product) => (
                    <Badge key={product} variant="outline" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="h-7 px-3 text-xs bg-transparent">
                    <Eye className="h-3 w-3 mr-1" />
                    Ver detalles
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 px-3 text-xs bg-transparent">
                    Aplicar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">
              <Lightbulb className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-slate-500 text-sm">No hay insights disponibles con los filtros aplicados</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
