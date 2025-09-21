import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { isConnected } from '@/lib/dbConnect';
import Note, { findNoteByIdInMemory } from '@/models/Note';
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
    
    // Check if preview is available
    if (!note.previewAvailable) {
      return new NextResponse('Preview not available for this file type', { status: 400 });
    }
    
    // Check password if required
    const url = new URL(request.url);
    const providedPassword = url.searchParams.get('password');
    
    // For password-protected notes, verify password before returning preview
    if (note.isPasswordProtected) {
      if (note.password !== providedPassword) {
        // Return metadata only if no valid password provided
        return NextResponse.json({
          success: true,
          data: {
            id: note._id,
            title: note.title,
            description: note.description,
            subject: note.subject,
            tags: note.tags,
            fileSize: note.fileSize,
            uploadDate: note.uploadDate,
            previewAvailable: note.previewAvailable,
            requiresPassword: true
          }
        });
      }
      // If password is valid, continue to return actual preview
    }
    
    // For non-password protected notes or valid password, return preview data
    const path = join(process.cwd(), 'public/uploads', note.filename);
    const fileBuffer = await readFile(path);
    
    // Return preview data (first 100KB for demo)
    const previewBuffer = fileBuffer.subarray(0, Math.min(100 * 1024, fileBuffer.length));
    
    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(previewBuffer);
    
    const response = new NextResponse(uint8Array);
    response.headers.set('Content-Type', note.fileType || 'application/pdf');
    response.headers.set('Content-Disposition', `inline; filename="preview-${note.originalname}"`);
    
    return response;
  } catch (error) {
    console.error('Error previewing note:', error);
    return new NextResponse('Failed to preview note', { status: 500 });
  }
}