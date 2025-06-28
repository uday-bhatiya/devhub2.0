import mongoose, { Document, Schema, model, models } from "mongoose"

export interface IPost extends Document {
  title: string
  description: string
  image?: string
  tags: string[]
  githubUrl?: string
  owner: mongoose.Types.ObjectId
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
  },
  { timestamps: true }
)

const Post = models.Post || model<IPost>("Post", PostSchema);
export default Post;
