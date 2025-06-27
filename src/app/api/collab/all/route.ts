import { connectDB } from "@/lib/db"
import CollabPost from "@/models/CollabPost"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB();

    const posts = await CollabPost.find()
      .populate("creator", "fullName email avatar") // show creator's details
      .sort({ createdAt: -1 })

    return NextResponse.json({ posts }, { status: 200 })
  } catch (error) {
    console.error("Error fetching collab posts:", error)
    return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 })
  }
}
