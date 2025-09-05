import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Calendar,
  Tag,
  Eye,
  TrendingUp,
  TrendingDown,
  Filter,
  X
} from 'lucide-react';
import { format } from 'date-fns';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  is_team_manager: boolean;
}

interface TaskComment {
  id: string;
  user_id: number;
  user_name: string;
  comment: string;
  created_at: Date;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_by: number;
  assigned_to: number;
  assigned_by_name: string;
  assigned_to_name: string;
  due_date?: Date;
  created_at: Date;
  completed_at?: Date;
  estimated_hours?: number;
  actual_hours?: number;
  tags?: string[];
  comments?: TaskComment[];
  cadena_supermercado?: string;
  area?: string;
  supermercado_id?: number;
}

interface TeamManagementProps {
  currentUser: {
    id: number;
    name: string;
    role: string;
    email: string;
  };
}

export function TeamManagement({ currentUser }: TeamManagementProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [memberTasks, setMemberTasks] = useState<{ [key: number]: Task[] }>({});
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    area: 'all',
    cadena: 'all',
    supermercado: 'all',
    agente: 'all'
  });
  
  // Data for filter options
  const [areas, setAreas] = useState<{id: number, nombre: string}[]>([]);
  const [cadenas, setCadenas] = useState<{id: number, nombre: string}[]>([]);
  const [supermercados, setSupermercados] = useState<{id: number, rotulo: string, codigo: string, direccion: string}[]>([]);

  useEffect(() => {
    fetchTeamMembers();
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch areas
      const areasResponse = await fetch('/api/supermercados/areas', { headers });
      if (areasResponse.ok) {
        const areasData = await areasResponse.json();
        setAreas(areasData.areas || []);
      }

      // Fetch cadenas
      const cadenasResponse = await fetch('/api/supermercados/cadenas', { headers });
      if (cadenasResponse.ok) {
        const cadenasData = await cadenasResponse.json();
        setCadenas(cadenasData.cadenas || []);
      }

      // Fetch supermercados
      const supermercadosResponse = await fetch('/api/supermercados', { headers });
      if (supermercadosResponse.ok) {
        const supermercadosData = await supermercadosResponse.json();
        setSupermercados(supermercadosData.supermercados || []);
      }
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks/team-members?includeAll=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.members) {
        setTeamMembers(data.members);
        // Fetch tasks for each team member
        await Promise.all(data.members.map((member: TeamMember) => fetchMemberTasks(member.id)));
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMemberTasks = async (memberId: number) => {
    try {
      const response = await fetch(`/api/tasks?userId=${memberId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMemberTasks(prev => ({
        ...prev,
        [memberId]: data.tasks || []
      }));
    } catch (error) {
      console.error(`Error fetching tasks for member ${memberId}:`, error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getMemberStats = (memberId: number) => {
    const tasks = getFilteredTasks(memberTasks[memberId] || []);
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => 
        t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
      ).length
    };
  };

  const getTeamStats = () => {
    const allTasks = getFilteredTasks(Object.values(memberTasks).flat());
    return {
      total: allTasks.length,
      pending: allTasks.filter(t => t.status === 'pending').length,
      inProgress: allTasks.filter(t => t.status === 'in_progress').length,
      completed: allTasks.filter(t => t.status === 'completed').length,
      overdue: allTasks.filter(t => 
        t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
      ).length
    };
  };

  // Filter tasks based on selected filters
  const getFilteredTasks = (tasks: Task[]) => {
    return tasks.filter(task => {
      // Filter by area
      if (filters.area && filters.area !== 'all' && task.area !== filters.area) return false;
      
      // Filter by cadena (cliente)
      if (filters.cadena && filters.cadena !== 'all' && task.cadena_supermercado !== filters.cadena) return false;
      
      // Filter by supermercado
      if (filters.supermercado && filters.supermercado !== 'all' && task.supermercado_id?.toString() !== filters.supermercado) return false;
      
      // Filter by agente (assigned_to)
      if (filters.agente && filters.agente !== 'all' && task.assigned_to.toString() !== filters.agente) return false;
      
      return true;
    });
  };

  // Get available filter options based on existing tasks
  const getAvailableFilterOptions = () => {
    const allTasks = Object.values(memberTasks).flat();
    
    // Apply partial filters to get remaining options
    const getPartiallyFilteredTasks = (excludeFilter: string) => {
      return allTasks.filter(task => {
        if (excludeFilter !== 'area' && filters.area && filters.area !== 'all' && task.area !== filters.area) return false;
        if (excludeFilter !== 'cadena' && filters.cadena && filters.cadena !== 'all' && task.cadena_supermercado !== filters.cadena) return false;
        if (excludeFilter !== 'supermercado' && filters.supermercado && filters.supermercado !== 'all' && task.supermercado_id?.toString() !== filters.supermercado) return false;
        if (excludeFilter !== 'agente' && filters.agente && filters.agente !== 'all' && task.assigned_to.toString() !== filters.agente) return false;
        return true;
      });
    };

    return {
      availableAreas: [...new Set(getPartiallyFilteredTasks('area').map(t => t.area).filter(Boolean))],
      availableCadenas: [...new Set(getPartiallyFilteredTasks('cadena').map(t => t.cadena_supermercado).filter(Boolean))],
      availableSupermercados: [...new Set(getPartiallyFilteredTasks('supermercado').map(t => t.supermercado_id).filter(Boolean))],
      availableAgentes: [...new Set(getPartiallyFilteredTasks('agente').map(t => t.assigned_to))]
    };
  };

  const availableOptions = getAvailableFilterOptions();
  const teamStats = getTeamStats();

  // Function to clear all filters
  const clearFilters = () => {
    setFilters({
      area: 'all',
      cadena: 'all',
      supermercado: 'all',
      agente: 'all'
    });
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(filter => filter !== '' && filter !== 'all');

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Resumen del Equipo
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Gestiona y monitorea las tareas y rendimiento de tu equipo
          </p>
        </CardHeader>
        <CardContent>
          {/* Filters Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros de Tareas
              </h3>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filter by Area */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Área ({availableOptions.availableAreas.length})
                </label>
                <Select
                  value={filters.area}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, area: value }))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Todas las áreas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las áreas</SelectItem>
                    {areas.filter(area => availableOptions.availableAreas.includes(area.nombre)).map((area) => (
                      <SelectItem key={area.id} value={area.nombre}>
                        {area.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Cadena (Cliente) */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Cliente ({availableOptions.availableCadenas.length})
                </label>
                <Select
                  value={filters.cadena}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, cadena: value }))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Todas las cadenas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las cadenas</SelectItem>
                    {cadenas.filter(cadena => availableOptions.availableCadenas.includes(cadena.nombre)).map((cadena) => (
                      <SelectItem key={cadena.id} value={cadena.nombre}>
                        {cadena.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Supermercado */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Supermercado ({availableOptions.availableSupermercados.length})
                </label>
                <Select
                  value={filters.supermercado}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, supermercado: value }))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Todos los supermercados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los supermercados</SelectItem>
                    {supermercados.filter(super_ => availableOptions.availableSupermercados.includes(super_.id)).map((super_) => (
                      <SelectItem key={super_.id} value={super_.id.toString()}>
                        {super_.rotulo} - {super_.direccion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Agente */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Agente ({availableOptions.availableAgentes.length})
                </label>
                <Select
                  value={filters.agente}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, agente: value }))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Todos los agentes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los agentes</SelectItem>
                    {teamMembers.filter(member => availableOptions.availableAgentes.includes(member.id)).map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filters indicator */}
            {hasActiveFilters && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {filters.area && filters.area !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Área: {filters.area}
                    </Badge>
                  )}
                  {filters.cadena && filters.cadena !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Cliente: {filters.cadena}
                    </Badge>
                  )}
                  {filters.supermercado && filters.supermercado !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Supermercado: {supermercados.find(s => s.id.toString() === filters.supermercado)?.rotulo}
                    </Badge>
                  )}
                  {filters.agente && filters.agente !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Agente: {teamMembers.find(m => m.id.toString() === filters.agente)?.name}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{teamStats.total}</div>
              <div className="text-sm text-muted-foreground">Total Tareas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{teamStats.pending}</div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{teamStats.inProgress}</div>
              <div className="text-sm text-muted-foreground">En Progreso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{teamStats.completed}</div>
              <div className="text-sm text-muted-foreground">Completadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{teamStats.overdue}</div>
              <div className="text-sm text-muted-foreground">Vencidas</div>
            </div>
          </div>

          <Tabs defaultValue="members" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="members">Miembros del Equipo</TabsTrigger>
              <TabsTrigger value="tasks">
                Todas las Tareas ({getFilteredTasks(Object.values(memberTasks).flat()).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {teamMembers.map((member) => {
                    const stats = getMemberStats(member.id);
                    return (
                      <Card key={member.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{member.name}</h3>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline">{member.role}</Badge>
                                  {member.is_team_manager && (
                                    <Badge variant="secondary">Gerente del Equipo</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedMember(member)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Tareas
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>Tareas de {member.name}</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[60vh]">
                                  <div className="space-y-4">
                                    {getFilteredTasks(memberTasks[member.id] || []).length === 0 ? (
                                      <p className="text-muted-foreground text-center py-8">
                                        {hasActiveFilters 
                                          ? `No hay tareas que coincidan con los filtros para ${member.name}`
                                          : `No hay tareas asignadas a ${member.name}`
                                        }
                                      </p>
                                    ) : (
                                      getFilteredTasks(memberTasks[member.id] || []).map((task) => (
                                        <Card key={task.id} className="p-4">
                                          <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-semibold">{task.title}</h4>
                                                {getStatusIcon(task.status)}
                                                <Badge className={getStatusColor(task.status)}>
                                                  {task.status.replace('_', ' ')}
                                                </Badge>
                                                <Badge className={getPriorityColor(task.priority)}>
                                                  {task.priority}
                                                </Badge>
                                              </div>
                                              
                                              {task.description && (
                                                <p className="text-sm text-muted-foreground mb-2">
                                                  {task.description}
                                                </p>
                                              )}

                                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                                {task.due_date && (
                                                  <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Vence: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                                                  </span>
                                                )}
                                                {task.estimated_hours && (
                                                  <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Est: {task.estimated_hours}h
                                                  </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                  <MessageSquare className="h-3 w-3" />
                                                  {task.comments?.length || 0} comentarios
                                                </span>
                                              </div>

                                              {/* Additional task info */}
                                              <div className="flex flex-wrap gap-2 text-xs">
                                                {task.area && (
                                                  <Badge variant="outline" className="text-xs">
                                                    📍 {task.area}
                                                  </Badge>
                                                )}
                                                {task.cadena_supermercado && (
                                                  <Badge variant="outline" className="text-xs">
                                                    🏪 {task.cadena_supermercado}
                                                  </Badge>
                                                )}
                                                {task.supermercado_id && (
                                                  <Badge variant="outline" className="text-xs">
                                                    🛒 {supermercados.find(s => s.id === task.supermercado_id)?.rotulo || `Supermercado ${task.supermercado_id}`}
                                                  </Badge>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Comments Section */}
                                          {task.comments && task.comments.length > 0 && (
                                            <div className="mt-4 pt-4 border-t">
                                              <h5 className="font-medium mb-2">Comentarios</h5>
                                              <div className="space-y-2">
                                                {task.comments.map((comment) => (
                                                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="flex items-center justify-between mb-1">
                                                      <span className="font-medium text-sm">{comment.user_name}</span>
                                                      <span className="text-xs text-muted-foreground">
                                                        {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                                                      </span>
                                                    </div>
                                                    <p className="text-sm">{comment.comment}</p>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </Card>
                                      ))
                                    )}
                                  </div>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                          </div>

                          {/* Member Stats */}
                          <div className="grid grid-cols-4 gap-2 text-center">
                            <div>
                              <div className="text-lg font-semibold">{stats.total}</div>
                              <div className="text-xs text-muted-foreground">Total</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-yellow-600">{stats.pending}</div>
                              <div className="text-xs text-muted-foreground">Pendientes</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-blue-600">{stats.inProgress}</div>
                              <div className="text-xs text-muted-foreground">En Progreso</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-green-600">{stats.completed}</div>
                              <div className="text-xs text-muted-foreground">Completadas</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <div className="space-y-4">
                {getFilteredTasks(Object.values(memberTasks).flat()).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {Object.values(memberTasks).flat().length === 0 
                      ? "No se encontraron tareas en tu equipo"
                      : "No hay tareas que coincidan con los filtros seleccionados"
                    }
                  </p>
                ) : (
                  getFilteredTasks(Object.values(memberTasks).flat()).map((task) => (
                    <Card key={task.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{task.title}</h4>
                            {getStatusIcon(task.status)}
                            <Badge className={getStatusColor(task.status)}>
                              {task.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {task.assigned_to_name}
                            </span>
                            {task.due_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Vence: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {task.comments?.length || 0} comentarios
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 