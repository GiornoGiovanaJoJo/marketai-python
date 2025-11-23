import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Campaigns() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <Button>Create Campaign</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Campaigns</CardTitle>
            <CardDescription>Manage your advertising campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No campaigns yet. Create your first campaign to get started.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
