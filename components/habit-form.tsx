"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { createHabit, updateHabit, getHabitById, getAllTags } from "@/lib/habit-service"
import { toast } from "@/components/ui/use-toast"

interface HabitFormProps {
  habitId?: string
  isEditing?: boolean
}

export function HabitForm({ habitId, isEditing = false }: HabitFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [existingTags, setExistingTags] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: [] as string[],
    currentTag: "",
  })

  useEffect(() => {
    // Load existing tags for autocomplete
    setExistingTags(getAllTags())

    // If editing, load the habit data
    if (isEditing && habitId) {
      const habit = getHabitById(habitId)
      if (habit) {
        setFormData({
          name: habit.name,
          description: habit.description,
          tags: [...habit.tags],
          currentTag: "",
        })
      } else {
        // Habit not found, redirect back to habits page
        toast({
          title: "Habit not found",
          description: "The habit you're trying to edit doesn't exist.",
          variant: "destructive",
        })
        router.push("/dashboard/habits")
      }
    }
  }, [habitId, isEditing, router])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEditing && habitId) {
        // Update existing habit
        const updatedHabit = updateHabit(habitId, {
          name: formData.name,
          description: formData.description,
          tags: formData.tags,
        })

        if (updatedHabit) {
          toast({
            title: "Habit updated",
            description: "Your habit has been updated successfully.",
          })
        } else {
          throw new Error("Failed to update habit")
        }
      } else {
        // Create new habit
        const newHabit = createHabit({
          name: formData.name,
          description: formData.description,
          tags: formData.tags,
        })

        toast({
          title: "Habit created",
          description: "Your new habit has been created successfully.",
        })
      }

      // Redirect back to habits page
      router.push("/dashboard/habits")
    } catch (error) {
      console.error("Error saving habit:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your habit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.currentTag.trim()],
        currentTag: "",
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Habit" : "Create New Habit"}</CardTitle>
          <CardDescription>
            {isEditing ? "Update your habit details" : "Enter the details of your new habit"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              placeholder="e.g., Drink Water, Meditate, Exercise"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your habit and what you want to achieve"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="e.g., health, productivity"
                value={formData.currentTag}
                onChange={(e) => setFormData({ ...formData, currentTag: e.target.value })}
                onKeyDown={handleKeyDown}
                list="existing-tags"
              />
              <datalist id="existing-tags">
                {existingTags.map((tag) => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
              <Button type="button" onClick={addTag} disabled={!formData.currentTag.trim()}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Press Enter to add a tag after typing</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/dashboard/habits")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !formData.name.trim()}>
            {isLoading ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update Habit" : "Create Habit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
