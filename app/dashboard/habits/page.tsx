"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllHabits, getAllTags, type Habit } from "@/lib/habit-service"
import { withPageAuthRequired } from "@/lib/auth"

export default function HabitsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("name")
  const [habits, setHabits] = useState<Habit[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    // Load habits and tags
    setHabits(getAllHabits())
    setAllTags(getAllTags())
  }, [])

  // Filter habits by search query and selected tags
  const filteredHabits = habits
    .filter(
      (habit) =>
        habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        habit.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((habit) => selectedTags.length === 0 || habit.tags.some((tag) => selectedTags.includes(tag)))

  // Sort habits
  const sortedHabits = [...filteredHabits].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "streak":
        return b.streak - a.streak
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default:
        return 0
    }
  })

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return withPageAuthRequired(
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
        <p className="text-muted-foreground">Manage and track your habits</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search habits..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="streak">Highest Streak</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/dashboard/habits/new">
              <Plus className="mr-1 h-4 w-4" /> New Habit
            </Link>
          </Button>
        </div>
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

      {/* Habits Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedHabits.map((habit) => (
          <Link key={habit.id} href={`/dashboard/habits/${habit.id}`}>
            <Card className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{habit.name}</CardTitle>
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
                    {habit.tags.map((tag) => (
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

      {/* Empty State */}
      {sortedHabits.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">No habits found</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            {searchQuery || selectedTags.length > 0
              ? "Try adjusting your search or filters"
              : "Create your first habit to get started"}
          </p>
          <Button asChild>
            <Link href="/dashboard/habits/new">
              <Plus className="mr-1 h-4 w-4" /> Create Habit
            </Link>
          </Button>
        </div>
      )}
    </div>,
  )
}
