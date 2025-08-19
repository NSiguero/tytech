"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye, Download, Calendar } from "lucide-react"

interface ImageCarouselProps {
  selectedChains: string[]
  selectedSupermarkets: string[]
  selectedBrands: string[]
  selectedProducts: string[]
  dateFrom?: Date
  dateTo?: Date
}

export function ImageCarousel({
  selectedChains,
  selectedSupermarkets,
  selectedBrands,
  selectedProducts,
  dateFrom,
  dateTo,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Mock data for images
  const images = [
    {
      id: 1,
      url: "/placeholder.svg?height=300&width=400&text=Oreo+Display",
      title: "Display Oreo - Mercadona Centro",
      product: "Oreo Original",
      brand: "Oreo",
      chain: "Mercadona",
      supermarket: "Mercadona Centro",
      date: "2025-07-23",
      visitor: "Ana García",
      notes: "Display bien posicionado, stock completo",
    },
    {
      id: 2,
      url: "/placeholder.svg?height=300&width=400&text=Nutella+Shelf",
      title: "Estantería Nutella - Carrefour Plaza",
      product: "Nutella 400g",
      brand: "Nutella",
      chain: "Carrefour",
      supermarket: "Carrefour Plaza",
      date: "2025-07-22",
      visitor: "Carlos López",
      notes: "Stock bajo, necesita reposición",
    },
    {
      id: 3,
      url: "/placeholder.svg?height=300&width=400&text=Coca+Cola+Fridge",
      title: "Nevera Coca-Cola - Día Market",
      product: "Coca-Cola 330ml",
      brand: "Coca-Cola",
      chain: "Día",
      supermarket: "Día Market",
      date: "2025-07-21",
      visitor: "María Rodríguez",
      notes: "Buena visibilidad, temperatura correcta",
    },
    {
      id: 4,
      url: "/placeholder.svg?height=300&width=400&text=Nestle+Cereals",
      title: "Cereales Nestlé - Alcampo",
      product: "Cereales Nestlé",
      brand: "Nestlé",
      chain: "Alcampo",
      supermarket: "Alcampo Hipermercado",
      date: "2025-07-20",
      visitor: "Pedro Martín",
      notes: "Promoción activa, buena rotación",
    },
  ]

  // Filter images based on selections
  const filteredImages = images.filter((image) => {
    const matchesChain = selectedChains.length === 0 || selectedChains.includes(image.chain)
    const matchesSupermarket = selectedSupermarkets.length === 0 || selectedSupermarkets.includes(image.supermarket)
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(image.brand)
    const matchesProduct = selectedProducts.length === 0 || selectedProducts.includes(image.product)

    return matchesChain && matchesSupermarket && matchesBrand && matchesProduct
  })

  const currentImage = filteredImages[currentIndex]

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)
  }

  if (filteredImages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Galería de Imágenes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">
              <Eye className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-slate-500 text-sm">No hay imágenes disponibles con los filtros aplicados</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Galería de Imágenes</CardTitle>
          <Badge variant="outline" className="text-xs">
            {currentIndex + 1} de {filteredImages.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Image Display */}
        <div className="relative">
          <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
            <img
              src={currentImage.url || "/placeholder.svg"}
              alt={currentImage.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Navigation Buttons */}
          {filteredImages.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/90 hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/90 hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Image Information */}
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-slate-900 mb-1">{currentImage.title}</h3>
            <p className="text-sm text-slate-600">{currentImage.notes}</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-500">Producto:</span>
              <div className="font-medium">{currentImage.product}</div>
            </div>
            <div>
              <span className="text-slate-500">Marca:</span>
              <div className="font-medium">{currentImage.brand}</div>
            </div>
            <div>
              <span className="text-slate-500">Cadena:</span>
              <div className="font-medium">{currentImage.chain}</div>
            </div>
            <div>
              <span className="text-slate-500">Supermercado:</span>
              <div className="font-medium">{currentImage.supermarket}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              <span>{currentImage.date}</span>
              <span>•</span>
              <span>{currentImage.visitor}</span>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                Ver
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Descargar
              </Button>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {filteredImages.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filteredImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-12 rounded border-2 overflow-hidden ${
                  index === currentIndex ? "border-primary" : "border-slate-200"
                }`}
              >
                <img src={image.url || "/placeholder.svg"} alt={image.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
