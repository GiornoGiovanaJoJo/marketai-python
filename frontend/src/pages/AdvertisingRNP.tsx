import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdvertisingRNP() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Advertising - RNP</h1>
        <Card>
          <CardHeader>
            <CardTitle>RNP Campaigns</CardTitle>
            <CardDescription>Manage your RNP advertising campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">RNP campaigns will appear here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
