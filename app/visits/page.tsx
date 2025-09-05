"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { visitsData, updateVisit, getVisitById, type Visit } from "@/lib/visits-data"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Camera,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  X,
  Search,
  Filter,
  Play,
  Square,
  Target,
  BarChart3,
  History,
  Pause,
  Timer,
  CheckSquare,
  LogOut,
  Loader2,
} from "lucide-react"

interface Product {
  id: string
  name: string
  facing: number
  observedPrice: number
  hasPromo: boolean
  observation: string
  image?: string
}

interface AIsuggestion {
  id: string
  type: "focus" | "promo" | "stock" | "display"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "pending" | "applied" | "ignored"
}

interface StoreHistory {
  totalVisits: number
  averageScore: number
  salesTrend: "up" | "down" | "stable"
  complianceTrend: "up" | "down" | "stable"
  recentPhotos: string[]
  commonIssues: string[]
}

// Sample data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Oreo Original 154g",
    facing: 8,
    observedPrice: 2.45,
    hasPromo: false,
    observation: "Stock completo, buena visibilidad",
  },
  {
    id: "2",
    name: "Nutella 400g",
    facing: 6,
    observedPrice: 4.99,
    hasPromo: true,
    observation: "Promoción 2x1 activa hasta fin de mes",
  },
]

const sampleAISuggestions: AIsuggestion[] = [
  {
    id: "1",
    type: "focus",
    title: "Shelf share de Oreo ha bajado",
    description: "El shelf share de Oreo ha disminuido un 15% esta semana. Haz foco en la visibilidad del producto.",
    priority: "high",
    status: "pending",
  },
  {
    id: "2",
    type: "promo",
    title: "Verificar promoción Nutella",
    description: "Revisa si sigue activa la promoción de Nutella 2x1. Debería haber terminado ayer.",
    priority: "medium",
    status: "pending",
  },
  {
    id: "3",
    type: "stock",
    title: "Stock bajo en cereales",
    description: "Los cereales Nestlé están con stock bajo. Considera solicitar reposición.",
    priority: "low",
    status: "pending",
  },
]

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

export default function VisitsPage() {
  const searchParams = useSearchParams()
  const visitId = searchParams.get("visit")

  const [user, setUser] = useState<any>(null)
  const [currentView, setCurrentView] = useState<"list" | "detail">("list")
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [visits, setVisits] = useState<Visit[]>(visitsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [aiSuggestions, setAiSuggestions] = useState<AIsuggestion[]>(sampleAISuggestions)
  const [storeHistory] = useState<StoreHistory>(sampleStoreHistory)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [visitNotes, setVisitNotes] = useState("")
  const [tasks, setTasks] = useState<any[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [timers, setTimers] = useState<Record<string, { elapsed: number; interval: NodeJS.Timeout | null }>>({})

  // Get user from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    
    if (!token || !storedUser) {
      window.location.href = "/login"
      return
    }
    
    try {
      setUser(JSON.parse(storedUser))
    } catch (error) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
  }, [])

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Function to load tasks for a specific visit
  const loadVisitTasks = async (visitData: Visit) => {
    try {
      setLoadingTasks(true)
      
      console.log('🔍 DEBUG - Loading tasks for visit:', visitData.id)
      console.log('🔍 DEBUG - User object:', user)
      console.log('🔍 DEBUG - User ID:', user?.id)
      
      if (!user?.id) {
        console.warn('❌ No user ID found, skipping task loading')
        setTasks([
          { id: "no-user-1", name: "Usuario no encontrado", completed: false, priority: "medium" },
          { id: "no-user-2", name: "Inicia sesión para ver tareas", completed: false, priority: "medium" },
        ])
        return
      }
      
      // Extract supermarket info from visit data
      const cadenaSupermercado = getCadenaFromStore(visitData.store)
      console.log('🔍 DEBUG - Store name:', visitData.store)
      console.log('🔍 DEBUG - Detected chain:', cadenaSupermercado)
      
      const params = new URLSearchParams({
        user_id: user.id.toString(),
        ...(cadenaSupermercado && { cadena: cadenaSupermercado }),
      })
      
      console.log('🔍 DEBUG - API URL:', `/api/visits/${visitData.id}/tasks?${params.toString()}`)
      
      const response = await fetch(`/api/visits/${visitData.id}/tasks?${params}`)
      
      console.log('🔍 DEBUG - API Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('🔍 DEBUG - API Result:', result)
      
      if (result.success) {
        console.log('✅ SUCCESS - Loaded tasks:', result.tasks.length, 'tasks')
        if (result.tasks.length === 0) {
          setTasks([
            { id: "empty-1", name: "No hay tareas para esta visita", completed: false, priority: "medium" },
            { id: "empty-2", name: "Verifica que existan tareas en la BD", completed: false, priority: "medium" },
          ])
        } else {
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
        }
      } else {
        console.error('❌ API Error:', result.error)
        // Fallback to default tasks
        setTasks([
          { id: "api-error-1", name: "Error en API: " + (result.error || "Unknown"), completed: false, priority: "medium" },
          { id: "api-error-2", name: "Usando tareas por defecto", completed: false, priority: "medium" },
        ])
      }
    } catch (error) {
      console.error('❌ Exception loading visit tasks:', error)
      // Fallback to default tasks
      setTasks([
        { id: "exception-1", name: "Error de conexión: " + error.message, completed: false, priority: "medium" },
        { id: "exception-2", name: "Verifica la consola del navegador", completed: false, priority: "medium" },
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

  // Check if we should show detail view based on URL parameter
  useEffect(() => {
    if (visitId) {
      const visit = getVisitById(visitId)
      if (visit) {
        setSelectedVisit(visit)
        setCurrentView("detail")
        setVisitNotes(visit.notes || "")
        
        // Load tasks for this visit
        if (user?.id) {
          loadVisitTasks(visit)
        }

        // If visit is in progress and has a start time, calculate elapsed time
        if (visit.status === "in-progress" && visit.startTime) {
          const elapsed = Math.floor((new Date().getTime() - visit.startTime.getTime()) / 1000)
          startTimer(visit.id, elapsed)
        }
      }
    }
  }, [visitId, user?.id])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timers).forEach((timer) => {
        if (timer.interval) {
          clearInterval(timer.interval)
        }
      })
    }
  }, [timers])

  const startTimer = useCallback(
    (visitId: string, initialElapsed = 0) => {
      // Clear existing timer if any
      if (timers[visitId]?.interval) {
        clearInterval(timers[visitId].interval)
      }

      const interval = setInterval(() => {
        setTimers((prev) => ({
          ...prev,
          [visitId]: {
            ...prev[visitId],
            elapsed: (prev[visitId]?.elapsed || initialElapsed) + 1,
          },
        }))
      }, 1000)

      setTimers((prev) => ({
        ...prev,
        [visitId]: {
          elapsed: initialElapsed,
          interval,
        },
      }))
    },
    [timers],
  )

  const stopTimer = useCallback(
    (visitId: string) => {
      if (timers[visitId]?.interval) {
        clearInterval(timers[visitId].interval)
        setTimers((prev) => ({
          ...prev,
          [visitId]: {
            ...prev[visitId],
            interval: null,
          },
        }))
      }
    },
    [timers],
  )

  const filteredVisits = visits.filter((visit) => {
    const matchesSearch =
      visit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || visit.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  const getVisitStatusBadge = (visit: Visit) => {
    const now = new Date()
    const visitDateTime = new Date(visit.date)
    visitDateTime.setHours(Number.parseInt(visit.time.split(":")[0]), Number.parseInt(visit.time.split(":")[1]))

    if (visit.status === "completed") {
      return { text: "Completada", color: "bg-green-100 text-green-700" }
    }
    if (visit.status === "in-progress") {
      return { text: "En progreso", color: "bg-orange-100 text-orange-700" }
    }
    if (visitDateTime < now) {
      return { text: "Retrasada", color: "bg-red-100 text-red-700" }
    }
    if (visitDateTime.getTime() - now.getTime() < 60 * 60 * 1000) {
      return { text: "Próxima", color: "bg-blue-100 text-blue-700" }
    }
    return { text: "Programada", color: "bg-gray-100 text-gray-700" }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartVisit = (visit: Visit, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }

    const now = new Date()
    const updatedVisit = {
      ...visit,
      status: "in-progress" as const,
      startTime: now,
      isActive: true,
    }

    setVisits(visits.map((v) => (v.id === visit.id ? updatedVisit : v)))
    updateVisit(updatedVisit)

    if (selectedVisit?.id === visit.id) {
      setSelectedVisit(updatedVisit)
    }

    // Start the timer
    startTimer(visit.id)

    toast.success(`Visita a ${visit.title} iniciada correctamente`)
  }

  const handlePauseVisit = (visit: Visit, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }

    stopTimer(visit.id)

    const updatedVisit = {
      ...visit,
      isActive: false,
      pausedTime: (visit.pausedTime || 0) + (timers[visit.id]?.elapsed || 0),
    }

    setVisits(visits.map((v) => (v.id === visit.id ? updatedVisit : v)))
    updateVisit(updatedVisit)

    if (selectedVisit?.id === visit.id) {
      setSelectedVisit(updatedVisit)
    }

    toast.success(`Visita a ${visit.title} pausada`)
  }

  const handleResumeVisit = (visit: Visit, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }

    const updatedVisit = {
      ...visit,
      isActive: true,
    }

    setVisits(visits.map((v) => (v.id === visit.id ? updatedVisit : v)))
    updateVisit(updatedVisit)

    if (selectedVisit?.id === visit.id) {
      setSelectedVisit(updatedVisit)
    }

    // Resume the timer
    startTimer(visit.id, timers[visit.id]?.elapsed || 0)

    toast.success(`Visita a ${visit.title} reanudada`)
  }

  const handleFinishVisit = (visit: Visit, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }

    stopTimer(visit.id)

    const elapsed = timers[visit.id]?.elapsed || 0
    const actualDuration = Math.floor(elapsed / 60) // Convert to minutes

    const updatedVisit = {
      ...visit,
      status: "completed" as const,
      progress: 100,
      endTime: new Date(),
      actualDuration: actualDuration,
      isActive: false,
    }

    setVisits(visits.map((v) => (v.id === visit.id ? updatedVisit : v)))
    updateVisit(updatedVisit)

    if (selectedVisit?.id === visit.id) {
      setSelectedVisit(updatedVisit)
    }

    toast.success(`Visita a ${visit.title} completada en ${formatTime(elapsed)}`)
  }

  const handleTaskToggle = (taskId: string) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    setTasks(updatedTasks)

    // Update visit progress
    if (selectedVisit) {
      const completedTasks = updatedTasks.filter((t) => t.completed).length
      const progress = Math.round((completedTasks / updatedTasks.length) * 100)
      const updatedVisit = { ...selectedVisit, progress }
      setSelectedVisit(updatedVisit)
      setVisits(visits.map((v) => (v.id === selectedVisit.id ? updatedVisit : v)))
      updateVisit(updatedVisit)
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && selectedVisit?.status !== "planned") {
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
    } else if (selectedVisit?.status === "planned") {
      toast.error("Debes iniciar la visita antes de subir fotos")
    }
  }

  const handleAISuggestionAction = (suggestionId: string, action: "applied" | "ignored") => {
    setAiSuggestions((suggestions) => suggestions.map((s) => (s.id === suggestionId ? { ...s, status: action } : s)))
    toast.success(`Sugerencia ${action === "applied" ? "aplicada" : "ignorada"}`)
  }

  const completedVisits = filteredVisits.filter((v) => v.status === "completed").length
  const inProgressVisits = filteredVisits.filter((v) => v.status === "in-progress").length
  const plannedVisits = filteredVisits.filter((v) => v.status === "planned").length

  if (currentView === "list") {
    return (
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar - Always visible */}
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Responsive Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Buenas Tardes, {user?.first_name || "Usuario"}
                  </h1>
                  <p className="text-gray-600">Aquí están tus visitas programadas y su estado actual.</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{completedVisits}</div>
                      <div className="text-sm text-slate-600">Completadas</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{inProgressVisits}</div>
                      <div className="text-sm text-slate-600">En progreso</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{plannedVisits}</div>
                      <div className="text-sm text-slate-600">Programadas</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por tienda o dirección..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="in-progress">En progreso</SelectItem>
                  <SelectItem value="planned">Programadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Visits List - More space on mobile */}
            <div className="flex-1 overflow-auto p-2 md:p-6">
              <div className="space-y-2 md:space-y-4">
                {filteredVisits.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No hay visitas</h3>
                      <p className="text-slate-600">
                        {searchTerm || statusFilter !== "all"
                          ? "No se encontraron visitas con los filtros aplicados"
                          : "No hay visitas programadas para hoy"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredVisits
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((visit) => {
                      const statusBadge = getVisitStatusBadge(visit)
                      const isActive = visit.status === "in-progress" && visit.isActive
                      const elapsed = timers[visit.id]?.elapsed || 0

                      return (
                        <Card
                          key={visit.id}
                          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300"
                          onClick={() => {
                            setSelectedVisit(visit)
                            setCurrentView("detail")
                            if (user?.id) {
                              loadVisitTasks(visit)
                            }
                          }}
                        >
                          <CardContent className="p-3 md:p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                  <h3 className="text-base md:text-lg font-semibold text-slate-900 truncate">
                                    {visit.title}
                                  </h3>
                                  <Badge className={`${statusBadge.color} text-xs`}>{statusBadge.text}</Badge>
                                  <Badge className={`${getPriorityColor(visit.priority)} text-xs hidden sm:inline-flex`}>
                                    {visit.priority}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-1 text-xs md:text-sm text-slate-600 mb-2">
                                  <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                  <span className="truncate">{visit.address}</span>
                                </div>

                                <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm text-slate-600 mb-2 md:mb-3">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                    <span>{visit.time}</span>
                                  </div>
                                  <div className="flex items-center gap-1 hidden sm:flex">
                                    <User className="w-3 h-3 md:w-4 md:h-4" />
                                    <span>{visit.assignee}</span>
                                  </div>
                                  <div className="flex items-center gap-1 hidden sm:flex">
                                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                    <span>{visit.duration} min</span>
                                  </div>

                                  {isActive && (
                                    <div className="flex items-center gap-1 text-orange-600 font-medium">
                                      <Timer className="w-3 h-3 md:w-4 md:h-4" />
                                      <span>{formatTime(elapsed)}</span>
                                    </div>
                                  )}
                                </div>

                                {visit.notes && (
                                  <p className="text-xs md:text-sm text-slate-600 mb-2 md:mb-3 line-clamp-2">
                                    {visit.notes}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-col items-end gap-2 md:gap-3 ml-3 md:ml-6">
                                {/* Visit Control Buttons */}
                                <div className="flex items-center gap-1 md:gap-2">
                                  {visit.status === "planned" && (
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-xs md:text-sm px-2 md:px-3"
                                      onClick={(e) => handleStartVisit(visit, e)}
                                    >
                                      <Play className="w-3 h-3 mr-1" />
                                      <span className="hidden sm:inline">Iniciar</span>
                                      <span className="sm:hidden">Start</span>
                                    </Button>
                                  )}

                                  {visit.status === "in-progress" && (
                                    <>
                                      {visit.isActive ? (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-xs md:text-sm px-2 md:px-3 bg-transparent"
                                          onClick={(e) => handlePauseVisit(visit, e)}
                                        >
                                          <Pause className="w-3 h-3 mr-1" />
                                          <span className="hidden sm:inline">Pausar</span>
                                        </Button>
                                      ) : (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-xs md:text-sm px-2 md:px-3 bg-transparent"
                                          onClick={(e) => handleResumeVisit(visit, e)}
                                        >
                                          <Play className="w-3 h-3 mr-1" />
                                          <span className="hidden sm:inline">Reanudar</span>
                                        </Button>
                                      )}

                                      <Button
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-xs md:text-sm px-2 md:px-3"
                                        onClick={(e) => handleFinishVisit(visit, e)}
                                      >
                                        <CheckSquare className="w-3 h-3 mr-1" />
                                        <span className="hidden sm:inline">Finalizar</span>
                                        <span className="sm:hidden">End</span>
                                      </Button>
                                    </>
                                  )}
                                </div>

                                {visit.progress > 0 && (
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 md:w-20 h-1.5 md:h-2 bg-slate-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-slate-900 rounded-full transition-all duration-300"
                                        style={{ width: `${visit.progress}%` }}
                                      />
                                    </div>
                                    <span className="text-xs md:text-sm font-medium text-slate-900">
                                      {visit.progress}%
                                    </span>
                                  </div>
                                )}

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs md:text-sm px-2 md:px-3 hidden md:flex bg-transparent"
                                >
                                  Ver detalles
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Detail View
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Always visible */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Responsive Header */}
        <div className="bg-white border-b border-slate-200">
          {/* Mobile Header */}
          <div className="block md:hidden p-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView("list")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {/* Visit Control Buttons */}
              <div className="flex items-center gap-2">
                {selectedVisit?.status === "planned" && (
                  <Button
                    onClick={() => handleStartVisit(selectedVisit)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Start
                  </Button>
                )}
                {selectedVisit?.status === "in-progress" && (
                  <div className="flex items-center gap-1">
                    {selectedVisit.isActive ? (
                      <Button onClick={() => handlePauseVisit(selectedVisit)} size="sm" variant="outline">
                        <Pause className="w-3 h-3 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button onClick={() => handleResumeVisit(selectedVisit)} size="sm" variant="outline">
                        <Play className="w-3 h-3 mr-1" />
                        Resume
                      </Button>
                    )}
                    <Button
                      onClick={() => handleFinishVisit(selectedVisit)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Square className="w-3 h-3 mr-1" />
                      End
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Visit Header Info - Compact */}
            <div>
              <h1 className="text-lg font-bold text-slate-900 mb-1">{selectedVisit?.title}</h1>
              <p className="text-sm text-slate-600 mb-3">{selectedVisit?.address}</p>

              <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {selectedVisit?.date.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                    })}{" "}
                    - {selectedVisit?.time}
                  </span>
                </div>
                <Badge className={getPriorityColor(selectedVisit?.priority || "low")}>
                  {selectedVisit?.priority}
                </Badge>

                {selectedVisit?.status === "in-progress" && selectedVisit.isActive && selectedVisit.id && (
                  <div className="flex items-center gap-1 text-orange-600 font-medium">
                    <Timer className="w-3 h-3" />
                    <span>{formatTime(timers[selectedVisit.id]?.elapsed || 0)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs">Progress:</span>
                <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-300"
                    style={{ width: `${selectedVisit?.progress || 0}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{selectedVisit?.progress || 0}%</span>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setCurrentView("list")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a la lista
                </Button>
              </div>

              {/* Visit Control Buttons */}
              <div className="flex items-center gap-3">
                {selectedVisit?.status === "planned" && (
                  <Button onClick={() => handleStartVisit(selectedVisit)} className="bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar visita
                  </Button>
                )}
                {selectedVisit?.status === "in-progress" && (
                  <div className="flex items-center gap-2">
                    {selectedVisit.isActive ? (
                      <Button onClick={() => handlePauseVisit(selectedVisit)} variant="outline">
                        <Pause className="w-4 h-4 mr-2" />
                        Pausar
                      </Button>
                    ) : (
                      <Button onClick={() => handleResumeVisit(selectedVisit)} variant="outline">
                        <Play className="w-4 h-4 mr-2" />
                        Reanudar
                      </Button>
                    )}
                    <Button onClick={() => handleFinishVisit(selectedVisit)} className="bg-blue-600 hover:bg-blue-700">
                      <Square className="w-4 h-4 mr-2" />
                      Finalizar visita
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Visit Header Info */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{selectedVisit?.title}</h1>
              <p className="text-slate-600 mb-4">{selectedVisit?.address}</p>

              <div className="flex items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {selectedVisit?.date.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    - {selectedVisit?.time}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{selectedVisit?.assignee}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedVisit?.duration} min</span>
                </div>
                <Badge className={getPriorityColor(selectedVisit?.priority || "low")}>{selectedVisit?.priority}</Badge>

                {selectedVisit?.status === "in-progress" && selectedVisit.isActive && selectedVisit.id && (
                  <div className="flex items-center gap-1 text-orange-600 font-medium">
                    <Timer className="w-4 h-4" />
                    <span>{formatTime(timers[selectedVisit.id]?.elapsed || 0)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <span>Progreso:</span>
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-full transition-all duration-300"
                      style={{ width: `${selectedVisit?.progress || 0}%` }}
                    />
                  </div>
                  <span className="font-medium">{selectedVisit?.progress || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - More space on mobile */}
        <div className="flex-1 overflow-auto p-2 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
            {/* Left Column - Quick Actions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Target className="w-4 h-4 md:w-5 md:h-5" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  {/* Photo Upload */}
                  <div>
                    <Label className="text-sm font-medium mb-2 md:mb-3 block">📸 Subir fotos</Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 md:p-8 text-center transition-colors ${
                        selectedVisit?.status === "planned"
                          ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                          : "border-slate-300 hover:border-blue-400 cursor-pointer"
                      }`}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                        disabled={selectedVisit?.status === "planned"}
                      />
                      <label
                        htmlFor="photo-upload"
                        className={`cursor-pointer ${selectedVisit?.status === "planned" ? "cursor-not-allowed" : ""}`}
                      >
                        <Camera className="w-8 h-8 md:w-12 md:h-12 text-slate-400 mx-auto mb-2 md:mb-3" />
                        <p className="text-sm md:text-base text-slate-600">
                          {selectedVisit?.status === "planned"
                            ? "Inicia la visita para subir fotos"
                            : "Arrastra fotos aquí o haz clic para seleccionar"}
                        </p>
                      </label>
                    </div>
                    {uploadedPhotos.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 md:gap-3 mt-3 md:mt-4">
                        {uploadedPhotos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={photo || "/placeholder.svg"}
                              alt={`Uploaded ${index + 1}`}
                              className="w-full h-16 md:h-20 object-cover rounded border"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute -top-1 -right-1 md:-top-2 md:-right-2 h-5 w-5 md:h-6 md:w-6 p-0"
                              onClick={() => setUploadedPhotos((photos) => photos.filter((_, i) => i !== index))}
                            >
                              <X className="w-2 h-2 md:w-3 md:h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tasks Checklist */}
                  <div>
                    <div className="flex items-center justify-between mb-2 md:mb-3">
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
                          <div className="text-center text-gray-500 py-4 border rounded-lg">
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
                                  disabled={selectedVisit?.status === "planned"}
                                  className="h-5 w-5 mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <Label
                                    htmlFor={task.id}
                                    className={`text-sm font-medium cursor-pointer block ${
                                      task.completed ? "line-through text-slate-500" : ""
                                    }`}
                                  >
                                    {task.name}
                                  </Label>
                                  {task.description && (
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
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
                                    {task.assignedBy && (
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {task.assignedBy}
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
                    <Label className="text-sm font-medium mb-2 md:mb-3 block">📝 Notas de la visita</Label>
                    <Textarea
                      placeholder="Añade observaciones, incidencias o comentarios..."
                      value={visitNotes}
                      onChange={(e) => setVisitNotes(e.target.value)}
                      className="min-h-[80px] md:min-h-[120px]"
                      disabled={selectedVisit?.status === "planned"}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Store History */}
            <div>
              <Card>
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <History className="w-4 h-4 md:w-5 md:h-5" />
                    Historial de la Tienda
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  {/* KPIs */}
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl md:text-3xl font-bold text-blue-900">{storeHistory.totalVisits}</div>
                      <div className="text-xs md:text-sm text-blue-600">Total visitas</div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl md:text-3xl font-bold text-green-900">{storeHistory.averageScore}</div>
                      <div className="text-xs md:text-sm text-green-600">Puntuación media</div>
                    </div>
                  </div>

                  {/* Trends */}
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Ventas</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp
                          className={`w-4 h-4 ${storeHistory.salesTrend === "up" ? "text-green-600" : "text-red-600"}`}
                        />
                        <span className="text-sm font-medium">
                          {storeHistory.salesTrend === "up" ? "↑" : storeHistory.salesTrend === "down" ? "↓" : "→"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Compliance</span>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">→</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Recent Photos */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-2 md:mb-3">Fotos recientes</h4>
                    <div className="grid grid-cols-2 gap-1 md:gap-2">
                      {storeHistory.recentPhotos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo || "/placeholder.svg"}
                          alt={`Recent ${index + 1}`}
                          className="w-full h-12 md:h-16 object-cover rounded border hover:opacity-75 cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Common Issues */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-2 md:mb-3">Incidencias comunes</h4>
                    <div className="space-y-1 md:space-y-2">
                      {storeHistory.commonIssues.map((issue, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs md:text-sm text-slate-600">
                          <AlertTriangle className="w-3 h-3 text-orange-500 flex-shrink-0" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
