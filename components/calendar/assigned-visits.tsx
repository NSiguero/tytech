"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, User, Eye, CheckSquare, X, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Visit } from "@/lib/visits-data"
import type { Task } from "@/lib/tasks"

interface AssignedVisitsProps {
  visits: Visit[]
  tasks: Task[]
  onViewVisit?: (visit: Visit) => void
  onViewTask?: (task: Task) => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function AssignedVisits({
  visits,
  tasks,
  onViewVisit,
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
      case "in_progress":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200"
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
    if (!task.due_date) return false
    const today = new Date()
    const taskDate = new Date(task.due_date)
    return taskDate.toDateString() === today.toDateString()
  })

  const upcomingTasks = tasks.filter((task) => {
    if (!task.due_date) return false
    const today = new Date()
    const taskDate = new Date(task.due_date)
    return taskDate > today
  })

  const overdueTasks = tasks.filter((task) => {
    if (!task.due_date) return false
    const today = new Date()
    const taskDate = new Date(task.due_date)
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
                            {task.status === "in_progress" && "En Progreso"}
                            {task.status === "completed" && "Completada"}
                            {task.status === "cancelled" && "Cancelada"}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <Calendar className="w-3 h-3" />
                            <span>Vencida el {format(new Date(task.due_date), "dd/MM", { locale: es })}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{task.assigned_to_name || "No especificado"}</span>
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
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Tareas de Hoy ({todayTasks.length})
            </h3>
            {todayTasks.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">No hay tareas para hoy</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-sm transition-shadow">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{task.title}</h4>
                          <Badge className={`${getTaskStatusColor(task.status)} text-xs`}>
                            {task.status === "pending" && "Pendiente"}
                            {task.status === "in_progress" && "En Progreso"}
                            {task.status === "completed" && "Completada"}
                            {task.status === "cancelled" && "Cancelada"}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{task.assigned_to_name || "No especificado"}</span>
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
            )}
          </div>

          <Separator />

          {/* Today's Visits */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Visitas de Hoy ({todayVisits.length})
            </h3>
            {todayVisits.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">No hay visitas programadas para hoy</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {todayVisits.map((visit) => (
                  <Card key={visit.id} className="cursor-pointer hover:shadow-sm transition-shadow">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{visit.title}</h4>
                          <Badge className={`${getStatusColor(visit.status)} text-xs`}>
                            {visit.status === "planned" && "Planificada"}
                            {visit.status === "in-progress" && "En Progreso"}
                            {visit.status === "completed" && "Completada"}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span>{visit.time}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{visit.assignee}</span>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewVisit?.(visit)}
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
            )}
          </div>

          {/* Upcoming Visits */}
          {upcomingVisits.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Próximas Visitas ({upcomingVisits.length})
              </h3>
              <div className="space-y-3">
                {upcomingVisits.slice(0, 3).map((visit) => (
                  <Card key={visit.id} className="cursor-pointer hover:shadow-sm transition-shadow">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{visit.title}</h4>
                          <Badge className={`${getStatusColor(visit.status)} text-xs`}>
                            {visit.status === "planned" && "Planificada"}
                            {visit.status === "in-progress" && "En Progreso"}
                            {visit.status === "completed" && "Completada"}
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

                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewVisit?.(visit)}
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

          {/* Upcoming Tasks */}
          {upcomingTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Próximas Tareas ({upcomingTasks.length})
              </h3>
              <div className="space-y-3">
                {upcomingTasks.slice(0, 3).map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-sm transition-shadow">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{task.title}</h4>
                          <Badge className={`${getTaskStatusColor(task.status)} text-xs`}>
                            {task.status === "pending" && "Pendiente"}
                            {task.status === "in_progress" && "En Progreso"}
                            {task.status === "completed" && "Completada"}
                            {task.status === "cancelled" && "Cancelada"}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>Vence el {format(new Date(task.due_date), "dd/MM", { locale: es })}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{task.assigned_to_name || "No especificado"}</span>
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
        </div>
      </ScrollArea>
    </div>
  )
}
