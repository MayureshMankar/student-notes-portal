import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string; // Hashed password
  createdAt: Date;
  notes: string[]; // Array of note IDs owned by this user
}

// Mongoose schema (for MongoDB)
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  notes: [{ type: String }] // References to note IDs
});

// Define the type for users storage
interface IUserStorage {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  notes: string[];
}

// In-memory storage for users
const usersStorage: IUserStorage[] = [];

// In-memory storage functions
export const createUserInMemory = (userData: Partial<IUserStorage>) => {
  const user = {
    _id: `user_${Date.now()}`,
    name: userData.name || '',
    email: userData.email || '',
    password: userData.password || '',
    createdAt: new Date(),
    notes: []
  };
  usersStorage.push(user);
  return user;
};

export const findUserByIdInMemory = (id: string) => {
  return usersStorage.find(user => user._id === id);
};

export const findUserByEmailInMemory = (email: string) => {
  return usersStorage.find(user => user.email === email);
};

export const addUserNoteInMemory = (userId: string, noteId: string) => {
  const user = usersStorage.find(user => user._id === userId);
  if (user) {
    user.notes.push(noteId);
    return user;
  }
  return null;
};

// Export both Mongoose model and in-memory functions
const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default UserModel;