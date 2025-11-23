import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReferralAbout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">About Referral Program</h1>
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Learn about our referral program</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Referral program details will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
