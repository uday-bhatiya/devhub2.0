import { getUserFromToken } from "@/lib/auth"
import { connectDB } from "@/lib/db";
import CollabPost from "@/models/CollabPost"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest,
  { params }: { params: { postId: string; userId: string } }
) {
  try {
    await connectDB();

    const user = await getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { status } = await req.json()

    if (!["selected", "rejected"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 })
    }

    const post = await CollabPost.findById(params.postId)

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    if (post.creator.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const applicant = post.applicants.find(
      (a) => a.user.toString() === params.userId
    )

    if (!applicant) {
      return NextResponse.json({ message: "Applicant not found" }, { status: 404 })
    }

    applicant.status = status
    await post.save()

    return NextResponse.json({ message: `Applicant ${status}` }, { status: 200 })
  } catch (err) {
    console.error("Decision error:", err)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
