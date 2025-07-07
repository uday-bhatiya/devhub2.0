import { NextRequest, NextResponse } from "next/server"
import CollabPost from "@/models/CollabPost"
import { getUserFromToken } from "@/lib/auth"
import { connectDB } from "@/lib/db"

export async function POST(req: NextRequest, context: any ) {
  try {
    await connectDB();

    const { id } = context.params;

    const user = await getUserFromToken()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { message } = await req.json()

    const post = await CollabPost.findById(id)
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    interface Applicant {
      user: string;
      message: string;
      status: string;
    }

    interface CollabPostType {
      applicants: Applicant[];
      creator: string;
      _id: string;
      save: () => Promise<void>;
    }

    const postTyped = post as CollabPostType;
    const alreadyApplied = postTyped.applicants.some((app: Applicant) => app.user.toString() === user._id.toString());
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
