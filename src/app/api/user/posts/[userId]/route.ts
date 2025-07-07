import { NextRequest, NextResponse } from "next/server"
import Post from "@/models/Post"
import { connectDB } from "@/lib/db"

export async function GET(req: NextRequest, context: any) {
  await connectDB();
   const { userId } = context.params;

  try {
    const posts = await Post.find({ owner: userId }).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (_error) {
    return NextResponse.json({ message: "Failed to fetch posts", err: _error }, { status: 500 });
  }
}
