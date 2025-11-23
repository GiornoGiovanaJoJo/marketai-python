import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Partners() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Partners</h1>
        <Card>
          <CardHeader>
            <CardTitle>Business Partners</CardTitle>
            <CardDescription>Manage your partners</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Partners list will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
