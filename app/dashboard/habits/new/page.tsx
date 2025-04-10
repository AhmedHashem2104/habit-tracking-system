"use client"

import { HabitForm } from "@/components/habit-form"
import { withPageAuthRequired } from "@/lib/auth"

export default function NewHabitPage() {
  return withPageAuthRequired(
    <div className="container max-w-2xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New Habit</h1>
      </div>
      <HabitForm />
    </div>,
  )
}
