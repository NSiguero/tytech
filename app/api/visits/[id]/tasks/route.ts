import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const visitId = params.id;
    const url = new URL(request.url);
    const cadenaSupermercado = url.searchParams.get('cadena');
    const supermercadoId = url.searchParams.get('supermercado_id');
    const area = url.searchParams.get('area');
    const userId = url.searchParams.get('user_id');

    console.log('🔍 API DEBUG - Getting tasks for visit:', { visitId, cadenaSupermercado, supermercadoId, area, userId });
    console.log('🔍 API DEBUG - Full URL:', request.url);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Build query to get relevant tasks for this visit
    let query = `
      SELECT t.*, 
             CONCAT(u1.first_name, ' ', u1.last_name) as assigned_by_name,
             CONCAT(u2.first_name, ' ', u2.last_name) as assigned_to_name
      FROM tasks t
      LEFT JOIN users u1 ON t.assigned_by = u1.id
      LEFT JOIN users u2 ON t.assigned_to = u2.id
      WHERE t.category = 'visita' 
      AND (
        t.assigned_to = ? 
        OR t.assigned_to IS NULL
      )
      AND t.status IN ('pending', 'in_progress')
    `;
    
    const params: any[] = [userId];
    
    // Add filtering conditions based on visit context
    const conditions: string[] = [];
    
    if (cadenaSupermercado) {
      conditions.push('(t.cadena_supermercado = ? OR t.cadena_supermercado IS NULL)');
      params.push(cadenaSupermercado);
    }
    
    if (supermercadoId) {
      conditions.push('(t.supermercado_id = ? OR t.supermercado_id IS NULL)');
      params.push(parseInt(supermercadoId));
    }
    
    if (area) {
      conditions.push('(t.area = ? OR t.area IS NULL)');
      params.push(area);
    }
    
    if (conditions.length > 0) {
      query += ' AND (' + conditions.join(' OR ') + ')';
    }
    
    query += ' ORDER BY t.priority DESC, t.due_date ASC';
    
    console.log('Executing query:', query);
    console.log('With parameters:', params);
    
    const tasks = await executeQuery(query, params);
    
    console.log('🔍 API DEBUG - Raw tasks from database:', tasks);
    console.log('🔍 API DEBUG - Found', (tasks as any[]).length, 'tasks');
    
    // Parse JSON fields for each task
    const parsedTasks = (tasks as any[]).map(task => {
      if (task.comments) {
        try {
          task.comments = JSON.parse(task.comments);
        } catch (e) {
          task.comments = [];
        }
      }
      if (task.history) {
        try {
          task.history = JSON.parse(task.history);
        } catch (e) {
          task.history = [];
        }
      }
      if (task.tags) {
        try {
          task.tags = JSON.parse(task.tags);
        } catch (e) {
          task.tags = [];
        }
      }
      if (task.attachments) {
        try {
          task.attachments = JSON.parse(task.attachments);
        } catch (e) {
          task.attachments = [];
        }
      }
      
      // Convert to visit task format
      return {
        id: task.id.toString(),
        name: task.title,
        description: task.description,
        completed: false, // We'll track completion separately for visits
        priority: task.priority,
        status: task.status,
        assignedBy: task.assigned_by_name,
        assignedTo: task.assigned_to_name,
        estimatedHours: task.estimated_hours,
        tags: task.tags || [],
        cadenaSupermercado: task.cadena_supermercado,
        area: task.area,
        supermercadoId: task.supermercado_id,
        dueDate: task.due_date,
        createdAt: task.created_at
      };
    });
    
    console.log('🔍 API DEBUG - Parsed tasks:', parsedTasks);
    console.log(`✅ API SUCCESS - Found ${parsedTasks.length} tasks for visit`);
    
    const response = {
      success: true,
      tasks: parsedTasks,
      visitId,
      context: {
        cadenaSupermercado,
        supermercadoId,
        area,
        userId
      }
    };
    
    console.log('🔍 API DEBUG - Final response:', response);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching visit tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
