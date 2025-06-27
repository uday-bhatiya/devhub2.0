import { getUserFromToken } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import CollabPost from "@/models/CollabPost"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const post = await CollabPost.findById(params.id)

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    if (post.creator.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await post.deleteOne()

    return NextResponse.json({ message: "Post deleted" }, { status: 200 })
  } catch (err) {
    console.error("Delete error:", err)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
