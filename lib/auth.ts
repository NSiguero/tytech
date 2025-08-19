import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery, executeQuerySingle } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'field_agent';
  avatar_url?: string;
  is_active: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  const query = `
    SELECT id, username, email, first_name, last_name, role, avatar_url, is_active
    FROM users 
    WHERE id = ? AND is_active = TRUE
  `;
  return executeQuerySingle(query, [id]) as Promise<User | null>;
}

// Get user by username or email
export async function getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
  const query = `
    SELECT id, username, email, first_name, last_name, role, avatar_url, is_active, password_hash
    FROM users 
    WHERE (username = ? OR email = ?) AND is_active = TRUE
  `;
  return executeQuerySingle(query, [usernameOrEmail, usernameOrEmail]) as Promise<User | null>;
}

// Create user session
export async function createUserSession(userId: number, token: string, ipAddress?: string, userAgent?: string): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  const query = `
    INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?)
  `;
  await executeQuery(query, [userId, token, expiresAt, ipAddress, userAgent]);
}

// Validate session
export async function validateSession(token: string): Promise<User | null> {
  const query = `
    SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.role, u.avatar_url, u.is_active
    FROM users u
    JOIN user_sessions s ON u.id = s.user_id
    WHERE s.session_token = ? AND s.expires_at > NOW() AND s.is_active = TRUE AND u.is_active = TRUE
  `;
  return executeQuerySingle(query, [token]) as Promise<User | null>;
}

// Invalidate session
export async function invalidateSession(token: string): Promise<void> {
  const query = `UPDATE user_sessions SET is_active = FALSE WHERE session_token = ?`;
  await executeQuery(query, [token]);
}

// Update last login
export async function updateLastLogin(userId: number): Promise<void> {
  const query = `UPDATE users SET last_login = NOW() WHERE id = ?`;
  await executeQuery(query, [userId]);
} 