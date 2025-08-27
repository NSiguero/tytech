import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Users, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/toast-notification';

interface User {
  id: number;
  name: string;
  role: 'manager' | 'field_agent' | 'admin';
  email: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  category: 'visita' | 'reporte';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_by: number;
  assigned_to: number;
  assigned_by_name: string;
  assigned_to_name: string;
  due_date?: Date;
  created_at: Date;
  tags?: string[];
}

interface TaskAssignmentPanelProps {
  currentUser: User;
  onTaskCreated: (task: Task) => void;
}

export function TaskAssignmentPanel({ currentUser, onTaskCreated }: TaskAssignmentPanelProps) {
  const { showToast } = useToast();
  
  const [agents, setAgents] = useState<User[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'visita' as 'visita' | 'reporte',
    priority: 'medium' as const,
    assigned_to: '',
    due_date: undefined as Date | undefined,
    estimated_hours: '',
    tags: [] as string[]
  });

  // Pre-load team members immediately when component mounts
  useEffect(() => {
    if (currentUser.role === 'manager' || currentUser.role === 'admin') {
      fetchTeamMembers();
    }
  }, [currentUser.role]);

  const fetchTeamMembers = async () => {
    setIsLoadingAgents(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/tasks/team-members', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
             const data = await response.json();
       if (data.members && Array.isArray(data.members)) {
         setAgents(data.members);
         if (data.members.length > 0) {
           showToast({
             type: 'success',
             title: 'Equipo cargado',
             message: `${data.members.length} agente(s) disponible(s) para asignar tareas.`,
             duration: 3000
           });
         }
       } else {
         console.error('Invalid response format:', data);
         setAgents([]);
       }
     } catch (error) {
       console.error('Error fetching team members:', error);
       setAgents([]);
       showToast({
         type: 'error',
         title: 'Error al cargar equipo',
         message: 'No se pudieron cargar los miembros del equipo.',
         duration: 4000
       });
     } finally {
       setIsLoadingAgents(false);
     }
  };

  const handleCreateTask = async () => {
    if (!formData.title || !formData.assigned_to || !formData.category) {
      return;
    }

    try {
      const requestData = {
        ...formData,
        assigned_to: parseInt(formData.assigned_to),
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : undefined
      };
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
      });

             if (response.ok) {
         const { task } = await response.json();
         onTaskCreated(task);
         

         
         setFormData({
           title: '',
           description: '',
           category: 'visita',
           priority: 'medium',
           assigned_to: '',
           due_date: undefined,
           estimated_hours: '',
           tags: []
         });
         setIsCreating(false);
       } else {
         const errorText = await response.text();
         console.error('API error response:', errorText);
         showToast({
           type: 'error',
           title: 'Error al crear tarea',
           message: `Error ${response.status}: ${errorText}`,
           duration: 5000
         });
       }
     } catch (error: any) {
       console.error('Error creating task:', error);
       showToast({
         type: 'error',
         title: 'Error al crear tarea',
         message: error?.message || 'Error desconocido al crear la tarea',
         duration: 5000
       });
     }
  };

  // Only managers and admins can create tasks
  if (currentUser.role !== 'manager' && currentUser.role !== 'admin') {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Asignación de Tareas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No tienes permisos para asignar tareas. Solo los gerentes pueden crear y asignar tareas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Panel de Asignación de Tareas
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Crea y asigna tareas a agentes
        </p>
      </CardHeader>
      <CardContent>
        {!isCreating ? (
          <Button onClick={() => setIsCreating(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Crear Nueva Tarea
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título de la Tarea *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ingresa el título de la tarea"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Categoría *</label>
              <Select
                value={formData.category}
                onValueChange={(value: 'visita' | 'reporte') => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visita">Visita</SelectItem>
                  <SelectItem value="reporte">Reporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ingresa la descripción de la tarea"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Prioridad</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
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
                <label className="text-sm font-medium">Asignar a *</label>
                <Select
                  value={formData.assigned_to}
                  onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingAgents ? "Cargando agentes..." : "Seleccionar agente"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingAgents ? (
                      <div className="flex items-center justify-center p-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        <span className="ml-2 text-sm text-gray-500">Cargando agentes...</span>
                      </div>
                    ) : (agents || []).length === 0 ? (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        No hay agentes disponibles en tu equipo
                      </div>
                    ) : (
                      (agents || []).map((agent) => (
                        <SelectItem key={agent.id} value={agent.id.toString()}>
                          {agent.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Fecha de Vencimiento</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.due_date ? format(formData.due_date, 'PPP') : 'Seleccionar fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.due_date}
                      onSelect={(date) => setFormData({ ...formData, due_date: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium">Horas Estimadas</label>
                <Input
                  type="number"
                  step="0.5"
                  value={formData.estimated_hours}
                  onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                  placeholder="2.5"
                />
              </div>
            </div>

            <div className="flex gap-2">
                             <Button onClick={handleCreateTask} disabled={!formData.title || !formData.assigned_to || !formData.category}>
                 Crear Tarea
               </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 