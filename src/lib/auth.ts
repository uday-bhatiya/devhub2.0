import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { User } from "@/models/User"

export const getUserFromToken = async (req: Request) => {
  const token = (await cookies()).get("token")?.value
  if (!token) return null

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    const user = await User.findById(decoded.id).select("-password")
    return user
  } catch {
    return null
  }
}
