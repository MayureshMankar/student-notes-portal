import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { isConnected } from '@/lib/dbConnect';
import Note, { getAllNotesInMemory } from '@/models/Note';
import { validateSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');
    const sessionId = authHeader ? authHeader.split(' ')[1] : null;
    const userId = sessionId ? validateSession(sessionId) : null;
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    
    let notes;
    if (isConnected) {
      // Try to use MongoDB
      try {
        // Get notes owned by the user
        notes = await Note.find({ ownerId: userId }).sort({ uploadDate: -1 });
        console.log('Fetched notes from MongoDB for user:', userId, notes.length);
      } catch (err) {
        // Fallback to in-memory storage
        console.warn('MongoDB query failed, using in-memory storage:', err);
        const allNotes = getAllNotesInMemory();
        notes = allNotes.filter(note => note.ownerId === userId);
      }
    } else {
      // Use in-memory storage
      const allNotes = getAllNotesInMemory();
      notes = allNotes.filter(note => note.ownerId === userId);
      console.log('Fetched notes from in-memory storage for user:', userId, notes.length);
    }
    
    return NextResponse.json({ success: true, data: notes });
  } catch (err) {
    console.error('Error fetching user notes:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch notes' }, { status: 500 });
  }
}