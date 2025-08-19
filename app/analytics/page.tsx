"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { KPIOverview } from "@/components/kpi-overview"
import { SupermarketExplorer } from "@/components/supermarket-explorer"
import { BrandProductTable } from "@/components/brand-product-table"
import { ImageCarousel } from "@/components/image-carousel"
import { SmartInsights } from "@/components/smart-insights"
import { AnalyticsCalendarCompact } from "@/components/analytics-calendar-compact"
import { AIAssistant } from "@/components/ai-assistant"
import { ThemeProvider } from "@/components/theme-provider"

export default function AnalyticsPage() {
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [selectedSupermarkets, setSelectedSupermarkets] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [dateRange, setDateRange] = useState("30d")
  const [dataMode, setDataMode] = useState("global")
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [dateFrom, setDateFrom] = useState<Date | undefined>()
  const [dateTo, setDateTo] = useState<Date | undefined>()

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
          <Header
            selectedChains={selectedChains}
            setSelectedChains={setSelectedChains}
            selectedSupermarkets={selectedSupermarkets}
            setSelectedSupermarkets={setSelectedSupermarkets}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            dateRange={dateRange}
            setDateRange={setDateRange}
            dataMode={dataMode}
            setDataMode={setDataMode}
            aiPanelOpen={aiPanelOpen}
            setAiPanelOpen={setAiPanelOpen}
            onDateRangeChange={handleDateRangeChange}
          />

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
