"use client"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole("button", { name: "Click me" })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("bg-primary")
  })

  it("applies variant classes correctly", () => {
    render(<Button variant="destructive">Delete</Button>)

    const button = screen.getByRole("button", { name: "Delete" })
    expect(button).toHaveClass("bg-destructive")
  })

  it("applies size classes correctly", () => {
    render(<Button size="sm">Small Button</Button>)

    const button = screen.getByRole("button", { name: "Small Button" })
    expect(button).toHaveClass("h-9")
  })

  it("handles click events", async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole("button", { name: "Click me" })
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("renders as a child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    )

    const link = screen.getByRole("link", { name: "Link Button" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test")
    expect(link).toHaveClass("bg-primary")
  })

  it("applies disabled styles when disabled", () => {
    render(<Button disabled>Disabled</Button>)

    const button = screen.getByRole("button", { name: "Disabled" })
    expect(button).toBeDisabled()
    expect(button).toHaveClass("disabled:opacity-50")
  })
})
