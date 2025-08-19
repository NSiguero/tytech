import { NextRequest, NextResponse } from 'next/server';
import { getUserTeam, getTeamMembers } from '@/lib/teams';
import { verifyToken } from '@/lib/auth';

// GET /api/teams - Get current user's team information
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

    // Get user's team
    const team = await getUserTeam(decoded.id);
    if (!team) {
      return NextResponse.json({ 
        team: null, 
        members: [] 
      });
    }

    // Get team members
    const members = await getTeamMembers(team.team_code);

    return NextResponse.json({ 
      team, 
      members 
    });
  } catch (error) {
    console.error('Error fetching team information:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
