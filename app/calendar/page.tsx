"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { CalendarGrid } from "@/components/calendar/calendar-grid"
import { AssignedVisits } from "@/components/calendar/assigned-visits"
import { AssignVisitModal } from "@/components/calendar/assign-visit-modal"
import { VisitModal } from "@/components/calendar/visit-modal"
import { TaskModal } from "@/components/task-modal"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { visitsData, type Visit } from "@/lib/visits-data"
import { Menu, Plus, Calendar, Clock, MapPin, User, CheckCircle2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

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

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "agenda">("month")
  const [visits, setVisits] = useState<Visit[]>(visitsData)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false)
  const [isMobileManagementOpen, setIsMobileManagementOpen] = useState(false)

  // Filter visits and tasks for the current period
  const getItemsForPeriod = () => {
    const items: Array<{ type: 'visit' | 'task', data: Visit | Task, date: Date }> = []
    
    // Add visits
    visits.forEach(visit => {
      items.push({ type: 'visit', data: visit, date: new Date(visit.date) })
    })
    
    // Add tasks
    tasks.forEach(task => {
      items.push({ type: 'task', data: task, date: new Date(task.dueDate) })
    })
    
    if (viewMode === "month") {
      return items.filter((item) => {
        return item.date.getMonth() === currentDate.getMonth() && item.date.getFullYear() === currentDate.getFullYear()
      })
    } else {
      // Week view logic
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return items.filter((item) => {
        return item.date >= startOfWeek && item.date <= endOfWeek
      })
    }
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsAssignModalOpen(true)
  }

  const handleVisitClick = (visit: Visit) => {
    setSelectedVisit(visit)
    setIsVisitModalOpen(true)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskModalOpen(true)
  }

  const handleAssignVisit = (visitData: Omit<Visit, "id">) => {
    const newVisit: Visit = {
      ...visitData,
      id: Date.now().toString(),
    }
    setVisits([...visits, newVisit])
    setIsAssignModalOpen(false)
    setSelectedDate(null)
    toast.success("Visita asignada correctamente")
  }

  const handleCreateTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    }
    setTasks([...tasks, newTask])
    setIsTaskModalOpen(false)
    setSelectedDate(null)
    toast.success("Tarea creada correctamente")
  }

  const handleUpdateVisit = (updatedVisit: Visit) => {
    setVisits(visits.map(v => v.id === updatedVisit.id ? updatedVisit : v))
    toast.success("Visita actualizada correctamente")
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
    toast.success("Tarea actualizada correctamente")
  }

  const handleDeleteVisit = (visitId: string) => {
    setVisits(visits.filter(v => v.id !== visitId))
    toast.success("Visita eliminada correctamente")
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId))
    toast.success("Tarea eliminada correctamente")
  }

  const filteredItems = getItemsForPeriod()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Always visible */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Calendar Header - Now responsive */}
        <CalendarHeader
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAssignVisit={() => setIsAssignModalOpen(true)}
          onCreateTask={() => setIsTaskModalOpen(true)}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Main Calendar Area - More space on mobile */}
          <div className="flex-1 overflow-auto p-2 md:p-6">
            <CalendarGrid
              currentDate={currentDate}
              viewMode={viewMode}
              visits={visits}
              tasks={tasks}
              onDateClick={handleDateClick}
              onVisitClick={handleVisitClick}
              onTaskClick={handleTaskClick}
            />
          </div>

          {/* Desktop Management Sidebar - Hidden on mobile for more space */}
          <div className="hidden lg:block w-80 bg-white border-l border-gray-200">
            <AssignedVisits
              visits={visits}
              tasks={tasks}
              onAssignVisit={() => setIsAssignModalOpen(true)}
              onViewVisit={handleVisitClick}
              onCreateTask={() => setIsTaskModalOpen(true)}
              onViewTask={handleTaskClick}
            />
          </div>

          {/* Mobile Management Panel - Floating button */}
          <div className="lg:hidden fixed bottom-4 right-4 z-10">
            <Sheet open={isMobileManagementOpen} onOpenChange={setIsMobileManagementOpen}>
              <SheetTrigger asChild>
                <Button className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <AssignedVisits
                  visits={visits}
                  tasks={tasks}
                  onAssignVisit={() => {
                    setIsMobileManagementOpen(false)
                    setIsAssignModalOpen(true)
                  }}
                  onViewVisit={(visit) => {
                    setIsMobileManagementOpen(false)
                    handleVisitClick(visit)
                  }}
                  onCreateTask={() => {
                    setIsMobileManagementOpen(false)
                    setIsTaskModalOpen(true)
                  }}
                  onViewTask={(task) => {
                    setIsMobileManagementOpen(false)
                    handleTaskClick(task)
                  }}
                  isMobileOpen={isMobileManagementOpen}
                  onMobileClose={() => setIsMobileManagementOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssignVisitModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false)
          setSelectedDate(null)
        }}
        selectedDate={selectedDate}
        onAssign={handleAssignVisit}
      />

      <VisitModal
        isOpen={isVisitModalOpen}
        onClose={() => {
          setIsVisitModalOpen(false)
          setSelectedVisit(null)
        }}
        visit={selectedVisit}
        onUpdate={handleUpdateVisit}
        onDelete={handleDeleteVisit}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setSelectedTask(null)
        }}
        task={selectedTask}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        selectedDate={selectedDate}
      />
    </div>
  )
}
