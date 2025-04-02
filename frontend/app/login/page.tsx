"use client"

import LoginForm from "@/features/authentication/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid place-items-center h-screen">
      <div className="min-w-[300px] max-w-[400px] w-full">
        <LoginForm />
      </div>
    </div>
  )
}
