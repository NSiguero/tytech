"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Trash2, Save, Plus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

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

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  onCreate: (taskData: Omit<Task, "id">) => void
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
  selectedDate?: Date | null
}

export function TaskModal({
  isOpen,
  onClose,
  task,
  onCreate,
  onUpdate,
  onDelete,
  selectedDate
}: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: selectedDate || new Date(),
    assignee: "",
    priority: "medium" as const,
    status: "pending" as const,
    estimatedHours: ""
  })

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate,
        assignee: task.assignee,
        priority: task.priority,
        status: task.status,
        estimatedHours: task.estimatedHours?.toString() || ""
      })
      setIsEditing(true)
    } else {
      setFormData({
        title: "",
        description: "",
        dueDate: selectedDate || new Date(),
        assignee: "",
        priority: "medium",
        status: "pending",
        estimatedHours: ""
      })
      setIsEditing(false)
    }
  }, [task, selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      dueDate: formData.dueDate,
      assignee: formData.assignee.trim(),
      priority: formData.priority,
      status: formData.status,
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined
    }

    if (isEditing && task) {
      onUpdate({ ...task, ...taskData })
    } else {
      onCreate(taskData)
    }
    
    onClose()
  }

  const handleDelete = () => {
    if (task) {
      onDelete(task.id)
      onClose()
    }
  }

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800"
  }

  const statusColors = {
    pending: "bg-gray-100 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? "Editar Tarea" : "Crear Nueva Tarea"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Título de la Tarea *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Descripción breve de la tarea"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción detallada de la tarea..."
              rows={3}
            />
          </div>

          {/* Due Date and Assignee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Fecha de Vencimiento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? (
                      format(formData.dueDate, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => date && setFormData({ ...formData, dueDate: date })}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="assignee">Asignado a</Label>
              <Input
                id="assignee"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                placeholder="Nombre del responsable"
              />
            </div>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high" | "urgent") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "pending" | "in-progress" | "completed") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in-progress">En Progreso</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estimated Hours */}
          <div>
            <Label htmlFor="estimatedHours">Horas Estimadas</Label>
            <Input
              id="estimatedHours"
              type="number"
              step="0.5"
              min="0"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
              placeholder="0.5"
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Vista Previa</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Título:</span>
                <span>{formData.title || "Sin título"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Fecha:</span>
                <span>{formData.dueDate ? format(formData.dueDate, "PPP", { locale: es }) : "No seleccionada"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Asignado:</span>
                <span>{formData.assignee || "No asignado"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Prioridad:</span>
                <span className={cn("px-2 py-1 rounded-full text-xs", priorityColors[formData.priority])}>
                  {formData.priority === "low" && "Baja"}
                  {formData.priority === "medium" && "Media"}
                  {formData.priority === "high" && "Alta"}
                  {formData.priority === "urgent" && "Urgente"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Estado:</span>
                <span className={cn("px-2 py-1 rounded-full text-xs", statusColors[formData.status])}>
                  {formData.status === "pending" && "Pendiente"}
                  {formData.status === "in-progress" && "En Progreso"}
                  {formData.status === "completed" && "Completada"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Actualizar Tarea
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Tarea
                </>
              )}
            </Button>

            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="px-6"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            )}

            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
