import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DDS() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">DDS Advertising</h1>
        <Card>
          <CardHeader>
            <CardTitle>DDS Campaigns</CardTitle>
            <CardDescription>Manage your DDS advertising campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">DDS campaigns will appear here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
