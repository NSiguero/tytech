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
import type { Task } from "@/lib/tasks"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  onCreate: (taskData: Omit<Task, "id" | "created_at" | "updated_at" | "assigned_by" | "team_code" | "category" | "status" | "priority">) => void
  onUpdate: (task: Task) => void
  onDelete: (taskId: number) => void
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
    due_date: selectedDate || new Date(),
    estimated_hours: ""
  })

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        due_date: task.due_date ? new Date(task.due_date) : new Date(),
        estimated_hours: task.estimated_hours?.toString() || ""
      })
      setIsEditing(true)
    } else {
      setFormData({
        title: "",
        description: "",
        due_date: selectedDate || new Date(),
        estimated_hours: ""
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
      due_date: formData.due_date,
      estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : undefined
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

          {/* Due Date */}
          <div>
            <Label>Fecha de Vencimiento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.due_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.due_date ? (
                    format(formData.due_date, "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.due_date}
                  onSelect={(date) => date && setFormData({ ...formData, due_date: date })}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Estimated Hours */}
          <div>
            <Label htmlFor="estimatedHours">Horas Estimadas</Label>
            <Input
              id="estimatedHours"
              type="number"
              step="0.5"
              min="0"
              value={formData.estimated_hours}
              onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
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
                <span>{formData.due_date ? format(formData.due_date, "PPP", { locale: es }) : "No seleccionada"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Horas Estimadas:</span>
                <span>{formData.estimated_hours || "No especificadas"}</span>
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
