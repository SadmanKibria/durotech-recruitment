import Link from "next/link"
import { Globe, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0066cc]">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                Durotech<span className="text-[#0066cc]">Recruitment</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Connecting talented professionals with leading employers across Europe, the Middle East, and Asia. Your
              career journey starts here.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/jobs" className="text-sm text-muted-foreground hover:text-background transition-colors">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-background transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-background transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                info@durotechrecruitment.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                +44 20 1234 5678
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                London, United Kingdom
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-muted pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Durotech Recruitment. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
