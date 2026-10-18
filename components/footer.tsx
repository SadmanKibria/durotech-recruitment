import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, LockKeyhole, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  const year = new Date().getFullYear()
  return <footer className="bg-[#080f4a] text-white">
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18">
      <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_.8fr_1fr]">
        <div><Link href="/" className="flex items-center gap-3"><span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#ffd35a] p-2"><Image src="/durotech-logo.png" alt="Durotech Group" width={56} height={56} className="h-full w-full object-contain"/></span><div><p className="text-xl font-extrabold">Durotech Group</p><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#ffd35a]">Global opportunities</p></div></Link><p className="mt-5 max-w-sm leading-7 text-blue-100/70">Connecting candidates, employers and students with international opportunities—and the support to pursue them confidently.</p></div>
        <div><h3 className="text-xs font-bold uppercase tracking-[.18em] text-[#ffd35a]">Explore</h3><div className="mt-5 grid gap-3 text-sm text-blue-100/75"><Link href="/jobs" className="hover:text-white">Live jobs</Link><Link href="/submit-cv" className="hover:text-white">Submit your CV</Link><Link href="/study-abroad" className="hover:text-white">Study abroad</Link><Link href="/training" className="hover:text-white">Training</Link></div></div>
        <div><h3 className="text-xs font-bold uppercase tracking-[.18em] text-[#ffd35a]">Company</h3><div className="mt-5 grid gap-3 text-sm text-blue-100/75"><Link href="/about" className="hover:text-white">About Durotech</Link><Link href="/contact" className="hover:text-white">Contact us</Link><Link href="/portal/login" className="flex items-center gap-2 hover:text-white"><LockKeyhole className="size-3.5"/>Staff portal</Link></div></div>
        <div><h3 className="text-xs font-bold uppercase tracking-[.18em] text-[#ffd35a]">Get in touch</h3><div className="mt-5 grid gap-4 text-sm text-blue-100/75"><a href="mailto:info@durotech.co.uk" className="flex items-start gap-3 hover:text-white"><Mail className="mt-0.5 size-4 text-[#ffd35a]"/>info@durotech.co.uk</a><a href="tel:+447950206007" className="flex items-start gap-3 hover:text-white"><Phone className="mt-0.5 size-4 text-[#ffd35a]"/>+44 7950 206007</a><span className="flex items-start gap-3"><MapPin className="mt-0.5 size-4 text-[#ffd35a]"/>London, United Kingdom</span></div></div>
      </div>
      <div className="flex flex-col gap-6 pt-8 text-xs text-blue-100/55 lg:flex-row lg:items-center lg:justify-between"><p>© {year} Durotech Group. All rights reserved.</p><div className="flex flex-wrap gap-x-5 gap-y-3">{[["Privacy","/privacy-policy"],["Terms","/terms-of-service"],["Cookies","/cookie-policy"],["GDPR","/gdpr"],["Modern slavery","/modern-slavery-statement"]].map(([label,href])=><Link key={href} href={href} className="flex items-center gap-1 hover:text-white">{label}<ArrowUpRight className="size-3"/></Link>)}</div></div>
    </div>
  </footer>
}
