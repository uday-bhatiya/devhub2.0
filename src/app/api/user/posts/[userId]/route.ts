import { NextRequest, NextResponse } from "next/server"
import Post from "@/models/Post"
import { connectDB } from "@/lib/db"
import { error } from "console";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  await connectDB();

  try {
    const posts = await Post.find({ owner: params.userId }).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (_error) {
    return NextResponse.json({ message: "Failed to fetch posts", err: error }, { status: 500 });
  }
}
