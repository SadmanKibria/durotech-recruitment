"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, BriefcaseBusiness, Menu, X } from "lucide-react"

const links = [["Jobs","/jobs"],["Training","/training"],["Study abroad","/study-abroad"],["About","/about"],["Contact","/contact"]]

export function Header() {
  const [open,setOpen]=useState(false)
  return <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
    <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8">
      <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Durotech Group home"><span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#ffd35a] p-1.5"><Image src="/durotech-logo.png" alt="Durotech Group" width={48} height={48} className="h-full w-full object-contain" priority/></span><div className="min-w-0 leading-none"><span className="block text-lg font-extrabold tracking-tight text-[#0d1974]">Durotech Group</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[.2em] text-slate-500">Global opportunities</span></div></Link>
      <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main navigation">{links.map(([label,href])=><Link key={href} href={href} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-[#f2f3fa] hover:text-[#0d1974]">{label}</Link>)}</nav>
      <div className="ml-3 hidden items-center gap-2 lg:flex"><Link href="/portal/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500 hover:text-[#0d1974]">Staff portal</Link><Link href="/jobs" className="flex items-center gap-2 rounded-full bg-[#0d1974] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17258d]"><BriefcaseBusiness className="size-4"/>Find jobs</Link></div>
      <button onClick={()=>setOpen(!open)} className="ml-auto grid size-11 place-items-center rounded-full bg-[#f2f3fa] text-[#0d1974] lg:hidden" aria-label={open?"Close menu":"Open menu"} aria-expanded={open}>{open?<X/>:<Menu/>}</button>
    </div>
    {open&&<div className="border-t bg-white px-5 py-5 shadow-xl lg:hidden"><nav className="mx-auto flex max-w-7xl flex-col" aria-label="Mobile navigation">{links.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)} className="flex min-h-12 items-center justify-between border-b border-slate-100 py-3 text-base font-semibold text-[#111735]">{label}<ArrowUpRight className="size-4 text-slate-400"/></Link>)}<div className="mt-5 grid grid-cols-2 gap-3"><Link href="/submit-cv" onClick={()=>setOpen(false)} className="flex min-h-12 items-center justify-center rounded-full border border-[#0d1974]/15 font-bold text-[#0d1974]">Submit CV</Link><Link href="/jobs" onClick={()=>setOpen(false)} className="flex min-h-12 items-center justify-center rounded-full bg-[#ffd35a] font-bold text-[#0d1974]">Find jobs</Link></div><Link href="/portal/login" onClick={()=>setOpen(false)} className="mt-4 text-center text-sm font-semibold text-slate-500">Staff portal</Link></nav></div>}
  </header>
}
