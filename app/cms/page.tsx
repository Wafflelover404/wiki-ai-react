"use client"

import { useState } from "react"
import CMSLogin from "@/components/cms-login"
import CMSDashboard from "@/components/cms-dashboard"

export default function CMSPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState("")

  const handleLogin = (authToken: string) => {
    setToken(authToken)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setToken("")
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <CMSLogin onLogin={handleLogin} />
  }

  return <CMSDashboard token={token} onLogout={handleLogout} />
}
