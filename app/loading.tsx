import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <div className="h-[72px] border-b bg-white px-5 sm:px-8">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3"><Skeleton className="size-11"/><div className="space-y-2"><Skeleton className="h-4 w-32"/><Skeleton className="h-2 w-24"/></div></div>
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
        <Skeleton className="h-5 w-36 rounded-full" />
        <Skeleton className="mt-6 h-14 max-w-2xl" />
        <Skeleton className="mt-4 h-6 max-w-xl" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="rounded-[1.5rem] border bg-white p-6"><Skeleton className="size-11 rounded-xl"/><Skeleton className="mt-7 h-6 w-2/3"/><Skeleton className="mt-3 h-4 w-full"/><Skeleton className="mt-2 h-4 w-4/5"/><Skeleton className="mt-7 h-11 w-full rounded-full"/></div>)}
        </div>
      </main>
    </div>
  )
}
