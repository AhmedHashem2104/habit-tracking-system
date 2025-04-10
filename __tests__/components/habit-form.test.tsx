import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { HabitForm } from "@/components/habit-form"
import { toast } from "@/components/ui/use-toast"
import { createHabit, updateHabit, getHabitById } from "@/lib/habit-service"

// Mock the dependencies
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}))

jest.mock("@/lib/habit-service", () => ({
  createHabit: jest.fn(),
  updateHabit: jest.fn(),
  getHabitById: jest.fn(),
  getAllTags: jest.fn().mockReturnValue(["health", "productivity"]),
}))

describe("HabitForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the form for creating a new habit", () => {
    render(<HabitForm />)

    expect(screen.getByText("Habit Details")).toBeInTheDocument()
    expect(screen.getByText("Enter the details of your new habit")).toBeInTheDocument()
    expect(screen.getByLabelText("Habit Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Description")).toBeInTheDocument()
    expect(screen.getByLabelText("Tags")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Create Habit" })).toBeInTheDocument()
  })

  it("renders the form for editing a habit", () => {
    ;(getHabitById as jest.Mock).mockReturnValue({
      id: "1",
      name: "Test Habit",
      description: "Test Description",
      tags: ["health"],
      streak: 5,
      completed: false,
      createdAt: "2023-01-01",
    })

    render(<HabitForm habitId="1" isEditing={true} />)

    expect(screen.getByText("Edit Habit")).toBeInTheDocument()
    expect(screen.getByText("Update your habit details")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Test Habit")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument()
    expect(screen.getByText("health")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Update Habit" })).toBeInTheDocument()
  })

  it("creates a new habit when the form is submitted", async () => {
    ;(createHabit as jest.Mock).mockReturnValue({
      id: "new-id",
      name: "New Habit",
      description: "New Description",
      tags: ["productivity"],
      streak: 0,
      completed: false,
      createdAt: "2023-01-01",
    })

    render(<HabitForm />)

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Habit Name"), { target: { value: "New Habit" } })
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "New Description" } })

    // Add a tag
    fireEvent.change(screen.getByLabelText("Tags"), { target: { value: "productivity" } })
    fireEvent.click(screen.getByRole("button", { name: "Add" }))

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Create Habit" }))

    await waitFor(() => {
      expect(createHabit).toHaveBeenCalledWith({
        name: "New Habit",
        description: "New Description",
        tags: ["productivity"],
      })

      expect(toast).toHaveBeenCalledWith({
        title: "Habit created",
        description: "Your new habit has been created successfully.",
      })
    })
  })

  it("updates an existing habit when the form is submitted in edit mode", async () => {
    ;(getHabitById as jest.Mock)
      .mockReturnValue({
        id: "1",
        name: "Test Habit",
        description: "Test Description",
        tags: ["health"],
        streak: 5,
        completed: false,
        createdAt: "2023-01-01",
      })(updateHabit as jest.Mock)
      .mockReturnValue({
        id: "1",
        name: "Updated Habit",
        description: "Updated Description",
        tags: ["health", "productivity"],
        streak: 5,
        completed: false,
        createdAt: "2023-01-01",
      })

    render(<HabitForm habitId="1" isEditing={true} />)

    // Update the form
    fireEvent.change(screen.getByLabelText("Habit Name"), { target: { value: "Updated Habit" } })
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Updated Description" } })

    // Add a tag
    fireEvent.change(screen.getByLabelText("Tags"), { target: { value: "productivity" } })
    fireEvent.click(screen.getByRole("button", { name: "Add" }))

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Update Habit" }))

    await waitFor(() => {
      expect(updateHabit).toHaveBeenCalledWith("1", {
        name: "Updated Habit",
        description: "Updated Description",
        tags: ["health", "productivity"],
      })

      expect(toast).toHaveBeenCalledWith({
        title: "Habit updated",
        description: "Your habit has been updated successfully.",
      })
    })
  })
})
