"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns"
import { Clock, MapPin, CheckSquare, AlertTriangle } from "lucide-react"
import type { Visit } from "@/lib/visits-data"
import type { Task } from "@/lib/tasks"

interface CalendarGridProps {
  currentDate: Date
  viewMode: "month" | "week" | "day" | "agenda"
  visits: Visit[]
  tasks: Task[]
  onVisitClick: (visit: Visit) => void
  onTaskClick: (task: Task) => void
}

export function CalendarGrid({ 
  currentDate, 
  viewMode, 
  visits, 
  tasks, 
  onVisitClick, 
  onTaskClick 
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getVisitsForDate = (date: Date) => {
    return visits.filter((visit) => isSameDay(new Date(visit.date), date))
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => task.due_date && isSameDay(new Date(task.due_date), date))
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

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "urgent":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  if (viewMode === "agenda") {
    const allItems = [
      ...visits.map(visit => ({ type: 'visit', data: visit, date: new Date(visit.date) })),
      ...tasks.map(task => ({ type: 'task', data: task, date: new Date(task.due_date!) }))
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Vista de Agenda</h2>
        <div className="space-y-3">
          {allItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No hay visitas o tareas programadas</p>
              </CardContent>
            </Card>
          ) : (
            allItems.map((item) => (
              <Card 
                key={`${item.type}-${item.data.id}`} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  if (item.type === 'visit') {
                    onVisitClick(item.data as Visit);
                  } else {
                    onTaskClick(item.data as Task);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.type === 'visit' ? (
                          <MapPin className="w-4 h-4 text-blue-600" />
                        ) : (
                          <CheckSquare className="w-4 h-4 text-green-600" />
                        )}
                        <h3 className="font-medium text-gray-900">
                          {item.type === 'visit' 
                            ? (item.data as Visit).title 
                            : (item.data as Task).title
                          }
                        </h3>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(item.date, "MMM dd, yyyy")}
                            {item.type === 'visit' && ` at ${(item.data as Visit).time}`}
                          </span>
                        </div>
                        {item.type === 'visit' && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{(item.data as Visit).address}</span>
                          </div>
                        )}
                        {item.type === 'task' && (item.data as Task).description && (
                          <div className="text-gray-600">
                            {(item.data as Task).description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {item.type === 'visit' ? (
                        <Badge className={getStatusColor((item.data as Visit).status)}>
                          {(item.data as Visit).status}
                        </Badge>
                      ) : (
                        <Badge className={getTaskPriorityColor((item.data as Task).priority)}>
                          {(item.data as Task).priority}
                        </Badge>
                      )}
                    </div>
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
          const dayTasks = getTasksForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isDayToday = isToday(day)

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[80px] md:min-h-[120px] border-r border-b border-gray-100 p-1 md:p-2 ${
                !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
              } ${isDayToday ? "bg-blue-50" : ""}`}
            >
              <div className={`text-sm font-medium mb-1 ${isDayToday ? "text-blue-600" : "text-gray-900"}`}>
                {format(day, "d")}
              </div>

              <div className="space-y-1">
                {/* Visits */}
                {dayVisits.slice(0, 2).map((visit) => (
                  <div
                    key={`visit-${visit.id}`}
                    className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(visit.status)}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onVisitClick(visit)
                    }}
                  >
                    <div className="font-medium truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {visit.title}
                    </div>
                    <div className="truncate">{visit.time}</div>
                  </div>
                ))}

                {/* Tasks */}
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={`task-${task.id}`}
                    className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getTaskPriorityColor(task.priority)}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onTaskClick(task)
                    }}
                  >
                    <div className="font-medium truncate flex items-center gap-1">
                      <CheckSquare className="w-3 h-3" />
                      {task.title}
                    </div>
                    <div className="truncate text-xs">
                      {task.priority === 'urgent' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                      {task.priority}
                    </div>
                  </div>
                ))}

                {/* Show total count if there are more items */}
                {(dayVisits.length + dayTasks.length) > 4 && (
                  <div className="text-xs text-gray-600 font-medium">
                    +{(dayVisits.length + dayTasks.length) - 4} más
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
