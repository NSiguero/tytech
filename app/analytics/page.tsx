"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { AnalyticsKPIs } from "@/components/analytics-kpis"
import { AnalyticsSupermercados } from "@/components/analytics-supermercados"
import { AnalyticsProductos } from "@/components/analytics-productos"
import { ImageCarousel } from "@/components/image-carousel"
import { AIAssistant } from "@/components/ai-assistant"
import { ThemeProvider } from "@/components/theme-provider"
import { LogOut, BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [aiPanelOpen, setAiPanelOpen] = useState(false)

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
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Analytics Dashboard
                    </h1>
                    <p className="text-gray-600">Análisis completo de retail y métricas de rendimiento</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Hola, {user?.first_name || "Usuario"}
                </span>
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
              
              {/* Product Analytics Section - Main Focus */}
              <div className="mb-8">
                <AnalyticsProductos />
              </div>

              {/* KPI Overview Section */}
              <div className="mb-8">
                <AnalyticsKPIs />
              </div>

              {/* Supermarket Analytics Section */}
              <div className="mb-8">
                <AnalyticsSupermercados />
              </div>

              {/* Image Gallery Section */}
              <div className="mb-8">
                <ImageCarousel
                  selectedChains={[]}
                  selectedSupermarkets={[]}
                  selectedBrands={[]}
                  selectedProducts={[]}
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
