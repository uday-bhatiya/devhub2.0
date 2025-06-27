import mongoose, { Document, Schema, Model } from "mongoose"

export interface Applicant {
  user: mongoose.Types.ObjectId
  message?: string
  status: "pending" | "selected" | "rejected"
}

export interface ICollabPost extends Document {
  creator: mongoose.Types.ObjectId
  title: string
  description: string
  requiredSkills: string[]
  githubLink: string
  status: "open" | "closed"
  applicants: Applicant[]
  createdAt: Date
  updatedAt: Date
}

const CollabPostSchema: Schema<ICollabPost> = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    githubLink: {
      type: String,
      required: true,
      match: [/^https:\/\/github\.com\/.+$/, "Invalid GitHub link"],
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    applicants: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        message: {
          type: String,
        },
        status: {
          type: String,
          enum: ["pending", "selected", "rejected"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
)

const CollabPost: Model<ICollabPost> =
  mongoose.models.CollabPost || mongoose.model<ICollabPost>("CollabPost", CollabPostSchema)

export default CollabPost
