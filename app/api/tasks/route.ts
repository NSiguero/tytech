import { NextRequest, NextResponse } from 'next/server';
import { createTask, getTasksForUser, getTasksAssignedByUser, getTaskStats, getVisitTasksForUser } from '@/lib/tasks';
import { verifyToken } from '@/lib/auth';

// GET /api/tasks - Get tasks for current user
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }



    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'assigned' or 'created'
    const status = searchParams.get('status');
    const userId = searchParams.get('userId'); // For team management - fetch tasks for specific user
    const category = searchParams.get('category'); // 'visita' or 'reporte'



    let tasks;
    if (category === 'visita') {
      // Fetch only visit tasks for the current user
      tasks = await getVisitTasksForUser(decoded.id);
    } else if (userId) {
      // Fetch tasks for a specific user (for team management)
      tasks = await getTasksForUser(parseInt(userId), status || undefined);
    } else if (type === 'created') {
      tasks = await getTasksAssignedByUser(decoded.id);
    } else {
      tasks = await getTasksForUser(decoded.id, status || undefined);
    }



    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, priority, assigned_to, due_date, estimated_hours, tags, cadena_supermercado, area } = body;

    if (!title || !assigned_to || !category) {
      return NextResponse.json({ error: 'Title, assigned_to, and category are required' }, { status: 400 });
    }

    const task = await createTask({
      title,
      description,
      category,
      priority,
      assigned_to,
      due_date: due_date ? new Date(due_date) : undefined,
      estimated_hours,
      tags,
      cadena_supermercado,
      area
    }, decoded.id);

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 