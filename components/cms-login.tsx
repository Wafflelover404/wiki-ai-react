"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Key } from "lucide-react"
import { API_CONFIG } from "@/lib/config"

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
      const response = await fetch(`${API_CONFIG.BASE_URL}/v1/auth/cms-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.access_token) {
          onLogin(data.access_token)
          return
        }
      }

      const data = await response.json().catch(() => ({}))
      setError(data?.error?.message || "Invalid CMS credentials")
    } catch (err) {
      setError("Failed to connect. Make sure the API is running on port 9001.")
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
          <p className="text-muted-foreground">Enter CMS credentials to manage content</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cmsadmin"
                required
                className="bg-background border-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Password</label>
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
              <strong>CMS Access:</strong>
            </p>
            <div className="text-xs space-y-1">
              <div>Credentials configured server-side via env vars:</div>
              <code className="block bg-background px-2 py-1 rounded mt-1 text-[10px] leading-relaxed">
                CMS_MASTER_USERNAME=cmsadmin<br/>
                CMS_MASTER_KEY=AdminTestPassword1423
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
