import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { isConnected } from '@/lib/dbConnect';
import Note, { findNoteByIdInMemory, updateNoteInMemory } from '@/models/Note';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { validateSession } from '@/lib/auth';

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
      return new NextResponse('Note not found', { status: 404 });
    }
    
    // Check password if required
    const url = new URL(request.url);
    const providedPassword = url.searchParams.get('password');
    
    if (note.isPasswordProtected && note.password !== providedPassword) {
      return new NextResponse('Access denied. Invalid password.', { status: 403 });
    }
    
    const path = join(process.cwd(), 'public/uploads', note.filename);
    const fileBuffer = await readFile(path);
    
    // Increment download count
    if (isConnected) {
      try {
        await Note.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });
      } catch (error) {
        console.warn('Failed to update download count in MongoDB:', error);
        // Fallback to in-memory update
        updateNoteInMemory(id, { downloadCount: (note.downloadCount || 0) + 1 });
      }
    } else {
      // Update in-memory storage
      updateNoteInMemory(id, { downloadCount: (note.downloadCount || 0) + 1 });
    }
    
    // Fix the response creation by converting Buffer to Uint8Array
    const uint8Array = new Uint8Array(fileBuffer);
    const response = new NextResponse(uint8Array);
    response.headers.set('Content-Type', note.fileType || 'application/octet-stream');
    response.headers.set('Content-Disposition', `attachment; filename="${note.originalname}"`);
    
    return response;
  } catch (err) {
    console.error('Error downloading note:', err);
    return new NextResponse('Failed to download note', { status: 500 });
  }
}

// POST method for password verification
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    // Await params before using
    const { id } = await params;
    
    // This endpoint is for password verification
    const { password } = await request.json();
    
    let note;
    if (isConnected) {
      // Try to use MongoDB
      try {
        note = await Note.findById(id);
      } catch (err) {
        // Fallback to in-memory storage
        console.warn('MongoDB query failed, using in-memory storage:', err);
        note = findNoteByIdInMemory(id);
      }
    } else {
      // Use in-memory storage
      note = findNoteByIdInMemory(id);
    }
    
    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }
    
    // Verify password if required
    if (note.isPasswordProtected && note.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 403 });
    }
    
    // Return success for access granted
    return NextResponse.json({ success: true, message: 'Access granted' });
  } catch (err) {
    console.error('Error verifying password:', err);
    return NextResponse.json({ success: false, error: 'Failed to verify password' }, { status: 500 });
  }
}