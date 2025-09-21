"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, type AuthState, getAuthToken, getStoredUser, removeAuthToken, removeStoredUser } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  })

  useEffect(() => {
    const token = getAuthToken()
    const user = getStoredUser()

    if (token && user) {
      setAuthState({
        user,
        token,
        isAuthenticated: true,
      })
    }
  }, [])

  const login = (token: string, user: User) => {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("user", JSON.stringify(user))
    setAuthState({
      user,
      token,
      isAuthenticated: true,
    })
  }

  const logout = () => {
    removeAuthToken()
    removeStoredUser()
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  }

  const updateUser = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user))
    setAuthState((prev) => ({
      ...prev,
      user,
    }))
  }

  return <AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>{children}</AuthContext.Provider>
}
