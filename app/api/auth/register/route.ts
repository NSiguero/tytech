import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeQuerySingle } from '@/lib/database';
import { hashPassword, generateToken, createUserSession } from '@/lib/auth';
import { getTeamByCode, addUserToTeam } from '@/lib/teams';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    
    const { username, email, password, first_name, last_name, teamCode, createNewTeam, teamName } = body;
    


    // Validate input
    if (!username || !email || !password || !first_name || !last_name) {
  
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate team information
    if (createNewTeam && !teamName) {
      return NextResponse.json(
        { error: 'Team name is required when creating a new team' },
        { status: 400 }
      );
    }

    if (!createNewTeam && !teamCode) {
      return NextResponse.json(
        { error: 'Team code is required when joining an existing team' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await executeQuerySingle(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingEmail = await executeQuerySingle(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Handle team creation or joining
    let finalTeamCode = null;
    let finalTeamName = null;
    let isTeamManager = false;

    if (createNewTeam) {
      // Create new team - we'll create the user first, then update the team
      const { generateTeamCode, teamCodeExists } = await import('@/lib/teams');
      
      // Generate unique team code
      let teamCodeGenerated: string;
      let attempts = 0;
      do {
        teamCodeGenerated = generateTeamCode();
        attempts++;
        if (attempts > 10) {
          return NextResponse.json(
            { error: 'Unable to generate unique team code' },
            { status: 500 }
          );
        }
      } while (await teamCodeExists(teamCodeGenerated));
      
      finalTeamCode = teamCodeGenerated;
      finalTeamName = teamName;
      isTeamManager = true;
    } else if (teamCode) {
      // Join existing team
      const team = await getTeamByCode(teamCode);
      if (!team) {
        return NextResponse.json(
          { error: 'Invalid team code' },
          { status: 400 }
        );
      }
      finalTeamCode = team.team_code;
      finalTeamName = team.team_name;
      isTeamManager = false;
    }

    // Create user
    const insertQuery = `
      INSERT INTO users (username, email, password_hash, first_name, last_name, role, team_code, team_name, is_team_manager)
      VALUES (?, ?, ?, ?, ?, 'field_agent', ?, ?, ?)
    `;
    
    const result = await executeQuery(insertQuery, [username, email, passwordHash, first_name, last_name, finalTeamCode, finalTeamName, isTeamManager]);
    const userId = (result as any).insertId;

    

    // Get the created user
    const user = await executeQuerySingle(
      'SELECT id, username, email, first_name, last_name, role, avatar_url, is_active FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = generateToken(user as any);

    // Create session
    const ipAddress = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    await createUserSession(userId, token, ipAddress, userAgent);

    return NextResponse.json({
      success: true,
      user,
      token,
      teamCode: finalTeamCode,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 