"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Key } from "lucide-react"
import { apiRequest } from "@/lib/api"

interface CMSLoginProps {
  onLogin: (token: string) => void
}

export default function CMSLogin({ onLogin }: CMSLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!username || !password) {
        setError("Username and master key are required.")
        return
      }

      const result = await apiRequest({
        url: "/v1/auth/cms-login",
        method: "POST",
        data: { username, password },
      })

      if (result.status === "success" && result.response) {
        const data = result.response as Record<string, unknown>
        const accessToken = (data.access_token as string) || (data.token as string)
        if (accessToken) {
          onLogin(accessToken)
        } else {
          setError("Login succeeded but no token returned.")
        }
      } else {
        setError("Invalid master key. Please check your credentials.")
      }
    } catch (err) {
      setError("Failed to connect to CMS API. Please check that the API server is running.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">WikiAI CMS</CardTitle>
          <p className="text-muted-foreground">Login to manage landing page content</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="bg-background border-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Master Key</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master key"
                required
                className="bg-background border-input"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Login to CMS
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>CMS Login Instructions:</strong>
            </p>
            <div className="text-xs space-y-1">
              <div>1. Use username: <code className="bg-background px-1 rounded">admin</code></div>
              <div>2. Enter the master key from the backend .env file</div>
              <div>3. Authenticates via <code className="bg-background px-1 rounded">/v1/auth/cms-login</code></div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Check the backend .env file for the current master key (CMS_MASTER_KEY).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
