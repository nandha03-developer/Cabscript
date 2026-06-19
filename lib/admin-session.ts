/**
 * Admin Session Management
 * Handles secure session creation, validation, and cleanup
 */

import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';

export interface AdminSession {
  id: string;
  adminId: string; // Add adminId property for backward compatibility
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: number;
  expiresAt: number;
}

// Session configuration
const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const SESSION_IDLE_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours idle timeout

// In-memory session store (use Redis in production)
// Use global store to survive hot reloads in development
declare global {
  var adminSessionStore: Map<string, AdminSession> | undefined;
}

const sessionStore = global.adminSessionStore ?? new Map<string, AdminSession>();

if (process.env.NODE_ENV !== 'production') {
  global.adminSessionStore = sessionStore;
}



/**
 * Create a new admin session
 */
export async function createSession(adminUser: {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}): Promise<string> {
  const sessionId = nanoid(32);
  const now = Date.now();

  const session: AdminSession = {
    id: adminUser.id,
    adminId: adminUser.id, // Set adminId to same as id
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
    isActive: adminUser.isActive,
    createdAt: now,
    expiresAt: now + SESSION_DURATION,
  };

  // Store session
  sessionStore.set(sessionId, session);


  // Set HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/', // Must be root path to work with all routes
  });

  return sessionId;
}

/**
 * Get current session from cookie
 */
export async function getSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return null;
    }

    const session = sessionStore.get(sessionId);

    if (!session) {
      return null;
    }

    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      sessionStore.delete(sessionId);
      await deleteSession();
      return null;
    }

    // Update expiry time on activity (sliding expiration)
    session.expiresAt = Date.now() + SESSION_IDLE_TIMEOUT;
    sessionStore.set(sessionId, session);

    return session;
  } catch (error) {
    console.error('❌ Error getting session:', error);
    return null;
  }
}

/**
 * Validate if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null && session.isActive;
}

/**
 * Validate if user has required role
 */
export async function hasRole(allowedRoles: string[]): Promise<boolean> {
  const session = await getSession();
  
  if (!session || !session.isActive) {
    return false;
  }

  return allowedRoles.includes(session.role);
}

/**
 * Delete current session (logout)
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    sessionStore.delete(sessionId);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Clean up expired sessions (run periodically)
 */
export function cleanupExpiredSessions(): void {
  const now = Date.now();
  
  for (const [sessionId, session] of sessionStore.entries()) {
    if (now > session.expiresAt) {
      sessionStore.delete(sessionId);
    }
  }
}

// Run cleanup every 15 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupExpiredSessions, 15 * 60 * 1000);
}

/**
 * Get session statistics (for monitoring)
 */
export function getSessionStats() {
  return {
    totalSessions: sessionStore.size,
    activeSessions: Array.from(sessionStore.values()).filter(
      (s) => s.isActive && Date.now() < s.expiresAt
    ).length,
  };
}
