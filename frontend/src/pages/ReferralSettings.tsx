import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReferralSettings() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Referral Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your referral settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Referral settings will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
