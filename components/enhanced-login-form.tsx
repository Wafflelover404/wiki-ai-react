"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Eye, EyeOff, Loader2, Building, UserPlus, Search, Bot, Code, FileText } from "lucide-react"
import { toast } from "sonner"
import { authApi, aiAgentApi } from "@/lib/api"

export function EnhancedLoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  // Organization creation states
  const [orgName, setOrgName] = useState("")
  const [orgSlug, setOrgSlug] = useState("")
  const [adminUsername, setAdminUsername] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [isCreatingOrg, setIsCreatingOrg] = useState(false)

  // AI Agent states
  const [aiAgentInput, setAiAgentInput] = useState("")
  const [aiAgentOutput, setAiAgentOutput] = useState("")
  const [isAiAgentLoading, setIsAiAgentLoading] = useState(false)
  const [availableFiles, setAvailableFiles] = useState<Array<{id: number, filename: string}>>([])
  const [showCommandHelp, setShowCommandHelp] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      toast.error("Please enter username and password")
      return
    }

    setIsLoading(true)
    const result = await login(username, password)
    setIsLoading(false)

    if (result.success) {
      toast.success("Login successful")
      router.push("/app")
    } else {
      toast.error(result.error || "Login failed")
    }
  }

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgName || !orgSlug || !adminUsername || !adminPassword) {
      toast.error("Please fill in all fields")
      return
    }

    setIsCreatingOrg(true)
    try {
      const result = await authApi.createOrganization({
        organization_name: orgName,
        admin_username: adminUsername,
        admin_password: adminPassword
      })

      if (result.status === "success") {
        toast.success("Organization created successfully! You can now login.")
        // Switch to login tab and populate username
        setUsername(adminUsername)
        setPassword("")
        // Reset organization form
        setOrgName("")
        setOrgSlug("")
        setAdminUsername("")
        setAdminPassword("")
      } else {
        toast.error(result.message || "Failed to create organization")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create organization")
    } finally {
      setIsCreatingOrg(false)
    }
  }

  const handleAiAgentCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiAgentInput.trim()) {
      toast.error("Please enter a command")
      return
    }

    setIsAiAgentLoading(true)
    setAiAgentOutput("Processing your command...")
    
    try {
      // For demo purposes, we'll use a temporary token
      // In production, this would come from auth context
      const tempToken = "temp-demo-token"
      
      const result = await aiAgentApi.executeCommands(tempToken, aiAgentInput)
      
      if (result.status === "success") {
        setAiAgentOutput(result.response || "Command executed successfully!")
        toast.success("Command executed successfully!")
      } else {
        setAiAgentOutput(`Error: ${result.message || "Failed to execute command"}`)
        toast.error(result.message || "Failed to execute command")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error"
      setAiAgentOutput(`Error: ${errorMessage}`)
      toast.error(errorMessage)
    } finally {
      setIsAiAgentLoading(false)
    }
  }

  const loadAvailableFiles = async () => {
    try {
      const tempToken = "temp-demo-token"
      const result = await aiAgentApi.getAvailableFiles(tempToken)
      
      if (result.status === "success") {
        setAvailableFiles(result.response?.files || [])
        toast.success("Files loaded successfully!")
      } else {
        toast.error(result.message || "Failed to load files")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load files")
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleOrgNameChange = (value: string) => {
    setOrgName(value)
    setOrgSlug(generateSlug(value))
  }

  // Dynamic background particles
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2
      })
    }
    
    let animationId: number
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`
        ctx.fill()
      })
      
      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 * (1 - distance / 100)})`
            ctx.stroke()
          }
        })
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-pink-900/20 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      
      {/* Canvas particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.6 }}
      />

      <Card className="w-full max-w-4xl relative z-10 border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">WikiAi Enhanced</CardTitle>
            <CardDescription className="mt-2">Manage your knowledge base with AI Agent</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="create-org" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Create Org
              </TabsTrigger>
              <TabsTrigger value="ai-agent" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                AI Agent
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="bg-background/50 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="create-org" className="mt-6">
              <form onSubmit={handleCreateOrganization} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    type="text"
                    placeholder="Enter organization name"
                    value={orgName}
                    onChange={(e) => handleOrgNameChange(e.target.value)}
                    disabled={isCreatingOrg}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-slug">Organization Slug</Label>
                  <Input
                    id="org-slug"
                    type="text"
                    placeholder="organization-slug"
                    value={orgSlug}
                    onChange={(e) => setOrgSlug(e.target.value)}
                    disabled={isCreatingOrg}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Admin Username</Label>
                  <Input
                    id="admin-username"
                    type="text"
                    placeholder="Enter admin username"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    disabled={isCreatingOrg}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showAdminPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      disabled={isCreatingOrg}
                      className="bg-background/50 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                    >
                      {showAdminPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isCreatingOrg}>
                  {isCreatingOrg ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Organization...
                    </>
                  ) : (
                    <>
                      <Building className="mr-2 h-4 w-4" />
                      Create Organization
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="ai-agent" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">AI Agent Commands</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCommandHelp(!showCommandHelp)}
                    className="flex items-center gap-2"
                  >
                    <Code className="w-4 h-4" />
                    {showCommandHelp ? "Hide Help" : "Show Help"}
                  </Button>
                </div>
                
                {showCommandHelp && (
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                    <h4 className="font-semibold mb-2">Available Commands:</h4>
                    <div className="space-y-1">
                      <p><code className="bg-background px-2 py-1 rounded">&lt;file-content&gt;filename.md&lt;/file-content&gt;</code> - Get file content</p>
                      <p><code className="bg-background px-2 py-1 rounded">&lt;file-id&gt;123&lt;/file-id&gt;</code> - Get file by ID</p>
                      <p><code className="bg-background px-2 py-1 rounded">&lt;fuzzy-search&gt;query&lt;/fuzzy-search&gt;</code> - Search filenames</p>
                      <p><code className="bg-background px-2 py-1 rounded">&lt;kb-search&gt;query&lt;/kb-search&gt;</code> - Search knowledge base</p>
                      <p><code className="bg-background px-2 py-1 rounded">&lt;semantic-search&gt;query&lt;/semantic-search&gt;</code> - AI-powered search</p>
                    </div>
                    <p className="text-muted-foreground">You can use multiple commands in one request!</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="ai-agent-input">AI Agent Command</Label>
                  <div className="relative">
                    <textarea
                      id="ai-agent-input"
                      placeholder="Enter your AI agent command..."
                      value={aiAgentInput}
                      onChange={(e) => setAiAgentInput(e.target.value)}
                      disabled={isAiAgentLoading}
                      className="w-full min-h-[100px] bg-background/50 p-3 font-mono text-sm resize-none"
                      rows={4}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    onClick={handleAiAgentCommand} 
                    disabled={isAiAgentLoading || !aiAgentInput.trim()}
                    className="flex-1"
                  >
                    {isAiAgentLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Bot className="mr-2 h-4 w-4" />
                        Execute Command
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={loadAvailableFiles}
                    disabled={isAiAgentLoading}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Load Files
                  </Button>
                </div>
                
                {aiAgentOutput && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      AI Agent Response
                    </h4>
                    <div className="bg-background p-3 rounded border text-sm font-mono whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                      {aiAgentOutput}
                    </div>
                  </div>
                )}
                
                {availableFiles.length > 0 && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Available Files ({availableFiles.length})
                    </h4>
                    <div className="space-y-1 max-h-[200px] overflow-y-auto">
                      {availableFiles.slice(0, 10).map((file) => (
                        <div key={file.id} className="flex items-center justify-between bg-background p-2 rounded text-sm">
                          <span className="font-mono">{file.filename}</span>
                          <span className="text-muted-foreground text-xs">ID: {file.id}</span>
                        </div>
                      ))}
                      {availableFiles.length > 10 && (
                        <p className="text-muted-foreground text-xs text-center pt-2">
                          ... and {availableFiles.length - 10} more files
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
