"use client"

import EditProfileForm from '@/components/EditProfileForm'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { Camera } from 'lucide-react'
import React, { useState } from 'react'

const Page = () => {

  const { user } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [uploading, setUploading] = useState(false)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const preview = URL.createObjectURL(file)
    setAvatar(preview)

    try {
      setUploading(true)
      const res = await fetch('/api/user/profile/upload', {
        method: 'POST',
        body: file,
      })
      const data = await res.json()
      console.log("FFFFFFFFFFFFFFFF", data)
      if (!res.ok) throw new Error(data.error)
      setAvatar(data.url) // Set uploaded Cloudinary URL
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }


  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <div className="flex justify-center mb-4 relative">
        <Avatar className="h-20 w-20">
           <AvatarImage src={avatar} alt="Profile" />
          <AvatarFallback>{user?.fullName?.at(0)}</AvatarFallback>
        </Avatar>

        <Label className="absolute bottom-0 right-50 bg-gray-200 p-1 rounded-full cursor-pointer text-xs">
          <Input type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <Camera className='text-black' />
        </Label>
      </div>



      {uploading && <p className="text-center text-sm mb-4">Uploading...</p>}

      <EditProfileForm avatar={avatar} />

    </div>
  )
}

export default Page