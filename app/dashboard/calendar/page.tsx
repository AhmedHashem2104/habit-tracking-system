"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllHabits, getCompletionsForDate, type Habit } from "@/lib/habit-service"
import { withPageAuthRequired } from "@/lib/auth"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedHabit, setSelectedHabit] = useState<string>("all")
  const [habits, setHabits] = useState<Habit[]>([])
  const [completionData, setCompletionData] = useState<Record<string, string[]>>({})
  const [selectedDateCompletions, setSelectedDateCompletions] = useState<any[]>([])

  useEffect(() => {
    // Load habits
    const allHabits = getAllHabits()
    setHabits(allHabits)

    // Generate completion data for the past 90 days
    const completions: Record<string, string[]> = {}
    const today = new Date()

    for (let i = 0; i < 90; i++) {
      const date = new Date()
      date.setDate(today.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const dailyCompletions = getCompletionsForDate(dateString)
      completions[dateString] = dailyCompletions
        .filter((completion) => completion.completed)
        .map((completion) => completion.habitId)
    }

    setCompletionData(completions)

    // Update selected date completions
    if (date) {
      updateSelectedDateCompletions(date, allHabits, completions, selectedHabit)
    }
  }, [])

  useEffect(() => {
    if (date) {
      updateSelectedDateCompletions(date, habits, completionData, selectedHabit)
    }
  }, [date, selectedHabit])

  const updateSelectedDateCompletions = (
    date: Date,
    habits: Habit[],
    completions: Record<string, string[]>,
    selectedHabitId: string,
  ) => {
    const dateString = date.toISOString().split("T")[0]
    const completedHabitIds = completions[dateString] || []

    let filteredHabits = habits
    if (selectedHabitId !== "all") {
      filteredHabits = habits.filter((h) => h.id === selectedHabitId)
    }

    const dateCompletions = filteredHabits.map((habit) => ({
      ...habit,
      completed: completedHabitIds.includes(habit.id),
    }))

    setSelectedDateCompletions(dateCompletions)
  }

  // Get dates with completions
  const getDatesWithCompletions = () => {
    return Object.entries(completionData).map(([dateString, habitIds]) => {
      const hasSelectedHabit = selectedHabit === "all" || habitIds.includes(selectedHabit)

      return {
        date: new Date(dateString),
        habitIds,
        hasSelectedHabit,
      }
    })
  }

  const datesWithCompletions = getDatesWithCompletions()

  // Calculate completion rate for selected date
  const completionRate =
    selectedDateCompletions.length > 0
      ? Math.round((selectedDateCompletions.filter((h) => h.completed).length / selectedDateCompletions.length) * 100)
      : 0

  return withPageAuthRequired(
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">Track your habit completion over time</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Habit Calendar</CardTitle>
                <CardDescription>View your habit completion history</CardDescription>
              </div>
              <Select value={selectedHabit} onValueChange={setSelectedHabit}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by habit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Habits</SelectItem>
                  {habits.map((habit) => (
                    <SelectItem key={habit.id} value={habit.id}>
                      {habit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                completed: datesWithCompletions.filter((d) => d.hasSelectedHabit).map((d) => d.date),
              }}
              modifiersStyles={{
                completed: {
                  backgroundColor: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                  fontWeight: "bold",
                },
              }}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {date
                  ? date.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Select a date"}
              </CardTitle>
              <CardDescription>
                {selectedDateCompletions.filter((h) => h.completed).length} of {selectedDateCompletions.length} habits
                completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {date && (
                <div className="space-y-4">
                  {selectedDateCompletions.length > 0 ? (
                    selectedDateCompletions.map((habit) => (
                      <div key={habit.id} className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${habit.completed ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className={habit.completed ? "font-medium" : "text-muted-foreground"}>{habit.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No habits tracked for this date</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-sm font-medium">{completionRate}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${completionRate}%` }} />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Tags</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Array.from(new Set(selectedDateCompletions.flatMap((h) => h.tags))).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>,
  )
}
