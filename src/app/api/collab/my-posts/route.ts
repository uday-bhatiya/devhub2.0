import { NextResponse } from "next/server"
import CollabPost from "@/models/CollabPost"
import { getUserFromToken } from "@/lib/auth"
import { connectDB } from "@/lib/db"

export async function GET(req: Request) {
  try {
    await connectDB();

    const user = await getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

const myPosts = await CollabPost.find({ creator: user._id })
  .populate("applicants.user", "fullName email avatar")
  .sort({ createdAt: -1 })

    return NextResponse.json({ posts: myPosts }, { status: 200 })
  } catch (error) {
    console.error("Fetch user posts error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
