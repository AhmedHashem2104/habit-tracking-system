import { v4 as uuidv4 } from "uuid"

export type HabitTag = "health" | "productivity" | "mindfulness" | "fitness" | "learning" | string

export interface Habit {
  id: string
  name: string
  description: string
  tags: HabitTag[]
  streak: number
  completed: boolean
  createdAt: string
}

export interface HabitCompletion {
  habitId: string
  date: string
  completed: boolean
}

// In a real app, this would be stored in a database
let habits: Habit[] = [
  {
    id: "1",
    name: "Drink Water",
    description: "Drink 8 glasses of water daily",
    streak: 12,
    completed: true,
    tags: ["health"],
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Meditation",
    description: "Meditate for 10 minutes",
    streak: 5,
    completed: true,
    tags: ["mindfulness", "health"],
    createdAt: "2023-02-10",
  },
  {
    id: "3",
    name: "Read",
    description: "Read for 30 minutes",
    streak: 8,
    completed: false,
    tags: ["productivity", "learning"],
    createdAt: "2023-01-05",
  },
  {
    id: "4",
    name: "Exercise",
    description: "30 minutes of exercise",
    streak: 3,
    completed: false,
    tags: ["health", "fitness"],
    createdAt: "2023-03-01",
  },
  {
    id: "5",
    name: "Journal",
    description: "Write in journal",
    streak: 15,
    completed: true,
    tags: ["mindfulness", "productivity"],
    createdAt: "2023-02-20",
  },
  {
    id: "6",
    name: "Learn a Language",
    description: "Practice for 20 minutes",
    streak: 7,
    completed: true,
    tags: ["learning", "productivity"],
    createdAt: "2023-03-10",
  },
  {
    id: "7",
    name: "Stretch",
    description: "Stretch for 10 minutes",
    streak: 4,
    completed: false,
    tags: ["health", "fitness"],
    createdAt: "2023-03-15",
  },
  {
    id: "8",
    name: "No Social Media",
    description: "Avoid social media until noon",
    streak: 2,
    completed: true,
    tags: ["productivity", "mindfulness"],
    createdAt: "2023-03-20",
  },
]

// In a real app, this would be stored in a database
let completions: HabitCompletion[] = []

// Initialize completions with some random data for the past 90 days
const initializeCompletions = () => {
  if (completions.length > 0) return // Only initialize once

  const today = new Date()
  for (let i = 0; i < 90; i++) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    const dateString = date.toISOString().split("T")[0]

    habits.forEach((habit) => {
      // 70% chance of completion
      if (Math.random() > 0.3) {
        completions.push({
          habitId: habit.id,
          date: dateString,
          completed: true,
        })
      }
    })
  }
}

// Call initialization
initializeCompletions()

// Get all habits
export const getAllHabits = (): Habit[] => {
  return [...habits]
}

// Get a habit by ID
export const getHabitById = (id: string): Habit | undefined => {
  return habits.find((habit) => habit.id === id)
}

// Create a new habit
export const createHabit = (habit: Omit<Habit, "id" | "streak" | "completed" | "createdAt">): Habit => {
  const newHabit: Habit = {
    ...habit,
    id: uuidv4(),
    streak: 0,
    completed: false,
    createdAt: new Date().toISOString().split("T")[0],
  }

  habits = [...habits, newHabit]
  return newHabit
}

// Update a habit
export const updateHabit = (id: string, updates: Partial<Omit<Habit, "id" | "createdAt">>): Habit | undefined => {
  const index = habits.findIndex((habit) => habit.id === id)
  if (index === -1) return undefined

  const updatedHabit = { ...habits[index], ...updates }
  habits = [...habits.slice(0, index), updatedHabit, ...habits.slice(index + 1)]
  return updatedHabit
}

// Delete a habit
export const deleteHabit = (id: string): boolean => {
  const initialLength = habits.length
  habits = habits.filter((habit) => habit.id !== id)

  // Also delete all completions for this habit
  completions = completions.filter((completion) => completion.habitId !== id)

  return habits.length < initialLength
}

// Toggle habit completion for today
export const toggleHabitCompletion = (id: string): boolean => {
  const habit = getHabitById(id)
  if (!habit) return false

  const today = new Date().toISOString().split("T")[0]
  const existingCompletion = completions.find((c) => c.habitId === id && c.date === today)

  if (existingCompletion) {
    // Toggle existing completion
    existingCompletion.completed = !existingCompletion.completed

    // Update habit completed status
    updateHabit(id, { completed: existingCompletion.completed })

    // Update streak
    updateStreak(id)

    return existingCompletion.completed
  } else {
    // Create new completion
    completions.push({
      habitId: id,
      date: today,
      completed: true,
    })

    // Update habit completed status
    updateHabit(id, { completed: true })

    // Update streak
    updateStreak(id)

    return true
  }
}

// Get completions for a habit
export const getHabitCompletions = (habitId: string): HabitCompletion[] => {
  return completions.filter((completion) => completion.habitId === habitId)
}

// Get completions for a specific date
export const getCompletionsForDate = (date: string): HabitCompletion[] => {
  return completions.filter((completion) => completion.date === date)
}

// Update streak for a habit
const updateStreak = (habitId: string) => {
  const habit = getHabitById(habitId)
  if (!habit) return

  // Sort completions by date in descending order
  const habitCompletions = getHabitCompletions(habitId)
    .filter((c) => c.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (habitCompletions.length === 0) {
    updateHabit(habitId, { streak: 0 })
    return
  }

  let streak = 1
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if the most recent completion is today or yesterday
  const mostRecentDate = new Date(habitCompletions[0].date)
  mostRecentDate.setHours(0, 0, 0, 0)

  const timeDiff = today.getTime() - mostRecentDate.getTime()
  const dayDiff = timeDiff / (1000 * 3600 * 24)

  // If the most recent completion is more than 1 day ago, streak is broken
  if (dayDiff > 1) {
    updateHabit(habitId, { streak: 0 })
    return
  }

  // Calculate streak by checking consecutive days
  for (let i = 1; i < habitCompletions.length; i++) {
    const currentDate = new Date(habitCompletions[i - 1].date)
    const prevDate = new Date(habitCompletions[i].date)

    // Calculate difference in days
    const diffTime = currentDate.getTime() - prevDate.getTime()
    const diffDays = diffTime / (1000 * 3600 * 24)

    // If days are consecutive, increment streak
    if (diffDays === 1) {
      streak++
    } else {
      break
    }
  }

  updateHabit(habitId, { streak })
}

// Get all unique tags
export const getAllTags = (): HabitTag[] => {
  const tagsSet = new Set<HabitTag>()
  habits.forEach((habit) => {
    habit.tags.forEach((tag) => tagsSet.add(tag))
  })
  return Array.from(tagsSet)
}
