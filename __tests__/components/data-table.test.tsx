import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"

// Define a test data type
interface TestData {
  id: string
  name: string
  email: string
}

// Sample test data
const testData: TestData[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com" },
  { id: "4", name: "Alice Brown", email: "alice@example.com" },
  { id: "5", name: "Charlie Davis", email: "charlie@example.com" },
  { id: "6", name: "Eva Wilson", email: "eva@example.com" },
  { id: "7", name: "Frank Miller", email: "frank@example.com" },
  { id: "8", name: "Grace Taylor", email: "grace@example.com" },
  { id: "9", name: "Henry Clark", email: "henry@example.com" },
  { id: "10", name: "Ivy Martin", email: "ivy@example.com" },
  { id: "11", name: "Jack White", email: "jack@example.com" },
]

// Define columns for the test
const columns: ColumnDef<TestData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
]

describe("DataTable", () => {
  it("renders the table with correct headers", () => {
    render(<DataTable columns={columns} data={testData} />)

    expect(screen.getByText("ID")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Email")).toBeInTheDocument()
  })

  it("renders the correct number of rows based on pageSize", () => {
    render(<DataTable columns={columns} data={testData} pageSize={5} />)

    // Should show 5 rows of data
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("Jane Smith")).toBeInTheDocument()
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument()
    expect(screen.getByText("Alice Brown")).toBeInTheDocument()
    expect(screen.getByText("Charlie Davis")).toBeInTheDocument()

    // Should not show the 6th row yet
    expect(screen.queryByText("Eva Wilson")).not.toBeInTheDocument()
  })

  it("paginates to the next page when Next button is clicked", async () => {
    render(<DataTable columns={columns} data={testData} pageSize={5} />)

    // First page should show first 5 items
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.queryByText("Eva Wilson")).not.toBeInTheDocument()

    // Go to next page
    await userEvent.click(screen.getByRole("button", { name: "Next" }))

    // Second page should show items 6-10
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument()
    expect(screen.getByText("Eva Wilson")).toBeInTheDocument()
    expect(screen.getByText("Frank Miller")).toBeInTheDocument()
  })

  it("paginates back to the previous page", async () => {
    render(<DataTable columns={columns} data={testData} pageSize={5} />)

    // Go to next page
    await userEvent.click(screen.getByRole("button", { name: "Next" }))

    // Verify we're on the second page
    expect(screen.getByText("Eva Wilson")).toBeInTheDocument()

    // Go back to previous page
    await userEvent.click(screen.getByRole("button", { name: "Previous" }))

    // Verify we're back on the first page
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.queryByText("Eva Wilson")).not.toBeInTheDocument()
  })

  it("disables Previous button on first page", () => {
    render(<DataTable columns={columns} data={testData} pageSize={5} />)

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Next" })).not.toBeDisabled()
  })

  it("disables Next button on last page", async () => {
    render(<DataTable columns={columns} data={testData} pageSize={10} />)

    // Go to next page (which should be the last page)
    await userEvent.click(screen.getByRole("button", { name: "Next" }))

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Previous" })).not.toBeDisabled()
  })

  it("shows 'No results' when data is empty", () => {
    render(<DataTable columns={columns} data={[]} />)

    expect(screen.getByText("No results.")).toBeInTheDocument()
  })
})
