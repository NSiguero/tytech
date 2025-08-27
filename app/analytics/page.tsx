"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { KPIOverview } from "@/components/kpi-overview"
import { SupermarketExplorer } from "@/components/supermarket-explorer"
import { BrandProductTable } from "@/components/brand-product-table"
import { ImageCarousel } from "@/components/image-carousel"
import { SmartInsights } from "@/components/smart-insights"
import { AnalyticsCalendarCompact } from "@/components/analytics-calendar-compact"
import { AIAssistant } from "@/components/ai-assistant"
import { ThemeProvider } from "@/components/theme-provider"
import { LogOut } from "lucide-react"

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [selectedSupermarkets, setSelectedSupermarkets] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [dateRange, setDateRange] = useState("30d")
  const [dataMode, setDataMode] = useState("global")
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [dateFrom, setDateFrom] = useState<Date | undefined>()
  const [dateTo, setDateTo] = useState<Date | undefined>()

  // Get user from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    
    if (!token || !storedUser) {
      window.location.href = "/login"
      return
    }
    
    try {
      setUser(JSON.parse(storedUser))
    } catch (error) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
  }, [])

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleDateRangeChange = (from: Date | undefined, to: Date | undefined) => {
    setDateFrom(from)
    setDateTo(to)

  }

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar - Always visible */}
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Buenas Tardes, {user?.first_name || "Usuario"}
                  </h1>
                  <p className="text-gray-600">Aquí está tu análisis de retail y métricas de rendimiento.</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
              {/* Compact Analytics Calendar */}
              <div className="mb-8">
                <AnalyticsCalendarCompact
                  selectedChains={selectedChains}
                  selectedSupermarkets={selectedSupermarkets}
                  selectedBrands={selectedBrands}
                  selectedProducts={selectedProducts}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  onDateRangeChange={handleDateRangeChange}
                />
              </div>

              {/* Supermarket Explorer */}
              <div className="mb-8">
                <SupermarketExplorer
                  selectedChains={selectedChains}
                  selectedSupermarkets={selectedSupermarkets}
                  selectedBrands={selectedBrands}
                  selectedProducts={selectedProducts}
                  onChainSelect={(chain) => {
                    if (!selectedChains.includes(chain)) {
                      setSelectedChains([...selectedChains, chain])
                    }
                  }}
                  onSupermarketSelect={(supermarket) => {
                    if (!selectedSupermarkets.includes(supermarket)) {
                      setSelectedSupermarkets([...selectedSupermarkets, supermarket])
                    }
                  }}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                />
              </div>

              {/* Brand & Product Performance */}
              <div className="mb-8">
                <BrandProductTable
                  selectedChains={selectedChains}
                  selectedSupermarkets={selectedSupermarkets}
                  selectedBrands={selectedBrands}
                  selectedProducts={selectedProducts}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                />
              </div>

              {/* KPI Overview - Moved down */}
              <div className="mb-8">
                <KPIOverview
                  selectedChains={selectedChains}
                  selectedSupermarkets={selectedSupermarkets}
                  selectedBrands={selectedBrands}
                  selectedProducts={selectedProducts}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                />
              </div>

              {/* Bottom Section - Images and Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ImageCarousel
                  selectedChains={selectedChains}
                  selectedSupermarkets={selectedSupermarkets}
                  selectedBrands={selectedBrands}
                  selectedProducts={selectedProducts}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                />
                <SmartInsights
                  selectedChains={selectedChains}
                  selectedSupermarkets={selectedSupermarkets}
                  selectedBrands={selectedBrands}
                  selectedProducts={selectedProducts}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Side Panel */}
        <AIAssistant isOpen={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />
      </div>
    </ThemeProvider>
  )
}
