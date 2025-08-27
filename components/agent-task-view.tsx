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
import { useToast } from '@/components/ui/toast-notification';

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
  category: 'visita' | 'reporte';
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
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [updateData, setUpdateData] = useState({
    status: '',
    actual_hours: ''
  });
  const [startTaskModalOpen, setStartTaskModalOpen] = useState(false);
  const [taskToStart, setTaskToStart] = useState<Task | null>(null);
  const [startTaskData, setStartTaskData] = useState({
    photo: null as File | null,
    comment: '',
    reportDescription: ''
  });
  const [newTasksCount, setNewTasksCount] = useState(0);

  useEffect(() => {
    fetchTasks();
    
    // Set up automatic refresh every 10 seconds to check for new tasks
    const interval = setInterval(() => {
      checkForNewTasks();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
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

  const checkForNewTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      const newTasks = data.tasks || [];
      
      // Check for new pending tasks
      const currentPendingIds = tasks.filter((t: Task) => t.status === 'pending').map((t: Task) => t.id);
      const newPendingTasks = newTasks.filter((t: any) => 
        t.status === 'pending' && !currentPendingIds.includes(t.id)
      );
      
      // Check for status changes in existing tasks
      const statusChanges = newTasks.filter((newTask: any) => {
        const existingTask = tasks.find((t: Task) => t.id === newTask.id);
        return existingTask && existingTask.status !== newTask.status;
      });
      
      // Show notifications for status changes only (removed new task notifications)
      statusChanges.forEach((task: any) => {
        const existingTask = tasks.find((t: Task) => t.id === task.id);
        if (existingTask && task.status === 'completed') {
          showToast({
            type: 'success',
            title: '¡Tarea completada! 🎉',
            message: `${task.title} ha sido marcada como completada`,
            duration: 5000
          });
        }
      });
      
      // Update new tasks count
      setNewTasksCount(newPendingTasks.length);
      
      // Update tasks if there are any changes
      if (newPendingTasks.length > 0 || statusChanges.length > 0 || newTasks.length !== tasks.length) {
        setTasks(newTasks);
      }
    } catch (error) {
      console.error('Error checking for new tasks:', error);
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

  const handleStartTask = async (task: Task) => {
    try {
      // Immediately move task to in_progress
      await handleStatusUpdate(task.id, 'in_progress');
      
      setTaskToStart(task);
      setStartTaskData({
        photo: null,
        comment: '',
        reportDescription: ''
      });
      setStartTaskModalOpen(true);
    } catch (error) {
      console.error('Error starting task:', error);
      showToast({
        type: 'error',
        title: 'Error al iniciar tarea',
        message: 'No se pudo iniciar la tarea. Por favor, inténtalo de nuevo.',
        duration: 5000
      });
    }
  };

  const handleStartTaskSubmit = async () => {
    if (!taskToStart) return;

    try {
      // If it's a visit task and has a photo, upload it and complete the task
      if (taskToStart.category === 'visita' && startTaskData.photo) {
        await uploadPhotoAndCompleteTask(taskToStart.id, startTaskData.photo, startTaskData.comment);
      } else if (taskToStart.category === 'reporte' && startTaskData.reportDescription.trim()) {
        // For report tasks, add description as comment and complete
        await handleAddComment(taskToStart.id);
        await handleStatusUpdate(taskToStart.id, 'completed');
        
        showToast({
          type: 'success',
          title: '¡Reporte completado!',
          message: `El reporte "${taskToStart.title}" ha sido completado.`,
          duration: 4000
        });
      } else {
        // Just add comments if any and close modal
        if (startTaskData.comment.trim()) {
          await handleAddComment(taskToStart.id);
        }
        
        showToast({
          type: 'info',
          title: 'Tarea en progreso',
          message: `La tarea "${taskToStart.title}" está en progreso. Sube una foto para completarla.`,
          duration: 4000
        });
      }

      // Close modal and reset state
      setStartTaskModalOpen(false);
      setTaskToStart(null);
      setStartTaskData({
        photo: null,
        comment: '',
        reportDescription: ''
      });
    } catch (error) {
      console.error('Error processing task:', error);
      showToast({
        type: 'error',
        title: 'Error al procesar tarea',
        message: 'No se pudo procesar la tarea. Por favor, inténtalo de nuevo.',
        duration: 5000
      });
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStartTaskData(prev => ({ ...prev, photo: file }));
    }
  };

  const uploadPhotoAndCompleteTask = async (taskId: number, photo: File, comment?: string) => {
    try {
      // Show loading toast
      showToast({
        type: 'info',
        title: 'Subiendo foto...',
        message: 'Procesando imagen y analizando con IA...',
        duration: 3000
      });

      // Create FormData for photo upload
      const formData = new FormData();
      formData.append('image', photo);
      formData.append('userId', currentUser.id.toString());
      formData.append('taskId', taskId.toString()); // Add task ID for reference

      // Upload photo using the existing upload API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const uploadResult = await response.json();

      // Add comment if provided
      if (comment && comment.trim()) {
        await handleAddComment(taskId);
      }

      // Complete the task
      await handleStatusUpdate(taskId, 'completed');

      // Show success toast
      showToast({
        type: 'success',
        title: '¡Visita completada!',
        message: `La foto ha sido subida y analizada con IA. La tarea está completada.`,
        duration: 5000
      });

      // Refresh tasks to show updated status
      fetchTasks();

    } catch (error) {
      console.error('Error uploading photo and completing task:', error);
      showToast({
        type: 'error',
        title: 'Error al subir foto',
        message: 'No se pudo subir la foto. Por favor, inténtalo de nuevo.',
        duration: 5000
      });
      throw error;
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
           <div className="flex items-center justify-between">
             <div>
               <CardTitle className="flex items-center gap-2">
                 <User className="h-5 w-5" />
                 Mis Tareas Asignadas
               </CardTitle>
               <p className="text-sm text-muted-foreground">
                 Ver y actualizar tus tareas asignadas
               </p>
             </div>
             <div className="flex items-center gap-2">
               <div className="flex items-center gap-1 text-xs text-gray-500">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 <span>Actualización automática</span>
               </div>
               {newTasksCount > 0 && (
                 <Badge variant="destructive" className="animate-pulse">
                   {newTasksCount} nueva{newTasksCount > 1 ? 's' : ''}
                 </Badge>
               )}
             </div>
           </div>
         </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => {
            // Reset new tasks count when clicking on pending tab to hide the red icon
            if (value === 'pending') {
              setNewTasksCount(0);
            }
          }}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas ({tasks.length})</TabsTrigger>
                             <TabsTrigger value="pending" className="relative">
                 Pendientes ({tasks.filter(t => t.status === 'pending').length})
                 {newTasksCount > 0 && (
                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                     {newTasksCount}
                   </span>
                 )}
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
                              <Badge variant="secondary" className="capitalize">
                                {task.category}
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
                                  onClick={() => handleStartTask(task)}
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

      {/* Start Task Modal */}
      <Dialog open={startTaskModalOpen} onOpenChange={setStartTaskModalOpen}>
        <DialogContent className="max-w-md">
                     <DialogHeader>
             <DialogTitle>
               Tarea en Progreso: {taskToStart?.title}
             </DialogTitle>
           </DialogHeader>
          
          {taskToStart && (
            <div className="space-y-4">
                             {/* Task Info */}
               <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                 <div className="flex items-center gap-2 mb-2">
                   <Badge variant="secondary" className="capitalize">
                     {taskToStart.category}
                   </Badge>
                   <Badge className={getPriorityColor(taskToStart.priority)}>
                     {taskToStart.priority}
                   </Badge>
                   <Badge className="bg-blue-100 text-blue-800">
                     En Progreso
                   </Badge>
                 </div>
                 {taskToStart.description && (
                   <p className="text-sm text-gray-600">{taskToStart.description}</p>
                 )}
                 <p className="text-xs text-blue-600 mt-2">
                   {taskToStart.category === 'visita' 
                     ? 'Sube una foto para completar la visita'
                     : 'Completa la descripción para finalizar el reporte'
                   }
                 </p>
               </div>

              {/* Visit Task Fields */}
              {taskToStart.category === 'visita' && (
                <>
                                     <div>
                     <label className="text-sm font-medium">
                       Foto de la Visita <span className="text-red-500">*</span>
                     </label>
                     <div className="mt-1">
                       <input
                         type="file"
                         accept="image/*"
                         onChange={handlePhotoChange}
                         className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                       />
                     </div>
                     <p className="text-xs text-gray-500 mt-1">
                       La foto será analizada automáticamente con IA para detectar productos
                     </p>
                   </div>
                  
                  <div>
                    <label className="text-sm font-medium">Comentario (opcional)</label>
                    <Textarea
                      value={startTaskData.comment}
                      onChange={(e) => setStartTaskData(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Añadir comentarios sobre la visita..."
                      rows={3}
                    />
                  </div>
                </>
              )}

              {/* Report Task Fields */}
              {taskToStart.category === 'reporte' && (
                                 <div>
                   <label className="text-sm font-medium">
                     Descripción del Reporte <span className="text-red-500">*</span>
                   </label>
                   <Textarea
                     value={startTaskData.reportDescription}
                     onChange={(e) => setStartTaskData(prev => ({ ...prev, reportDescription: e.target.value }))}
                     placeholder="Describe el reporte que vas a realizar..."
                     rows={4}
                   />
                   <p className="text-xs text-gray-500 mt-1">
                     Esta descripción se guardará como comentario de la tarea
                   </p>
                 </div>
              )}

                             {/* Action Buttons */}
               <div className="flex gap-2 pt-4">
                 {taskToStart.category === 'visita' ? (
                   <Button
                     onClick={handleStartTaskSubmit}
                     disabled={!startTaskData.photo}
                     className="flex-1 bg-green-600 hover:bg-green-700"
                   >
                     <CheckCircle className="h-4 w-4 mr-2" />
                     Completar con Foto
                   </Button>
                 ) : (
                   <Button
                     onClick={handleStartTaskSubmit}
                     disabled={!startTaskData.reportDescription.trim()}
                     className="flex-1 bg-green-600 hover:bg-green-700"
                   >
                     <CheckCircle className="h-4 w-4 mr-2" />
                     Completar Reporte
                   </Button>
                 )}
                 <Button
                   variant="outline"
                   onClick={() => setStartTaskModalOpen(false)}
                 >
                   Guardar y Salir
                 </Button>
               </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 