"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { adminApi } from "@/lib/api"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Brain,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  Play,
  RotateCcw,
  ChevronRight,
  Loader2,
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

interface QuizResult {
  quizId: string
  score: number
  totalPoints: number
  passed: boolean
  timeSpent: number
  answers: Record<string, string | number>
  completedAt: string
}

export default function QuizzesPage() {
  const { token, user } = useAuth()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null)
  const [userQuizHistory, setUserQuizHistory] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)

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

  const submitQuizResults = async () => {
    if (!selectedQuiz || !token) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9001'
      const response = await fetch(`${apiUrl}/quizzes/${selectedQuiz.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers: answers,
          time_spent: selectedQuiz.time_limit * 60 - timeRemaining
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Update local history
          const newResult: QuizResult = {
            quizId: selectedQuiz.id,
            score: result.response.score,
            totalPoints: result.response.total_points,
            passed: result.response.passed,
            timeSpent: result.response.time_spent,
            answers: answers,
            completedAt: new Date().toISOString()
          }
          
          setUserQuizHistory(prev => [...prev, newResult])
          setQuizResults(newResult)
          setQuizCompleted(true)
          
          if (result.response.passed) {
            toast.success(`Congratulations! You passed with ${result.response.score}/${result.response.total_points} points!`)
          } else {
            toast.error(`Quiz completed. You scored ${result.response.score}/${result.response.total_points} points. Try again!`)
          }
        }
      }
    } catch (error) {
      toast.error("Failed to submit quiz")
    }
  }

  // Timer effect
  useEffect(() => {
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && quizStarted && !quizCompleted) {
      handleQuizSubmit()
    }
  }, [quizStarted, quizCompleted, timeRemaining])

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setQuizStarted(true)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setTimeRemaining(quiz.timeLimit * 60)
    setQuizResults(null)
  }

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = () => {
    if (selectedQuiz && currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateScore = () => {
    if (!selectedQuiz) return { score: 0, totalPoints: 0, passed: false }
    
    let score = 0
    let totalPoints = 0
    
    selectedQuiz.questions.forEach(question => {
      totalPoints += question.points
      if (answers[question.id] === question.correctAnswer) {
        score += question.points
      }
    })
    
    const passed = (score / totalPoints) * 100 >= selectedQuiz.passingScore
    
    return { score, totalPoints, passed }
  }

  const handleQuizSubmit = () => {
    if (!selectedQuiz) return
    
    const { score, totalPoints, passed } = calculateScore()
    const timeSpent = selectedQuiz.timeLimit * 60 - timeRemaining
    
    const result: QuizResult = {
      quizId: selectedQuiz.id,
      score,
      totalPoints,
      passed,
      timeSpent,
      answers,
      completedAt: new Date().toISOString()
    }
    
    setQuizResults(result)
    setQuizCompleted(true)
    setUserQuizHistory(prev => [...prev, result])
    
    if (passed) {
      toast.success(`Congratulations! You passed with ${score}/${totalPoints} points!`)
    } else {
      toast.error(`Quiz completed. You scored ${score}/${totalPoints} points. Try again!`)
    }
  }

  const resetQuiz = () => {
    setSelectedQuiz(null)
    setQuizStarted(false)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setTimeRemaining(0)
    setQuizResults(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "hard": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )
      
      case "true-false":
        return (
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="cursor-pointer">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="cursor-pointer">False</Label>
            </div>
          </RadioGroup>
        )
      
      case "text":
        return (
          <Textarea
            value={answers[question.id] as string || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[100px]"
          />
        )
      
      default:
        return null
    }
  }

  if (!selectedQuiz) {
    return (
      <>
        <AppHeader />
        <main className="flex-1 p-6 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Quizzes</h1>
            <p className="text-muted-foreground">Test your knowledge and track your progress</p>
          </div>

          {/* Quiz Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{quizzes.length}</div>
                <p className="text-xs text-muted-foreground">Available quizzes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userQuizHistory.length}</div>
                <p className="text-xs text-muted-foreground">Quizzes finished</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userQuizHistory.length > 0 
                    ? Math.round((userQuizHistory.filter(r => r.passed).length / userQuizHistory.length) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Quizzes passed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userQuizHistory.length > 0
                    ? Math.round(userQuizHistory.reduce((acc, r) => acc + (r.score / r.totalPoints) * 100, 0) / userQuizHistory.length)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Average performance</p>
              </CardContent>
            </Card>
          </div>

          {/* Quiz List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => {
              const attempts = userQuizHistory.filter(r => r.quizId === quiz.id)
              const bestScore = attempts.length > 0 
                ? Math.max(...attempts.map(r => (r.score / r.totalPoints) * 100))
                : null
              const passed = attempts.some(r => r.passed)

              return (
                <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription>{quiz.description}</CardDescription>
                      </div>
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {quiz.timeLimit} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {quiz.passingScore}% to pass
                      </div>
                    </div>

                    {attempts.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Best Score:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{bestScore?.toFixed(0)}%</span>
                            {passed && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                        </div>
                        <Progress value={bestScore || 0} className="h-2" />
                      </div>
                    )}

                    <Button 
                      onClick={() => startQuiz(quiz)} 
                      className="w-full"
                      size="sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {attempts.length > 0 ? "Retake Quiz" : "Start Quiz"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </main>
      </>
    )
  }

  if (quizCompleted && quizResults) {
    const percentage = (quizResults.score / quizResults.totalPoints) * 100

    return (
      <>
        <AppHeader />
        <main className="flex-1 p-6 space-y-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Quiz Completed!</h1>
              <p className="text-muted-foreground">Here are your results for {selectedQuiz.title}</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                    quizResults.passed ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {quizResults.passed ? (
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    ) : (
                      <XCircle className="w-10 h-10 text-red-600" />
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <h2 className={`text-3xl font-bold ${quizResults.passed ? "text-green-600" : "text-red-600"}`}>
                      {quizResults.passed ? "Passed!" : "Not Passed"}
                    </h2>
                    <p className="text-muted-foreground">
                      You scored {quizResults.score} out of {quizResults.totalPoints} points ({percentage.toFixed(1)}%)
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{formatTime(quizResults.timeSpent)}</div>
                      <p className="text-sm text-muted-foreground">Time Spent</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{selectedQuiz.questions.length}</div>
                      <p className="text-sm text-muted-foreground">Questions</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{selectedQuiz.passingScore}%</div>
                      <p className="text-sm text-muted-foreground">Passing Score</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Question Review</CardTitle>
                <CardDescription>Review your answers and explanations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedQuiz.questions.map((question, index) => {
                  const userAnswer = answers[question.id]
                  const isCorrect = userAnswer === question.correctAnswer

                  return (
                    <div key={question.id} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect ? "bg-green-100" : "bg-red-100"
                        }`}>
                          {isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">Q{index + 1}: {question.question}</p>
                          <div className="text-sm space-y-1">
                            <p className="text-muted-foreground">Your answer: {userAnswer}</p>
                            {!isCorrect && (
                              <p className="text-green-600">Correct answer: {question.correctAnswer}</p>
                            )}
                            {question.explanation && (
                              <Alert>
                                <AlertDescription>{question.explanation}</AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                      </div>
                      {index < selectedQuiz.questions.length - 1 && <Separator />}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={resetQuiz} variant="outline" className="flex-1">
                Back to Quizzes
              </Button>
              <Button onClick={() => startQuiz(selectedQuiz)} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
            </div>
          </div>
        </main>
      </>
    )
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100

  return (
    <>
      <AppHeader />
      <main className="flex-1 p-6 space-y-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Quiz Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{selectedQuiz.title}</h1>
                <p className="text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span className={timeRemaining < 60 ? "text-red-600 font-semibold" : ""}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
            
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{currentQuestion.type}</Badge>
                    <span className="text-sm text-muted-foreground">{currentQuestion.points} points</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderQuestion(currentQuestion)}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {selectedQuiz.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    index === currentQuestionIndex
                      ? "bg-primary text-primary-foreground"
                      : answers[_.id]
                      ? "bg-green-100 text-green-800"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>

            {currentQuestionIndex === selectedQuiz.questions.length - 1 ? (
              <Button onClick={handleQuizSubmit}>
                Submit Quiz
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={nextQuestion}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
