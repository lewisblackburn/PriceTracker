"use client";

import useAuth from "./useAuth"

export function useIsLoggedIn(): boolean {
  const user = useAuth()
  return !!user
}
