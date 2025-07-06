import jwt, { JwtPayload } from "jsonwebtoken"
import { cookies } from "next/headers"
import { User } from "@/models/User"

export const getUserFromToken = async (_req: Request) => {
  const token = (await cookies()).get("token")?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.id).select("-password")
    return user
  } catch {
    return null
  }
}
