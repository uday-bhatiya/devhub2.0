import { getUserFromToken } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Notification } from "@/models/Notification"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    await connectDB()
    try {
        const user = await getUserFromToken(req)
        if (!user) return new NextResponse("Unauthorized", { status: 401 })

        const notifications = await Notification.find({ recipient: user._id })
            .sort({ createdAt: -1 })
            .limit(20)

        return NextResponse.json(notifications)
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}