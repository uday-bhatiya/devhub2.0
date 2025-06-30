"use client"

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

const formSchema = z.object({
  fullName: z.string().min(3),
  username: z.string().min(3),
  email: z.string().email(),
  about: z.string().optional(),
  headline: z.string().optional(),
  skills: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

 const EditProfileForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const { user } = useAuth() 
  console.log("first", user)
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      about: '',
      headline: '',
      skills: '',
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        form.reset({
          fullName: user?.fullName,
          username: user?.username || '',
          email: user?.email,
          about: user?.about || '',
          headline: user?.headline || '',
          skills: user?.skills?.join(', ') || '',
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, form])

  const onSubmit = async (values: FormData) => {
    console.log(values)
    try {
      const payload = {
        ...values,
        skills: values.skills?.split(',').map(skill => skill.trim()),
      }
      await axios.patch('/api/user/profile', payload);
      toast.success('Profile updated successfully!');
      router.push('/profile') 
    } catch (err) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Update failed:', err)
    }
  }

  if (loading) return <div className="text-center py-20">Loading...</div>

    
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input readOnly {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input readOnly type="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headline</FormLabel>
                <FormControl><Input type="text" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About</FormLabel>
                <FormControl><Textarea rows={4} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills (comma separated)</FormLabel>
                <FormControl><Input {...field} placeholder="e.g. React, Node.js, MongoDB" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Save</Button>
        </form>
      </Form>
  )
}

export default EditProfileForm;