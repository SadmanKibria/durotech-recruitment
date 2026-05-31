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
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Incoming Costs */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Incoming Costs
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-green-600">
                £{incomingTotal.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                Money received from applicant/company
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Outgoing Costs */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Outgoing Costs
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-red-600">
                £{outgoingTotal.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                Total expenses and fees paid
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Balance / Net Profit */}
        <Card
          className={`border-l-4 ${
            isProfit ? "border-l-blue-500" : "border-l-orange-500"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Balance
              </CardTitle>
              <DollarSign
                className={`h-4 w-4 ${
                  isProfit ? "text-blue-600" : "text-orange-600"
                }`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p
                className={`text-3xl font-bold ${
                  isProfit ? "text-blue-600" : "text-orange-600"
                }`}
              >
                £{Math.abs(balance).toFixed(2)}
              </p>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isProfit ? "default" : "destructive"}
                  className="text-xs"
                >
                  {isProfit ? "Profit" : "Loss"}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {isProfit ? "Incoming > Outgoing" : "Outgoing > Incoming"}
                </p>
              </div>
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
