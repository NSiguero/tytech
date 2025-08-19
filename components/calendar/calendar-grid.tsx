"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns"
import { Clock, MapPin } from "lucide-react"
import type { Visit } from "@/lib/visits-data"

interface CalendarGridProps {
  currentDate: Date
  viewMode: "month" | "week" | "day" | "agenda"
  visits: Visit[]
  onDateClick: (date: Date) => void
  onVisitClick: (visit: Visit) => void
}

export function CalendarGrid({ currentDate, viewMode, visits, onDateClick, onVisitClick }: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getVisitsForDate = (date: Date) => {
    return visits.filter((visit) => isSameDay(new Date(visit.date), date))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "in-progress":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  if (viewMode === "agenda") {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Vista de Agenda</h2>
        <div className="space-y-3">
          {visits.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No hay visitas programadas</p>
              </CardContent>
            </Card>
          ) : (
            visits
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((visit) => (
                <Card key={visit.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{visit.title}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {format(new Date(visit.date), "MMM dd, yyyy")} at {visit.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{visit.address}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(visit.status)}>{visit.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 md:p-4 text-center">
            <span className="text-sm font-medium text-gray-700">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayVisits = getVisitsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isDayToday = isToday(day)

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[80px] md:min-h-[120px] border-r border-b border-gray-100 p-1 md:p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
              } ${isDayToday ? "bg-blue-50" : ""}`}
              onClick={() => onDateClick(day)}
            >
              <div className={`text-sm font-medium mb-1 ${isDayToday ? "text-blue-600" : "text-gray-900"}`}>
                {format(day, "d")}
              </div>

              <div className="space-y-1">
                {dayVisits.slice(0, 3).map((visit) => (
                  <div
                    key={visit.id}
                    className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(visit.status)}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onVisitClick(visit)
                    }}
                  >
                    <div className="font-medium truncate">{visit.title}</div>
                    <div className="truncate">{visit.time}</div>
                  </div>
                ))}

                {dayVisits.length > 3 && (
                  <div className="text-xs text-gray-600 font-medium">+{dayVisits.length - 3} más</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
