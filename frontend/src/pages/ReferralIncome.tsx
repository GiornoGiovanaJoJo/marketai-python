import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReferralIncome() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Referral Income</h1>
        <Card>
          <CardHeader>
            <CardTitle>Income Overview</CardTitle>
            <CardDescription>Track your referral earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Income details will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
