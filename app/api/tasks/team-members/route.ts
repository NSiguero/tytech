import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { verifyToken } from '@/lib/auth';

// GET /api/tasks/team-members - Get team members for task assignment
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



    // Get user's team code first
    const userQuery = 'SELECT team_code FROM users WHERE id = ?';
    const user = await executeQuery(userQuery, [decoded.id]) as any;
    
    if (!user || !user[0]?.team_code) {
      return NextResponse.json({ members: [] });
    }

    const teamCode = user[0].team_code;

    // Check if we want all team members (for team management) or just non-managers (for task assignment)
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('includeAll') === 'true';

    let query;
    let params;

    if (includeAll) {
      // Get all team members (including managers) for team management
      query = `
        SELECT id, CONCAT(first_name, ' ', last_name) as name, role, email, is_team_manager
        FROM users 
        WHERE team_code = ?
        ORDER BY first_name, last_name
      `;
      params = [teamCode];
    } else {
      // Get only non-manager team members for task assignment
      query = `
        SELECT id, CONCAT(first_name, ' ', last_name) as name, role, email, is_team_manager
        FROM users 
        WHERE team_code = ? AND is_team_manager = FALSE
        ORDER BY first_name, last_name
      `;
      params = [teamCode];
    }
    
    const result = await executeQuery(query, params) as any[];

    return NextResponse.json({ members: result });
  } catch (error: any) {
    console.error('Error fetching team members:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error?.message 
    }, { status: 500 });
  }
} 