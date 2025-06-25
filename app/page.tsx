"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, ArrowLeft, Github } from "lucide-react"

type Step = "landing" | "form" | "success" | "error"

interface ApiResponse {
  success: boolean
  message: string
  detail?: string
}

export default function Component() {
  const [currentStep, setCurrentStep] = useState<Step>("landing")
  const [gameUrl, setGameUrl] = useState("")
  const [score, setScore] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")
  const [urlError, setUrlError] = useState("")

  const validateGameUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      // Basic validation for Gamee URLs
      if (url.includes("prizes.gamee.com") || url.includes("gamee.com")) {
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const handleSubmit = async () => {
    if (!gameUrl || !score) return

    // Clear previous errors
    setUrlError("")

    // Validate on submit
    if (!validateGameUrl(gameUrl)) {
      setUrlError("Please enter a valid Gamee URL")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("https://g-exp-go.vercel.app/submit-score-simple", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score: Number.parseInt(score),
          url: gameUrl,
        }),
      })

      const data: ApiResponse = await response.json()

      if (response.ok && data.success) {
        setResponseMessage(data.message || "Score submitted successfully!")
        setCurrentStep("success")
      } else {
        setResponseMessage(data.detail || data.message || "An error occurred")
        setCurrentStep("error")
      }
    } catch (error) {
      setResponseMessage("Network error. Please try again.")
      setCurrentStep("error")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setGameUrl("")
    setScore("")
    setUrlError("")
    setResponseMessage("")
    setCurrentStep("landing")
  }

  // Render different steps based on current step
  if (currentStep === "landing") {
    return (
      <div className="relative">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                If it exists, there exists a{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">crack</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
                Unlock the potential. Submit your game scores and break through the limits.
              </p>
            </div>

            <Button
              onClick={() => setCurrentStep("form")}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Button>
          </div>
        </div>
        <div className="fixed bottom-4 left-4 right-4 text-center">
          <p className="text-white/60 text-sm flex items-center justify-center gap-2">
            Made By:{" "}
            <a
              href="https://github.com/YashDuhan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              github.com/YashDuhan
            </a>
          </p>
        </div>
      </div>
    )
  }

  if (currentStep === "form") {
    return (
      <div className="relative">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white">Submit Your Score</CardTitle>
              <CardDescription className="text-slate-300">Enter your game URL and target score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="gameUrl" className="text-white font-medium">
                  Game URL
                </Label>
                <Input
                  id="gameUrl"
                  type="url"
                  placeholder="https://prizes.gamee.com/game-bot/..."
                  value={gameUrl}
                  onChange={(e) => setGameUrl(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400"
                />
                {urlError && (
                  <Alert className="bg-red-500/10 border-red-500/20">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-400">{urlError}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="score" className="text-white font-medium">
                  Target Score
                </Label>
                <Input
                  id="score"
                  type="number"
                  placeholder="Enter score (e.g., 100)"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("landing")}
                className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!gameUrl || !score || isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Score"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="fixed bottom-4 left-4 right-4 text-center">
          <p className="text-white/60 text-sm flex items-center justify-center gap-2">
            Made By:{" "}
            <a
              href="https://github.com/YashDuhan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              github.com/YashDuhan
            </a>
          </p>
        </div>
      </div>
    )
  }

  if (currentStep === "success") {
    return (
      <div className="relative">
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Success!</CardTitle>
              <CardDescription className="text-slate-300">{responseMessage}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={resetForm}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Submit Another Score
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="fixed bottom-4 left-4 right-4 text-center">
          <p className="text-white/60 text-sm flex items-center justify-center gap-2">
            Made By:{" "}
            <a
              href="https://github.com/YashDuhan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              github.com/YashDuhan
            </a>
          </p>
        </div>
      </div>
    )
  }

  if (currentStep === "error") {
    return (
      <div className="relative">
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-slate-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Error</CardTitle>
              <CardDescription className="text-slate-300">{responseMessage}</CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("form")}
                className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Try Again
              </Button>
              <Button
                onClick={resetForm}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                Start Over
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="fixed bottom-4 left-4 right-4 text-center">
          <p className="text-white/60 text-sm flex items-center justify-center gap-2">
            Made By:{" "}
            <a
              href="https://github.com/YashDuhan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              github.com/YashDuhan
            </a>
          </p>
        </div>
      </div>
    )
  }

  return null
}
