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
  followers?: mongoose.Types.ObjectId[];
  following?: mongoose.Types.ObjectId[];
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
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model<IUser>('User', UserSchema);
