import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Access() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Access Control</h1>
        <Card>
          <CardHeader>
            <CardTitle>Access Management</CardTitle>
            <CardDescription>Manage permissions and access</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Access control settings will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
