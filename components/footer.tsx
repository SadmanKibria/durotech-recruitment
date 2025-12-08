import Link from "next/link"
import { Briefcase, Mail, Phone, MapPin, Lock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">
                Durotech<span className="text-primary">Recruitment</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Connecting talented professionals with leading employers across Europe, the Middle East, and Asia.
            </p>
            <p className="mt-2 text-xs text-slate-500">Trading as Durotech Recruitment</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/jobs" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link href="/submit-cv" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Submit CV
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Industries</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/jobs?industry=construction"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Construction
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?industry=health"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Healthcare
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?industry=engineering"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Engineering
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?industry=garments"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Garments
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?industry=warehousing"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Warehousing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Contact Us</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@durotechrecruitment.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+44 20 1234 5678</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>London, United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-8">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <Link href="/gdpr" className="hover:text-white transition-colors">
              GDPR Compliance
            </Link>
            <Link href="/modern-slavery-statement" className="hover:text-white transition-colors">
              Modern Slavery Statement
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Durotech Limited. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <Lock className="h-3 w-3" />
                Admin
              </Link>
              <span className="text-slate-700">|</span>
              <p className="text-sm text-slate-500">
                Designed & Developed by{" "}
                <a
                  href="https://sadmankibria.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Sadman Kibria
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
