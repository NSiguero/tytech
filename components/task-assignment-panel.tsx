import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Users, Clock, Tag, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
  start_date?: Date;
  due_date?: Date;
  created_at: Date;
  tags?: string[];
  cadena_supermercado?: string;
  area?: string;
}

interface TaskAssignmentPanelProps {
  currentUser: User;
  onTaskCreated: (task: Task) => void;
}

export function TaskAssignmentPanel({ currentUser, onTaskCreated }: TaskAssignmentPanelProps) {
  const { showToast } = useToast();
  
  const [agents, setAgents] = useState<User[]>([]);
  const [cadenas, setCadenas] = useState<{id: number, nombre: string}[]>([]);
  const [areas, setAreas] = useState<{id: number, nombre: string}[]>([]);
  const [supermercados, setSupermercados] = useState<{id: number, rotulo: string, codigo: string, direccion: string}[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [isLoadingCadenas, setIsLoadingCadenas] = useState(false);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [isLoadingSupermercados, setIsLoadingSupermercados] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'visita' as 'visita' | 'reporte',
    priority: 'medium' as const,
    assigned_to: '',
    start_date: undefined as Date | undefined,
    due_date: undefined as Date | undefined,
    estimated_hours: '',
    tags: [] as string[],
    cadena_supermercado: '',
    area: '',
    supermercado_id: ''
  });

  // Pre-load team members, cadenas and areas immediately when component mounts
  useEffect(() => {
    if (currentUser.role === 'manager' || currentUser.role === 'admin') {
      fetchTeamMembers();
      fetchCadenas();
      fetchAreas();
    }
  }, [currentUser.role]);

  // Fetch supermarkets when cadena or area changes
  useEffect(() => {
    if (formData.cadena_supermercado || formData.area) {
      fetchSupermercados(formData.cadena_supermercado, formData.area);
      // Reset supermercado selection when filters change
      setFormData(prev => ({ ...prev, supermercado_id: '' }));
    } else {
      setSupermercados([]);
      setFormData(prev => ({ ...prev, supermercado_id: '' }));
    }
  }, [formData.cadena_supermercado, formData.area]);

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

  const fetchCadenas = async () => {
    setIsLoadingCadenas(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/supermercados/cadenas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.cadenas && Array.isArray(data.cadenas)) {
          setCadenas(data.cadenas);
        }
      } else {
        console.error('Error fetching cadenas:', response.status);
        setCadenas([]);
      }
    } catch (error) {
      console.error('Error fetching cadenas:', error);
      setCadenas([]);
    } finally {
      setIsLoadingCadenas(false);
    }
  };

  const fetchAreas = async () => {
    setIsLoadingAreas(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/supermercados/areas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.areas && Array.isArray(data.areas)) {
          setAreas(data.areas);
        }
      } else {
        console.error('Error fetching areas:', response.status);
        setAreas([]);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    } finally {
      setIsLoadingAreas(false);
    }
  };

  const fetchSupermercados = async (cadena?: string, area?: string) => {
    setIsLoadingSupermercados(true);
    try {
      const token = localStorage.getItem('token');
      
      let url = '/api/supermercados';
      const params = new URLSearchParams();
      if (cadena) params.append('cadena', cadena);
      if (area) params.append('area', area);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.supermercados && Array.isArray(data.supermercados)) {
          setSupermercados(data.supermercados);
        }
      } else {
        console.error('Error fetching supermercados:', response.status);
        setSupermercados([]);
      }
    } catch (error) {
      console.error('Error fetching supermercados:', error);
      setSupermercados([]);
    } finally {
      setIsLoadingSupermercados(false);
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
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : undefined,
        cadena_supermercado: formData.cadena_supermercado || null,
        area: formData.area || null,
        supermercado_id: formData.supermercado_id ? parseInt(formData.supermercado_id) : null
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
           start_date: undefined,
           due_date: undefined,
           estimated_hours: '',
           tags: [],
           cadena_supermercado: '',
           area: '',
           supermercado_id: ''
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
    <Card className="w-full shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
          Panel de Asignación de Tareas
        </CardTitle>
        <p className="text-sm text-gray-600">
          Crea y asigna tareas a tu equipo de forma eficiente
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {!isCreating ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Listo para asignar una nueva tarea?</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Crea tareas específicas para tu equipo y mantén el control total sobre las operaciones de retail.
            </p>
            <Button 
              onClick={() => setIsCreating(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg shadow-sm transition-all hover:shadow-md"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Crear Nueva Tarea
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header del formulario */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Nueva Tarea</h3>
                <p className="text-sm text-gray-600">Completa los detalles para crear la tarea</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título de la Tarea *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Visita a Carrefour - Auditoría de estante"
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoría *
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value: 'visita' | 'reporte') => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visita">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Visita
                      </div>
                    </SelectItem>
                    <SelectItem value="reporte">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Reporte
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prioridad
                </label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        Baja
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        Media
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        Alta
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Urgente
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe los objetivos y detalles específicos de la tarea..."
                rows={3}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Asignar a *
                </label>
                <Select
                  value={formData.assigned_to}
                  onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                >
                  <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder={isLoadingAgents ? "Cargando agentes..." : "Seleccionar agente"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingAgents ? (
                      <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-sm text-gray-600">Cargando agentes...</span>
                      </div>
                    ) : (agents || []).length === 0 ? (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No hay agentes disponibles en tu equipo</p>
                      </div>
                    ) : (
                      (agents || []).map((agent) => (
                        <SelectItem key={agent.id} value={agent.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {agent.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{agent.name}</p>
                              <p className="text-xs text-gray-500">{agent.role}</p>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {formData.category === 'visita' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Horas Estimadas
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.estimated_hours}
                    onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                    placeholder="2.5"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Cadena de Supermercado</label>
                <Select
                  value={formData.cadena_supermercado}
                  onValueChange={(value) => setFormData({ ...formData, cadena_supermercado: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingCadenas ? "Cargando cadenas..." : "Seleccionar cadena"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCadenas ? (
                      <div className="flex items-center justify-center p-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        <span className="ml-2 text-sm text-gray-500">Cargando cadenas...</span>
                      </div>
                    ) : (cadenas || []).length === 0 ? (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        No hay cadenas disponibles
                      </div>
                    ) : (
                      (cadenas || []).map((cadena) => (
                        <SelectItem key={cadena.id} value={cadena.nombre}>
                          {cadena.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Área</label>
                <Select
                  value={formData.area}
                  onValueChange={(value) => setFormData({ ...formData, area: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingAreas ? "Cargando áreas..." : "Seleccionar área"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingAreas ? (
                      <div className="flex items-center justify-center p-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        <span className="ml-2 text-sm text-gray-500">Cargando áreas...</span>
                      </div>
                    ) : (areas || []).length === 0 ? (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        No hay áreas disponibles
                      </div>
                    ) : (
                      (areas || []).map((area) => (
                        <SelectItem key={area.id} value={area.nombre}>
                          {area.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(formData.cadena_supermercado || formData.area) && (
              <div>
                <label className="text-sm font-medium">Supermercado Específico</label>
                <Select
                  value={formData.supermercado_id}
                  onValueChange={(value) => setFormData({ ...formData, supermercado_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingSupermercados ? "Cargando supermercados..." : "Seleccionar supermercado (opcional)"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingSupermercados ? (
                      <div className="flex items-center justify-center p-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        <span className="ml-2 text-sm text-gray-500">Cargando supermercados...</span>
                      </div>
                    ) : (supermercados || []).length === 0 ? (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        No hay supermercados disponibles para los filtros seleccionados
                      </div>
                    ) : (
                      (supermercados || []).map((supermercado) => (
                        <SelectItem key={supermercado.id} value={supermercado.id.toString()}>
                          {supermercado.rotulo} - {supermercado.direccion}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Fecha de Inicio</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? format(formData.start_date, 'PPP', { locale: es }) : 'Seleccionar fecha de inicio'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.start_date}
                      onSelect={(date) => setFormData({ ...formData, start_date: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium">Fecha de Fin</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.due_date ? format(formData.due_date, 'PPP', { locale: es }) : 'Seleccionar fecha de fin'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.due_date}
                      onSelect={(date) => setFormData({ ...formData, due_date: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {formData.category === 'visita' && (
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
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
              <Button 
                onClick={handleCreateTask} 
                disabled={!formData.title || !formData.assigned_to || !formData.category}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-11 font-medium shadow-sm hover:shadow-md transition-all"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Crear Tarea
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCreating(false)}
                className="flex-1 sm:flex-none bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-11 px-8"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 