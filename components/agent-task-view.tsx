import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Edit3, 
  Play,
  Pause,
  StopCircle,
  User,
  Calendar,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: number;
  name: string;
  role: 'manager' | 'field_agent' | 'admin';
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

interface AgentTaskViewProps {
  currentUser: User;
}

export function AgentTaskView({ currentUser }: AgentTaskViewProps) {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [updateData, setUpdateData] = useState({
    status: '',
    actual_hours: ''
  });

  useEffect(() => {

    fetchTasks();
  }, [currentUser.id]);

  const fetchTasks = async () => {
    try {
  
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
              const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleStatusUpdate = async (taskId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchTasks(); // Refresh tasks
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleAddComment = async (taskId: number) => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ comment: newComment })
      });

      if (response.ok) {
        setNewComment('');
        fetchTasks(); // Refresh tasks
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Play className="h-4 w-4 text-blue-600" />;
      case 'cancelled': return <StopCircle className="h-4 w-4 text-red-600" />;
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

  // Only field agents can see this view
  if (currentUser.role !== 'field_agent') {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Mis Tareas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta vista solo está disponible para agentes. Los gerentes pueden asignar tareas desde el panel de asignación.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Mis Tareas Asignadas
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ver y actualizar tus tareas asignadas
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas ({tasks.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pendientes ({tasks.filter(t => t.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="in_progress">
                En Progreso ({tasks.filter(t => t.status === 'in_progress').length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completadas ({tasks.filter(t => t.status === 'completed').length})
              </TabsTrigger>
            </TabsList>

            {['all', 'pending', 'in_progress', 'completed'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {tasks
                  .filter(task => tab === 'all' || task.status === tab)
                  .map((task) => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{task.title}</h3>
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
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                Asignado por: {task.assigned_by_name}
                              </span>
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
                            </div>

                            {task.tags && task.tags.length > 0 && (
                              <div className="flex items-center gap-1 mb-3">
                                <Tag className="h-3 w-3 text-muted-foreground" />
                                {task.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              {task.status === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(task.id, 'in_progress')}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Iniciar Tarea
                                </Button>
                              )}

                              {task.status === 'in_progress' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusUpdate(task.id, 'completed')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Completar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusUpdate(task.id, 'pending')}
                                  >
                                    <Pause className="h-3 w-3 mr-1" />
                                    Pausar
                                  </Button>
                                </>
                              )}

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Comentarios ({task.comments?.length || 0})
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Comentarios de la Tarea</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="max-h-60 overflow-y-auto space-y-3">
                                      {task.comments?.map((comment) => (
                                        <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-sm">{comment.user_name}</span>
                                            <span className="text-xs text-muted-foreground">
                                              {format(new Date(comment.created_at), 'MMM dd, HH:mm')}
                                            </span>
                                          </div>
                                          <p className="text-sm">{comment.comment}</p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="space-y-2">
                                      <Textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Añadir un comentario..."
                                        rows={3}
                                      />
                                      <Button
                                        onClick={() => handleAddComment(task.id)}
                                        disabled={!newComment.trim()}
                                        className="w-full"
                                      >
                                        Añadir Comentario
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 