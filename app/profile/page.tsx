"use client"

import { UserProfileForm } from "@/components/user-profile-form"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

// Sample navigation items
const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Settings",
    href: "/settings",
  },
]

// Sample user data
const userData = {
  username: "johndoe",
  email: "john.doe@example.com",
  bio: "Software developer and tech enthusiast.",
}

export default function ProfilePage() {
  const handleProfileUpdate = async (data: any) => {
    // In a real app, you would send this data to your API
    console.log("Profile updated:", data)
    return Promise.resolve()
  }

  const handleDeleteAccount = () => {
    // In a real app, you would call your API to delete the account
    console.log("Account deleted")
  }

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
        <div className="container grid gap-12 py-8 md:grid-cols-[1fr_250px]">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>
            <UserProfileForm initialData={userData} onSubmit={handleProfileUpdate} />
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent>
                <ConfirmationDialog
                  title="Delete Account"
                  description="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
                  confirmText="Delete Account"
                  cancelText="Cancel"
                  onConfirm={handleDeleteAccount}
                >
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </ConfirmationDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
