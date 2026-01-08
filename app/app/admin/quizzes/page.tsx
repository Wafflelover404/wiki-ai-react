"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { adminApi } from "@/lib/api"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Edit,
  Trash2,
  Play,
  BarChart3,
  Users,
  Clock,
  Target,
  TrendingUp,
  Eye,
  Download,
  Upload,
  Brain,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

interface Quiz {
  id: string
  title: string
  description: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  time_limit: number
  passing_score: number
  questions: Question[]
  created_at: string
  updated_at: string
  organization_id: string
}

interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "text"
  question: string
  options?: string[]
  correct_answer: string | number
  explanation?: string
  points: number
}

interface QuizStats {
  total_submissions: number
  pass_rate: number
  avg_score: number
  avg_time_spent: number
  recent_submissions: Array<{
    user_id: string
    score: number
    passed: boolean
    submitted_at: string
  }>
}

interface QuizFormData {
  title: string
  description: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  time_limit: number
  passing_score: number
  questions: Question[]
}

export default function AdminQuizzesPage() {
  const { token, user } = useAuth()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [quizStats, setQuizStats] = useState<Record<string, QuizStats>>({})
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showStatsDialog, setShowStatsDialog] = useState(false)
  const [generatingQuiz, setGeneratingQuiz] = useState(false)
  const [formData, setFormData] = useState<QuizFormData>({
    title: "",
    description: "",
    category: "",
    difficulty: "medium",
    time_limit: 15,
    passing_score: 70,
    questions: []
  })

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getQuizzes(token)
      if (response.success) {
        setQuizzes(response.response.quizzes)
      }
    } catch (error) {
      toast.error("Failed to fetch quizzes")
    } finally {
      setLoading(false)
    }
  }

  const fetchQuizStats = async (quizId: string) => {
    try {
      const response = await adminApi.getQuizStats(quizId, token)
      if (response.success) {
        setQuizStats(prev => ({
          ...prev,
          [quizId]: response.response
        }))
      }
    } catch (error) {
      toast.error("Failed to fetch quiz statistics")
    }
  }

  const createQuiz = async () => {
    try {
      const response = await adminApi.createQuiz(formData, token)
      if (response.success) {
        toast.success("Quiz created successfully")
        setShowCreateDialog(false)
        setFormData({
          title: "",
          description: "",
          category: "",
          difficulty: "medium",
          time_limit: 15,
          passing_score: 70,
          questions: []
        })
        fetchQuizzes()
      }
    } catch (error) {
      toast.error("Failed to create quiz")
    }
  }

  const updateQuiz = async () => {
    if (!selectedQuiz) return
    
    try {
      const response = await adminApi.updateQuiz(selectedQuiz.id, formData, token)
      if (response.success) {
        toast.success("Quiz updated successfully")
        setShowEditDialog(false)
        fetchQuizzes()
      }
    } catch (error) {
      toast.error("Failed to update quiz")
    }
  }

  const deleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return
    
    try {
      const response = await adminApi.deleteQuiz(quizId, token)
      if (response.success) {
        toast.success("Quiz deleted successfully")
        fetchQuizzes()
      }
    } catch (error) {
      toast.error("Failed to delete quiz")
    }
  }

  const generateQuizFromAI = async () => {
    setGeneratingQuiz(true)
    try {
      // This would integrate with the existing quiz generation API
      // For now, we'll create a sample quiz
      const sampleQuiz: QuizFormData = {
        title: "AI Generated Knowledge Test",
        description: "Automatically generated quiz about your knowledge base",
        category: "General Knowledge",
        difficulty: "medium",
        time_limit: 10,
        passing_score: 75,
        questions: [
          {
            id: "1",
            type: "multiple-choice",
            question: "What is the primary purpose of a knowledge management system?",
            options: [
              "To store documents only",
              "To organize and retrieve information efficiently",
              "To replace human employees",
              "To create backups"
            ],
            correct_answer: 1,
            explanation: "Knowledge management systems organize information for efficient access and retrieval.",
            points: 10
          },
          {
            id: "2",
            type: "true-false",
            question: "Modern knowledge bases can only contain text documents.",
            correct_answer: "false",
            explanation: "Modern knowledge bases support various media types including images, videos, and structured data.",
            points: 10
          }
        ]
      }
      
      setFormData(sampleQuiz)
      toast.success("Quiz generated successfully! Review and save to create.")
    } catch (error) {
      toast.error("Failed to generate quiz")
    } finally {
      setGeneratingQuiz(false)
    }
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correct_answer: 0,
      explanation: "",
      points: 10
    }
    
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }))
  }

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "hard": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <>
        <AppHeader />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </main>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Quiz Management</h1>
            <p className="text-muted-foreground">Create and manage quizzes for users</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={generateQuizFromAI} variant="outline" disabled={generatingQuiz}>
              {generatingQuiz ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              Generate with AI
            </Button>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quiz
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Quiz</DialogTitle>
                  <DialogDescription>
                    Create a new quiz for users to test their knowledge
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter quiz title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Enter category"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter quiz description"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value: "easy" | "medium" | "hard") => 
                          setFormData(prev => ({ ...prev, difficulty: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                      <Input
                        id="time_limit"
                        type="number"
                        value={formData.time_limit}
                        onChange={(e) => setFormData(prev => ({ ...prev, time_limit: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passing_score">Passing Score (%)</Label>
                      <Input
                        id="passing_score"
                        type="number"
                        value={formData.passing_score}
                        onChange={(e) => setFormData(prev => ({ ...prev, passing_score: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Questions</h3>
                      <Button onClick={addQuestion} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </div>

                    <ScrollArea className="h-64">
                      <div className="space-y-4">
                        {formData.questions.map((question, index) => (
                          <Card key={question.id}>
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">Question {index + 1}</h4>
                                  <Button
                                    onClick={() => removeQuestion(index)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Question Type</Label>
                                    <Select
                                      value={question.type}
                                      onValueChange={(value: "multiple-choice" | "true-false" | "text") => 
                                        updateQuestion(index, "type", value)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                        <SelectItem value="true-false">True/False</SelectItem>
                                        <SelectItem value="text">Text Answer</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Points</Label>
                                    <Input
                                      type="number"
                                      value={question.points}
                                      onChange={(e) => updateQuestion(index, "points", parseInt(e.target.value))}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Question</Label>
                                  <Textarea
                                    value={question.question}
                                    onChange={(e) => updateQuestion(index, "question", e.target.value)}
                                    placeholder="Enter your question"
                                  />
                                </div>

                                {question.type === "multiple-choice" && (
                                  <div className="space-y-2">
                                    <Label>Options</Label>
                                    {question.options?.map((option, optIndex) => (
                                      <div key={optIndex} className="flex items-center gap-2">
                                        <Input
                                          value={option}
                                          onChange={(e) => {
                                            const newOptions = [...(question.options || [])]
                                            newOptions[optIndex] = e.target.value
                                            updateQuestion(index, "options", newOptions)
                                          }}
                                          placeholder={`Option ${optIndex + 1}`}
                                        />
                                        <Button
                                          onClick={() => updateQuestion(index, "correct_answer", optIndex)}
                                          variant={question.correct_answer === optIndex ? "default" : "outline"}
                                          size="sm"
                                        >
                                          Correct
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {question.type === "true-false" && (
                                  <div className="space-y-2">
                                    <Label>Correct Answer</Label>
                                    <Select
                                      value={question.correct_answer.toString()}
                                      onValueChange={(value) => updateQuestion(index, "correct_answer", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="true">True</SelectItem>
                                        <SelectItem value="false">False</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                {question.type === "text" && (
                                  <div className="space-y-2">
                                    <Label>Correct Answer</Label>
                                    <Input
                                      value={question.correct_answer as string}
                                      onChange={(e) => updateQuestion(index, "correct_answer", e.target.value)}
                                      placeholder="Enter the correct answer"
                                    />
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <Label>Explanation (Optional)</Label>
                                  <Textarea
                                    value={question.explanation || ""}
                                    onChange={(e) => updateQuestion(index, "explanation", e.target.value)}
                                    placeholder="Explain why this is the correct answer"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createQuiz}>Create Quiz</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quiz Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizzes.length}</div>
              <p className="text-xs text-muted-foreground">Active quizzes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Questions across all quizzes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(quizzes.map(q => q.category)).size}
              </div>
              <p className="text-xs text-muted-foreground">Quiz categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Difficulty</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quizzes.length > 0 
                  ? (quizzes.reduce((acc, q) => acc + (q.difficulty === "easy" ? 1 : q.difficulty === "medium" ? 2 : 3), 0) / quizzes.length).toFixed(1)
                  : "0.0"
                }
              </div>
              <p className="text-xs text-muted-foreground">Average difficulty level</p>
            </CardContent>
          </Card>
        </div>

        {/* Quiz List */}
        <div className="grid gap-4">
          {quizzes.map((quiz) => {
            const stats = quizStats[quiz.id]
            
            return (
              <Card key={quiz.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <CardDescription>{quiz.description}</CardDescription>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{quiz.category}</Badge>
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {quiz.time_limit} min
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Target className="w-4 h-4" />
                          {quiz.passing_score}% to pass
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedQuiz(quiz)
                          setShowStatsDialog(true)
                          fetchQuizStats(quiz.id)
                        }}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Stats
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedQuiz(quiz)
                          setFormData({
                            title: quiz.title,
                            description: quiz.description,
                            category: quiz.category,
                            difficulty: quiz.difficulty,
                            time_limit: quiz.time_limit,
                            passing_score: quiz.passing_score,
                            questions: quiz.questions
                          })
                          setShowEditDialog(true)
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteQuiz(quiz.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>{quiz.questions.length} questions</span>
                      <span>Created {new Date(quiz.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    {stats && (
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold">{stats.total_submissions}</div>
                          <p className="text-xs text-muted-foreground">Submissions</p>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">{stats.pass_rate.toFixed(0)}%</div>
                          <p className="text-xs text-muted-foreground">Pass Rate</p>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">{stats.avg_score.toFixed(0)}%</div>
                          <p className="text-xs text-muted-foreground">Avg Score</p>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">{Math.round(stats.avg_time_spent / 60)}m</div>
                          <p className="text-xs text-muted-foreground">Avg Time</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Edit Quiz Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Quiz</DialogTitle>
              <DialogDescription>
                Update quiz details and questions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value: "easy" | "medium" | "hard") => 
                      setFormData(prev => ({ ...prev, difficulty: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time_limit">Time Limit (minutes)</Label>
                  <Input
                    id="edit-time_limit"
                    type="number"
                    value={formData.time_limit}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_limit: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-passing_score">Passing Score (%)</Label>
                  <Input
                    id="edit-passing_score"
                    type="number"
                    value={formData.passing_score}
                    onChange={(e) => setFormData(prev => ({ ...prev, passing_score: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={updateQuiz}>Update Quiz</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Stats Dialog */}
        <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Quiz Statistics</DialogTitle>
              <DialogDescription>
                Performance analytics for {selectedQuiz?.title}
              </DialogDescription>
            </DialogHeader>
            {selectedQuiz && quizStats[selectedQuiz.id] && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{quizStats[selectedQuiz.id].total_submissions}</div>
                        <p className="text-sm text-muted-foreground">Total Submissions</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{quizStats[selectedQuiz.id].pass_rate.toFixed(0)}%</div>
                        <p className="text-sm text-muted-foreground">Pass Rate</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Recent Submissions</h3>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {quizStats[selectedQuiz.id].recent_submissions.map((submission, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            {submission.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm">User {submission.user_id.slice(0, 8)}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{submission.score}%</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(submission.submitted_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </>
  )
}
