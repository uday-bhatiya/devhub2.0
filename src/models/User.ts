import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  username?: string;
  email: string;
  password: string;
  avatar?: string;
  headline?: string;
  about?: string;
  skills?: string[];
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: String,
    headline: String,
    about: String,
    skills: [String],
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model<IUser>('User', UserSchema);
