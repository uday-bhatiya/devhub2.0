import { connectDB } from "@/lib/db"
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest, { params }: { params: { username: string } }) {
    await connectDB();

    try {
        const user = await User.findOne({ username: params.username }).select("-password -__v");
        if (!user){
          return NextResponse.json({ message: "User not found" }, { status: 404 })  
        } 

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }

}