import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  TrendingDown
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

  useEffect(() => {
    fetchTeamMembers();
  }, []);

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
    const tasks = memberTasks[memberId] || [];
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
    const allTasks = Object.values(memberTasks).flat();
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

  const teamStats = getTeamStats();

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
              <TabsTrigger value="tasks">Todas las Tareas</TabsTrigger>
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
                                    {memberTasks[member.id]?.length === 0 ? (
                                      <p className="text-muted-foreground text-center py-8">
                                        No hay tareas asignadas a {member.name}
                                      </p>
                                    ) : (
                                      memberTasks[member.id]?.map((task) => (
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
                {Object.values(memberTasks).flat().length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No se encontraron tareas en tu equipo
                  </p>
                ) : (
                  Object.values(memberTasks).flat().map((task) => (
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