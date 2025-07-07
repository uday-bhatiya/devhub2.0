import { NextRequest, NextResponse } from "next/server"
import CollabPost from "@/models/CollabPost"
import { connectDB } from "@/lib/db"

export async function GET(req: NextRequest,context: any) {
  await connectDB();
  const { userId } = context.params;

  try {
    const collabPosts = await CollabPost.find({ creator: userId }).sort({ createdAt: -1 });
    return NextResponse.json(collabPosts);
  } catch (_error) {
    return NextResponse.json({ message: "Failed to fetch collab posts", err: _error }, { status: 500 });
  }
}
