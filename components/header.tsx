"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Calendar,
  MapPin,
  Clock,
  Camera,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Play,
  Eye,
  Upload,
  BarChart3,
  Target,
  Plus,
  MoreHorizontal,
  Edit3,
  Trash2,
  Check,
  Sparkles,
  LogOut,
  User,
} from "lucide-react"
import Link from "next/link"

interface Task {
  id: number
  task: string
  count: number
  urgent: boolean
  description?: string
  createdAt?: Date
  isDeleting?: boolean
  completed?: boolean
}

interface UploadedImage {
  id: string
  url: string
  filename: string
  uploadedAt: Date
  size: number
  originalSize: number
}

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [pendingTasks, setPendingTasks] = useState<Task[]>([
    {
      id: 1,
      task: "Subir fotos de las visitas de ayer",
      count: 8,
      urgent: true,
      description: "Necesito subir y categorizar fotos de las visitas a Carrefour y Mercadona",
      createdAt: new Date(2025, 0, 17, 9, 30),
      completed: false,
    },
    {
      id: 2,
      task: "Revisar informes de cuota de estante",
      count: 3,
      urgent: false,
      description: "Analizar datos de rendimiento de las visitas de la semana pasada",
      createdAt: new Date(2025, 0, 17, 10, 15),
      completed: false,
    },
    {
      id: 3,
      task: "Programar visitas de seguimiento",
      count: 5,
      urgent: true,
      description: "Coordinar con el equipo para las visitas a tiendas de la próxima semana",
      createdAt: new Date(2025, 0, 17, 11, 0),
      completed: false,
    },
  ])

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

  const todayVisits = [
    {
      id: "1",
      store: "Carrefour Alcobendas",
      time: "10:30 AM",
      status: "planned" as const,
      address: "C/ de la Chopera, 56",
      brand: "Oreo",
      assignedTo: "John Doe",
      date: new Date(2025, 0, 15),
    },
    {
      id: "2",
      store: "Mercadona Centro",
      time: "2:15 PM",
      status: "planned" as const,
      address: "Gran Vía, 28",
      brand: "Kinder",
      assignedTo: "John Doe",
      date: new Date(2025, 0, 15),
    },
  ]

  const kpiData = [
    {
      title: "Cambio en Cuota de Estante",
      value: "+2.3%",
      trend: "up",
      subtitle: "vs semana pasada",
      color: "text-emerald-600",
    },
    {
      title: "Mejor Rendimiento",
      value: "Oreo Original",
      trend: "up",
      subtitle: "87% cobertura",
      color: "text-blue-600",
    },
    {
      title: "Cadena Más Activa",
      value: "Carrefour",
      trend: "neutral",
      subtitle: "24 visitas asignadas",
      color: "text-violet-600",
    },
    {
      title: "Mejora en Cobertura",
      value: "94.2%",
      trend: "up",
      subtitle: "+5.1% este mes",
      color: "text-emerald-600",
    },
  ]

  const weekSummary = {
    completedVisits: 23,
    photosUploaded: 156,
    alertsResolved: 8,
    newIssues: 3,
  }

  // Get user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Buenos Días" : currentHour < 18 ? "Buenas Tardes" : "Buenas Noches"

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 px-4 md:px-8 py-4 md:py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-neutral-900">
                {greeting}, {user?.first_name || 'User'} 
              </h1>
              <p className="text-sm text-neutral-600">
                Aquí tienes un resumen de tu actividad hoy
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-neutral-600 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-neutral-500">Hoy</p>
            <p className="text-lg font-medium text-neutral-900">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
} 