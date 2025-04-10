import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { Button } from "@/components/ui/button"

describe("ConfirmationDialog", () => {
  it("renders trigger element correctly", () => {
    render(
      <ConfirmationDialog
        title="Confirm Action"
        description="Are you sure you want to perform this action?"
        onConfirm={jest.fn()}
      >
        <Button>Open Dialog</Button>
      </ConfirmationDialog>,
    )

    expect(screen.getByRole("button", { name: "Open Dialog" })).toBeInTheDocument()
  })

  it("opens dialog when trigger is clicked", async () => {
    render(
      <ConfirmationDialog
        title="Confirm Action"
        description="Are you sure you want to perform this action?"
        onConfirm={jest.fn()}
      >
        <Button>Open Dialog</Button>
      </ConfirmationDialog>,
    )

    await userEvent.click(screen.getByRole("button", { name: "Open Dialog" }))

    expect(screen.getByText("Confirm Action")).toBeInTheDocument()
    expect(screen.getByText("Are you sure you want to perform this action?")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument()
  })

  it("calls onConfirm when confirm button is clicked", async () => {
    const onConfirm = jest.fn()
    render(
      <ConfirmationDialog
        title="Confirm Action"
        description="Are you sure you want to perform this action?"
        onConfirm={onConfirm}
      >
        <Button>Open Dialog</Button>
      </ConfirmationDialog>,
    )

    await userEvent.click(screen.getByRole("button", { name: "Open Dialog" }))
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }))

    expect(onConfirm).toHaveBeenCalledTimes(1)

    // Dialog should close after confirmation
    await waitFor(() => {
      expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument()
    })
  })

  it("closes dialog when cancel button is clicked", async () => {
    const onConfirm = jest.fn()
    render(
      <ConfirmationDialog
        title="Confirm Action"
        description="Are you sure you want to perform this action?"
        onConfirm={onConfirm}
      >
        <Button>Open Dialog</Button>
      </ConfirmationDialog>,
    )

    await userEvent.click(screen.getByRole("button", { name: "Open Dialog" }))
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))

    expect(onConfirm).not.toHaveBeenCalled()

    // Dialog should close after cancellation
    await waitFor(() => {
      expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument()
    })
  })

  it("uses custom button text when provided", async () => {
    render(
      <ConfirmationDialog
        title="Delete Item"
        description="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Keep"
        onConfirm={jest.fn()}
      >
        <Button>Delete</Button>
      </ConfirmationDialog>,
    )

    await userEvent.click(screen.getByRole("button", { name: "Delete" }))

    expect(screen.getByRole("button", { name: "Keep" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()
  })
})
