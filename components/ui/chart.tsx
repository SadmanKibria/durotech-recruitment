"use client"

import * as React from "react"
import { ResponsiveContainer, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

export type ChartConfig = Record<string, { label?: React.ReactNode; color?: string }>

export function ChartContainer({ className, children, config }: { className?: string; children: React.ReactElement; config: ChartConfig }) {
  const variables = Object.fromEntries(Object.entries(config).flatMap(([key,value]) => value.color ? [[`--color-${key}`,value.color]] : [])) as React.CSSProperties
  return <div className={cn("text-xs [&_.recharts-cartesian-axis-tick_text]:fill-slate-500 [&_.recharts-cartesian-grid_line]:stroke-slate-200",className)} style={variables}><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
}

export const ChartTooltip = Tooltip

export function ChartTooltipContent({ active, payload, label, formatter }: { active?: boolean; payload?: Array<{ name?: string; value?: string | number; color?: string }>; label?: React.ReactNode; formatter?: (value: string | number) => React.ReactNode }) {
  if (!active || !payload?.length) return null
  return <div className="min-w-32 rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-xl">{label&&<p className="mb-2 font-semibold">{label}</p>}{payload.map((item,index)=><div key={index} className="flex items-center justify-between gap-5"><span className="flex items-center gap-2 text-slate-500"><i className="size-2 rounded-full" style={{background:item.color}}/>{item.name}</span><b>{item.value==null?"—":formatter?formatter(item.value):Number(item.value).toLocaleString()}</b></div>)}</div>
}
