"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, ArrowUpCircle, ArrowDownCircle, Trash2 } from "lucide-react"
import { CURRENCIES, PAYMENT_CATEGORIES } from "@/lib/types"
import type { ApplicationPayment } from "@/lib/types"

interface ApplicationPaymentsProps {
  applicationId: string
}

export function ApplicationPayments({ applicationId }: ApplicationPaymentsProps) {
  const [payments, setPayments] = useState<ApplicationPayment[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    payment_type: "incoming" as "incoming" | "outgoing",
    category: "",
    amount: "",
    currency: "GBP",
    description: "",
    payment_date: new Date().toISOString().split("T")[0],
  })
  const router = useRouter()
  const supabase = createClient()

  const fetchPayments = async () => {
    setFetching(true)
    const { data } = await supabase
      .from("application_payments")
      .select("*")
      .eq("application_id", applicationId)
      .order("payment_date", { ascending: false })

    if (data) setPayments(data)
    setFetching(false)
  }

  useEffect(() => {
    fetchPayments()
  }, [applicationId])

  const handleAddPayment = async () => {
    if (!formData.category || !formData.amount) return

    setLoading(true)
    const { error } = await supabase.from("application_payments").insert({
      application_id: applicationId,
      payment_type: formData.payment_type,
      category: formData.category,
      amount: Number.parseFloat(formData.amount),
      currency: formData.currency,
      description: formData.description || null,
      payment_date: formData.payment_date,
    })

    if (!error) {
      // Log payment in notes
      await supabase.from("application_notes").insert({
        application_id: applicationId,
        note_type: "payment",
        content: `${formData.payment_type === "incoming" ? "Received" : "Paid"} ${formData.currency} ${formData.amount} for ${PAYMENT_CATEGORIES[formData.category as keyof typeof PAYMENT_CATEGORIES] || formData.category}`,
        created_by: "Admin",
      })

      setFormData({
        payment_type: "incoming",
        category: "",
        amount: "",
        currency: "GBP",
        description: "",
        payment_date: new Date().toISOString().split("T")[0],
      })
      setShowForm(false)
      fetchPayments()
      router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from("application_payments").delete().eq("id", id)
    fetchPayments()
  }

  const totalIncoming = payments
    .filter((p) => p.payment_type === "incoming")
    .reduce((sum, p) => sum + Number(p.amount), 0)
  const totalOutgoing = payments
    .filter((p) => p.payment_type === "outgoing")
    .reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <ArrowDownCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Total Incoming</span>
          </div>
          <p className="text-lg font-bold text-green-800 mt-1">£{totalIncoming.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <ArrowUpCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Total Outgoing</span>
          </div>
          <p className="text-lg font-bold text-red-800 mt-1">£{totalOutgoing.toFixed(2)}</p>
        </div>
      </div>

      {/* Add payment form */}
      {showForm ? (
        <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Type</Label>
              <Select
                value={formData.payment_type}
                onValueChange={(v) => setFormData((p) => ({ ...p, payment_type: v as "incoming" | "outgoing" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incoming">Incoming</SelectItem>
                  <SelectItem value="outgoing">Outgoing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_CATEGORIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label className="text-xs">Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData((p) => ({ ...p, currency: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CURRENCIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Date</Label>
              <Input
                type="date"
                value={formData.payment_date}
                onChange={(e) => setFormData((p) => ({ ...p, payment_date: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Description (optional)</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              rows={2}
              className="resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddPayment} disabled={loading || !formData.category || !formData.amount} size="sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
              Add Payment
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment
        </Button>
      )}

      {/* Payments list */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {fetching ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No payments recorded</p>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                {payment.payment_type === "incoming" ? (
                  <ArrowDownCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowUpCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {PAYMENT_CATEGORIES[payment.category as keyof typeof PAYMENT_CATEGORIES] || payment.category}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(payment.payment_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-semibold ${payment.payment_type === "incoming" ? "text-green-600" : "text-red-600"}`}
                >
                  {payment.payment_type === "incoming" ? "+" : "-"}
                  {payment.currency} {Number(payment.amount).toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(payment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
