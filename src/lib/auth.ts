// Simple authentication utilities for the Student Notes Portal

// In-memory session storage
export const sessions: { [key: string]: { userId: string; expires: Date } } = {};

// Generate a simple session ID
export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create a session
export const createSession = (userId: string) => {
  const sessionId = generateSessionId();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  sessions[sessionId] = {
    userId,
    expires
  };
  
  return { sessionId, expires };
};

// Validate a session
export const validateSession = (sessionId: string) => {
  const session = sessions[sessionId];
  
  if (!session) {
    return null;
  }
  
  if (session.expires < new Date()) {
    // Session expired, remove it
    delete sessions[sessionId];
    return null;
  }
  
  return session.userId;
};

// Destroy a session
export const destroySession = (sessionId: string) => {
  delete sessions[sessionId];
};

// Hash password (simple implementation for demo - use bcrypt in production)
export const hashPassword = (password: string) => {
  // Simple hash for demo purposes - DO NOT use in production
  return `hashed_${password}_demo`;
};

// Verify password (simple implementation for demo)
export const verifyPassword = (password: string, hashedPassword: string) => {
  return hashedPassword === `hashed_${password}_demo`;
};