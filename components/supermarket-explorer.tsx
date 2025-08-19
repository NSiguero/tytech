"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Store, TrendingUp, TrendingDown, Search, X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface SupermarketExplorerProps {
  selectedChains: string[]
  selectedSupermarkets: string[]
  selectedBrands: string[]
  selectedProducts: string[]
  onChainSelect?: (chain: string) => void
  onSupermarketSelect?: (supermarket: string) => void
  dateFrom?: Date
  dateTo?: Date
}

interface SupermarketData {
  id: string
  name: string
  chain: string
  location: string
  revenue: number
  growth: number
  visits: number
  products: number
  status: "active" | "inactive" | "maintenance"
}

const mockSupermarkets: SupermarketData[] = [
  {
    id: "1",
    name: "Mercadona Centro",
    chain: "Mercadona",
    location: "Madrid Centro",
    revenue: 125000,
    growth: 12.5,
    visits: 1250,
    products: 45,
    status: "active",
  },
  {
    id: "2",
    name: "Carrefour Plaza",
    chain: "Carrefour",
    location: "Barcelona Eixample",
    revenue: 98000,
    growth: -3.2,
    visits: 890,
    products: 32,
    status: "active",
  },
  {
    id: "3",
    name: "Día Malasaña",
    chain: "Día",
    location: "Madrid Malasaña",
    revenue: 67000,
    growth: 8.7,
    visits: 567,
    products: 28,
    status: "maintenance",
  },
  {
    id: "4",
    name: "El Corte Inglés Castellana",
    chain: "El Corte Inglés",
    location: "Madrid Castellana",
    revenue: 156000,
    growth: 15.3,
    visits: 1890,
    products: 67,
    status: "active",
  },
  {
    id: "5",
    name: "Lidl Valencia",
    chain: "Lidl",
    location: "Valencia Centro",
    revenue: 78000,
    growth: 5.8,
    visits: 723,
    products: 38,
    status: "active",
  },
]

export function SupermarketExplorer({
  selectedChains,
  selectedSupermarkets,
  selectedBrands,
  selectedProducts,
  onChainSelect,
  onSupermarketSelect,
  dateFrom,
  dateTo,
}: SupermarketExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("revenue")
  const [filterStatus, setFilterStatus] = useState("all")
  const [localFilters, setLocalFilters] = useState<{
    chains: string[]
    locations: string[]
  }>({
    chains: [],
    locations: [],
  })

  // Filter data based on search, status, and local filters
  const filteredSupermarkets = mockSupermarkets.filter((supermarket) => {
    const matchesSearch =
      supermarket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supermarket.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || supermarket.status === filterStatus

    const matchesChainFilter = localFilters.chains.length === 0 || localFilters.chains.includes(supermarket.chain)

    const matchesLocationFilter =
      localFilters.locations.length === 0 || localFilters.locations.some((loc) => supermarket.location.includes(loc))

    return matchesSearch && matchesStatus && matchesChainFilter && matchesLocationFilter
  })

  // Sort data
  const sortedSupermarkets = [...filteredSupermarkets].sort((a, b) => {
    switch (sortBy) {
      case "revenue":
        return b.revenue - a.revenue
      case "growth":
        return b.growth - a.growth
      case "visits":
        return b.visits - a.visits
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "inactive":
        return "Inactivo"
      case "maintenance":
        return "Mantenimiento"
      default:
        return "Desconocido"
    }
  }

  const addChainFilter = (chain: string) => {
    if (!localFilters.chains.includes(chain)) {
      setLocalFilters((prev) => ({
        ...prev,
        chains: [...prev.chains, chain],
      }))
    }
  }

  const removeChainFilter = (chain: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      chains: prev.chains.filter((c) => c !== chain),
    }))
  }

  const addLocationFilter = (location: string) => {
    const city = location.split(" ")[0] // Extract city name
    if (!localFilters.locations.includes(city)) {
      setLocalFilters((prev) => ({
        ...prev,
        locations: [...prev.locations, city],
      }))
    }
  }

  const removeLocationFilter = (location: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      locations: prev.locations.filter((l) => l !== location),
    }))
  }

  const clearAllFilters = () => {
    setLocalFilters({ chains: [], locations: [] })
    setSearchTerm("")
    setFilterStatus("all")
  }

  const hasActiveFilters =
    localFilters.chains.length > 0 || localFilters.locations.length > 0 || searchTerm !== "" || filterStatus !== "all"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Store className="h-5 w-5" />
            <span>Explorador de Supermercados</span>
          </CardTitle>
          <Badge variant="outline">{sortedSupermarkets.length} supermercados</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters and Search */}
        <div className="space-y-4 mb-6">
          {/* Search and Sort Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Ingresos</SelectItem>
                <SelectItem value="growth">Crecimiento</SelectItem>
                <SelectItem value="visits">Visitas</SelectItem>
                <SelectItem value="name">Nombre</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="maintenance">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Filtros activos:</span>

              {localFilters.chains.map((chain) => (
                <Badge key={chain} variant="secondary" className="text-xs">
                  Cadena: {chain}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => removeChainFilter(chain)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              {localFilters.locations.map((location) => (
                <Badge key={location} variant="secondary" className="text-xs">
                  Ciudad: {location}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => removeLocationFilter(location)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Búsqueda: "{searchTerm}"
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {filterStatus !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Estado: {getStatusText(filterStatus)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setFilterStatus("all")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              <Button variant="outline" size="sm" onClick={clearAllFilters} className="ml-auto text-xs bg-transparent">
                Limpiar todos
              </Button>
            </div>
          )}
        </div>

        {/* Supermarkets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedSupermarkets.map((supermarket) => (
            <div
              key={supermarket.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSupermarketSelect?.(supermarket.name)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900">{supermarket.name}</h3>
                  <div className="flex items-center space-x-1 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{supermarket.location}</span>
                  </div>
                </div>
                <Badge className={cn("text-xs", getStatusColor(supermarket.status))}>
                  {getStatusText(supermarket.status)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Ingresos</span>
                  <span className="text-sm font-semibold">{formatCurrency(supermarket.revenue)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Crecimiento</span>
                  <div className="flex items-center space-x-1">
                    {supermarket.growth > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={cn("text-sm font-semibold", {
                        "text-green-600": supermarket.growth > 0,
                        "text-red-600": supermarket.growth < 0,
                        "text-gray-600": supermarket.growth === 0,
                      })}
                    >
                      {supermarket.growth > 0 ? "+" : ""}
                      {supermarket.growth}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Visitas</span>
                  <span className="text-sm font-semibold">{supermarket.visits.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Productos</span>
                  <span className="text-sm font-semibold">{supermarket.products}</span>
                </div>
              </div>

              <div className="flex space-x-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    addChainFilter(supermarket.chain)
                  }}
                >
                  + {supermarket.chain}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    addLocationFilter(supermarket.location)
                  }}
                >
                  + {supermarket.location.split(" ")[0]}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {sortedSupermarkets.length === 0 && (
          <div className="text-center py-8">
            <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron supermercados con los filtros aplicados</p>
            <Button variant="outline" onClick={clearAllFilters} className="mt-2 bg-transparent">
              Limpiar filtros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
