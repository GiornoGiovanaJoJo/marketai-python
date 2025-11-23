import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReferralNetwork() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Referral Network</h1>
        <Card>
          <CardHeader>
            <CardTitle>Your Network</CardTitle>
            <CardDescription>View your referral network</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Network visualization will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
