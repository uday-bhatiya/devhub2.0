import { NextRequest, NextResponse } from "next/server"
import CollabPost from "@/models/CollabPost"
import { connectDB } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  await connectDB();

  try {
    const collabPosts = await CollabPost.find({ creator: params.userId }).sort({ createdAt: -1 });
    return NextResponse.json(collabPosts);
  } catch (_error) {
    return NextResponse.json({ message: "Failed to fetch collab posts", err: _error }, { status: 500 });
  }
}
