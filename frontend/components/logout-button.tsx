"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function LogoutButton() {
  const router = useRouter()
  const handleLogout = async () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <Button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </Button>
  )
}
