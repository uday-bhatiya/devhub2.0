import { NextRequest, NextResponse } from "next/server"
import CollabPost from "@/models/CollabPost"
import { connectDB } from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await getUserFromToken(req)
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, requiredSkills, githubLink } = await req.json()

    if (!title || !description || !githubLink) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const newPost = await CollabPost.create({
      creator: user._id,
      title,
      description,
      requiredSkills,
      githubLink,
    })

    return NextResponse.json({ message: "Collab post created", post: newPost }, { status: 201 })
  } catch (error) {
    console.error("Error creating collab post:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
