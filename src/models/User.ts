import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: String,
    bio: String,
    skills: [String],
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model<IUser>('User', UserSchema);
