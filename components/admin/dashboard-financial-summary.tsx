"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface PaymentRecord {
  id: string
  payment_type: "incoming" | "outgoing"
  amount: number
  description: string
  category: string
  payment_date: string
}

interface DashboardFinancialSummaryProps {
  payments: PaymentRecord[]
}

export function DashboardFinancialSummary({
  payments,
}: DashboardFinancialSummaryProps) {
  // Calculate incoming and outgoing totals
  const incomingTotal = payments
    .filter((p) => p.payment_type === "incoming")
    .reduce((sum, p) => sum + p.amount, 0)

  const outgoingTotal = payments
    .filter((p) => p.payment_type === "outgoing")
    .reduce((sum, p) => sum + p.amount, 0)

  const netProfit = incomingTotal - outgoingTotal

  return (
    <div className="space-y-4">
      {/* Net Balance Banner */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-0 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300 mb-1">Net Balance</p>
              <p className="text-4xl font-bold">{netProfit >= 0 ? "+" : ""}£{Math.abs(netProfit).toFixed(2)}</p>
            </div>
            <div className={`p-4 rounded-lg ${netProfit >= 0 ? "bg-green-500/20" : "bg-red-500/20"}`}>
              {netProfit >= 0 ? (
                <TrendingUp className={`h-8 w-8 ${netProfit >= 0 ? "text-green-400" : "text-red-400"}`} />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout: Incoming and Outgoing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Incoming Section */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-900">Incoming</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 mb-4">
              £{incomingTotal.toFixed(2)}
            </p>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex justify-between">
                <span>Total Received</span>
                <span className="font-medium">£{incomingTotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Transactions</span>
                <span className="font-medium">{payments.filter((p) => p.payment_type === "incoming").length}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Outgoing Section */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-900">Outgoing</CardTitle>
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600 mb-4">
              £{outgoingTotal.toFixed(2)}
            </p>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex justify-between">
                <span>Total Expenses</span>
                <span className="font-medium">£{outgoingTotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Transactions</span>
                <span className="font-medium">{payments.filter((p) => p.payment_type === "outgoing").length}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
