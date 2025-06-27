import axios from "@/lib/axios"

export const registerUser = (data: {
  fullName: string
  email: string
  password: string
}) => axios.post("/api/auth/register", data)

export const loginUser = (data: {
  email: string
  password: string
}) => axios.post("/api/auth/login", data)

export const getCurrentUser = () => axios.get("/api/auth/me");

export const logoutUser = () => axios.post("/api/auth/logout");
