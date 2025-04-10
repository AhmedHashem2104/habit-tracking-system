import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

describe("Dialog", () => {
  it("opens when trigger is clicked", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>This is a test dialog</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )

    // Dialog content should not be visible initially
    expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument()

    // Click the trigger button
    await userEvent.click(screen.getByRole("button", { name: "Open Dialog" }))

    // Dialog content should now be visible
    expect(screen.getByText("Test Dialog")).toBeInTheDocument()
    expect(screen.getByText("This is a test dialog")).toBeInTheDocument()
  })

  it("closes when close button is clicked", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )

    // Open the dialog
    await userEvent.click(screen.getByRole("button", { name: "Open Dialog" }))
    expect(screen.getByText("Test Dialog")).toBeInTheDocument()

    // Close the dialog
    await userEvent.click(screen.getByRole("button", { name: "Close" }))

    // Dialog content should no longer be visible
    await waitFor(() => {
      expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument()
    })
  })

  it("closes when clicking the X button", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )

    // Open the dialog
    await userEvent.click(screen.getByRole("button", { name: "Open Dialog" }))

    // Find and click the close button (X)
    const closeButton = screen.getByRole("button", { name: "Close" })
    await userEvent.click(closeButton)

    // Dialog content should no longer be visible
    await waitFor(() => {
      expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument()
    })
  })
})
