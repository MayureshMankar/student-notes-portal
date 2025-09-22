import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { isConnected } from '@/lib/dbConnect';
import Note, { createNoteInMemory, getAllNotesInMemory } from '@/models/Note';
import User from '@/models/User';
import { writeFile, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
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
    'gif': 'image/gif',
    // Programming files
    'py': 'text/x-python',
    'js': 'text/javascript',
    'ts': 'text/typescript',
    'html': 'text/html',
    'css': 'text/css',
    'java': 'text/x-java-source',
    'cpp': 'text/x-c++src',
    'c': 'text/x-csrc',
    'h': 'text/x-chdr',
    'hpp': 'text/x-c++hdr',
    'sql': 'text/x-sql',
    'php': 'text/x-php',
    'rb': 'text/x-ruby',
    'go': 'text/x-go',
    'rs': 'text/x-rust',
    'sh': 'application/x-sh',
    'yaml': 'text/yaml',
    'yml': 'text/yaml',
    'json': 'application/json',
    'xml': 'application/xml',
    'md': 'text/markdown'
  };
  return mimeTypes[extension] || 'application/octet-stream';
};

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check if user is authenticated
    const authHeader = request.headers.get('authorization');
    const sessionId = authHeader ? authHeader.split(' ')[1] : null;
    // Note: userId is not used in this function but kept for consistency with other routes
    const userId = sessionId ? validateSession(sessionId) : null;
    
    let notes;
    if (isConnected) {
      // Try to use MongoDB
      try {
        // Show all notes to everyone (public visibility)
        notes = await Note.find({}).sort({ uploadDate: -1 });
      } catch (error) {
        // Fallback to in-memory storage
        console.warn('MongoDB query failed, using in-memory storage:', error);
        notes = getAllNotesInMemory();
      }
    } else {
      // Use in-memory storage
      notes = getAllNotesInMemory();
    }
    
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
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
    
    // Log request details for debugging
    console.log('Upload request received');
    console.log('Session ID:', sessionId);
    console.log('User ID:', userId);
    
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const subject = formData.get('subject') as string || 'General';
    const tags = (formData.get('tags') as string)?.split(',').map(tag => tag.trim()) || [];
    const file = formData.get('file') as File;
    const password = formData.get('password') as string || undefined;
    
    console.log('Form data received:', { title, description, subject, tags: tags.length, hasFile: !!file, hasPassword: !!password });
    
    if (!title || !description || !file) {
      console.log('Missing required fields');
      return NextResponse.json({ success: false, error: 'Title, description, and file are required' }, { status: 400 });
    }
    
    // Save file to uploads directory
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Use tmp directory for Vercel compatibility (read-only file system)
      const tmpDir = '/tmp'; // Vercel writable directory
      const filename = `${Date.now()}-${file.name}`;
      const tmpPath = join(tmpDir, filename);
      console.log('Temporary file path:', tmpPath);
      
      // Write file to tmp directory
      await writeFile(tmpPath, buffer);
      console.log('File written to tmp directory');
      
      // For Vercel deployment, we need to store files differently
      // We'll store the file data in MongoDB as base64 for small files
      // For larger files, we would need to use a storage service like AWS S3
      
      // Determine file type
      const fileType = file.type || getFileTypeFromExtension(file.name);
      
      // Convert file to base64 for storage in MongoDB
      const fileBase64 = buffer.toString('base64');
      
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
        fileData: fileBase64, // Store file data as base64
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
          console.log('Note created in MongoDB:', note._id);
          // If user is authenticated, add note to their collection
          if (userId) {
            await User.findByIdAndUpdate(userId, { $push: { notes: note._id } });
          }
          
          // Clean up tmp file
          try {
            await unlink(tmpPath);
            console.log('Temporary file removed');
          } catch (unlinkError) {
            console.warn('Failed to remove temporary file:', unlinkError);
          }
        } catch (err) {
          // Fallback to in-memory storage
          console.warn('MongoDB create failed, using in-memory storage:', err);
          note = createNoteInMemory(noteData);
        }
      } else {
        // Use in-memory storage
        console.log('Using in-memory storage');
        note = createNoteInMemory(noteData);
      }
      
      console.log('Upload successful');
      return NextResponse.json({ success: true, data: note });
    } catch (fileError: unknown) {
      console.error('File handling error:', fileError);
      const errorMessage = fileError instanceof Error ? fileError.message : 'Unknown error';
      return NextResponse.json({ success: false, error: `File handling failed: ${errorMessage}` }, { status: 500 });
    }
  } catch (err: unknown) {
    console.error('Error uploading note:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: `Failed to upload note: ${errorMessage}` }, { status: 500 });
  }
}