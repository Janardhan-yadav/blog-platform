export interface User {
  id: string
  email: string
  name: string
  profilePicture?: string
  bio?: string
  createdAt?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("auth_token", token)
}

export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("auth_token")
}

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

export const setStoredUser = (user: User): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("user", JSON.stringify(user))
}

export const removeStoredUser = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("user")
}
