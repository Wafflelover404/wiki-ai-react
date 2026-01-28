"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Key } from "lucide-react"

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
      // Simple authentication: admin + master key
      if (username === "admin" && password === "U4XjElktw2jFG5duv1Dp-hPRvUty-U1wWseZLDr9tMsATYd_06O7G5k5M6-wH2dlCzeyFnYKmWc1mBA2w-nX3A") {
        // Test the token with API
        const response = await fetch("http://127.0.0.1:8000/api/cms/content/stats", {
          headers: {
            "Authorization": `Bearer ${password}`,
            "Content-Type": "application/json"
          }
        })

        if (response.ok) {
          onLogin(password)
          setError("")
        } else {
          setError("Invalid master token")
        }
      } else {
        setError("Invalid credentials. Use username: admin, password: master key")
      }
    } catch (err) {
      setError("Failed to connect to CMS API. Make sure the API is running.")
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
              <strong>Development Credentials:</strong>
            </p>
            <div className="text-xs space-y-1 font-mono">
              <div>Username: admin</div>
              <div>Password: U4XjElktw2jFG5duv1Dp-hPRvUty-U1wWseZLDr9tMsATYd_06O7G5k5M6-wH2dlCzeyFnYKmWc1mBA2w-nX3A</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
