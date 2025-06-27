import { NextRequest, NextResponse } from "next/server"
import CollabPost from "@/models/CollabPost"
import { getUserFromToken } from "@/lib/auth"
import { connectDB } from "@/lib/db"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const user = await getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { message } = await req.json()

    const post = await CollabPost.findById(params.id)
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    //praevent applying twice
    const alreadyApplied = post.applicants.some(app => app.user.toString() === user._id.toString())
    if (alreadyApplied) {
      return NextResponse.json({ message: "You already applied" }, { status: 400 })
    }

    post.applicants.push({
      user: user._id,
      message,
      status: "pending"
    })

    await post.save()

    return NextResponse.json({ message: "Application submitted" }, { status: 200 })
  } catch (err) {
    console.error("Apply error:", err)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
