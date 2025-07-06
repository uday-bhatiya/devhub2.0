import { Notification } from "@/models/Notification"

export const createNotification = async ({
  recipient,
  sender,
  type,
  message,
  link,
}: {
  recipient: string
  sender: string
  type: "like" | "comment" | "collab_request" | "collab_selected" | "follow"
  message: string
  link: string
}) => {
  await Notification.create({
    recipient,
    sender,
    type,
    message,
    link,
  })
}