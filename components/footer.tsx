import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Lock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-[#1E3A5F] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/durotech-logo.png" alt="Durotech" width={40} height={40} className="rounded-lg" />
              <span className="text-lg font-bold">
                Durotech<span className="text-[#F5C547]">Group</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Connecting talented professionals with leading employers across Europe, the Middle East and Asia. We also
              help students achieve their dreams of studying abroad.
            </p>
            <p className="mt-2 text-xs text-slate-400">Worldwide employment opportunities for global talent</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5C547]">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/jobs" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link href="/submit-cv" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Submit CV
                </Link>
              </li>
              <li>
                <Link href="/study-abroad" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Study Abroad
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5C547]">Industries</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/jobs?industry=construction"
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Construction
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?industry=health"
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Healthcare
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?industry=engineering"
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Engineering
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?industry=garments"
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Garments
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?industry=warehousing"
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Warehousing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5C547]">Contact Us</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <Mail className="h-4 w-4 flex-shrink-0 text-[#F5C547]" />
                <span>info@durotech.co.uk</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <Phone className="h-4 w-4 flex-shrink-0 text-[#F5C547]" />
                <span>+44 7950 206007</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <MapPin className="h-4 w-4 flex-shrink-0 text-[#F5C547]" />
                <span>London, United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-700 pt-8">
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

        <div className="mt-8 border-t border-slate-700 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-400 text-center sm:text-left">
              <p>&copy; {new Date().getFullYear()} Durotech Group. All rights reserved.</p>
              <p className="text-xs text-slate-500 mt-2">Worldwide presence: UK • Bangladesh • Serbia</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <Lock className="h-3 w-3" />
                Admin
              </Link>
              <span className="text-slate-600">|</span>
              <p className="text-sm text-slate-400">
                Designed & Developed by{" "}
                <a
                  href="https://sadmankibria.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F5C547] hover:text-white transition-colors"
                >
                  Sadman Kibria
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 border-t border-slate-700 pt-8">
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://www.facebook.com/profile.php?id=61565862601426"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#F5C547] transition-colors text-sm font-medium"
            >
              Facebook
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#F5C547] transition-colors text-sm font-medium"
            >
              Instagram
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#F5C547] transition-colors text-sm font-medium"
            >
              X (Twitter)
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
