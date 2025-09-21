import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Note, { getAllNotesInMemory, updateNoteInMemory } from '@/models/Note';
import User, { createUserInMemory, findUserByEmailInMemory } from '@/models/User';
import { hashPassword, verifyPassword, createSession } from '@/lib/auth';
import { isConnected } from '@/lib/dbConnect';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { action, name, email, password } = await request.json();
    console.log('Auth request:', { action, name, email });
    
    if (action === 'register') {
      // Registration
      if (!name || !email || !password) {
        return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
      }
      
      // Check if user already exists
      let existingUser;
      try {
        existingUser = await User.findOne({ email });
      } catch (error) {
        // Fallback to in-memory storage
        existingUser = findUserByEmailInMemory(email);
      }
      
      if (existingUser) {
        return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
      }
      
      // Create new user
      const hashedPassword = hashPassword(password);
      const userData = { name, email, password: hashedPassword };
      
      let user;
      try {
        user = await User.create(userData);
      } catch (error) {
        // Fallback to in-memory storage
        user = createUserInMemory(userData);
      }
      
      // Create session
      const { sessionId } = createSession(user._id.toString());
      console.log('Created session for new user:', sessionId, user._id.toString());
      
      // Return session ID to client
      return NextResponse.json({ 
        success: true, 
        data: { 
          user: { 
            id: user._id.toString(), 
            name: user.name, 
            email: user.email 
          },
          sessionId
        } 
      });
    } 
    else if (action === 'login') {
      // Login
      if (!email || !password) {
        return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
      }
      
      // Find user
      let user;
      try {
        user = await User.findOne({ email });
      } catch (error) {
        // Fallback to in-memory storage
        user = findUserByEmailInMemory(email);
      }
      
      if (!user) {
        return NextResponse.json({ success: false, error: 'No account found with this email address' }, { status: 401 });
      }
      
      // Verify password
      const isValid = verifyPassword(password, user.password);
      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
      }
      
      // Create session
      const { sessionId } = createSession(user._id.toString());
      console.log('Created session for existing user:', sessionId, user._id.toString());
      
      // Associate legacy notes with this user
      try {
        if (isConnected) {
          // Update notes that don't have an ownerId to belong to this user
          const result = await Note.updateMany(
            { ownerId: { $exists: false } },
            { $set: { ownerId: user._id.toString() } }
          );
          console.log('Associated legacy notes with user (MongoDB):', result.modifiedCount);
        } else {
          // For in-memory storage, update all notes without ownerId
          const allNotes = getAllNotesInMemory();
          let count = 0;
          allNotes.forEach(note => {
            if (!note.ownerId) {
              updateNoteInMemory(note._id, { ownerId: user._id.toString() });
              count++;
            }
          });
          console.log('Associated legacy notes with user (in-memory):', count);
        }
      } catch (error) {
        console.warn('Failed to associate legacy notes with user:', error);
      }
      
      // Return session ID to client
      return NextResponse.json({ 
        success: true, 
        data: { 
          user: { 
            id: user._id.toString(), 
            name: user.name, 
            email: user.email 
          },
          sessionId
        } 
      });
    }
    else if (action === 'logout') {
      // Logout - client should delete session cookie
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}