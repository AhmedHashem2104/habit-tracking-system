"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Auth0Provider, type Auth0ProviderOptions, useAuth0 } from "@auth0/auth0-react"

// Auth0 configuration
const auth0Config: Auth0ProviderOptions = {
  domain: "dev-f1hbv678endiqp6t.us.auth0.com", // Replace with your Auth0 domain
  clientId: "V209H6cNbS2fQsH30pEqgfDeC0q6F7hi", // Replace with your Auth0 client ID
  authorizationParams: {
    redirect_uri: "http://localhost:3000", // Replace with your redirect URI
  },
}

// Auth context
type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  user: any
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <Auth0Provider {...auth0Config}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </Auth0Provider>
  )
}

function AuthProviderContent({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0()

  const login = () => {
    loginWithRedirect()
  }

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout: handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// HOC to protect pages that require authentication
export function withPageAuthRequired(Component: ReactNode) {
  const WithPageAuthRequired = () => {
    const { isAuthenticated, isLoading, login } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        login()
      }
    }, [isLoading, isAuthenticated, login, router])

    if (isLoading) {
      return (
        <div className="flex h-screen w-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Loading...</h2>
            <p className="text-muted-foreground">Please wait while we load your data</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null // Will redirect in the useEffect
    }

    return <>{Component}</>
  }

  return <WithPageAuthRequired />
}
