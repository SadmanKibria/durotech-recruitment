"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Briefcase, FileText, GraduationCap, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/durotech-logo.png" alt="Durotech" width={40} height={40} className="rounded-lg" />
          <span className="text-lg font-bold text-foreground">
            Durotech<span className="text-primary">Recruitment</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            Home
          </Link>

          {/* Employment Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors flex items-center gap-1">
              Employment
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/jobs" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Find Jobs
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/submit-cv" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Submit CV
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Study Abroad Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors flex items-center gap-1">
              Study Abroad
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/study-abroad" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Programs
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/study-abroad#apply" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Apply Now
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
            <Link href="/study-abroad">
              <GraduationCap className="mr-2 h-4 w-4" />
              Study Abroad
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

      {/* Mobile menu */}
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
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Employment
            </div>
            <Link
              href="/jobs"
              className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors pl-6"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              href="/submit-cv"
              className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors pl-6"
              onClick={() => setIsMenuOpen(false)}
            >
              Submit CV
            </Link>
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
              Study Abroad
            </div>
            <Link
              href="/study-abroad"
              className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors pl-6"
              onClick={() => setIsMenuOpen(false)}
            >
              Programs
            </Link>
            <Link
              href="/about"
              className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors mt-2"
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
                <Link href="/study-abroad" onClick={() => setIsMenuOpen(false)}>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Study Abroad
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
