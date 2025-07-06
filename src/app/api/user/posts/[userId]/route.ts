import { NextRequest, NextResponse } from "next/server"
import Post from "@/models/Post"
import { connectDB } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  await connectDB();

  try {
    const posts = await Post.find({ owner: params.userId }).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
