import { getUserFromToken } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Notification } from "@/models/Notification"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    await connectDB()
    try {
        const user = await getUserFromToken(req)
        if (!user) return new NextResponse("Unauthorized", { status: 401 })

        const notification = await Notification.findByIdAndUpdate(
            params.id,
            { read: true },
            { new: true }
        )

        return NextResponse.json(notification)
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}