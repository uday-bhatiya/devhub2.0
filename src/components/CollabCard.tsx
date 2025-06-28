import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ApplyModal from "./ApplyModal"

type CollabCardProps = {
  id: string
  title: string
  description: string
  skills: string[]
  creatorName: string
  postedAt: string
  onApply?: () => void
  applicants: { user: string }[]
  currentUserId: string
}

const CollabCard = ({
  id,
  title,
  description,
  skills,
  creatorName,
  postedAt,
  onApply,
  applicants,
  currentUserId,

}: CollabCardProps) => {

  const alreadyApplied = applicants.some(app => app.user === currentUserId)

  return (
    <Card className="flex flex-row justify-between items-start w-[48%] px-6 py-4">
      <div className="flex flex-col gap-2">
        <CardHeader className="p-0">
          <CardTitle className="text-lg font-bold text-blue-600">[Collab] {title}</CardTitle>
          <CardDescription className="text-gray-600">{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex flex-col gap-2 mt-2">
          <div className="flex gap-2 flex-wrap text-sm">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full text-xs">
                {skill}
              </span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            Posted {postedAt} by {creatorName}
          </span>
        </CardContent>
      </div>
      <div className="pt-4">
        {alreadyApplied ? (
          <Button disabled>
            Already Applied
          </Button>
        ) : (
          <ApplyModal postId={id} />
        )}
      </div>
    </Card>
  )
}

export default CollabCard