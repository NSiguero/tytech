"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Clock, User, Tag, FileText, AlertTriangle, CheckCircle, XCircle, PlayCircle, Camera, MessageSquare, Upload } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Task } from "@/lib/tasks"

interface TaskComment {
  id: string
  user_id: number
  user_name: string
  comment: string
  created_at: Date
}

interface TaskDetailModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
}

export function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete
}: TaskDetailModalProps) {
  const [newComment, setNewComment] = useState('')
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    if (task && isOpen) {
      // Reset state when task changes
      setNewComment('')
      setUploadedPhotos([])
      setActiveTab('details')
    }
  }, [task, isOpen])

  if (!task) return null

  const getPriorityColor = (priority: string) => {
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

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "in_progress":
        return <PlayCircle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === "urgent") {
      return <AlertTriangle className="w-4 h-4" />
    }
    return null
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      // Simulate photo upload - in real app, this would upload to server
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file))
      setUploadedPhotos(prev => [...prev, ...newPhotos])
      toast.success(`${files.length} foto(s) subida(s) correctamente`)
    } catch (error) {
      toast.error('Error al subir las fotos')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index))
    toast.success('Foto eliminada')
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      // In real app, this would send to API
      toast.success('Comentario añadido correctamente')
      setNewComment('')
    } catch (error) {
      toast.error('Error al añadir comentario')
    }
  }

  const handleStartTask = () => {
    if (task.status === 'pending') {
      toast.success('Tarea iniciada correctamente')
    }
  }

  const handleCompleteTask = () => {
    if (task.status === 'in_progress') {
      toast.success('Tarea completada correctamente')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Detalles de la Tarea
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="photos">Fotos</TabsTrigger>
            <TabsTrigger value="comments">Comentarios</TabsTrigger>
            <TabsTrigger value="actions">Acciones</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            {/* Task Header */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
                {task.description && (
                  <p className="text-gray-600 mt-2">{task.description}</p>
                )}
              </div>

              {/* Status and Priority Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={cn("flex items-center gap-1", getStatusColor(task.status))}>
                  {getStatusIcon(task.status)}
                  {task.status === "pending" && "Pendiente"}
                  {task.status === "in_progress" && "En Progreso"}
                  {task.status === "completed" && "Completada"}
                  {task.status === "cancelled" && "Cancelada"}
                </Badge>
                <Badge className={cn("flex items-center gap-1", getPriorityColor(task.priority))}>
                  {getPriorityIcon(task.priority)}
                  {task.priority === "low" && "Baja"}
                  {task.priority === "medium" && "Media"}
                  {task.priority === "high" && "Alta"}
                  {task.priority === "urgent" && "Urgente"}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {task.category === "visita" ? "Visita" : "Reporte"}
                </Badge>
              </div>
            </div>

            {/* Task Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Due Date */}
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Fecha de Vencimiento</p>
                  <p className="text-sm text-gray-600">
                    {task.due_date ? format(new Date(task.due_date), "PPP", { locale: es }) : "No especificada"}
                  </p>
                </div>
              </div>

              {/* Estimated Hours */}
              {task.estimated_hours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Horas Estimadas</p>
                    <p className="text-sm text-gray-600">{task.estimated_hours} horas</p>
                  </div>
                </div>
              )}

              {/* Assigned To */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Asignado a</p>
                  <p className="text-sm text-gray-600">{task.assigned_to_name || "No especificado"}</p>
                </div>
              </div>

              {/* Assigned By */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Asignado por</p>
                  <p className="text-sm text-gray-600">{task.assigned_by_name || "No especificado"}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-700">Etiquetas</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-700">Archivos Adjuntos</p>
                </div>
                <div className="space-y-2">
                  {task.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Fotos de la Tarea</h3>
              
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="photo-upload"
                  className={`cursor-pointer ${isUploading ? "cursor-not-allowed" : ""}`}
                >
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    {isUploading ? "Subiendo..." : "Arrastra fotos aquí o haz clic para seleccionar"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG hasta 10MB
                  </p>
                </label>
              </div>

              {/* Uploaded Photos */}
              {uploadedPhotos.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Fotos Subidas ({uploadedPhotos.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Comentarios</h3>
              
              {/* Existing Comments */}
              {task.comments && task.comments.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {task.comments.map((comment, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-700">{comment.user_name}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(comment.created_at), "dd/MM/yyyy HH:mm", { locale: es })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No hay comentarios aún</p>
                </div>
              )}

              {/* Add New Comment */}
              <div className="space-y-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Añadir un comentario..."
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Añadir Comentario
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones de la Tarea</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Task Status Actions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Estado de la Tarea</h4>
                  
                  {task.status === 'pending' && (
                    <Button
                      onClick={handleStartTask}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Iniciar Tarea
                    </Button>
                  )}

                  {task.status === 'in_progress' && (
                    <Button
                      onClick={handleCompleteTask}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completar Tarea
                    </Button>
                  )}

                  <div className="text-sm text-gray-600">
                    <p><strong>Estado actual:</strong> {task.status}</p>
                    <p><strong>Prioridad:</strong> {task.priority}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Acciones Rápidas</h4>
                  
                  <Button
                    variant="outline"
                    onClick={() => onEdit(task)}
                    className="w-full"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Editar Tarea
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('photos')}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Subir Fotos
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('comments')}
                    className="w-full"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ver Comentarios
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
