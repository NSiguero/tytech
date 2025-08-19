"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, MapPin, AlertTriangle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalyticsEvent {
  id: string
  type: "visit" | "promotion" | "stock" | "alert"
  title: string
  description: string
  time?: string
  location?: string
}

interface AnalyticsCalendarProps {
  selectedChains: string[]
  selectedSupermarkets: string[]
  selectedBrands: string[]
  selectedProducts: string[]
  dateFrom?: Date
  dateTo?: Date
  onDateRangeChange: (from: Date | undefined, to: Date | undefined) => void
}

// Safe date formatting functions
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

// Mock events data
const generateMockEvents = (): Record<string, AnalyticsEvent[]> => {
  const events: Record<string, AnalyticsEvent[]> = {}
  const today = new Date()

  // Generate events for the current month
  for (let i = 1; i <= 31; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i)
    if (date.getMonth() === today.getMonth()) {
      const dateKey = date.toISOString().split("T")[0]
      events[dateKey] = []

      // Add random events
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

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case "visit":
      return <MapPin className="h-4 w-4" />
    case "promotion":
      return <TrendingUp className="h-4 w-4" />
    case "stock":
      return <Clock className="h-4 w-4" />
    case "alert":
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <CalendarIcon className="h-4 w-4" />
  }
}

export function AnalyticsCalendar({
  selectedChains,
  selectedSupermarkets,
  selectedBrands,
  selectedProducts,
  dateFrom,
  dateTo,
  onDateRangeChange,
}: AnalyticsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isRangeMode, setIsRangeMode] = useState(false)

  const events = generateMockEvents()

  // Calendar navigation
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

  // Get calendar days with proper alignment
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay()

    // Calculate the start date (may be from previous month)
    const startDate = new Date(firstDay)
    startDate.setDate(firstDay.getDate() - firstDayOfWeek)

    const days = []
    const currentDay = new Date(startDate)

    // Generate 42 days (6 weeks × 7 days) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }

    return days
  }

  const calendarDays = getCalendarDays()
  const selectedDateEvents = selectedDate ? events[selectedDate.toISOString().split("T")[0]] || [] : []

  const handleDateClick = (date: Date) => {
    if (isRangeMode) {
      if (!dateFrom || (dateFrom && dateTo)) {
        // Start new range
        onDateRangeChange(date, undefined)
      } else if (dateFrom && !dateTo) {
        // Complete range
        if (date >= dateFrom) {
          onDateRangeChange(dateFrom, date)
        } else {
          onDateRangeChange(date, dateFrom)
        }
      }
    } else {
      setSelectedDate(date)
    }
  }

  const isInRange = (date: Date) => {
    if (!dateFrom || !dateTo) return false
    return date >= dateFrom && date <= dateTo
  }

  const isRangeStart = (date: Date) => {
    return dateFrom && isSameDay(date, dateFrom)
  }

  const isRangeEnd = (date: Date) => {
    return dateTo && isSameDay(date, dateTo)
  }

  const quickRangeSelect = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days + 1)
    onDateRangeChange(start, end)
    setIsRangeMode(true)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Calendario de Analytics</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isRangeMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsRangeMode(!isRangeMode)}
                >
                  {isRangeMode ? "Modo Rango" : "Modo Simple"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
            {isRangeMode && (
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onDateRangeChange(undefined, undefined)
                    setIsRangeMode(false)
                  }}
                >
                  Limpiar
                </Button>
              </div>
            )}

            {/* Range Display */}
            {isRangeMode && (dateFrom || dateTo) && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Rango seleccionado:</span>
                  <span>
                    {dateFrom ? formatDate(dateFrom) : "Inicio"} - {dateTo ? formatDate(dateTo) : "Fin"}
                  </span>
                </div>
              </div>
            )}

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50 rounded-md">
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
                const inRange = isInRange(date)
                const rangeStart = isRangeStart(date)
                const rangeEnd = isRangeEnd(date)
                const todayDate = isToday(date)

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    className={cn(
                      "relative p-3 text-sm border rounded-lg transition-all duration-200",
                      "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                      "min-h-[3rem] flex flex-col items-center justify-start",
                      {
                        "text-gray-400 bg-gray-50/50": !isCurrentMonth,
                        "bg-blue-100 border-blue-300 text-blue-900": isSelected && !rangeStart && !rangeEnd,
                        "bg-blue-50 border-blue-200": inRange && !rangeStart && !rangeEnd,
                        "bg-blue-500 text-white border-blue-500": rangeStart || rangeEnd,
                        "font-bold ring-2 ring-orange-400 bg-orange-50 border-orange-300":
                          todayDate && !isSelected && !rangeStart && !rangeEnd,
                        "hover:bg-blue-600": rangeStart || rangeEnd,
                        "cursor-pointer": isCurrentMonth,
                        "cursor-default": !isCurrentMonth,
                      },
                    )}
                    disabled={!isCurrentMonth}
                  >
                    <span
                      className={cn("mb-1", {
                        "text-orange-600 font-bold": todayDate && !isSelected && !rangeStart && !rangeEnd,
                      })}
                    >
                      {date.getDate()}
                    </span>

                    {/* Event indicators */}
                    {dayEvents.length > 0 && isCurrentMonth && (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {dayEvents.slice(0, 4).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className={cn("w-1.5 h-1.5 rounded-full", getEventTypeColor(event.type), {
                              "bg-white": rangeStart || rangeEnd,
                            })}
                          />
                        ))}
                        {dayEvents.length > 4 && (
                          <div
                            className={cn("w-1.5 h-1.5 rounded-full bg-gray-400", {
                              "bg-white": rangeStart || rangeEnd,
                            })}
                          />
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Calendar Footer Info */}
            <div className="mt-4 text-xs text-gray-500 text-center">
              Haz clic en una fecha para ver detalles • {isRangeMode ? "Modo rango activo" : "Modo simple activo"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Details Panel */}
      <div className="lg:col-span-1">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? formatDate(selectedDate) : "Selecciona una fecha"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="space-y-4">
                {selectedDateEvents.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {selectedDateEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={cn("p-2 rounded-full text-white flex-shrink-0", getEventTypeColor(event.type))}
                            >
                              {getEventTypeIcon(event.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-gray-900">{event.title}</h4>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                              <div className="flex flex-col gap-1 mt-2">
                                {event.time && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {event.time}
                                  </div>
                                )}
                                {event.location && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {event.location}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <CalendarIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No hay eventos para esta fecha</p>
                  </div>
                )}

                <Separator />

                {/* Event Legend */}
                <div>
                  <h4 className="font-medium text-sm mb-3">Leyenda de eventos</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
                      <span>Visitas programadas</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                      <span>Promociones activas</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0" />
                      <span>Alertas de stock</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                      <span>Alertas críticas</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm mb-2">Haz clic en una fecha para ver los eventos</p>
                <p className="text-gray-400 text-xs">Los puntos de colores indican eventos programados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
