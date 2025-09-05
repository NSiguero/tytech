"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { updateVisit, type Visit } from "@/lib/visits-data"
import {
  Calendar,
  Clock,
  User,
  Camera,
  AlertTriangle,
  TrendingUp,
  X,
  Target,
  BarChart3,
  History,
  Play,
  Pause,
  Square,
  Timer,
  Loader2,
  CheckSquare,
} from "lucide-react"

interface VisitModalProps {
  isOpen: boolean
  onClose: () => void
  visit: Visit | null
}

interface StoreHistory {
  totalVisits: number
  averageScore: number
  salesTrend: "up" | "down" | "stable"
  complianceTrend: "up" | "down" | "stable"
  recentPhotos: string[]
  commonIssues: string[]
}

const sampleStoreHistory: StoreHistory = {
  totalVisits: 24,
  averageScore: 8.5,
  salesTrend: "up",
  complianceTrend: "stable",
  recentPhotos: [
    "/placeholder.svg?height=80&width=80&text=Photo1",
    "/placeholder.svg?height=80&width=80&text=Photo2",
    "/placeholder.svg?height=80&width=80&text=Photo3",
    "/placeholder.svg?height=80&width=80&text=Photo4",
  ],
  commonIssues: ["Precios desactualizados", "Stock bajo en promociones", "PLV mal colocado"],
}

export function VisitModal({ isOpen, onClose, visit }: VisitModalProps) {
  const [visitNotes, setVisitNotes] = useState("")
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [timer, setTimer] = useState({ elapsed: 0, interval: null as NodeJS.Timeout | null })
  const [currentVisit, setCurrentVisit] = useState<Visit | null>(visit)

  useEffect(() => {
    if (visit) {
      setCurrentVisit(visit)
      setVisitNotes(visit.notes || "")
      
      // Load tasks for this visit
      loadVisitTasks(visit)

      // If visit is in progress and has a start time, calculate elapsed time
      if (visit.status === "in-progress" && visit.startTime) {
        const elapsed = Math.floor((new Date().getTime() - visit.startTime.getTime()) / 1000)
        startTimer(elapsed)
      }
    }
  }, [visit])

  // Function to load tasks related to this visit
  const loadVisitTasks = async (visitData: Visit) => {
    try {
      setLoadingTasks(true)
      
      // Get user from localStorage
      const storedUser = localStorage.getItem("user")
      if (!storedUser) return
      
      const user = JSON.parse(storedUser)
      
      // Extract supermarket info from visit data
      // For now, we'll use the store name to determine the chain
      const cadenaSupermercado = getCadenaFromStore(visitData.store)
      
      const params = new URLSearchParams({
        user_id: user.id.toString(),
        ...(cadenaSupermercado && { cadena: cadenaSupermercado }),
        // Add more params based on available data
      })
      
      console.log('Loading tasks for visit:', visitData.id, 'with params:', params.toString())
      
      const response = await fetch(`/api/visits/${visitData.id}/tasks?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        console.log('Loaded tasks for visit:', result.tasks)
        setTasks(result.tasks.map((task: any) => ({
          id: task.id,
          name: task.name,
          description: task.description,
          completed: false, // Reset completion for this visit
          priority: task.priority,
          status: task.status,
          assignedBy: task.assignedBy,
          estimatedHours: task.estimatedHours,
          tags: task.tags || [],
          cadenaSupermercado: task.cadenaSupermercado,
          area: task.area,
          supermercadoId: task.supermercadoId
        })))
      } else {
        console.error('Failed to load tasks:', result.error)
        // Fallback to default tasks
        setTasks([
          { id: "default-1", name: "Auditoría de lineal", completed: false, priority: "medium" },
          { id: "default-2", name: "Verificación de PLV", completed: false, priority: "medium" },
          { id: "default-3", name: "Comprobar precios", completed: false, priority: "medium" },
        ])
      }
    } catch (error) {
      console.error('Error loading visit tasks:', error)
      // Fallback to default tasks
      setTasks([
        { id: "default-1", name: "Auditoría de lineal", completed: false, priority: "medium" },
        { id: "default-2", name: "Verificación de PLV", completed: false, priority: "medium" },
        { id: "default-3", name: "Comprobar precios", completed: false, priority: "medium" },
      ])
    } finally {
      setLoadingTasks(false)
    }
  }

  // Helper function to determine chain from store name
  const getCadenaFromStore = (storeName: string): string | null => {
    const name = storeName.toLowerCase()
    if (name.includes('carrefour')) return 'GRUPO CARREFOUR'
    if (name.includes('mercadona')) return 'MERCADONA'
    if (name.includes('alcampo')) return 'GRUPO AUCHAN'
    if (name.includes('eroski')) return 'GRUPO EROSKI'
    if (name.includes('día')) return 'GRUPO DIA'
    return null
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timer.interval) {
        clearInterval(timer.interval)
      }
    }
  }, [timer.interval])

  const startTimer = useCallback(
    (initialElapsed = 0) => {
      // Clear existing timer if any
      if (timer.interval) {
        clearInterval(timer.interval)
      }

      const interval = setInterval(() => {
        setTimer((prev) => ({
          ...prev,
          elapsed: prev.elapsed + 1,
        }))
      }, 1000)

      setTimer({
        elapsed: initialElapsed,
        interval,
      })
    },
    [timer.interval],
  )

  const stopTimer = useCallback(() => {
    if (timer.interval) {
      clearInterval(timer.interval)
      setTimer((prev) => ({
        ...prev,
        interval: null,
      }))
    }
  }, [timer.interval])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartVisit = () => {
    if (!currentVisit) return

    const now = new Date()
    const updatedVisit = {
      ...currentVisit,
      status: "in-progress" as const,
      startTime: now,
      isActive: true,
    }

    setCurrentVisit(updatedVisit)
    updateVisit(updatedVisit)
    startTimer()
    toast.success(`Visita a ${currentVisit.title} iniciada correctamente`)
  }

  const handlePauseVisit = () => {
    if (!currentVisit) return

    stopTimer()
    const updatedVisit = {
      ...currentVisit,
      isActive: false,
      pausedTime: (currentVisit.pausedTime || 0) + timer.elapsed,
    }

    setCurrentVisit(updatedVisit)
    updateVisit(updatedVisit)
    toast.success(`Visita a ${currentVisit.title} pausada`)
  }

  const handleResumeVisit = () => {
    if (!currentVisit) return

    const updatedVisit = {
      ...currentVisit,
      isActive: true,
    }

    setCurrentVisit(updatedVisit)
    updateVisit(updatedVisit)
    startTimer(timer.elapsed)
    toast.success(`Visita a ${currentVisit.title} reanudada`)
  }

  const handleFinishVisit = () => {
    if (!currentVisit) return

    stopTimer()
    const actualDuration = Math.floor(timer.elapsed / 60) // Convert to minutes

    const updatedVisit = {
      ...currentVisit,
      status: "completed" as const,
      progress: 100,
      endTime: new Date(),
      actualDuration: actualDuration,
      isActive: false,
    }

    setCurrentVisit(updatedVisit)
    updateVisit(updatedVisit)
    toast.success(`Visita a ${currentVisit.title} completada en ${formatTime(timer.elapsed)}`)
  }

  const handleTaskToggle = (taskId: string) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    setTasks(updatedTasks)

    // Update visit progress
    if (currentVisit) {
      const completedTasks = updatedTasks.filter((t) => t.completed).length
      const progress = Math.round((completedTasks / updatedTasks.length) * 100)
      const updatedVisit = { ...currentVisit, progress }
      setCurrentVisit(updatedVisit)
      updateVisit(updatedVisit)
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && currentVisit?.status !== "planned") {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedPhotos((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
      toast.success(`${files.length} foto(s) subida(s) correctamente`)
    } else if (currentVisit?.status === "planned") {
      toast.error("Debes iniciar la visita antes de subir fotos")
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

  if (!currentVisit) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[95vh] p-0 overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-xl font-bold">{currentVisit.title}</DialogTitle>

            {/* Visit Control Buttons */}
            <div className="flex items-center gap-2">
              {currentVisit.status === "planned" && (
                <Button onClick={handleStartVisit} className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Iniciar Visita</span>
                </Button>
              )}

              {currentVisit.status === "in-progress" && (
                <>
                  {currentVisit.isActive ? (
                    <Button onClick={handlePauseVisit} variant="outline">
                      <Pause className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Pausar</span>
                    </Button>
                  ) : (
                    <Button onClick={handleResumeVisit} variant="outline">
                      <Play className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Reanudar</span>
                    </Button>
                  )}

                  <Button onClick={handleFinishVisit} className="bg-blue-600 hover:bg-blue-700">
                    <Square className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Finalizar</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Visit Info */}
          <div className="space-y-2">
            <p className="text-gray-600">{currentVisit.address}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {currentVisit.date.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  - {currentVisit.time}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{currentVisit.assignee}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{currentVisit.duration} min</span>
              </div>
              <Badge className={getPriorityColor(currentVisit.priority)}>{currentVisit.priority}</Badge>

              {/* Timer Display */}
              {currentVisit.status === "in-progress" && currentVisit.isActive && (
                <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-md font-medium">
                  <Timer className="w-4 h-4" />
                  <span>{formatTime(timer.elapsed)}</span>
                </div>
              )}

              {/* Progress Bar */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs">Progreso:</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${currentVisit.progress || 0}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{currentVisit.progress || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Photo Upload */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">📸 Subir fotos</Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 lg:p-8 text-center transition-colors ${
                        currentVisit.status === "planned"
                          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                          : "border-gray-300 hover:border-blue-400 cursor-pointer"
                      }`}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                        disabled={currentVisit.status === "planned"}
                      />
                      <label
                        htmlFor="photo-upload"
                        className={`cursor-pointer ${currentVisit.status === "planned" ? "cursor-not-allowed" : ""}`}
                      >
                        <Camera className="w-8 lg:w-12 h-8 lg:h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 text-sm lg:text-base">
                          {currentVisit.status === "planned"
                            ? "Inicia la visita para subir fotos"
                            : window.innerWidth < 768
                              ? "Toca para seleccionar fotos"
                              : "Arrastra fotos aquí o haz clic para seleccionar"}
                        </p>
                      </label>
                    </div>
                    {uploadedPhotos.length > 0 && (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                        {uploadedPhotos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={photo || "/placeholder.svg"}
                              alt={`Uploaded ${index + 1}`}
                              className="w-full h-16 lg:h-20 object-cover rounded border"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0"
                              onClick={() => setUploadedPhotos((photos) => photos.filter((_, i) => i !== index))}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tasks Checklist */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" />
                        Lista de tareas
                      </Label>
                      {loadingTasks && (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      )}
                    </div>
                    
                    {loadingTasks ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center space-x-3 p-2 rounded">
                            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                            <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tasks.length === 0 ? (
                          <div className="text-center text-gray-500 py-4">
                            <CheckSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No hay tareas específicas para esta visita</p>
                            <p className="text-xs text-gray-400 mt-1">Las tareas se asignan según la cadena y ubicación</p>
                          </div>
                        ) : (
                          tasks.map((task) => (
                            <div key={task.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start space-x-3">
                                <Checkbox
                                  id={task.id}
                                  checked={task.completed}
                                  onCheckedChange={() => handleTaskToggle(task.id)}
                                  disabled={currentVisit?.status === "planned"}
                                  className="h-5 w-5 mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <Label
                                    htmlFor={task.id}
                                    className={`text-sm font-medium cursor-pointer block ${
                                      task.completed ? "line-through text-gray-500" : ""
                                    }`}
                                  >
                                    {task.name}
                                  </Label>
                                  {task.description && (
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge 
                                      variant={
                                        task.priority === "urgent" ? "destructive" :
                                        task.priority === "high" ? "default" :
                                        task.priority === "medium" ? "secondary" : "outline"
                                      }
                                      className="text-xs"
                                    >
                                      {task.priority}
                                    </Badge>
                                    {task.cadenaSupermercado && (
                                      <Badge variant="outline" className="text-xs">
                                        {task.cadenaSupermercado}
                                      </Badge>
                                    )}
                                    {task.estimatedHours && (
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {task.estimatedHours}h
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">📝 Notas de la visita</Label>
                    <Textarea
                      placeholder="Añade observaciones, incidencias o comentarios..."
                      value={visitNotes}
                      onChange={(e) => setVisitNotes(e.target.value)}
                      className="min-h-[100px] lg:min-h-[120px] resize-none"
                      disabled={currentVisit.status === "planned"}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Store History */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Historial de la Tienda
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* KPIs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 lg:p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl lg:text-3xl font-bold text-blue-900">
                        {sampleStoreHistory.totalVisits}
                      </div>
                      <div className="text-xs lg:text-sm text-blue-600">Total visitas</div>
                    </div>
                    <div className="text-center p-3 lg:p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl lg:text-3xl font-bold text-green-900">
                        {sampleStoreHistory.averageScore}
                      </div>
                      <div className="text-xs lg:text-sm text-green-600">Puntuación media</div>
                    </div>
                  </div>

                  {/* Trends */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ventas</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp
                          className={`w-4 h-4 ${sampleStoreHistory.salesTrend === "up" ? "text-green-600" : "text-red-600"}`}
                        />
                        <span className="text-sm font-medium">
                          {sampleStoreHistory.salesTrend === "up"
                            ? "↑"
                            : sampleStoreHistory.salesTrend === "down"
                              ? "↓"
                              : "→"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Compliance</span>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">→</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Recent Photos */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Fotos recientes</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {sampleStoreHistory.recentPhotos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo || "/placeholder.svg"}
                          alt={`Recent ${index + 1}`}
                          className="w-full h-12 lg:h-16 object-cover rounded border hover:opacity-75 cursor-pointer transition-opacity"
                        />
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Common Issues */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Incidencias comunes</h4>
                    <div className="space-y-2">
                      {sampleStoreHistory.commonIssues.map((issue, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="leading-tight">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
