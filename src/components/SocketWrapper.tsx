"use client"
import { useEffect } from "react"
import { toast } from "sonner" // or your own notification UI
import { useAuth } from "@/context/AuthContext"
import { io, Socket } from "socket.io-client"

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string)

const SocketWrapper = () => {

  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) return

    socket.emit("join", user._id) // Join room

    socket.on("receiveNotification", (data) => {
      console.log("🔔 New Notification:", data)

      toast(data.message) // Or update notification state
    })

    return () => {
      socket.off("receiveNotification")
    }
  }, [user?._id])

  return null
}

export default SocketWrapper