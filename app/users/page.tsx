"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ColumnDef } from "@tanstack/react-table"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { Edit, Trash } from "lucide-react"

// Sample navigation items
const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Users",
    href: "/users",
  },
  {
    title: "Settings",
    href: "/settings",
  },
]

// Define User type
interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
}

// Sample user data
const users: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", status: "active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User", status: "active" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "User", status: "inactive" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", role: "Editor", status: "active" },
  { id: "5", name: "Charlie Davis", email: "charlie@example.com", role: "User", status: "active" },
  { id: "6", name: "Eva Wilson", email: "eva@example.com", role: "User", status: "inactive" },
  { id: "7", name: "Frank Miller", email: "frank@example.com", role: "Editor", status: "active" },
  { id: "8", name: "Grace Taylor", email: "grace@example.com", role: "User", status: "active" },
  { id: "9", name: "Henry Clark", email: "henry@example.com", role: "User", status: "active" },
  { id: "10", name: "Ivy Martin", email: "ivy@example.com", role: "Admin", status: "active" },
  { id: "11", name: "Jack White", email: "jack@example.com", role: "User", status: "inactive" },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteUser = (userId: string) => {
    console.log(`Delete user with ID: ${userId}`)
    // In a real app, you would call your API to delete the user
  }

  const handleEditUser = (userId: string) => {
    console.log(`Edit user with ID: ${userId}`)
    // In a real app, you would navigate to the edit user page
  }

  // Define columns for the data table
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEditUser(user.id)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <ConfirmationDialog
              title="Delete User"
              description={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={() => handleDeleteUser(user.id)}
            >
              <Button variant="ghost" size="sm">
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </ConfirmationDialog>
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={navItems} />
          <div className="flex items-center gap-4">
            <Button>Sign Out</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Users</h1>
              <p className="text-muted-foreground">Manage user accounts and permissions.</p>
            </div>
            <Button>Add User</Button>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <DataTable columns={columns} data={filteredUsers} pageSize={8} />
        </div>
      </main>
    </div>
  )
}
