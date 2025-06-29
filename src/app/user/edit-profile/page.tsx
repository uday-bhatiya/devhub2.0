import EditProfileForm from '@/components/EditProfileForm'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import React from 'react'

const page = () => {
  return (
   <div className="max-w-xl mx-auto py-12 px-4">
     <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <div className="flex justify-center mb-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>

      <EditProfileForm />

    </div>
  )
}

export default page