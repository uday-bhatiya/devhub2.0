import { NextRequest, NextResponse } from "next/server"
import Post from "@/models/Post"
import { getUserFromToken } from "@/lib/auth"
import { connectDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
  
    const posts = await Post.find({ owner: user._id })
      .sort({ createdAt: -1 })
      .populate("owner", "fullName email username")
  
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching user posts:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
