"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getCurrentUser } from "@/lib/api"

type User = {
  _id: string
  username?: string
  fullName?: string
  email: string
  avatar?: string
  about?: string
  headline?: string 
  skills?: string[]
}

type AuthContextType = {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {}
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getCurrentUser()
        setUser(data.user)
        console.log(data.user)
      } catch {
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
