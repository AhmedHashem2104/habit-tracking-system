"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface MainNavProps {
  items: {
    title: string
    href: string
    description?: string
  }[]
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">Your App Name</span>
      </Link>
      <nav className="flex gap-6">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center text-sm font-medium text-muted-foreground",
              pathname === item.href && "text-foreground",
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
