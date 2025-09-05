"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { Clock, MapPin, CheckSquare, AlertTriangle, User, Calendar as CalendarIcon, Filter, ChevronRight } from "lucide-react"
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

  // Week view
  if (viewMode === "week") {
    const weekStart = startOfWeek(currentDate, { locale: es })
    const weekEnd = endOfWeek(currentDate, { locale: es })
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Week Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="p-3 text-center border-r border-gray-100 last:border-r-0">
              <div className="text-sm font-medium text-gray-700">
                {format(day, "EEE", { locale: es })}
              </div>
              <div className={`text-lg font-semibold ${isToday(day) ? "text-blue-600" : "text-gray-900"}`}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDays.map((day) => {
            const dayVisits = getVisitsForDate(day)
            const dayTasks = getTasksForDate(day)
            const isDayToday = isToday(day)

            return (
              <div
                key={day.toISOString()}
                className={`border-r border-gray-100 last:border-r-0 p-2 ${
                  isDayToday ? "bg-blue-50/30" : ""
                }`}
              >
                <ScrollArea className="h-[380px]">
                  <div className="space-y-2">
                    {/* Tasks */}
                    {dayTasks.map((task) => (
                      <Card
                        key={`task-${task.id}`}
                        className={`cursor-pointer hover:shadow-sm transition-all border-l-4 ${
                          task.priority === 'urgent' ? 'border-l-red-500 bg-red-50' :
                          task.priority === 'high' ? 'border-l-orange-500 bg-orange-50' :
                          task.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                          'border-l-gray-500 bg-gray-50'
                        }`}
                        onClick={() => onTaskClick(task)}
                      >
                        <CardContent className="p-2">
                          <div className="space-y-1">
                            <div className="flex items-start gap-1">
                              <CheckSquare className="w-3 h-3 mt-0.5 text-green-600 flex-shrink-0" />
                              <span className="text-xs font-medium text-gray-900 line-clamp-2">
                                {task.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <User className="w-3 h-3" />
                              <span className="truncate">{task.assigned_to_name || `Usuario ${task.assigned_to}`}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge className={`text-xs ${getTaskPriorityColor(task.priority)}`}>
                                {task.priority === 'urgent' ? 'Urgente' :
                                 task.priority === 'high' ? 'Alta' :
                                 task.priority === 'medium' ? 'Media' : 'Baja'}
                              </Badge>
                              {task.priority === 'urgent' && (
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Visits */}
                    {dayVisits.map((visit) => (
                      <Card
                        key={`visit-${visit.id}`}
                        className="cursor-pointer hover:shadow-sm transition-all border-l-4 border-l-blue-500 bg-blue-50"
                        onClick={() => onVisitClick(visit)}
                      >
                        <CardContent className="p-2">
                          <div className="space-y-1">
                            <div className="flex items-start gap-1">
                              <MapPin className="w-3 h-3 mt-0.5 text-blue-600 flex-shrink-0" />
                              <span className="text-xs font-medium text-gray-900 line-clamp-2">
                                {visit.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>{visit.time}</span>
                            </div>
                            <Badge className={`text-xs ${getStatusColor(visit.status)}`}>
                              {visit.status === 'planned' ? 'Planificada' :
                               visit.status === 'in-progress' ? 'En Progreso' : 'Completada'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Agenda view - Enhanced for manager use
  if (viewMode === "agenda") {
    const allItems = [
      ...visits.map(visit => ({ type: 'visit' as const, data: visit, date: new Date(visit.date) })),
      ...tasks.map(task => ({ type: 'task' as const, data: task, date: new Date(task.due_date!) }))
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    // Group items by date
    const itemsByDate = allItems.reduce((acc, item) => {
      const dateKey = format(item.date, "yyyy-MM-dd")
      if (!acc[dateKey]) {
        acc[dateKey] = { date: item.date, items: [] }
      }
      acc[dateKey].items.push(item)
      return acc
    }, {} as Record<string, { date: Date, items: typeof allItems }>)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Vista de Agenda - Panel de Gestión
          </h2>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </div>
        
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {Object.keys(itemsByDate).length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay elementos programados</h3>
                  <p className="text-gray-600">Las tareas y visitas aparecerán aquí una vez que sean asignadas</p>
                </CardContent>
              </Card>
            ) : (
              Object.values(itemsByDate).map(({ date, items }) => (
                <Card key={format(date, "yyyy-MM-dd")} className="overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {format(date, "EEEE, d 'de' MMMM", { locale: es })}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {items.length} elemento{items.length !== 1 ? 's' : ''} programado{items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {items.map((item) => (
                        <div
                          key={`${item.type}-${item.data.id}`}
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            if (item.type === 'visit') {
                              onVisitClick(item.data as Visit);
                            } else {
                              onTaskClick(item.data as Task);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {item.type === 'visit' ? (
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckSquare className="w-4 h-4 text-green-600" />
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {item.type === 'visit' 
                                      ? (item.data as Visit).title 
                                      : (item.data as Task).title
                                    }
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {item.type === 'visit' ? 'Visita programada' : 'Tarea asignada'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="ml-11 space-y-2">
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  {item.type === 'visit' ? (
                                    <>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{(item.data as Visit).time}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>{(item.data as Visit).assignee}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{(item.data as Visit).address}</span>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>{(item.data as Task).assigned_to_name || `Usuario ${(item.data as Task).assigned_to}`}</span>
                                      </div>
                                      {(item.data as Task).description && (
                                        <div className="w-full text-gray-600 mt-1">
                                          {(item.data as Task).description}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2 ml-4">
                              {item.type === 'visit' ? (
                                <Badge className={`${getStatusColor((item.data as Visit).status)} text-xs`}>
                                  {(item.data as Visit).status === 'planned' ? 'Planificada' :
                                   (item.data as Visit).status === 'in-progress' ? 'En Progreso' : 'Completada'}
                                </Badge>
                              ) : (
                                <>
                                  <Badge className={`${getTaskPriorityColor((item.data as Task).priority)} text-xs`}>
                                    {(item.data as Task).priority === 'urgent' ? 'Urgente' :
                                     (item.data as Task).priority === 'high' ? 'Alta' :
                                     (item.data as Task).priority === 'medium' ? 'Media' : 'Baja'}
                                  </Badge>
                                  {(item.data as Task).priority === 'urgent' && (
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                  )}
                                </>
                              )}
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    )
  }

  // Month view - Enhanced design
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="p-3 text-center border-r border-gray-100 last:border-r-0">
            <span className="text-sm font-semibold text-gray-700">{day}</span>
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
          const totalItems = dayVisits.length + dayTasks.length

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[100px] md:min-h-[140px] border-r border-b border-gray-100 last:border-r-0 p-2 relative ${
                !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
              } ${isDayToday ? "bg-blue-50 ring-2 ring-blue-200 ring-inset" : ""}`}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-2">
                <div className={`text-sm font-semibold ${
                  isDayToday ? "text-blue-600 bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center" : 
                  isCurrentMonth ? "text-gray-900" : "text-gray-400"
                }`}>
                  {format(day, "d")}
                </div>
                {totalItems > 0 && (
                  <div className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
                    {totalItems}
                  </div>
                )}
              </div>

              <ScrollArea className="h-[70px] md:h-[110px]">
                <div className="space-y-1">
                  {/* Urgent tasks first */}
                  {dayTasks
                    .filter(task => task.priority === 'urgent')
                    .slice(0, 1)
                    .map((task) => (
                    <div
                      key={`urgent-task-${task.id}`}
                      className="text-xs p-1.5 rounded cursor-pointer hover:shadow-sm transition-all bg-red-100 border-l-2 border-red-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        onTaskClick(task)
                      }}
                    >
                      <div className="font-medium truncate flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0" />
                        <span className="text-red-900">{task.title}</span>
                      </div>
                      <div className="truncate text-red-700 mt-0.5">
                        {task.assigned_to_name || `Usuario ${task.assigned_to}`}
                      </div>
                    </div>
                  ))}

                  {/* Other tasks */}
                  {dayTasks
                    .filter(task => task.priority !== 'urgent')
                    .slice(0, 2)
                    .map((task) => (
                    <div
                      key={`task-${task.id}`}
                      className={`text-xs p-1.5 rounded cursor-pointer hover:shadow-sm transition-all border-l-2 ${
                        task.priority === 'high' ? 'bg-orange-50 border-orange-400' :
                        task.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                        'bg-gray-50 border-gray-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onTaskClick(task)
                      }}
                    >
                      <div className="font-medium truncate flex items-center gap-1">
                        <CheckSquare className="w-3 h-3 text-green-600 flex-shrink-0" />
                        <span className="text-gray-900">{task.title}</span>
                      </div>
                      <div className="truncate text-gray-600 mt-0.5">
                        {task.assigned_to_name || `Usuario ${task.assigned_to}`}
                      </div>
                    </div>
                  ))}

                  {/* Visits */}
                  {dayVisits.slice(0, 2).map((visit) => (
                    <div
                      key={`visit-${visit.id}`}
                      className="text-xs p-1.5 rounded cursor-pointer hover:shadow-sm transition-all bg-blue-50 border-l-2 border-blue-400"
                      onClick={(e) => {
                        e.stopPropagation()
                        onVisitClick(visit)
                      }}
                    >
                      <div className="font-medium truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-600 flex-shrink-0" />
                        <span className="text-blue-900">{visit.title}</span>
                      </div>
                      <div className="truncate text-blue-700 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {visit.time}
                      </div>
                    </div>
                  ))}

                  {/* Show more indicator */}
                  {totalItems > 3 && (
                    <div className="text-xs text-gray-500 font-medium text-center py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors">
                      +{totalItems - 3} más
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )
        })}
      </div>
    </div>
  )
}
