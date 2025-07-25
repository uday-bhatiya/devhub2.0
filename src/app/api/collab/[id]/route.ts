import { NextRequest, NextResponse } from "next/server"
import CollabPost from "@/models/CollabPost"
import { connectDB } from "@/lib/db"

export async function GET(
  request: NextRequest,
  context: any 
) {
  try {
    await connectDB();

    const { id } = context.params;

    const post = await CollabPost.findById(id)
      .populate("creator", "fullName email avatar username")
      .populate("applicants.user", "fullName email avatar username")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "fullName avatar username"
        }
      });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post }, { status: 200 })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
