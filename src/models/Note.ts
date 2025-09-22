import mongoose, { Document, Schema } from 'mongoose';
import { notesStorage } from '@/lib/dbConnect';

export interface INote extends Document {
  _id: string;
  title: string;
  description: string;
  subject: string;
  tags: string[];
  filename: string;
  originalname: string;
  fileSize: number;
  fileType: string;
  fileData?: string; // Base64 encoded file data for Vercel deployment
  uploadDate: Date;
  downloadCount: number;
  // Privacy settings
  isPasswordProtected: boolean;
  password?: string;
  ownerId?: string; // ID of the user who uploaded the note
}

// Mongoose schema (for MongoDB)
const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, default: 'General' },
  tags: [{ type: String }],
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileType: { type: String },
  fileData: { type: String }, // Base64 encoded file data for Vercel deployment
  uploadDate: { type: Date, default: Date.now },
  downloadCount: { type: Number, default: 0 },
  // Privacy settings
  isPasswordProtected: { type: Boolean, default: false },
  password: { type: String }, // Store password as plain text for simplicity
  ownerId: { type: String }
});

// In-memory storage functions
export const createNoteInMemory = (noteData: Partial<INote>) => {
  const note = {
    _id: Date.now().toString(),
    title: noteData.title || '',
    description: noteData.description || '',
    subject: noteData.subject || 'General',
    tags: noteData.tags || [],
    filename: noteData.filename || '',
    originalname: noteData.originalname || '',
    fileSize: noteData.fileSize || 0,
    fileType: noteData.fileType || '',
    fileData: noteData.fileData || undefined,
    uploadDate: new Date(),
    downloadCount: 0,
    isPasswordProtected: noteData.isPasswordProtected || false,
    password: noteData.password,
    ownerId: noteData.ownerId
  };
  notesStorage.push(note);
  return note;
};

export const getAllNotesInMemory = () => {
  return [...notesStorage].reverse(); // Return newest first
};

export const findNoteByIdInMemory = (id: string) => {
  return notesStorage.find(note => note._id === id);
};

export const updateNoteInMemory = (id: string, updateData: Partial<INote>) => {
  const index = notesStorage.findIndex(note => note._id === id);
  if (index !== -1) {
    notesStorage[index] = { ...notesStorage[index], ...updateData };
    return notesStorage[index];
  }
  return null;
};

// Export both Mongoose model and in-memory functions
const NoteModel = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
export default NoteModel;
export { NoteSchema };