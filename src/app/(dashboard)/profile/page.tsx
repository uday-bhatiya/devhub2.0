"use client";

import { useAuth } from '@/context/AuthContext';
import React from 'react'

const page = () => {

  const { user } = useAuth();
  console.log(user)

  return (
    <div>{user?.fullName}</div>
  )
}

export default page