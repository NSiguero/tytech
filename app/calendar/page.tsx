"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { CalendarGrid } from "@/components/calendar/calendar-grid"
import { AssignedVisits } from "@/components/calendar/assigned-visits"
import { VisitModal } from "@/components/calendar/visit-modal"
import { TaskDetailModal } from "@/components/task-detail-modal"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { visitsData, type Visit } from "@/lib/visits-data"
import { Menu } from "lucide-react"
import { toast } from "sonner"
import type { Task } from "@/lib/tasks"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "agenda">("month")
  const [visits, setVisits] = useState<Visit[]>(visitsData)
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false)
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false)
  const [isMobileManagementOpen, setIsMobileManagementOpen] = useState(false)
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)

  // Load tasks for the current user (agent)
  useEffect(() => {
    const loadAgentTasks = async () => {
      try {
        setIsLoadingTasks(true)
        // For now, we'll use a mock agent ID. In a real app, this would come from user authentication
        const agentId = 6 // Rodrigo Quesada - usuario que tiene tareas asignadas
        console.log('👤 ID del agente:', agentId)
        const response = await fetch(`/api/tasks/agent/${agentId}`)
        
        if (response.ok) {
          const agentTasks = await response.json()
          setTasks(agentTasks)
        } else {
          console.error('Failed to load agent tasks')
          toast.error('Error al cargar las tareas del agente')
        }
      } catch (error) {
        console.error('Error loading agent tasks:', error)
        toast.error('Error al cargar las tareas del agente')
      } finally {
        setIsLoadingTasks(false)
      }
    }

    loadAgentTasks()
  }, [])

  // Filter visits and tasks for the current period
  const getItemsForPeriod = () => {
    const items: Array<{ type: 'visit' | 'task', data: Visit | Task, date: Date }> = []
    
    // Add visits
    visits.forEach(visit => {
      items.push({ type: 'visit', data: visit, date: new Date(visit.date) })
    })
    
    // Add tasks
    tasks.forEach(task => {
      if (task.due_date) {
        items.push({ type: 'task', data: task, date: new Date(task.due_date) })
      }
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

  const handleVisitClick = (visit: Visit) => {
    setSelectedVisit(visit)
    setIsVisitModalOpen(true)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDetailModalOpen(true)
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
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Main Calendar Area - More space on mobile */}
          <div className="flex-1 overflow-auto p-2 md:p-6">
            <CalendarGrid
              currentDate={currentDate}
              viewMode={viewMode}
              visits={visits}
              tasks={tasks}
              onVisitClick={handleVisitClick}
              onTaskClick={handleTaskClick}
            />
          </div>

          {/* Desktop Management Sidebar - Hidden on mobile for more space */}
          <div className="hidden lg:block w-80 bg-white border-l border-gray-200">
            <AssignedVisits
              visits={visits}
              tasks={tasks}
              onViewVisit={handleVisitClick}
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
                  onViewVisit={(visit) => {
                    setIsMobileManagementOpen(false)
                    handleVisitClick(visit)
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
      <VisitModal
        isOpen={isVisitModalOpen}
        onClose={() => {
          setIsVisitModalOpen(false)
          setSelectedVisit(null)
        }}
        visit={selectedVisit}
      />

      <TaskDetailModal
        isOpen={isTaskDetailModalOpen}
        onClose={() => {
          setIsTaskDetailModalOpen(false)
          setSelectedTask(null)
        }}
        task={selectedTask}
        onEdit={() => {
          // No edit functionality for agents in calendar view
          toast.info("Los agentes no pueden editar tareas desde el calendario")
        }}
        onDelete={() => {
          // No delete functionality for agents in calendar view
          toast.info("Los agentes no pueden eliminar tareas desde el calendario")
        }}
      />
    </div>
  )
}
