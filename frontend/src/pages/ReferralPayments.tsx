import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReferralPayments() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Referral Payments</h1>
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>View your payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Payment history will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
