import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "./ui/badge"

type CollabCardProps = {
  id: string
  title: string
  description: string
  skills: string[]
  creator: string
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
  creator,
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
          <CardTitle className="text-lg font-bold text-blue-600"><Link href={`/collab/${id}`}>[Collab] {title}</Link></CardTitle>
          <CardDescription className="text-gray-600">{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex flex-col gap-2 mt-2">
          <div className="flex gap-2 flex-wrap text-sm">
            {skills.map((skill, idx) => (
              <span key={idx} className="text-xs">
                {skill.length > 0 ? (
                  <Badge>{skill}</Badge>
                ) : ("")}
              </span>
            ))}
          </div>
         <Link className="text-xs text-muted-foreground" href={`user/${creator}`}> Posted {postedAt} by {creator}</Link>
        </CardContent>
      </div>
      <div className="pt-4">
        <Link href={`/collab/${id}`}>
          <Button>
            View
          </Button>
        </Link>

      </div>
    </Card>
  )
}

export default CollabCard