"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Briefcase, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/durotech-logo.png" alt="Durotech" width={40} height={40} className="rounded-lg" />
          <span className="text-lg font-bold text-foreground">
            Durotech<span className="text-primary"> Recruitment</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            Home
          </Link>
          <Link
            href="/jobs"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            Employment
          </Link>
          <Link
            href="/study-abroad"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            Study Abroad
          </Link>
          <Link
            href="/about"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="hidden lg:flex gap-2">
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/submit-cv">
              <FileText className="mr-2 h-4 w-4" />
              Submit CV
            </Link>
          </Button>
          <Button asChild>
            <Link href="/jobs">
              <Briefcase className="mr-2 h-4 w-4" />
              Find Jobs
            </Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu - simplified */}
      {isMenuOpen && (
        <div className="border-t lg:hidden">
          <nav className="flex flex-col p-4 bg-background">
            <Link
              href="/"
              className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Employment
            </Link>
            <Link
              href="/study-abroad"
              className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Study Abroad
            </Link>
            <Link
              href="/about"
              className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-3 mt-3 border-t space-y-2">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/submit-cv" onClick={() => setIsMenuOpen(false)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Submit CV
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/jobs" onClick={() => setIsMenuOpen(false)}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Find Jobs
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
