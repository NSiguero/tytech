"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, MapPin, User, Plus, Eye, CheckSquare, X, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Visit } from "@/lib/visits-data"

interface Task {
  id: string
  title: string
  description?: string
  dueDate: Date
  assignee: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-progress" | "completed"
  estimatedHours?: number
}

interface AssignedVisitsProps {
  visits: Visit[]
  tasks: Task[]
  onAssignVisit?: () => void
  onViewVisit?: (visit: Visit) => void
  onCreateTask?: () => void
  onViewTask?: (task: Task) => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function AssignedVisits({
  visits,
  tasks,
  onAssignVisit,
  onViewVisit,
  onCreateTask,
  onViewTask,
  isMobileOpen,
  onMobileClose,
}: AssignedVisitsProps) {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "high":
        return "bg-orange-100 text-orange-700"
      case "urgent":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-200"
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const todayVisits = visits.filter((visit) => {
    const today = new Date()
    const visitDate = new Date(visit.date)
    return visitDate.toDateString() === today.toDateString()
  })

  const upcomingVisits = visits.filter((visit) => {
    const today = new Date()
    const visitDate = new Date(visit.date)
    return visitDate > today
  })

  const todayTasks = tasks.filter((task) => {
    const today = new Date()
    const taskDate = new Date(task.dueDate)
    return taskDate.toDateString() === today.toDateString()
  })

  const upcomingTasks = tasks.filter((task) => {
    const today = new Date()
    const taskDate = new Date(task.dueDate)
    return taskDate > today
  })

  const overdueTasks = tasks.filter((task) => {
    const today = new Date()
    const taskDate = new Date(task.dueDate)
    return taskDate < today && task.status !== "completed"
  })

  return (
    <div className="h-full bg-white">
      {/* Mobile Header */}
      {isMobileOpen && onMobileClose && (
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Gestión del Calendario</h2>
          <Button variant="ghost" size="sm" onClick={onMobileClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={onAssignVisit} className="w-full justify-start bg-blue-600 hover:bg-blue-700" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Asignar Nueva Visita
              </Button>
              <Button onClick={onCreateTask} variant="outline" className="w-full justify-start bg-transparent" size="sm">
                <CheckSquare className="w-4 h-4 mr-2" />
                Crear Tarea
              </Button>
            </CardContent>
          </Card>

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-red-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Tareas Vencidas ({overdueTasks.length})
              </h3>
              <div className="space-y-3">
                {overdueTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-sm transition-shadow border-red-200">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{task.title}</h4>
                          <Badge className={`${getTaskStatusColor(task.status)} text-xs`}>
                            {task.status === "pending" && "Pendiente"}
                            {task.status === "in-progress" && "En Progreso"}
                            {task.status === "completed" && "Completada"}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <Calendar className="w-3 h-3" />
                            <span>Vencida el {format(new Date(task.dueDate), "dd/MM", { locale: es })}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{task.assignee}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                            {task.priority === "low" && "Baja"}
                            {task.priority === "medium" && "Media"}
                            {task.priority === "high" && "Alta"}
                            {task.priority === "urgent" && "Urgente"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewTask?.(task)}
                            className="h-6 px-2 text-xs"
                          >
                            Ver
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Today's Tasks */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tareas de Hoy ({todayTasks.length})</h3>
            <div className="space-y-3">
              {todayTasks.length === 0 ? (
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No hay tareas para hoy</p>
                  </CardContent>
                </Card>
              ) : (
                todayTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-sm transition-shadow">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{task.title}</h4>
                          <Badge className={`${getTaskStatusColor(task.status)} text-xs`}>
                            {task.status === "pending" && "Pendiente"}
                            {task.status === "in-progress" && "En Progreso"}
                            {task.status === "completed" && "Completada"}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span>Vence hoy</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{task.assignee}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                            {task.priority === "low" && "Baja"}
                            {task.priority === "medium" && "Media"}
                            {task.priority === "high" && "Alta"}
                            {task.priority === "urgent" && "Urgente"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewTask?.(task)}
                            className="h-6 px-2 text-xs"
                          >
                            Ver
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Today's Visits */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Visitas de Hoy ({todayVisits.length})</h3>
            <div className="space-y-3">
              {todayVisits.length === 0 ? (
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No hay visitas programadas para hoy</p>
                  </CardContent>
                </Card>
              ) : (
                todayVisits.map((visit) => (
                  <Card key={visit.id} className="cursor-pointer hover:shadow-sm transition-shadow">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{visit.title}</h4>
                          <Badge className={`${getStatusColor(visit.status)} text-xs`}>
                            {visit.status === "planned" && "Programada"}
                            {visit.status === "in-progress" && "En Progreso"}
                            {visit.status === "completed" && "Completada"}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span className="line-clamp-1">{visit.address}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span>{visit.time}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{visit.assignee}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge className={`${getPriorityColor(visit.priority)} text-xs`}>
                            {visit.priority === "low" && "Baja"}
                            {visit.priority === "medium" && "Media"}
                            {visit.priority === "high" && "Alta"}
                            {visit.priority === "urgent" && "Urgente"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewVisit?.(visit)}
                            className="h-6 px-2 text-xs"
                          >
                            Ver
                          </Button>
                        </div>

                        {visit.progress > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                style={{ width: `${visit.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-900">{visit.progress}%</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Items */}
          {(upcomingVisits.length > 0 || upcomingTasks.length > 0) && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Próximos ({upcomingVisits.length + upcomingTasks.length})</h3>
                <div className="space-y-3">
                  {/* Upcoming Tasks */}
                  {upcomingTasks.slice(0, 3).map((task) => (
                    <Card key={`task-${task.id}`} className="cursor-pointer hover:shadow-sm transition-shadow border-l-4 border-l-green-400">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1 flex items-center gap-2">
                              <CheckSquare className="w-3 h-3 text-green-600" />
                              {task.title}
                            </h4>
                            <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                              {task.priority === "low" && "Baja"}
                              {task.priority === "medium" && "Media"}
                              {task.priority === "high" && "Alta"}
                              {task.priority === "urgent" && "Urgente"}
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span>Vence el {format(new Date(task.dueDate), "dd/MM", { locale: es })}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <User className="w-3 h-3" />
                              <span>{task.assignee}</span>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewTask?.(task)}
                            className="w-full h-6 text-xs"
                          >
                            Ver Detalles
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Upcoming Visits */}
                  {upcomingVisits.slice(0, 3).map((visit) => (
                    <Card key={`visit-${visit.id}`} className="cursor-pointer hover:shadow-sm transition-shadow border-l-4 border-l-blue-400">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1 flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-blue-600" />
                              {visit.title}
                            </h4>
                            <Badge className={`${getPriorityColor(visit.priority)} text-xs`}>
                              {visit.priority === "low" && "Baja"}
                              {visit.priority === "medium" && "Media"}
                              {visit.priority === "high" && "Alta"}
                              {visit.priority === "urgent" && "Urgente"}
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span>{format(new Date(visit.date), "dd/MM", { locale: es })}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>{visit.time}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <User className="w-3 h-3" />
                              <span>{visit.assignee}</span>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewVisit?.(visit)}
                            className="w-full h-6 text-xs"
                          >
                            Ver Detalles
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
