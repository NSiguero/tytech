"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronLeft, ChevronRight, CalendarIcon, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalyticsEvent {
  id: string
  type: "visit" | "promotion" | "stock" | "alert"
  title: string
  description: string
  time?: string
  location?: string
}

interface AnalyticsCalendarCompactProps {
  selectedChains: string[]
  selectedSupermarkets: string[]
  selectedBrands: string[]
  selectedProducts: string[]
  dateFrom?: Date
  dateTo?: Date
  onDateRangeChange: (from: Date | undefined, to: Date | undefined) => void
}

const formatDate = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return ""
  }
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

const formatMonthYear = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return ""
  }
  return new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(date)
}

const isSameDay = (date1: Date | undefined, date2: Date | undefined): boolean => {
  if (!date1 || !date2 || !(date1 instanceof Date) || !(date2 instanceof Date)) {
    return false
  }
  if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
    return false
  }
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isToday = (date: Date): boolean => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false
  }
  return isSameDay(date, new Date())
}

const generateMockEvents = (): Record<string, AnalyticsEvent[]> => {
  const events: Record<string, AnalyticsEvent[]> = {}
  const today = new Date()

  for (let i = 1; i <= 31; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i)
    if (date.getMonth() === today.getMonth()) {
      const dateKey = date.toISOString().split("T")[0]
      events[dateKey] = []

      if (Math.random() > 0.7) {
        events[dateKey].push({
          id: `visit-${i}`,
          type: "visit",
          title: "Visita programada",
          description: "Visita de auditoría a Mercadona Centro",
          time: "10:00",
          location: "Madrid Centro",
        })
      }

      if (Math.random() > 0.8) {
        events[dateKey].push({
          id: `promo-${i}`,
          type: "promotion",
          title: "Promoción activa",
          description: "Descuento 20% en Coca-Cola",
          time: "Todo el día",
        })
      }

      if (Math.random() > 0.85) {
        events[dateKey].push({
          id: `stock-${i}`,
          type: "stock",
          title: "Alerta de stock",
          description: "Stock bajo en Nestlé Agua",
          time: "14:30",
        })
      }

      if (Math.random() > 0.9) {
        events[dateKey].push({
          id: `alert-${i}`,
          type: "alert",
          title: "Alerta crítica",
          description: "Precio fuera de rango",
          time: "16:45",
        })
      }
    }
  }

  return events
}

const getEventTypeColor = (type: string) => {
  switch (type) {
    case "visit":
      return "bg-blue-500"
    case "promotion":
      return "bg-green-500"
    case "stock":
      return "bg-yellow-500"
    case "alert":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export function AnalyticsCalendarCompact({
  selectedChains,
  selectedSupermarkets,
  selectedBrands,
  selectedProducts,
  dateFrom,
  dateTo,
  onDateRangeChange,
}: AnalyticsCalendarCompactProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const events = generateMockEvents()

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const firstDayOfWeek = firstDay.getDay()
    const startDate = new Date(firstDay)
    startDate.setDate(firstDay.getDate() - firstDayOfWeek)

    const days = []
    const currentDay = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }

    return days
  }

  const calendarDays = getCalendarDays()
  const selectedDateEvents = selectedDate ? events[selectedDate.toISOString().split("T")[0]] || [] : []

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const quickRangeSelect = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days + 1)
    onDateRangeChange(start, end)
  }

  return (
    <Card className="w-full">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Calendario de Analytics</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {Object.values(events).flat().length} eventos
                </Badge>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-2">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="text-lg font-semibold capitalize">{formatMonthYear(currentDate)}</h3>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Range Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={() => quickRangeSelect(7)}>
                    7 días
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => quickRangeSelect(30)}>
                    30 días
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => quickRangeSelect(90)}>
                    90 días
                  </Button>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-xs font-semibold text-gray-700 bg-gray-50 rounded-md"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => {
                    const dateKey = date.toISOString().split("T")[0]
                    const dayEvents = events[dateKey] || []
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth()
                    const isSelected = selectedDate && isSameDay(date, selectedDate)
                    const todayDate = isToday(date)

                    return (
                      <button
                        key={index}
                        onClick={() => handleDateClick(date)}
                        className={cn(
                          "relative p-2 text-xs border rounded-md transition-all duration-200",
                          "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                          "min-h-[2.5rem] flex flex-col items-center justify-start",
                          {
                            "text-gray-400 bg-gray-50/50": !isCurrentMonth,
                            "bg-blue-100 border-blue-300 text-blue-900": isSelected,
                            "font-bold ring-2 ring-orange-400 bg-orange-50 border-orange-300": todayDate && !isSelected,
                            "cursor-pointer": isCurrentMonth,
                            "cursor-default": !isCurrentMonth,
                          },
                        )}
                        disabled={!isCurrentMonth}
                      >
                        <span
                          className={cn("mb-1", {
                            "text-orange-600 font-bold": todayDate && !isSelected,
                          })}
                        >
                          {date.getDate()}
                        </span>

                        {/* Event indicators */}
                        {dayEvents.length > 0 && isCurrentMonth && (
                          <div className="flex flex-wrap gap-0.5 justify-center">
                            {dayEvents.slice(0, 3).map((event, eventIndex) => (
                              <div
                                key={eventIndex}
                                className={cn("w-1 h-1 rounded-full", getEventTypeColor(event.type))}
                              />
                            ))}
                            {dayEvents.length > 3 && <div className="w-1 h-1 rounded-full bg-gray-400" />}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Event Details Panel */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-3">
                    {selectedDate ? formatDate(selectedDate) : "Selecciona una fecha"}
                  </h4>

                  {selectedDate ? (
                    <div className="space-y-3">
                      {selectedDateEvents.length > 0 ? (
                        selectedDateEvents.map((event) => (
                          <div key={event.id} className="p-2 border rounded-md bg-white text-xs">
                            <div className="flex items-start space-x-2">
                              <div className={cn("w-2 h-2 rounded-full mt-1", getEventTypeColor(event.type))} />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-gray-900">{event.title}</h5>
                                <p className="text-gray-600 mt-1">{event.description}</p>
                                {event.time && <p className="text-gray-500 mt-1">⏰ {event.time}</p>}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-xs">No hay eventos para esta fecha</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <CalendarIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-xs">Haz clic en una fecha para ver los eventos</p>
                    </div>
                  )}

                  {/* Event Legend */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h5 className="font-medium text-xs mb-2">Leyenda</h5>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>Visitas</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Promociones</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span>Stock</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span>Alertas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
