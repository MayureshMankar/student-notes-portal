import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Define the type for notes storage
interface INoteStorage {
  _id: string;
  title: string;
  description: string;
  subject: string;
  tags: string[];
  filename: string;
  originalname: string;
  fileSize: number;
  uploadDate: Date;
  downloadCount: number;
  isPasswordProtected: boolean;
  password?: string;
  ownerId?: string;
}

// In-memory storage for development
const notesStorage: INoteStorage[] = [];
let isConnected = false;

async function dbConnect() {
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not provided. Using in-memory storage for development.');
    isConnected = true;
    return { isConnected: true };
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
    return { isConnected: true };
  } catch (error) {
    console.warn('MongoDB connection failed. Using in-memory storage for development.', error);
    isConnected = true;
    return { isConnected: true };
  }
}

// Export storage methods for in-memory fallback
export { notesStorage, isConnected };
export default dbConnect;