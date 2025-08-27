import { NextRequest, NextResponse } from 'next/server';
import { getTasksForAgentCalendar } from '@/lib/tasks';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = parseInt(params.id);
    
    if (isNaN(agentId)) {
      return NextResponse.json(
        { error: 'ID de agente inválido' },
        { status: 400 }
      );
    }

    const tasks = await getTasksForAgentCalendar(agentId);
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching agent tasks:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
