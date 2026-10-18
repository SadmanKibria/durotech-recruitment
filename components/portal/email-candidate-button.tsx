"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { toast } from "sonner"
import type { Candidate } from "@/lib/portal/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function EmailCandidateButton({ candidate, iconOnly = false }: { candidate: Candidate; iconOnly?: boolean }) {
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [subject, setSubject] = useState(`Durotech application update — ${candidate.status}`)
  const [message, setMessage] = useState(`Hello ${candidate.name},\n\nYour application for ${candidate.jobTitle} in ${candidate.destinationCountry} is now: ${candidate.status}.\n\nIf you have any questions, please reply to this email.\n\nDurotech Recruitment`)

  async function send() {
    setSending(true)
    const response = await fetch("/api/portal/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ candidateId: candidate.id, to: candidate.email, subject, message }),
    })
    const result = await response.json() as { error?: string }
    setSending(false)
    if (!response.ok) return toast.error(result.error || "Email could not be sent")
    toast.success(`Email sent to ${candidate.name}`)
    setOpen(false)
  }

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button type="button" variant="outline" size={iconOnly ? "icon" : "default"} aria-label={`Email ${candidate.name}`} className="gap-2">
        <Mail className="size-4" />{!iconOnly && "Email candidate"}
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-xl">
      <DialogHeader><DialogTitle>Email {candidate.name}</DialogTitle><DialogDescription>The message will be sent securely to {candidate.email} through Durotech&apos;s mail service.</DialogDescription></DialogHeader>
      <div className="space-y-4 py-2"><div className="space-y-2"><Label htmlFor={`subject-${candidate.id}`}>Subject</Label><Input id={`subject-${candidate.id}`} value={subject} onChange={event => setSubject(event.target.value)} maxLength={160}/></div><div className="space-y-2"><Label htmlFor={`message-${candidate.id}`}>Message</Label><Textarea id={`message-${candidate.id}`} value={message} onChange={event => setMessage(event.target.value)} rows={9} maxLength={10000}/></div></div>
      <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={send} disabled={sending || !subject.trim() || !message.trim()} className="bg-[#0d1974] hover:bg-[#17258d]">{sending ? "Sending…" : "Send email"}</Button></DialogFooter>
    </DialogContent>
  </Dialog>
}
