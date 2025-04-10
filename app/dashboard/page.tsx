"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Calendar, Plus, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { getAllHabits, getAllTags, getCompletionsForDate } from "@/lib/habit-service"
import { withPageAuthRequired } from "@/lib/auth"

export default function DashboardPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [habits, setHabits] = useState<any[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])

  useEffect(() => {
    // Load habits and tags
    setHabits(getAllHabits())
    setAllTags(getAllTags())

    // Generate weekly data
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const today = new Date()
    const weeklyData = weekDays.map((name, index) => {
      const date = new Date()
      date.setDate(today.getDate() - today.getDay() + index + 1) // Start from Monday
      const dateStr = date.toISOString().split("T")[0]

      const completions = getCompletionsForDate(dateStr)
      const completed = completions.filter((c) => c.completed).length
      const total = getAllHabits().length

      return {
        name,
        completed,
        total,
      }
    })
    setWeeklyData(weeklyData)

    // Generate monthly data
    const monthlyData = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date()
      weekStart.setDate(today.getDate() - 21 + i * 7) // 4 weeks back

      let completed = 0
      let total = 0

      // Sum up completions for each day in the week
      for (let j = 0; j < 7; j++) {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + j)
        const dateStr = date.toISOString().split("T")[0]

        const dailyCompletions = getCompletionsForDate(dateStr)
        completed += dailyCompletions.filter((c) => c.completed).length
        total += getAllHabits().length
      }

      return {
        name: `Week ${i + 1}`,
        completed,
        total,
      }
    })
    setMonthlyData(monthlyData)
  }, [])

  // Filter habits by selected tags
  const filteredHabits =
    selectedTags.length > 0
      ? habits.filter((habit) => habit.tags.some((tag: string) => selectedTags.includes(tag)))
      : habits

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Calculate completion rate
  const completedHabits = filteredHabits.filter((habit) => habit.completed).length
  const completionRate = Math.round((completedHabits / (filteredHabits.length || 1)) * 100) || 0

  // Calculate weekly and monthly completion rates
  const weeklyCompletionRate =
    weeklyData.length > 0
      ? Math.round(
          (weeklyData.reduce((sum, day) => sum + day.completed, 0) /
            (weeklyData.reduce((sum, day) => sum + day.total, 0) || 1)) *
            100,
        ) || 0
      : 0

  const monthlyCompletionRate =
    monthlyData.length > 0
      ? Math.round(
          (monthlyData.reduce((sum, week) => sum + week.completed, 0) /
            (monthlyData.reduce((sum, week) => sum + week.total, 0) || 1)) *
            100,
        ) || 0
      : 0

  return withPageAuthRequired(
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track your habits and monitor your progress</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Habits</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredHabits.length}</div>
            <p className="text-xs text-muted-foreground">{completedHabits} completed</p>
            <Progress className="mt-2" value={completionRate} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {habits.length > 0 ? Math.max(...habits.map((h: any) => h.streak)) : 0} days
            </div>
            <p className="text-xs text-muted-foreground">Best streak this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weeklyData.reduce((sum, day) => sum + day.completed, 0)}/
              {weeklyData.reduce((sum, day) => sum + day.total, 0)}
            </div>
            <p className="text-xs text-muted-foreground">{weeklyCompletionRate}% completion rate</p>
            <Progress className="mt-2" value={weeklyCompletionRate} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyData.reduce((sum, week) => sum + week.completed, 0)}/
              {monthlyData.reduce((sum, week) => sum + week.total, 0)}
            </div>
            <p className="text-xs text-muted-foreground">{monthlyCompletionRate}% completion rate</p>
            <Progress className="mt-2" value={monthlyCompletionRate} />
          </CardContent>
        </Card>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium">Filter by tags:</span>
        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
        {selectedTags.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])} className="h-6 px-2 text-xs">
            Clear filters
          </Button>
        )}
      </div>

      {/* Charts */}
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Habit Completion</CardTitle>
              <CardDescription>Your habit completion rate for the past week</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [value, name === "completed" ? "Completed" : "Total"]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend />
                  <Bar name="Completed" dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar name="Total" dataKey="total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Habit Completion</CardTitle>
              <CardDescription>Your habit completion rate for the past month</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [value, name === "completed" ? "Completed" : "Total"]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend />
                  <Bar name="Completed" dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar name="Total" dataKey="total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Today's Habits */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Today's Habits</h2>
          <Button asChild size="sm">
            <Link href="/dashboard/habits/new">
              <Plus className="mr-1 h-4 w-4" /> Add Habit
            </Link>
          </Button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredHabits.map((habit) => (
            <Link key={habit.id} href={`/dashboard/habits/${habit.id}`}>
              <Card className="cursor-pointer transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{habit.name}</CardTitle>
                    <div className={`h-3 w-3 rounded-full ${habit.completed ? "bg-green-500" : "bg-gray-300"}`} />
                  </div>
                  <CardDescription>{habit.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{habit.streak} day streak</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {habit.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>,
  )
}
