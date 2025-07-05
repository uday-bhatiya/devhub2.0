import mongoose, { Document, Schema, model, models } from "mongoose"

export interface IPost extends Document {
  title: string
  description: string
  image?: string
  tags: string[]
  githubUrl?: string
  owner: mongoose.Types.ObjectId
  likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
  comments: {
    user: mongoose.Types.ObjectId
    text: string
    createdAt: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: String,
    tags: [String],
    githubUrl: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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

const Post = models.Post || model<IPost>("Post", PostSchema);
export default Post;
