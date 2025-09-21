import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User, { findUserByIdInMemory } from '@/models/User';
import { validateSession, sessions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { sessionId } = await request.json();
    console.log('Validating session:', sessionId);
    
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Session ID is required' }, { status: 400 });
    }
    
    // Validate session
    const userId = validateSession(sessionId);
    console.log('Validated user ID:', userId);
    
    if (!userId) {
      // Check if session exists but is expired
      const sessionExists = sessions[sessionId];
      if (sessionExists) {
        return NextResponse.json({ success: false, error: 'Session expired. Please sign in again.' }, { status: 401 });
      }
      return NextResponse.json({ success: false, error: 'Invalid session. Please sign in again.' }, { status: 401 });
    }
    
    // Find user
    let user;
    try {
      user = await User.findById(userId);
      console.log('Found user in MongoDB:', user?._id);
    } catch (error) {
      // Fallback to in-memory storage
      console.log('Falling back to in-memory storage for user lookup');
      user = findUserByIdInMemory(userId);
      console.log('Found user in memory:', user?._id);
    }
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    // Return user data
    return NextResponse.json({ 
      success: true, 
      data: { 
        user: { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email 
        }
      } 
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ success: false, error: 'Session validation failed' }, { status: 500 });
  }
}