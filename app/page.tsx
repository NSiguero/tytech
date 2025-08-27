"use client"

import React, { useState, useEffect, Suspense, lazy } from "react"
import axios from "axios"
import { Sidebar } from "@/components/sidebar"
import { initPerformanceOptimizations } from "@/lib/performance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import Link from "next/link"

// Import components directly for debugging
import { VisitModal } from "@/components/calendar/visit-modal"
import { TaskModal } from "@/components/task-modal"
import { TaskAssignmentPanel } from "@/components/task-assignment-panel"
import { AgentTaskView } from "@/components/agent-task-view"
import { TeamManagement } from "@/components/team-management"
import { ProductDetectionResults } from "@/components/product-detection-results"
import { AnalysisModal } from "@/components/analysis-modal"
import { useToast } from "@/components/ui/toast-notification"

interface Task {
  id: string
  title: string
  description?: string
  category: 'visita' | 'reporte'
  dueDate: Date
  assignee: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-progress" | "completed"
  estimatedHours?: number
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

// Loading component for lazy-loaded modals
const ModalLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
)

export default function DashboardPage() {
  const { showToast } = useToast();
  const [selectedVisit, setSelectedVisit] = useState<any>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [taskModalMode, setTaskModalMode] = useState<"add" | "view" | "edit">("add")
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploadCount, setUploadCount] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [productosRefreshTrigger, setProductosRefreshTrigger] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false)
  const [selectedImageForAnalysis, setSelectedImageForAnalysis] = useState<{url: string, filename: string, productos: any[]} | null>(null)
  const [visitTasks, setVisitTasks] = useState<Task[]>([])

  // Get user from localStorage on component mount and check authentication
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
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initialize performance optimizations
  useEffect(() => {
    initPerformanceOptimizations()
  }, [])

  // Fetch visit tasks when user is loaded
  useEffect(() => {
    const fetchVisitTasks = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/tasks?category=visita`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setVisitTasks(data.tasks || []);
          }
        } catch (error) {
          console.error('Error fetching visit tasks:', error);
        }
      }
    };

    fetchVisitTasks();
  }, [user?.id]);

  // Load existing uploads
  useEffect(() => {
    const loadUploads = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`/api/uploads?userId=${user.id}`);
          if (response.data.success) {
            const uploads = response.data.uploads.map((upload: any) => ({
              id: upload.id.toString(),
              url: upload.url,
              filename: upload.filename,
              uploadedAt: new Date(upload.uploaded_at),
              size: upload.size,
              originalSize: upload.original_size
            }));
            setUploadedImages(uploads);
            setUploadCount(uploads.length);
            
            // Update performance metrics with actual upload count
            setPerformanceMetrics(prev => ({
              ...prev,
              photoUploads: uploads.length
            }));
          }
        } catch (error) {
          console.error('Error loading uploads:', error);
        }
      }
    };

    loadUploads();
  }, [user?.id]);

  const [pendingTasks, setPendingTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Visita a Carrefour Express - Auditoría de estante",
      description: "Revisar cuota de estante y colocación de productos",
      category: "visita",
      dueDate: new Date(2025, 0, 17, 14, 0),
      assignee: "Agente 1",
      priority: "urgent",
      status: "pending",
      estimatedHours: 2,
      createdAt: new Date(2025, 0, 17, 9, 30),
      completed: false,
    },
    {
      id: "2",
      title: "Revisar informes de cuota de estante",
      description: "Analizar datos de rendimiento de las visitas de la semana pasada",
      category: "reporte",
      dueDate: new Date(2025, 0, 17, 10, 15),
      assignee: "Agente 2",
      priority: "medium",
      status: "pending",
      estimatedHours: 1.5,
      createdAt: new Date(2025, 0, 17, 10, 15),
      completed: false,
    },
    {
      id: "3",
      title: "Visita a Mercadona - Verificación de inventario",
      description: "Contar productos en estante y verificar disponibilidad",
      category: "visita",
      dueDate: new Date(2025, 0, 18, 10, 30),
      assignee: "Agente 3",
      priority: "high",
      status: "pending",
      estimatedHours: 2.5,
      createdAt: new Date(2025, 0, 17, 11, 0),
      completed: false,
    },
    {
      id: "4",
      title: "Visita a Día Market - Colocación de productos",
      description: "Reorganizar estante y colocar nuevos productos",
      category: "visita",
      dueDate: new Date(2025, 0, 19, 16, 0),
      assignee: "Agente 1",
      priority: "medium",
      status: "pending",
      estimatedHours: 3,
      createdAt: new Date(2025, 0, 17, 12, 0),
      completed: false,
    },
  ])

  const [completedTasks, setCompletedTasks] = useState<Task[]>([
    {
      id: "5",
      title: "Completar informe de visita a Carrefour",
      description: "Finalizar documentación para la visita a Carrefour",
      category: "visita",
      dueDate: new Date(2025, 0, 16, 14, 30),
      assignee: "Agente 1",
      priority: "medium",
      status: "completed",
      estimatedHours: 1,
      createdAt: new Date(2025, 0, 16, 14, 30),
      completed: true,
    },
  ])

  // Function to get upcoming visits from tasks
  const getUpcomingVisits = () => {
    // Use real visit tasks from database
    if (visitTasks.length === 0) {
      return [];
    }
    
    return visitTasks.map((task: any) => ({
      id: task.id.toString(),
      store: task.title,
      location: task.assigned_to_name || `Usuario ${task.assigned_to}`,
      date: task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      }) : 'Sin fecha',
      time: task.due_date ? new Date(task.due_date).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }) : '',
      status: task.status === 'pending' ? 'pending' : 'confirmed',
      type: task.description || 'Visita',
      priority: task.priority,
      dueDate: task.due_date ? new Date(task.due_date) : new Date()
    })).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  };



  const [performanceMetrics, setPerformanceMetrics] = useState({
    shelfShare: 87.5,
    visitCompletion: 94.2,
    photoUploads: 0,
    averageRating: 4.8,
  })

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", user?.id?.toString() || "");

      try {
        setIsAnalyzing(true);
        const res = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const compressionRatio = ((1 - res.data.size / res.data.originalSize) * 100).toFixed(1);
        
        if (res.data.aiAnalysisTriggered) {
          showToast({
            type: 'success',
            title: '¡Imagen subida exitosamente!',
            message: `Análisis de IA iniciado. Los resultados aparecerán en unos segundos.`,
            duration: 4000
          });
          
          // Show analysis progress toast
          setTimeout(() => {
            showToast({
              type: 'info',
              title: 'Analizando imagen...',
              message: 'La IA está procesando los productos detectados',
              duration: 3000
            });
          }, 1000);
        } else {
          showToast({
            type: 'success',
            title: '¡Imagen subida exitosamente!',
            message: `Tamaño: ${(res.data.size / 1024 / 1024).toFixed(2)}MB (${compressionRatio}% comprimido)`,
            duration: 4000
          });
        }

        const newImage: UploadedImage = {
          id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
          url: res.data.url,
          filename: res.data.filename,
          uploadedAt: new Date(),
          size: res.data.size,
          originalSize: res.data.originalSize
        };
        setUploadedImages(prev => [newImage, ...prev.slice(0, 7)]);
        
        // Update performance metrics with new upload count
        setPerformanceMetrics(prev => ({
          ...prev,
          photoUploads: prev.photoUploads + 1
        }));

        // Trigger refresh of productos detectados after a delay to allow AI analysis to complete
        setTimeout(() => {
          setProductosRefreshTrigger(prev => prev + 1);
          
          // Show completion toast
          showToast({
            type: 'success',
            title: 'Análisis completado',
            message: 'Los productos detectados están listos para revisar',
            duration: 4000
          });
        }, 5000); // Wait 5 seconds for AI analysis to complete
      } catch (error: any) {
        console.error("Upload error:", error);
        const errorMessage = error.response?.data?.error || "Error desconocido";
        showToast({
          type: 'error',
          title: 'Error al subir imagen',
          message: errorMessage,
          duration: 5000
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
    event.target.value = '';
  };

  const handleVisitClick = (visit: any) => {
    setSelectedVisit(visit);
  };

  const handleViewAnalysis = async (imageUrl: string, filename: string) => {
    try {
      // Extract fotoId from the imageUrl or find it in uploadedImages
      const image = uploadedImages.find(img => img.url === imageUrl);
      if (image && image.id) {
        const response = await fetch(`/api/ai-analysis?fotoId=${image.id}`);
        if (response.ok) {
          const data = await response.json();
          setSelectedImageForAnalysis({ 
            url: imageUrl, 
            filename,
            productos: data.products || []
          });
        } else {
          setSelectedImageForAnalysis({ 
            url: imageUrl, 
            filename,
            productos: []
          });
        }
      } else {
        setSelectedImageForAnalysis({ 
          url: imageUrl, 
          filename,
          productos: []
        });
      }
      setAnalysisModalOpen(true);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setSelectedImageForAnalysis({ 
        url: imageUrl, 
        filename,
        productos: []
      });
      setAnalysisModalOpen(true);
    }
  };

  const handleDeleteImage = async (imageId: string, imageUrl: string, filename: string) => {
    // Disable the button to prevent multiple clicks
    const deleteButton = document.querySelector(`[data-image-id="${imageId}"]`) as HTMLButtonElement;
    if (deleteButton) {
      deleteButton.disabled = true;
      deleteButton.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>';
    }

    try {
      const response = await fetch(`/api/upload?imageId=${imageId}&userId=${user.id}&userRole=${user.role}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove from local state
        setUploadedImages(prev => prev.filter(img => img.id !== imageId));
        
        // Refresh productos detectados
        setProductosRefreshTrigger(prev => prev + 1);
        
        showToast({
          type: 'success',
          title: 'Imagen eliminada',
          message: `"${filename}" ha sido eliminada exitosamente`,
          duration: 4000
        });
      } else {
        const errorData = await response.json();
        showToast({
          type: 'error',
          title: 'Error al eliminar',
          message: errorData.error || 'Error desconocido',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      showToast({
        type: 'error',
        title: 'Error al eliminar',
        message: 'Por favor, inténtalo de nuevo',
        duration: 5000
      });
    } finally {
      // Re-enable the button
      if (deleteButton) {
        deleteButton.disabled = false;
        deleteButton.innerHTML = '<Trash2 className="h-4 w-4" />';
      }
    }
  };

  const handleAddTask = () => {
    setTaskModalMode("add");
    setSelectedTask(null);
    setTaskModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskModalMode("view");
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskModalMode("edit");
    setTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setPendingTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, isDeleting: true } : task
    ));
    
    setTimeout(() => {
      setPendingTasks(prev => prev.filter(task => task.id !== taskId));
    }, 300);
  };

  const handleToggleTask = (taskId: string) => {
    setPendingTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleSaveTask = (taskData: Omit<Task, "id">) => {
    if (taskModalMode === "add") {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        category: taskData.category || 'visita', // Default to 'visita' if not specified
        createdAt: new Date(),
        completed: false,
      };
      setPendingTasks(prev => [newTask, ...prev]);
    } else if (taskModalMode === "edit" && selectedTask) {
      setPendingTasks(prev => prev.map(task => 
        task.id === selectedTask.id ? { ...task, ...taskData } : task
      ));
    }
    setTaskModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

    return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Buenas Tardes, {user?.first_name || "Usuario"}
                </h1>
                <p className="text-gray-600">Aquí está lo que está sucediendo con tu análisis de retail hoy.</p>
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
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* KPI Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Resumen de Rendimiento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{performanceMetrics.shelfShare}%</div>
                      <div className="text-sm text-gray-600">Cuota de Estante</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{performanceMetrics.visitCompletion}%</div>
                      <div className="text-sm text-gray-600">Completitud de Visitas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{performanceMetrics.photoUploads}</div>
                      <div className="text-sm text-gray-600">Fotos Subidas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{performanceMetrics.averageRating}</div>
                      <div className="text-sm text-gray-600">Calificación Promedio</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tasks Section */}
              {/* Role-based Task Management */}
              {(() => {
                
                return null;
              })()}
              {user?.role === 'manager' || user?.role === 'admin' ? (
                <>
                  <TaskAssignmentPanel 
                    currentUser={user} 
                    onTaskCreated={(task) => {
                      // Refresh tasks or show notification
              
                    }} 
                  />
                  
                  {/* Team Management Section */}
                  <TeamManagement currentUser={user} />
                </>
              ) : (
                <AgentTaskView currentUser={user} />
              )}

              {/* Photos to Review */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="h-5 w-5" />
                    <span>Fotos para Revisar</span>
                    {uploadCount !== null && <Badge variant="secondary">{uploadCount}</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.slice(0, 8).map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200 group-hover:border-blue-300 transition-colors"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={() => handleViewAnalysis(image.url, image.filename)}
                            title="Ver análisis de IA"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {/* Delete button - only visible to admins and managers */}
                          {(user?.role === 'admin' || user?.role === 'manager') && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => handleDeleteImage(image.id, image.url, image.filename)}
                              title="Eliminar imagen"
                              data-image-id={image.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">




              {/* Upcoming Visits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Próximas Visitas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getUpcomingVisits().length > 0 ? (
                      getUpcomingVisits().map((visit: any) => (
                        <div
                          key={visit.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                          onClick={() => handleVisitClick(visit)}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{visit.store}</div>
                            <div className="text-sm text-gray-600 flex items-center space-x-2">
                              <MapPin className="h-3 w-3" />
                              <span>{visit.location}</span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center space-x-2">
                              <Clock className="h-3 w-3" />
                              <span>{visit.date} a las {visit.time}</span>
                            </div>
                            {visit.priority === 'urgent' && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                Urgente
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={visit.status === "confirmed" ? "default" : "secondary"}
                            >
                              {visit.status === "confirmed" ? "Confirmada" : "Pendiente"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-lg font-medium">No tienes visitas programadas</p>
                        <p className="text-sm">Las tareas de tipo "visita" aparecerán aquí automáticamente</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <Suspense fallback={<ModalLoader />}>
        {selectedVisit && (
          <VisitModal
            isOpen={!!selectedVisit}
            visit={selectedVisit}
            onClose={() => setSelectedVisit(null)}
          />
        )}
      </Suspense>

      <Suspense fallback={<ModalLoader />}>
        {taskModalOpen && (
          <TaskModal
            isOpen={taskModalOpen}
            task={selectedTask}
            onClose={() => setTaskModalOpen(false)}
            onCreate={handleSaveTask}
            onUpdate={handleSaveTask}
            onDelete={handleDeleteTask}
          />
        )}
      </Suspense>

      {/* Analysis Modal */}
      {analysisModalOpen && selectedImageForAnalysis && (
        <AnalysisModal
          isOpen={analysisModalOpen}
          onClose={() => setAnalysisModalOpen(false)}
          imageUrl={selectedImageForAnalysis.url}
          filename={selectedImageForAnalysis.filename}
          productos={selectedImageForAnalysis.productos}
        />
      )}
    </div>
  )
}
