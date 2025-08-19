import { NextRequest, NextResponse } from 'next/server';
import { addTaskComment } from '@/lib/tasks';
import { verifyToken } from '@/lib/auth';

// POST /api/tasks/[id]/comments - Add a comment to a task
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const taskId = parseInt(params.id);
    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const body = await request.json();
    const { comment } = body;

    if (!comment || typeof comment !== 'string') {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
    }

    const task = await addTaskComment(taskId, decoded.userId, comment, decoded.name || 'User');
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 