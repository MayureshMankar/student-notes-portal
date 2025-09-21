import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { isConnected } from '@/lib/dbConnect';
import Note, { createNoteInMemory, getAllNotesInMemory } from '@/models/Note';
import User from '@/models/User';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { validateSession } from '@/lib/auth';

// Helper function to determine file type from extension
const getFileTypeFromExtension = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'csv': 'text/csv',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif'
  };
  return mimeTypes[extension] || 'application/octet-stream';
};

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');
    const sessionId = authHeader ? authHeader.split(' ')[1] : null;
    const userId = sessionId ? validateSession(sessionId) : null;
    
    let notes;
    if (isConnected) {
      // Try to use MongoDB
      try {
        // Show all notes to everyone (public visibility)
        notes = await Note.find({}).sort({ uploadDate: -1 });
      } catch (err) {
        // Fallback to in-memory storage
        console.warn('MongoDB query failed, using in-memory storage:', err);
        notes = getAllNotesInMemory();
      }
    } else {
      // Use in-memory storage
      notes = getAllNotesInMemory();
    }
    
    return NextResponse.json({ success: true, data: notes });
  } catch (err) {
    console.error('Error fetching notes:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');
    const sessionId = authHeader ? authHeader.split(' ')[1] : null;
    const userId = sessionId ? validateSession(sessionId) : null;
    
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const subject = formData.get('subject') as string || 'General';
    const tags = (formData.get('tags') as string)?.split(',').map(tag => tag.trim()) || [];
    const file = formData.get('file') as File;
    const password = formData.get('password') as string || undefined;
    
    if (!title || !description || !file) {
      return NextResponse.json({ success: false, error: 'Title, description, and file are required' }, { status: 400 });
    }
    
    // Save file to uploads directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filename = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'public/uploads', filename);
    
    await writeFile(path, buffer);
    
    // Determine file type
    const fileType = file.type || getFileTypeFromExtension(file.name);
    
    // Prepare note data for MongoDB and in-memory storage
    const baseNoteData = {
      title,
      description,
      subject,
      tags,
      filename,
      originalname: file.name,
      fileSize: file.size,
      fileType,
      isPasswordProtected: !!password,
      password
    };

    // Add ownerId only if it exists
    const noteData = userId 
      ? { ...baseNoteData, ownerId: userId }
      : baseNoteData;

    let note;
    if (isConnected) {
      // Try to use MongoDB
      try {
        note = await Note.create(noteData);
        // If user is authenticated, add note to their collection
        if (userId) {
          await User.findByIdAndUpdate(userId, { $push: { notes: note._id } });
        }
      } catch (err) {
        // Fallback to in-memory storage
        console.warn('MongoDB create failed, using in-memory storage:', err);
        note = createNoteInMemory(noteData);
      }
    } else {
      // Use in-memory storage
      note = createNoteInMemory(noteData);
    }
    
    return NextResponse.json({ success: true, data: note });
  } catch (err) {
    console.error('Error uploading note:', err);
    return NextResponse.json({ success: false, error: 'Failed to upload note' }, { status: 500 });
  }
}