import { executeQuery, executeQuerySingle } from './database';

export interface Team {
  team_code: string;
  team_name: string;
  manager_id: number;
  manager_name: string;
  member_count: number;
  created_at: Date;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  team_code: string;
  team_name: string;
  is_team_manager: boolean;
}

// Generate a unique team code
export function generateTeamCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create a new team
export async function createTeam(name: string, createdBy: number): Promise<Team> {
  let teamCode: string;
  let attempts = 0;
  
  // Generate unique team code
  do {
    teamCode = generateTeamCode();
    attempts++;
    
    if (attempts > 10) {
      throw new Error('Unable to generate unique team code');
    }
  } while (await teamCodeExists(teamCode));

  // Update the user to be the team manager
  const query = `
    UPDATE users 
    SET team_code = ?, team_name = ?, is_team_manager = TRUE 
    WHERE id = ?
  `;
  
  await executeQuery(query, [teamCode, name, createdBy]);
  
  const team = await getTeamByCode(teamCode);
  if (!team) throw new Error('Failed to create team');
  return team;
}

// Check if team code exists
export async function teamCodeExists(teamCode: string): Promise<boolean> {
  const query = 'SELECT COUNT(*) as count FROM users WHERE team_code = ?';
  const result = await executeQuerySingle(query, [teamCode]) as any;
  return result.count > 0;
}

// Get team by team code
export async function getTeamByCode(teamCode: string): Promise<Team | null> {
  const query = `
    SELECT 
      u1.team_code,
      u1.team_name,
      u1.id as manager_id,
      CONCAT(u1.first_name, ' ', u1.last_name) as manager_name,
      COUNT(u2.id) as member_count,
      u1.created_at
    FROM users u1
    LEFT JOIN users u2 ON u1.team_code = u2.team_code
    WHERE u1.team_code = ? AND u1.is_team_manager = TRUE
    GROUP BY u1.team_code, u1.team_name, u1.id, u1.first_name, u1.last_name, u1.created_at
  `;
  
  const result = await executeQuerySingle(query, [teamCode]);
  return result as Team | null;
}

// Get team members
export async function getTeamMembers(teamCode: string): Promise<TeamMember[]> {
  const query = `
    SELECT 
      u.id, 
      CONCAT(u.first_name, ' ', u.last_name) as name, 
      u.email, 
      u.role, 
      u.team_code,
      u.team_name,
      u.is_team_manager
    FROM users u
    WHERE u.team_code = ?
    ORDER BY u.first_name, u.last_name
  `;
  
  const result = await executeQuery(query, [teamCode]);
  return result as TeamMember[];
}

// Add user to team
export async function addUserToTeam(userId: number, teamCode: string): Promise<boolean> {
  // Get team info
  const teamQuery = 'SELECT team_name FROM users WHERE team_code = ? AND is_team_manager = TRUE LIMIT 1';
  const team = await executeQuerySingle(teamQuery, [teamCode]) as any;
  
  if (!team) {
    throw new Error('Team not found');
  }

  const query = 'UPDATE users SET team_code = ?, team_name = ? WHERE id = ?';
  const result = await executeQuery(query, [teamCode, team.team_name, userId]) as any;
  
  return result.affectedRows > 0;
}

// Remove user from team
export async function removeUserFromTeam(userId: number): Promise<boolean> {
  const query = 'UPDATE users SET team_code = NULL, team_name = NULL, is_team_manager = FALSE WHERE id = ?';
  const result = await executeQuery(query, [userId]) as any;
  
  return result.affectedRows > 0;
}

// Get user's team
export async function getUserTeam(userId: number): Promise<Team | null> {
  const query = `
    SELECT 
      u1.team_code,
      u1.team_name,
      u1.id as manager_id,
      CONCAT(u1.first_name, ' ', u1.last_name) as manager_name,
      COUNT(u2.id) as member_count,
      u1.created_at
    FROM users u1
    LEFT JOIN users u2 ON u1.team_code = u2.team_code
    WHERE u1.id = ? AND u1.team_code IS NOT NULL
    GROUP BY u1.team_code, u1.team_name, u1.id, u1.first_name, u1.last_name, u1.created_at
  `;
  
  const result = await executeQuerySingle(query, [userId]);
  return result as Team | null;
}

// Get teams managed by user
export async function getTeamsByManager(userId: number): Promise<Team[]> {
  const query = `
    SELECT 
      u1.team_code,
      u1.team_name,
      u1.id as manager_id,
      CONCAT(u1.first_name, ' ', u1.last_name) as manager_name,
      COUNT(u2.id) as member_count,
      u1.created_at
    FROM users u1
    LEFT JOIN users u2 ON u1.team_code = u2.team_code
    WHERE u1.id = ? AND u1.is_team_manager = TRUE
    GROUP BY u1.team_code, u1.team_name, u1.id, u1.first_name, u1.last_name, u1.created_at
    ORDER BY u1.created_at DESC
  `;
  
  const result = await executeQuery(query, [userId]);
  return result as Team[];
}

// Update team name
export async function updateTeamName(teamCode: string, name: string): Promise<Team | null> {
  const query = 'UPDATE users SET team_name = ? WHERE team_code = ?';
  await executeQuery(query, [name, teamCode]);
  
  return getTeamByCode(teamCode);
}

// Delete team (only if manager)
export async function deleteTeam(teamCode: string, userId: number): Promise<boolean> {
  // Check if user is the team manager
  const team = await getTeamByCode(teamCode);
  if (!team || team.manager_id !== userId) {
    throw new Error('Only team manager can delete the team');
  }

  // Remove all team members
  const removeQuery = 'UPDATE users SET team_code = NULL, team_name = NULL, is_team_manager = FALSE WHERE team_code = ?';
  await executeQuery(removeQuery, [teamCode]);
  
  return true;
} 