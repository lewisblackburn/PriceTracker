"use client"

import RegisterForm from "@/features/authentication/components/register-form"

export default function RegisterPage() {
  return (
    <div className="grid place-items-center h-screen">
      <div className="min-w-[300px] max-w-[400px] w-full">
        <RegisterForm />
      </div>
    </div>
  )
}
