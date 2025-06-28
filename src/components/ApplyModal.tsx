"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { applyToCollabPost } from "@/lib/api"
import { toast } from "sonner"

export default function ApplyModal({ postId }: { postId: string }) {
  const [message, setMessage] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleApply = async () => {
    try {
      setLoading(true)
      await applyToCollabPost(postId, message)
      toast.success("Application sent successfully!");
      setOpen(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send application");
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Apply</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Why do you want to join?</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Write a short message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="mt-4"
        />
        <Button onClick={handleApply} disabled={loading || message.length < 5} className="mt-4">
          {loading ? "Applying..." : "Send Application"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
