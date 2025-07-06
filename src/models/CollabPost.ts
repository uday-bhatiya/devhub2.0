import mongoose, { Document, Schema, models, model } from "mongoose"

export interface Applicant {
  user: mongoose.Types.ObjectId
  message?: string
  status: "pending" | "selected" | "rejected"
}

export interface ICollabPost extends Document {
  creator: mongoose.Types.ObjectId
  likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
  comments: {
    user: mongoose.Types.ObjectId
    text: string
    createdAt: Date
  }[]
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
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        user: { type: mongoose.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now },
      }
    ]
  },
  { timestamps: true }
)

const CollabPost = models.CollabPost || model<ICollabPost>("CollabPost", CollabPostSchema);

export default CollabPost
