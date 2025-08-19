"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Eye, Package, Search, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrandProductTableProps {
  selectedChains: string[]
  selectedSupermarkets: string[]
  selectedBrands: string[]
  selectedProducts: string[]
  dateFrom?: Date
  dateTo?: Date
}

interface ProductData {
  id: string
  name: string
  brand: string
  category: string
  price: number
  sales: number
  growth: number
  views: number // Cantidad de veces que se ha visto/visitado
  stock: number
  availability: number
  lastSeen: string
}

const mockProducts: ProductData[] = [
  {
    id: "1",
    name: "Coca-Cola Original 330ml",
    brand: "Coca-Cola",
    category: "Bebidas",
    price: 1.25,
    sales: 15420,
    growth: 8.5,
    views: 2340,
    stock: 450,
    availability: 95,
    lastSeen: "2024-01-15",
  },
  {
    id: "2",
    name: "Nutella 400g",
    brand: "Ferrero",
    category: "Dulces",
    price: 4.89,
    sales: 8750,
    growth: -2.3,
    views: 1890,
    stock: 120,
    availability: 78,
    lastSeen: "2024-01-14",
  },
  {
    id: "3",
    name: "Yogur Natural Danone",
    brand: "Danone",
    category: "Lácteos",
    price: 2.15,
    sales: 12300,
    growth: 12.7,
    views: 3450,
    stock: 280,
    availability: 92,
    lastSeen: "2024-01-15",
  },
  {
    id: "4",
    name: "Cereales Nestlé Fitness",
    brand: "Nestlé",
    category: "Cereales",
    price: 3.45,
    sales: 6890,
    growth: 5.2,
    views: 1560,
    stock: 95,
    availability: 67,
    lastSeen: "2024-01-13",
  },
  {
    id: "5",
    name: "Agua Mineral Bezoya 1.5L",
    brand: "Bezoya",
    category: "Bebidas",
    price: 0.85,
    sales: 23450,
    growth: 15.8,
    views: 4120,
    stock: 890,
    availability: 98,
    lastSeen: "2024-01-15",
  },
]

export function BrandProductTable({
  selectedChains,
  selectedSupermarkets,
  selectedBrands,
  selectedProducts,
  dateFrom,
  dateTo,
}: BrandProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("sales")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterCategory, setFilterCategory] = useState("all")

  // Filter and sort data
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategory === "all" || product.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: number | string = a[sortBy as keyof ProductData]
    let bValue: number | string = b[sortBy as keyof ProductData]

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES")
  }

  const getAvailabilityColor = (availability: number) => {
    if (availability >= 90) return "text-green-600 bg-green-100"
    if (availability >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const categories = ["all", ...Array.from(new Set(mockProducts.map((p) => p.category)))]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Rendimiento de Productos</span>
          </CardTitle>
          <Badge variant="outline">{sortedProducts.length} productos</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos o marcas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.slice(1).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort("price")}
                  >
                    Precio
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort("sales")}
                  >
                    Ventas
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort("growth")}
                  >
                    Crecimiento
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort("views")}
                  >
                    Visitas
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort("availability")}
                  >
                    Disponibilidad
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Última Vista</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        {product.brand} • {product.category}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{formatCurrency(product.price)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{product.sales.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {product.growth > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={cn("font-semibold", {
                          "text-green-600": product.growth > 0,
                          "text-red-600": product.growth < 0,
                          "text-gray-600": product.growth === 0,
                        })}
                      >
                        {product.growth > 0 ? "+" : ""}
                        {product.growth}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-blue-600">{product.views.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", getAvailabilityColor(product.availability))}>
                      {product.availability}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{formatDate(product.lastSeen)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron productos con los filtros aplicados</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
