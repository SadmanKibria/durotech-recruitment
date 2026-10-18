"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import type { Application } from "@/lib/types"

interface PaymentRecord {
  id: string
  payment_type: "incoming" | "outgoing"
  amount: number
  description: string
  category: string
  payment_date: string
  notes?: string
}

interface ApplicationFinancialSummaryProps {
  application: Application
  payments?: PaymentRecord[]
}

export function ApplicationFinancialSummary({
  application,
  payments = [],
}: ApplicationFinancialSummaryProps) {
  // Calculate incoming and outgoing totals
  const incomingTotal = payments
    .filter((p) => p.payment_type === "incoming")
    .reduce((sum, p) => sum + p.amount, 0)

  const outgoingTotal = payments
    .filter((p) => p.payment_type === "outgoing")
    .reduce((sum, p) => sum + p.amount, 0)

  const balance = incomingTotal - outgoingTotal
  const isProfit = balance > 0

  return (
    <div className="space-y-6">
      {/* Top Balance Banner */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-0 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 mb-1">Net Balance</p>
              <p className="text-4xl font-bold">{isProfit ? "+" : "-"}£{Math.abs(balance).toFixed(2)}</p>
            </div>
            <div className={`p-4 rounded-lg ${isProfit ? "bg-green-500/20" : "bg-red-500/20"}`}>
              {isProfit ? (
                <TrendingUp className="h-8 w-8 text-green-400" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Incoming Costs */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-900">
                Incoming
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-3xl font-bold text-green-600">
                £{incomingTotal.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Money received from applicant or company
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Outgoing Costs */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-900">
                Outgoing
              </CardTitle>
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-3xl font-bold text-red-600">
                £{outgoingTotal.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Total expenses, fees, and costs paid
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-start justify-between p-3 bg-muted/50 rounded-lg border"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{payment.description}</p>
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {payment.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </p>
                    {payment.notes && (
                      <p className="text-xs text-muted-foreground italic">
                        {payment.notes}
                      </p>
                    )}
                  </div>
                  <p
                    className={`text-sm font-bold whitespace-nowrap ml-4 ${
                      payment.payment_type === "incoming"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {payment.payment_type === "incoming" ? "+" : "-"}£
                    {payment.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
