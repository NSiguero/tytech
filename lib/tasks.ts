import { executeQuery, executeQuerySingle } from './database';

export interface TaskComment {
  id: string;
  user_id: number;
  user_name: string;
  comment: string;
  created_at: Date;
}

export interface TaskHistory {
  id: string;
  user_id: number;
  user_name: string;
  action: string;
  old_value?: any;
  new_value?: any;
  created_at: Date;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  category: 'visita' | 'reporte';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_by: number;
  assigned_to: number;
  team_code: string;
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
  estimated_hours?: number;
  actual_hours?: number;
  tags?: string[];
  attachments?: string[];
  comments?: TaskComment[];
  history?: TaskHistory[];
}

export interface CreateTaskData {
  title: string;
  description?: string;
  category: 'visita' | 'reporte';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: number;
  due_date?: Date;
  estimated_hours?: number;
  tags?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: Date;
  actual_hours?: number;
  tags?: string[];
}

// Create a new task
export async function createTask(data: CreateTaskData, assignedBy: number): Promise<Task> {

  
  // Get the team code for the assigned user
  const userQuery = 'SELECT team_code FROM users WHERE id = ?';
  const user = await executeQuerySingle(userQuery, [data.assigned_to]) as any;
  
  
  
  if (!user || !user.team_code) {
    throw new Error('User is not part of a team');
  }

  const query = `
    INSERT INTO tasks (title, description, category, priority, assigned_by, assigned_to, team_code, due_date, estimated_hours, tags, comments, history)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const initialHistory = [{
    id: Date.now().toString(),
    user_id: assignedBy,
    user_name: 'System', // Will be replaced with actual user name
    action: 'created',
    new_value: data,
    created_at: new Date()
  }];
  
  const params = [
    data.title,
    data.description || null,
    data.category,
    data.priority || 'medium',
    assignedBy,
    data.assigned_to,
    user.team_code,
    data.due_date || null,
    data.estimated_hours || null,
    data.tags ? JSON.stringify(data.tags) : null,
    JSON.stringify([]), // Empty comments array
    JSON.stringify(initialHistory) // Initial history
  ];

  const result = await executeQuery(query, params) as any;
  const task = await getTaskById(result.insertId);
  if (!task) throw new Error('Failed to create task');
  return task;
}

// Get task by ID
export async function getTaskById(id: number): Promise<Task | null> {
  const query = `
    SELECT t.*, 
           CONCAT(u1.first_name, ' ', u1.last_name) as assigned_by_name,
           CONCAT(u2.first_name, ' ', u2.last_name) as assigned_to_name
    FROM tasks t
    LEFT JOIN users u1 ON t.assigned_by = u1.id
    LEFT JOIN users u2 ON t.assigned_to = u2.id
    WHERE t.id = ?
  `;
  
  const result = await executeQuerySingle(query, [id]);
  if (!result) return null;
  
  // Parse JSON fields
  const task = result as any;
  if (task.comments) {
    task.comments = JSON.parse(task.comments);
  }
  if (task.history) {
    task.history = JSON.parse(task.history);
  }
  if (task.tags) {
    task.tags = JSON.parse(task.tags);
  }
  if (task.attachments) {
    task.attachments = JSON.parse(task.attachments);
  }
  
  return task as Task;
}

// Get tasks for a user (assigned to them)
export async function getTasksForUser(userId: number, status?: string): Promise<Task[]> {
  
  let query = `
    SELECT t.*, 
           CONCAT(u1.first_name, ' ', u1.last_name) as assigned_by_name,
           CONCAT(u2.first_name, ' ', u2.last_name) as assigned_to_name
    FROM tasks t
    LEFT JOIN users u1 ON t.assigned_by = u1.id
    LEFT JOIN users u2 ON t.assigned_to = u2.id
    WHERE t.assigned_to = ?
  `;
  
  const params = [userId];
  
  if (status) {
    query += ' AND t.status = ?';
    params.push(status as any);
  }
  
  query += ' ORDER BY t.priority DESC, t.due_date ASC, t.created_at DESC';
  
  const result = await executeQuery(query, params);
  
  // Parse JSON fields for each task
  return (result as any[]).map(task => {
    if (task.comments) {
      task.comments = JSON.parse(task.comments);
    }
    if (task.history) {
      task.history = JSON.parse(task.history);
    }
    if (task.tags) {
      task.tags = JSON.parse(task.tags);
    }
    if (task.attachments) {
      task.attachments = JSON.parse(task.attachments);
    }
    return task;
  }) as Task[];
}

// Get tasks assigned by a user
export async function getTasksAssignedByUser(userId: number): Promise<Task[]> {
  const query = `
    SELECT t.*, 
           CONCAT(u1.first_name, ' ', u1.last_name) as assigned_by_name,
           CONCAT(u2.first_name, ' ', u2.last_name) as assigned_to_name
    FROM tasks t
    LEFT JOIN users u1 ON t.assigned_by = u1.id
    LEFT JOIN users u2 ON t.assigned_to = u2.id
    WHERE t.assigned_by = ?
    ORDER BY t.created_at DESC
  `;
  
  const result = await executeQuery(query, [userId]);
  
  // Parse JSON fields for each task
  return (result as any[]).map(task => {
    if (task.comments) {
      task.comments = JSON.parse(task.comments);
    }
    if (task.history) {
      task.history = JSON.parse(task.history);
    }
    if (task.tags) {
      task.tags = JSON.parse(task.tags);
    }
    if (task.attachments) {
      task.attachments = JSON.parse(task.attachments);
    }
    return task;
  }) as Task[];
}

// Get visit tasks for a user (simple SQL query for sidebar)
export async function getVisitTasksForUser(userId: number): Promise<Task[]> {
  const query = `
    SELECT t.*, 
           CONCAT(u2.first_name, ' ', u2.last_name) as assigned_to_name
    FROM tasks t
    LEFT JOIN users u2 ON t.assigned_to = u2.id
    WHERE t.assigned_to = ? 
      AND t.category = 'visita' 
      AND t.status != 'completed'
    ORDER BY t.due_date ASC, t.priority DESC
  `;
  
  const result = await executeQuery(query, [userId]);
  
  // Parse JSON fields for each task
  return (result as any[]).map(task => {
    if (task.comments) {
      task.comments = JSON.parse(task.comments);
    }
    if (task.history) {
      task.history = JSON.parse(task.history);
    }
    if (task.tags) {
      task.tags = JSON.parse(task.tags);
    }
    if (task.attachments) {
      task.attachments = JSON.parse(task.attachments);
    }
    return task;
  }) as Task[];
}

// Update task
export async function updateTask(id: number, data: UpdateTaskData, userId: number): Promise<Task | null> {
  const currentTask = await getTaskById(id);
  if (!currentTask) return null;
  
  const updates: string[] = [];
  const params: any[] = [];
  
  if (data.title !== undefined) {
    updates.push('title = ?');
    params.push(data.title);
  }
  
  if (data.description !== undefined) {
    updates.push('description = ?');
    params.push(data.description);
  }
  
  if (data.status !== undefined) {
    updates.push('status = ?');
    params.push(data.status);
    
    // Set completed_at if status is completed
    if (data.status === 'completed') {
      updates.push('completed_at = NOW()');
    }
  }
  
  if (data.priority !== undefined) {
    updates.push('priority = ?');
    params.push(data.priority);
  }
  
  if (data.due_date !== undefined) {
    updates.push('due_date = ?');
    params.push(data.due_date);
  }
  
  if (data.actual_hours !== undefined) {
    updates.push('actual_hours = ?');
    params.push(data.actual_hours);
  }
  
  if (data.tags !== undefined) {
    updates.push('tags = ?');
    params.push(JSON.stringify(data.tags));
  }
  
  if (updates.length === 0) {
    return currentTask;
  }
  
  // Add history entry
  const historyEntry = {
    id: Date.now().toString(),
    user_id: userId,
    user_name: 'System', // Will be replaced with actual user name
    action: 'updated',
    old_value: currentTask,
    new_value: data,
    created_at: new Date()
  };
  
  const currentHistory = currentTask.history || [];
  const updatedHistory = [...currentHistory, historyEntry];
  
  updates.push('history = ?');
  params.push(JSON.stringify(updatedHistory));
  
  params.push(id);
  const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
  
  await executeQuery(query, params);
  
  return getTaskById(id);
}

// Delete task
export async function deleteTask(id: number, userId: number): Promise<boolean> {
  const query = 'DELETE FROM tasks WHERE id = ?';
  const result = await executeQuery(query, [id]) as any;
  
  return result.affectedRows > 0;
}

// Add comment to task
export async function addTaskComment(taskId: number, userId: number, comment: string, userName: string): Promise<Task | null> {
  const currentTask = await getTaskById(taskId);
  if (!currentTask) return null;
  
  const newComment: TaskComment = {
    id: Date.now().toString(),
    user_id: userId,
    user_name: userName,
    comment,
    created_at: new Date()
  };
  
  const currentComments = currentTask.comments || [];
  const updatedComments = [...currentComments, newComment];
  
  const query = 'UPDATE tasks SET comments = ? WHERE id = ?';
  await executeQuery(query, [JSON.stringify(updatedComments), taskId]);
  
  return getTaskById(taskId);
}

// Add attachment to task
export async function addTaskAttachment(taskId: number, attachment: string): Promise<Task | null> {
  const currentTask = await getTaskById(taskId);
  if (!currentTask) return null;
  
  const currentAttachments = currentTask.attachments || [];
  const updatedAttachments = [...currentAttachments, attachment];
  
  const query = 'UPDATE tasks SET attachments = ? WHERE id = ?';
  await executeQuery(query, [JSON.stringify(updatedAttachments), taskId]);
  
  return getTaskById(taskId);
}

// Get team members for task assignment
export async function getTeamMembersForAssignment(userId: number): Promise<{
  id: number;
  name: string;
  role: string;
}[]> {
  // Get user's team
  const userQuery = 'SELECT team_code FROM users WHERE id = ?';
  const user = await executeQuerySingle(userQuery, [userId]) as any;
  
  if (!user || !user.team_code) {
    return [];
  }

  // Get all non-manager team members (excluding team managers, not the current user)
  const query = `
    SELECT id, CONCAT(first_name, ' ', last_name) as name, role
    FROM users 
    WHERE team_code = ? AND is_team_manager = FALSE
    ORDER BY first_name, last_name
  `;
  
  const result = await executeQuery(query, [user.team_code]);
  
  return result as any[];
}

// Get task statistics
export async function getTaskStats(userId: number): Promise<{
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  overdue: number;
}> {
  const query = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN due_date < NOW() AND status != 'completed' THEN 1 ELSE 0 END) as overdue
    FROM tasks 
    WHERE assigned_to = ?
  `;
  
  const result = await executeQuerySingle(query, [userId]) as any;
  
  return {
    total: result.total || 0,
    pending: result.pending || 0,
    in_progress: result.in_progress || 0,
    completed: result.completed || 0,
    overdue: result.overdue || 0
  };
} 

// Get tasks assigned to a specific agent with due date for calendar
export async function getTasksForAgentCalendar(agentId: number): Promise<Task[]> {
  console.log('🔍 Buscando tareas para agente ID:', agentId)
  
  const query = `
    SELECT t.*, 
           CONCAT(u1.first_name, ' ', u1.last_name) as assigned_by_name,
           CONCAT(u2.first_name, ' ', u2.last_name) as assigned_to_name
    FROM tasks t
    LEFT JOIN users u1 ON t.assigned_by = u1.id
    LEFT JOIN users u2 ON t.assigned_to = u2.id
    WHERE t.assigned_to = ? 
      AND t.due_date IS NOT NULL
      AND t.status != 'completed'
    ORDER BY t.due_date ASC, t.priority DESC
  `;
  
  console.log('📝 Query SQL:', query)
  console.log('🔢 Parámetros:', [agentId])
  
  try {
    const result = await executeQuery(query, [agentId]);
    console.log('📊 Resultado de la base de datos:', result)
    
    // Parse JSON fields for each task
    const parsedTasks = (result as any[]).map(task => {
      if (task.comments && typeof task.comments === 'string') {
        try {
          task.comments = JSON.parse(task.comments);
        } catch (e) {
          task.comments = [];
        }
      }
      if (task.history && typeof task.history === 'string') {
        try {
          task.history = JSON.parse(task.history);
        } catch (e) {
          task.history = [];
        }
      }
      if (task.tags && typeof task.tags === 'string') {
        try {
          task.tags = JSON.parse(task.tags);
        } catch (e) {
          task.tags = [];
        }
      }
      if (task.attachments && typeof task.attachments === 'string') {
        try {
          task.attachments = JSON.parse(task.attachments);
        } catch (e) {
          task.attachments = [];
        }
      }
      return task;
    }) as Task[];
    
    console.log('✅ Tareas parseadas:', parsedTasks)
    return parsedTasks
  } catch (error) {
    console.error('💥 Error en getTasksForAgentCalendar:', error)
    throw error
  }
} 