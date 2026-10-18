"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Globe, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0066cc]">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Durotech<span className="text-[#0066cc]">Recruitment</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/jobs" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Find Jobs
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex">
          <Button asChild className="bg-[#0066cc] hover:bg-[#0052a3] text-white">
            <Link href="/jobs">
              <Briefcase className="mr-2 h-4 w-4" />
              Browse Jobs
            </Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border md:hidden">
          <nav className="flex flex-col gap-4 p-4">
            <Link
              href="/"
              className="text-sm font-medium text-muted hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className="text-sm font-medium text-muted hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Button asChild className="bg-[#0066cc] hover:bg-[#0052a3] text-white w-full">
              <Link href="/jobs" onClick={() => setIsMenuOpen(false)}>
                <Briefcase className="mr-2 h-4 w-4" />
                Browse Jobs
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
