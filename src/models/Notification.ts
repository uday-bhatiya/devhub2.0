import mongoose, { Schema, Document } from "mongoose"

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId
  sender: mongoose.Types.ObjectId
  type: "like" | "comment" | "collab_request" | "collab_selected" | "follow"
  message: string
  read: boolean
  link: string
}

const NotificationSchema = new Schema<INotification>({
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true })

export const Notification = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);