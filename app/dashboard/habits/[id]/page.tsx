"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarIcon, Check, Edit, MoreHorizontal, Trash, TrendingUp } from "lucide-react"
import { getHabitById, getHabitCompletions, deleteHabit, toggleHabitCompletion } from "@/lib/habit-service"
import { toast } from "@/components/ui/use-toast"
import { withPageAuthRequired } from "@/lib/auth"

export default function HabitDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [habit, setHabit] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [completedDates, setCompletedDates] = useState<Date[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Load habit data
    const habitData = getHabitById(params.id)
    if (!habitData) {
      toast({
        title: "Habit not found",
        description: "The habit you're looking for doesn't exist.",
        variant: "destructive",
      })
      router.push("/dashboard/habits")
      return
    }

    setHabit(habitData)

    // Load completions
    const completions = getHabitCompletions(params.id)

    // Set completed dates for calendar
    const dates = completions
      .filter((completion) => completion.completed)
      .map((completion) => new Date(completion.date))
    setCompletedDates(dates)

    // Generate chart data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - 29 + i)
      return date.toISOString().split("T")[0]
    })

    const chartData = last30Days.map((dateStr) => {
      // Find completion for this date
      const completion = completions.find((c) => c.date === dateStr)

      // Calculate streak at this point
      let streak = 0
      if (completion?.completed) {
        streak = 1
        // Look back to find consecutive completions
        for (let i = 1; i < 30; i++) {
          const prevDate = new Date(dateStr)
          prevDate.setDate(prevDate.getDate() - i)
          const prevDateStr = prevDate.toISOString().split("T")[0]

          const prevCompletion = completions.find((c) => c.date === prevDateStr)
          if (prevCompletion?.completed) {
            streak++
          } else {
            break
          }
        }
      }

      return {
        date: dateStr,
        streak,
        completed: completion?.completed || false,
      }
    })

    setChartData(chartData)
    setIsLoading(false)
  }, [params.id, router])

  const handleDelete = () => {
    const success = deleteHabit(params.id)
    if (success) {
      toast({
        title: "Habit deleted",
        description: "Your habit has been deleted successfully.",
      })
      router.push("/dashboard/habits")
    } else {
      toast({
        title: "Error",
        description: "There was a problem deleting your habit. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleCompletion = () => {
    const completed = toggleHabitCompletion(params.id)

    // Update local state
    setHabit((prev) => ({
      ...prev,
      completed,
    }))

    toast({
      title: completed ? "Habit completed" : "Habit marked as incomplete",
      description: completed ? "Keep up the good work!" : "Don't worry, you can complete it later.",
    })
  }

  if (isLoading) {
    return withPageAuthRequired(
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Loading habit...</h1>
        </div>
      </div>,
    )
  }

  if (!habit) {
    return withPageAuthRequired(
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Habit not found</h1>
        </div>
        <p>The habit you're looking for doesn't exist.</p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/habits">Back to Habits</Link>
        </Button>
      </div>,
    )
  }

  // Get recent completions for the activity feed
  const recentCompletions = chartData
    .slice(-7)
    .reverse()
    .map((day) => ({
      date: day.date,
      completed: day.completed,
    }))

  return withPageAuthRequired(
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{habit.name}</h1>
        <div className="flex items-center gap-2">
          <Button variant={habit.completed ? "default" : "outline"} onClick={toggleCompletion} className="gap-2">
            {habit.completed ? <Check className="h-4 w-4" /> : null}
            {habit.completed ? "Completed" : "Mark as Complete"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/habits/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Habit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Habit
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your habit and all of its associated
                      data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Habit Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-muted-foreground">{habit.description}</p>
            </div>
            <div>
              <h3 className="font-medium">Current Streak</h3>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-lg font-bold">{habit.streak} days</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Tags</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {habit.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium">Created</h3>
              <p className="text-sm text-muted-foreground">{new Date(habit.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/dashboard/habits/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Habit
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="calendar">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="streak">Streak History</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Completion Calendar
                  </CardTitle>
                  <CardDescription>Track your habit completion over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="multiple"
                    selected={completedDates}
                    onSelect={() => {}}
                    className="rounded-md border"
                    disabled={(date) => date > new Date()}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="streak" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Streak History
                  </CardTitle>
                  <CardDescription>View your streak progress over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => value.split("-").slice(1).join("/")}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`${value} days`, "Streak"]}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Legend />
                      <Line
                        name="Streak"
                        type="monotone"
                        dataKey="streak"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent completion history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCompletions.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${day.completed ? "bg-green-500" : "bg-gray-300"}`} />
                      <span>
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{day.completed ? "Completed" : "Missed"}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>,
  )
}
