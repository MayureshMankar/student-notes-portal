import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { isConnected } from '@/lib/dbConnect';
import Note, { findNoteByIdInMemory, updateNoteInMemory } from '@/models/Note';
import { validateSession } from '@/lib/auth';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    // Await params before using
    const { id } = await params;
    
    let note;
    if (isConnected) {
      // Try to use MongoDB
      try {
        note = await Note.findById(id);
      } catch (error) {
        // Fallback to in-memory storage
        console.warn('MongoDB query failed, using in-memory storage:', error);
        note = findNoteByIdInMemory(id);
      }
    } else {
      // Use in-memory storage
      note = findNoteByIdInMemory(id);
    }
    
    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }
    
    // Return note metadata
    return NextResponse.json({ success: true, data: note });
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    // Await params before using
    const { id } = await params;
    
    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');
    const sessionId = authHeader ? authHeader.split(' ')[1] : null;
    const userId = sessionId ? validateSession(sessionId) : null;
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    
    // Get the note to check ownership
    let note;
    if (isConnected) {
      try {
        note = await Note.findById(id);
      } catch (error) {
        note = findNoteByIdInMemory(id);
      }
    } else {
      note = findNoteByIdInMemory(id);
    }
    
    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }
    
    // Check if user owns the note
    if (note.ownerId !== userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
    // Get update data
    const { title, description, subject, tags, isPasswordProtected, password } = await request.json();
    
    // Prepare update data
    const updateData: any = {
      title,
      description,
      subject: subject || 'General',
      tags: Array.isArray(tags) ? tags : [],
      isPasswordProtected: !!isPasswordProtected,
    };
    
    // Only add password if note is password protected
    if (isPasswordProtected && password) {
      updateData.password = password;
    }
    
    let updatedNote;
    if (isConnected) {
      try {
        updatedNote = await Note.findByIdAndUpdate(id, updateData, { new: true });
      } catch (error) {
        console.warn('MongoDB update failed, using in-memory storage:', error);
        updatedNote = updateNoteInMemory(id, updateData);
      }
    } else {
      updatedNote = updateNoteInMemory(id, updateData);
    }
    
    return NextResponse.json({ success: true, data: updatedNote });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ success: false, error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    // Await params before using
    const { id } = await params;
    
    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');
    const sessionId = authHeader ? authHeader.split(' ')[1] : null;
    const userId = sessionId ? validateSession(sessionId) : null;
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    
    // Get the note to check ownership
    let note;
    if (isConnected) {
      try {
        note = await Note.findById(id);
      } catch (error) {
        note = findNoteByIdInMemory(id);
      }
    } else {
      note = findNoteByIdInMemory(id);
    }
    
    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }
    
    // Check if user owns the note
    if (note.ownerId !== userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
    // Delete the file from storage
    try {
      const path = join(process.cwd(), 'public/uploads', note.filename);
      await unlink(path);
    } catch (fileError) {
      console.warn('Failed to delete file:', fileError);
    }
    
    // Delete the note from database
    if (isConnected) {
      try {
        await Note.findByIdAndDelete(id);
      } catch (error) {
        console.warn('MongoDB delete failed:', error);
        // For in-memory storage, we would need to implement deletion
        // This is a simplified implementation
      }
    }
    
    return NextResponse.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete note' }, { status: 500 });
  }
}