import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Check, Compass, FileText, GraduationCap, Handshake, ShieldCheck, Sparkles } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JobCard } from "@/components/job-card"
import { createClient } from "@/lib/supabase/server"
import type { Job } from "@/lib/types"

const pathways = [
  { icon: BriefcaseBusiness, eyebrow: "For candidates", title: "Work abroad with clarity", copy: "Explore verified vacancies and get practical support through application, documentation and mobilisation.", href: "/jobs", cta: "Explore live jobs" },
  { icon: GraduationCap, eyebrow: "For students", title: "Make your study plan real", copy: "Navigate course selection, applications and student visa preparation with an experienced team beside you.", href: "/study-abroad", cta: "Plan your studies" },
  { icon: Handshake, eyebrow: "For employers", title: "Build the team you need", copy: "Reach skilled international candidates and manage recruitment through one focused, accountable partner.", href: "/contact", cta: "Talk to our team" },
]

const steps = [
  ["01", "Tell us your goal", "Apply for a role, submit your CV or speak to us about your hiring needs."],
  ["02", "Get a clear route", "We review fit, explain the process and set out the documents and next actions."],
  ["03", "Move forward supported", "Our team stays involved through selection, compliance and mobilisation."],
]

export default async function HomePage() {
  let jobs: Job[] = []
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("https://") && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient()
    const { data } = await supabase.from("jobs").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(6)
    jobs = (data || []) as Job[]
  }

  return <div className="min-h-screen bg-[#f7f8fc] text-[#111735]">
    <Header />
    <main>
      <section className="relative isolate overflow-hidden bg-[#0d1974] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,211,90,.24),transparent_32%),linear-gradient(110deg,#0d1974_0%,#0d1974_55%,#17258d_100%)]"/>
        <div className="absolute -right-28 -top-24 size-[420px] rounded-full border border-white/10 sm:size-[600px]"/>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ffd35a]/35 bg-[#ffd35a]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.16em] text-[#ffe48f]"><Sparkles className="size-4"/> Recruitment that moves people forward</div>
            <h1 className="max-w-3xl text-[2.7rem] font-semibold leading-[.98] tracking-[-.045em] sm:text-6xl lg:text-7xl">Your next move should feel <span className="text-[#ffd35a]">possible.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-blue-100/85 sm:text-lg">Durotech connects people, employers and education opportunities across borders—with honest guidance and human support at every step.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/jobs" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ffd35a] px-6 font-bold text-[#0d1974] transition hover:bg-white">Find your opportunity <ArrowRight className="size-4"/></Link><Link href="/submit-cv" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 font-semibold text-white transition hover:bg-white/12"><FileText className="size-4"/> Submit your CV</Link></div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-100/80"><span className="flex items-center gap-2"><Check className="size-4 text-[#ffd35a]"/>Real live vacancies</span><span className="flex items-center gap-2"><Check className="size-4 text-[#ffd35a]"/>End-to-end guidance</span><span className="flex items-center gap-2"><Check className="size-4 text-[#ffd35a]"/>Mobile-friendly applications</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-[560px] lg:mx-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl sm:aspect-[5/4] lg:aspect-[4/5]"><Image src="/professional-team-meeting-diverse-office.jpg" alt="Recruitment professionals discussing international opportunities" fill priority sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-[#0d1974]/70 via-transparent to-transparent"/><div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-[#0d1974]/75 p-5 backdrop-blur-xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#ffd35a]">One connected team</p><p className="mt-2 text-lg font-semibold">Recruitment, education and candidate support under one roof.</p></div></div>
            <div className="absolute -bottom-5 -left-3 rounded-2xl bg-[#ffd35a] p-4 text-[#0d1974] shadow-xl sm:-left-8"><Compass className="mb-2 size-6"/><p className="text-sm font-bold">Local guidance.<br/>Global direction.</p></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#0d1974]">Choose your path</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-5xl">Different ambitions. One team to help you move.</h2></div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">{pathways.map((item,index)=><Link key={item.title} href={item.href} className={`group rounded-[1.75rem] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${index===1?"bg-[#ffd35a] text-[#0d1974]":"border border-[#dfe3f0] bg-white"}`}><span className={`grid size-12 place-items-center rounded-2xl ${index===1?"bg-[#0d1974] text-white":"bg-[#eef0ff] text-[#0d1974]"}`}><item.icon className="size-5"/></span><p className="mt-8 text-xs font-bold uppercase tracking-[.17em] opacity-60">{item.eyebrow}</p><h3 className="mt-2 text-2xl font-semibold tracking-tight">{item.title}</h3><p className="mt-3 leading-7 opacity-75">{item.copy}</p><span className="mt-7 flex items-center gap-2 font-bold">{item.cta}<ArrowRight className="size-4 transition group-hover:translate-x-1"/></span></Link>)}</div>
      </section>

      {jobs.length>0&&<section className="bg-white py-16 sm:py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-[#0d1974]">Open now</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-5xl">Your next opportunity</h2><p className="mt-3 text-slate-600">Current roles published by the Durotech recruitment team.</p></div><Link href="/jobs" className="flex items-center gap-2 font-bold text-[#0d1974]">View all jobs <ArrowRight className="size-4"/></Link></div><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{jobs.map(job=><JobCard key={job.id} job={job}/>)}</div></div></section>}

      <section className="relative overflow-hidden bg-[#ffd35a] py-16 sm:py-24"><div className="absolute right-0 top-0 size-72 translate-x-1/3 -translate-y-1/3 rounded-full border-[50px] border-[#0d1974]/8"/><div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-[#0d1974]">A clearer process</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] text-[#0d1974] sm:text-5xl">Know what happens next.</h2><p className="mt-5 max-w-md leading-7 text-[#0d1974]/70">International recruitment can feel complicated. We make each stage visible, practical and easier to navigate.</p></div><div className="grid gap-3">{steps.map(([number,title,copy])=><div key={number} className="grid grid-cols-[54px_1fr] gap-4 rounded-2xl bg-white/85 p-5 shadow-sm backdrop-blur sm:p-6"><span className="text-2xl font-bold text-[#0d1974]/30">{number}</span><div><h3 className="text-lg font-bold text-[#0d1974]">{title}</h3><p className="mt-1 leading-6 text-slate-600">{copy}</p></div></div>)}</div></div></section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center"><div className="relative aspect-square overflow-hidden rounded-[2rem] sm:aspect-[4/3]"><Image src="/global-business-handshake-partnership.jpg" alt="An international recruitment partnership" fill sizes="(max-width: 1024px) 90vw, 50vw" className="object-cover"/></div><div className="lg:pl-10"><span className="grid size-12 place-items-center rounded-2xl bg-[#eef0ff] text-[#0d1974]"><ShieldCheck className="size-6"/></span><p className="mt-7 text-sm font-bold uppercase tracking-[.18em] text-[#0d1974]">Built around trust</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-5xl">Straight answers. Real support.</h2><p className="mt-5 leading-7 text-slate-600">We focus on clear communication, responsible recruitment and opportunities that candidates can understand before they commit.</p><ul className="mt-7 space-y-4">{["Vacancy details presented clearly","Support for applications and documentation","A real team available when questions come up"].map(item=><li key={item} className="flex gap-3 font-medium"><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#ffd35a] text-[#0d1974]"><Check className="size-4"/></span>{item}</li>)}</ul><Link href="/about" className="mt-8 inline-flex items-center gap-2 font-bold text-[#0d1974]">Meet Durotech <ArrowRight className="size-4"/></Link></div></section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-24"><div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0d1974] px-6 py-12 text-center text-white sm:px-12 sm:py-16"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#ffd35a]">Ready when you are</p><h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-[-.035em] sm:text-5xl">Take the next step with a team behind you.</h2><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/jobs" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ffd35a] px-7 font-bold text-[#0d1974]">Browse live jobs</Link><Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 font-bold text-white">Speak to Durotech</Link></div></div></section>
    </main>
    <Footer />
  </div>
}
