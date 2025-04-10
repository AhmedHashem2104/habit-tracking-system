"use client"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { UserProfileForm } from "@/components/user-profile-form"
import { toast } from "@/components/ui/use-toast"

// Mock the toast function
jest.mock("@/components/ui/use-toast", () => ({
  toast: jest.fn(),
}))

describe("UserProfileForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders with default values", () => {
    render(<UserProfileForm />)

    expect(screen.getByLabelText(/username/i)).toHaveValue("")
    expect(screen.getByLabelText(/email/i)).toHaveValue("")
  })

  it("renders with provided initial data", () => {
    const initialData = {
      username: "testuser",
      email: "test@example.com",
      bio: "Test bio",
    }

    render(<UserProfileForm initialData={initialData} />)

    expect(screen.getByLabelText(/username/i)).toHaveValue("testuser")
    expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com")
    expect(screen.getByLabelText(/bio/i)).toHaveValue("Test bio")
  })

  it("validates form fields", async () => {
    render(<UserProfileForm />)

    // Try to submit with empty fields
    await userEvent.click(screen.getByRole("button", { name: /update profile/i }))

    // Check for validation errors
    expect(await screen.findByText(/username must be at least 2 characters/i)).toBeInTheDocument()
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument()
  })

  it("submits the form with valid data", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    render(<UserProfileForm onSubmit={onSubmit} />)

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/username/i), "testuser")
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com")
    await userEvent.type(screen.getByLabelText(/bio/i), "This is my bio")

    // Submit the form
    await userEvent.click(screen.getByRole("button", { name: /update profile/i }))

    // Check if onSubmit was called with the correct data
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        bio: "This is my bio",
      })
    })

    // Check if toast was called
    expect(toast).toHaveBeenCalledWith({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  })

  it("handles submission errors", async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error("Submission failed"))
    render(<UserProfileForm onSubmit={onSubmit} />)

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/username/i), "testuser")
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com")

    // Submit the form
    await userEvent.click(screen.getByRole("button", { name: /update profile/i }))

    // Check if error toast was called
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    })
  })
})
