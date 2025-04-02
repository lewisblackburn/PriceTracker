import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

interface User {
  id: number
  email: string
}

interface AuthResult {
  user: User | null
  loading: boolean
}

export default function useAuth(): AuthResult {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const decoded: User = jwtDecode(token)
      setUser(decoded)
    } catch (e) {
      console.error("Invalid token", e)
      setUser(null)
    }

    setLoading(false)
  }, [])

  return { user, loading }
}
